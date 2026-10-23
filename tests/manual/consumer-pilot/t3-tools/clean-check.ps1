param(
  [Parameter(Mandatory = $true)][string]$Project,
  [Parameter(Mandatory = $true)][string]$Output
)
$ErrorActionPreference = 'Stop'
$projectPath = (Resolve-Path -LiteralPath $Project).Path
$outputPath = [System.IO.Path]::GetFullPath($Output)
New-Item -ItemType Directory -Force -Path $outputPath | Out-Null
Set-Location -LiteralPath $projectPath
if (-not (Test-Path -LiteralPath '.git' -PathType Container)) { throw 'Expected an independent clone with its own .git directory.' }
if (Test-Path -LiteralPath 'node_modules') { throw 'Expected fresh checkout without node_modules before npm ci.' }
if (Test-Path -LiteralPath '.git/objects/info/alternates') { throw 'Git alternates are not permitted for this clean checkout proof.' }
$initialStatus = @(git status --porcelain)
if ($LASTEXITCODE -ne 0 -or $initialStatus.Count -ne 0) { throw 'Checkout must start clean.' }
$nodeCmd = (Get-Command node.exe).Source
$npmCmd = (Get-Command npm.cmd).Source
$report = [ordered]@{
  task = 'P03-T3'; date = '2026-10-24'; project = $projectPath
  sourceSha = (git rev-parse HEAD).Trim()
  initialClean = $true; initialNodeModulesAbsent = $true
  independentGitDirectory = $true; gitAlternatesAbsent = $true
  node = (& $nodeCmd --version).Trim(); npm = (& $npmCmd --version).Trim()
  os = [System.Environment]::OSVersion.VersionString
  nodeExecutable = $nodeCmd; npmExecutable = $npmCmd
  inheritedNODE_PATH = $env:NODE_PATH
  NODE_PATH = $null
  lockSha256Before = (Get-FileHash -LiteralPath 'package-lock.json' -Algorithm SHA256).Hash.ToLowerInvariant()
  commands = @(); npmCacheNote = 'npm ci installs into this new checkout; normal npm registry cache may be reused. No source node_modules or links are reused.'
}
$env:NO_COLOR = '1'
$inheritedNodePath = $env:NODE_PATH
Remove-Item Env:NODE_PATH -ErrorAction SilentlyContinue
$report.NODE_PATH = $env:NODE_PATH
$report.environmentPolicy = 'NODE_PATH cleared only in this task process and restored on exit; no global/user configuration changed.'
$checks = @(
  @{ name = 'install'; executable = $npmCmd; arguments = @('ci', '--no-audit', '--no-fund') },
  @{ name = 'snapshot'; executable = $nodeCmd; arguments = @('scripts/check-personal-ui.mjs') },
  @{ name = 'typecheck'; executable = $npmCmd; arguments = @('run', 'typecheck') },
  @{ name = 'lint'; executable = $npmCmd; arguments = @('run', 'lint') },
  @{ name = 'test'; executable = $npmCmd; arguments = @('run', 'test') },
  @{ name = 'build'; executable = $npmCmd; arguments = @('run', 'build') },
  @{ name = 'dependencies'; executable = $npmCmd; arguments = @('ls', '--depth=0', '--json') }
)
try {
  foreach ($check in $checks) {
    $commandArgs = $check.arguments
    $logFile = Join-Path $outputPath ($check.name + '.txt')
    & $check.executable @commandArgs 2>&1 | Tee-Object -FilePath $logFile
    $commandExit = $LASTEXITCODE
    $report.commands += [ordered]@{ name = $check.name; command = ((Split-Path -Leaf $check.executable) + ' ' + ($commandArgs -join ' ')); exitCode = $commandExit; log = $check.name + '.txt' }
    if ($commandExit -ne 0) { throw ($check.name + ' failed with exit ' + $commandExit) }
  }
  $report.lockSha256After = (Get-FileHash -LiteralPath 'package-lock.json' -Algorithm SHA256).Hash.ToLowerInvariant()
  if ($report.lockSha256Before -ne $report.lockSha256After) { throw 'Lockfile changed during clean install/checks.' }
  $report.finalGitStatus = @(git status --porcelain)
  if ($report.finalGitStatus.Count -ne 0) { throw 'Tracked checkout changed during verification.' }
  $report.status = 'passed'
} catch {
  $report.status = 'failed'; $report.error = $_.ToString(); throw
} finally {
  [System.IO.File]::WriteAllText((Join-Path $outputPath 'clean-check.json'), ($report | ConvertTo-Json -Depth 12) + "`n", [System.Text.UTF8Encoding]::new($false))
  if ($null -eq $inheritedNodePath) { Remove-Item Env:NODE_PATH -ErrorAction SilentlyContinue }
  else { $env:NODE_PATH = $inheritedNodePath }
}
