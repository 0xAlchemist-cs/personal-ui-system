$ErrorActionPreference = 'Stop'
$projectRoot = Split-Path $PSScriptRoot -Parent
$appDirectory = Join-Path $projectRoot 'showcase/app'
$url = 'http://127.0.0.1:5173/'

trap {
    Add-Type -AssemblyName PresentationFramework
    [System.Windows.MessageBox]::Show($_.Exception.Message, 'UI system - startup failed') | Out-Null
    exit 1
}

# Repeated clicks reuse the running workbench.
$response = $null
try {
    $response = Invoke-WebRequest -Uri $url -UseBasicParsing -TimeoutSec 2
} catch [System.Net.WebException] {
    # No running server: start it below.
}
if ($response) {
    if ($response.Content -notmatch '<title>Personal UI') {
        throw 'Port 5173 is occupied by another application. Close it and try again.'
    }
    Start-Process $url
    exit 0
}

Set-Location $projectRoot
if (-not (Test-Path (Join-Path $appDirectory 'node_modules/vite/bin/vite.js'))) {
    & npm.cmd --prefix $appDirectory ci
    if ($LASTEXITCODE -ne 0) { throw 'Dependency installation failed. See the launcher window for details.' }
}

# This window owns Vite. Closing it stops the workbench.
& npm.cmd --prefix $appDirectory run dev -- --open --port 5173 --strictPort
if ($LASTEXITCODE -ne 0) { throw 'Workbench startup failed. See the launcher window for details.' }
