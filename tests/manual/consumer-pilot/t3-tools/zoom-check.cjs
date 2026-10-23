// Host-side manual acceptance aid. Install no browser tooling in the consumer.
// PLAYWRIGHT_MODULE must resolve to the separately installed Playwright module.
// Required arguments: --project --url --output --heading --field --submit
// --reset --disabled --error --success --valid-value. All paths are supplied at runtime.
const assert = require('node:assert/strict');
const fs = require('node:fs');
const os = require('node:os');
const path = require('node:path');
const { execFileSync } = require('node:child_process');

const options = {};
for (let index = 2; index < process.argv.length; index += 2) {
  const flag = process.argv[index];
  assert(/^--[a-z-]+$/.test(flag) && process.argv[index + 1], `Missing value for ${flag}`);
  assert(!Object.hasOwn(options, flag.slice(2)), `Duplicate option ${flag}`);
  options[flag.slice(2)] = process.argv[index + 1];
}
for (const name of ['project', 'url', 'output', 'heading', 'field', 'submit', 'reset', 'disabled', 'error', 'success', 'valid-value']) {
  assert(options[name], `Required --${name}`);
}
assert(process.env.PLAYWRIGHT_MODULE, 'Set PLAYWRIGHT_MODULE to the host Playwright module.');
const { chromium } = require(process.env.PLAYWRIGHT_MODULE);
const project = fs.realpathSync(options.project);
const output = path.resolve(options.output);
const pageUrl = new URL(options.url);
assert(pageUrl.protocol === 'http:' && ['127.0.0.1', 'localhost', '[::1]'].includes(pageUrl.hostname), 'Use the local consumer server.');
fs.mkdirSync(output, { recursive: true });
const profileParent = fs.realpathSync(os.tmpdir());
const profile = fs.mkdtempSync(path.join(profileParent, 'pui-p03-t3-zoom-'));

function git(...args) {
  return execFileSync('git', args, { cwd: project, encoding: 'utf8', windowsHide: true }).trim();
}
async function metrics(page) {
  return page.evaluate(() => ({
    dpr: devicePixelRatio,
    innerWidth, innerHeight, outerWidth, outerHeight,
    documentWidth: document.documentElement.scrollWidth,
    visualViewportScale: visualViewport.scale,
    cssZoom: getComputedStyle(document.documentElement).zoom,
    bodyZoom: getComputedStyle(document.body).zoom,
    reducedMotion: matchMedia('(prefers-reduced-motion: reduce)').matches,
  }));
}
async function currentFocus(page) {
  return page.evaluate(() => {
    const element = document.activeElement;
    const style = getComputedStyle(element);
    return {
      tag: element.tagName,
      id: element.id,
      name: element.getAttribute('aria-label') || element.innerText || element.getAttribute('name'),
      outlineStyle: style.outlineStyle,
      outlineWidth: style.outlineWidth,
      outlineColor: style.outlineColor,
      boxShadow: style.boxShadow,
      focusVisible: element.matches(':focus-visible'),
    };
  });
}
async function tabTo(page, target, trace) {
  for (let count = 0; count < 20; count += 1) {
    await page.keyboard.press('Tab');
    const reached = await target.evaluate(element => element === document.activeElement);
    // A key event resolves before Chromium's next style/paint frame. Record stable focus.
    if (reached) await page.waitForTimeout(100);
    const focus = await currentFocus(page);
    trace.push(focus);
    if (reached) return focus;
  }
  throw new Error('Target was not reachable within 20 Tab presses.');
}
function buttonName(label) {
  // Ant Design may insert a space between two Chinese button characters.
  return /^[\p{Script=Han}]{2}$/u.test(label)
    ? new RegExp(`^${Array.from(label).join('\\s*')}$`)
    : label;
}
function pngDimensions(filename) {
  const png = fs.readFileSync(path.join(output, filename));
  assert.equal(png.subarray(1, 4).toString('ascii'), 'PNG');
  return { filename, width: png.readUInt32BE(16), height: png.readUInt32BE(20) };
}

(async () => {
  let context;
  let settings;
  let zoom;
  let getChromeZoom;
  const report = {
    status: 'running',
    sourceSha: null,
    projectStatusBefore: null,
    url: pageUrl.href,
    project,
    environment: { platform: process.platform, osRelease: os.release(), node: process.version },
    method: 'Native Chrome Settings > Appearance > Page zoom in an isolated disposable headed Chrome profile; settingsPrivate.getDefaultZoom confirms 1 -> 2 -> 1. No viewport emulation, CSS zoom, deviceScaleFactor, or pageScaleFactor.',
    screenshotMethod: 'CDP Page.captureScreenshot without clip, captureBeyondViewport false, fromSurface true. Viewport images retain native page zoom; Playwright fullPage is not used.',
    scope: 'One consumer theme probe in Windows Chrome at actual 200% browser zoom. This does not prove screen-reader, other-browser, or real-device conformance.',
    configuredLabels: {
      heading: options.heading, field: options.field, submit: options.submit,
      reset: options.reset, disabled: options.disabled, error: options.error, success: options.success,
    },
    checks: [], screenshots: [], keyboardTrace: [], pageErrors: [], consoleErrors: [], responseFailures: [],
  };
  try {
    report.sourceSha = git('rev-parse', 'HEAD');
    report.projectStatusBefore = git('status', '--porcelain');
    assert.equal(report.projectStatusBefore, '', 'Consumer checkout must have no tracked or untracked changes before QA.');
    context = await chromium.launchPersistentContext(profile, {
      channel: 'chrome', headless: false, viewport: null,
      locale: 'zh-CN', timezoneId: 'UTC', reducedMotion: 'reduce',
      args: ['--window-size=1440,1100', '--window-position=0,0'],
    });
    report.environment.browser = context.browser().version();
    const page = await context.newPage();
    page.setDefaultTimeout(15000);
    page.on('pageerror', error => report.pageErrors.push(error.message));
    page.on('console', message => { if (message.type() === 'error') report.consoleErrors.push({ text: message.text(), location: message.location() }); });
    page.on('response', response => { if (response.status() >= 400) report.responseFailures.push({ url: response.url(), status: response.status() }); });
    await page.goto(pageUrl.href, { waitUntil: 'networkidle' });
    const heading = page.getByRole('heading', { name: options.heading, exact: true });
    const field = page.getByLabel(options.field, { exact: true });
    const submit = page.getByRole('button', { name: buttonName(options.submit), exact: true });
    const reset = page.getByRole('button', { name: buttonName(options.reset), exact: true });
    const disabled = page.getByRole('button', { name: buttonName(options.disabled), exact: true });
    await heading.waitFor({ state: 'visible' });
    await field.waitFor({ state: 'visible' });
    assert.equal(await field.inputValue(), '', 'Initial form is empty.');
    assert(await disabled.isDisabled(), 'Remote action exposes a disabled state.');
    const describedBy = await disabled.getAttribute('aria-describedby');
    assert(describedBy, 'Disabled action is associated with its reason.');
    report.disabledReason = await page.evaluate(ids => ids.split(/\s+/).map(id => {
      const element = document.getElementById(id);
      if (!element) return null;
      const rect = element.getBoundingClientRect();
      const style = getComputedStyle(element);
      return { id, text: element.textContent.trim(), visible: rect.width > 0 && rect.height > 0 && style.visibility !== 'hidden' && style.display !== 'none' };
    }), describedBy);
    assert(report.disabledReason.every(reason => reason && reason.visible && reason.text), 'Disabled reason is visible text, independent of hover.');
    report.checks.push('Heading and associated input label are present; input is initially empty; the disabled remote action has a visible associated reason.');

    const cdp = await context.newCDPSession(page);
    async function screenshot(filename) {
      // DOM visibility can precede Ant Design's next layout/paint after field validation.
      await page.evaluate(() => new Promise(resolve => requestAnimationFrame(() => requestAnimationFrame(resolve))));
      await page.waitForTimeout(100);
      const shot = await cdp.send('Page.captureScreenshot', { format: 'png', fromSurface: true, captureBeyondViewport: false });
      fs.writeFileSync(path.join(output, filename), Buffer.from(shot.data, 'base64'));
      report.screenshots.push(pngDimensions(filename));
    }
    settings = await context.newPage();
    await settings.goto('chrome://settings/appearance');
    zoom = settings.getByRole('combobox', { name: '网页缩放', exact: true });
    getChromeZoom = () => settings.evaluate(() => new Promise(resolve => chrome.settingsPrivate.getDefaultZoom(resolve)));
    await zoom.selectOption({ label: '100%' });
    report.chromeZoomBefore = await getChromeZoom();
    await page.bringToFront();
    await page.waitForTimeout(300);
    report.before = await metrics(page);
    await screenshot('zoom-100.png');
    await zoom.selectOption({ label: '200%' });
    report.chromeZoomDuring = await getChromeZoom();
    await page.bringToFront();
    await page.waitForTimeout(400);
    report.zoomed = await metrics(page);
    assert.equal(report.chromeZoomBefore, 1);
    assert.equal(report.chromeZoomDuring, 2);
    assert(Math.abs(report.zoomed.dpr / report.before.dpr - 2) < 0.02, 'Native browser page zoom doubles devicePixelRatio.');
    assert(Math.abs(report.zoomed.innerWidth * 2 - report.before.innerWidth) <= 3, 'CSS viewport width halves.');
    assert.equal(report.zoomed.outerWidth, report.before.outerWidth, 'Native outer window width is unchanged.');
    assert.equal(report.zoomed.cssZoom, '1');
    assert.equal(report.zoomed.bodyZoom, '1');
    assert.equal(report.zoomed.visualViewportScale, 1, 'No pinch-zoom emulation.');
    assert(report.zoomed.reducedMotion, 'Reduced-motion preference is active.');
    assert(report.zoomed.documentWidth <= report.zoomed.innerWidth + 1, 'No horizontal document overflow at 200%.');
    await screenshot('zoom-200.png');
    report.checks.push('Actual native 200% page zoom: settingsPrivate 2, DPR doubled, CSS viewport halved, outer window unchanged, CSS zoom 1 and visualViewport scale 1; no horizontal document overflow.');
    await disabled.scrollIntoViewIfNeeded();
    await page.evaluate(id => document.getElementById(id).scrollIntoView({ block: 'center' }), report.disabledReason[0].id);
    await screenshot('zoom-200-disabled.png');

    await field.focus();
    const buttonFocus = await tabTo(page, submit, report.keyboardTrace);
    assert(buttonFocus.focusVisible, 'Primary action has a keyboard focus-visible state.');
    assert((buttonFocus.outlineStyle !== 'none' && parseFloat(buttonFocus.outlineWidth) > 0) || buttonFocus.boxShadow !== 'none', 'Focused primary action has a visible outline or shadow.');
    report.primaryFocus = buttonFocus;
    await screenshot('zoom-200-focus.png');
    await page.keyboard.press('Enter');
    const error = page.getByText(options.error, { exact: true });
    await error.waitFor({ state: 'visible' });
    assert.equal(await field.getAttribute('aria-invalid'), 'true', 'Invalid input exposes aria-invalid.');
    await screenshot('zoom-200-error.png');
    report.checks.push('Keyboard reaches the primary action with a visible focus indicator; Enter on an empty field shows the local validation error and aria-invalid.');

    await field.focus();
    await page.keyboard.type(options['valid-value']);
    await tabTo(page, submit, report.keyboardTrace);
    await page.keyboard.press('Enter');
    await page.getByText(options.success, { exact: true }).waitFor({ state: 'visible' });
    await error.waitFor({ state: 'hidden' });
    assert.notEqual(await field.getAttribute('aria-invalid'), 'true', 'Successful validation clears aria-invalid.');
    assert.equal(await field.inputValue(), options['valid-value'], 'Success preserves the submitted input.');
    assert(await reset.isEnabled(), 'Reset is enabled after editing.');
    await screenshot('zoom-200-success.png');
    await tabTo(page, reset, report.keyboardTrace);
    await page.keyboard.press('Enter');
    assert.equal(await field.inputValue(), '', 'Keyboard reset clears the field.');
    await error.waitFor({ state: 'hidden' });
    await page.getByText(options.success, { exact: true }).waitFor({ state: 'hidden' });
    assert(await field.evaluate(element => element === document.activeElement), 'Reset returns focus to the input.');
    assert(await disabled.isDisabled(), 'Remote action remains disabled.');
    report.zoomedAfterChecks = await metrics(page);
    assert(report.zoomedAfterChecks.documentWidth <= report.zoomedAfterChecks.innerWidth + 1, 'No overflow after error, success, and reset.');
    report.checks.push('Valid input, submit, success feedback and reset work by keyboard at 200%; input remains on success, reset clears field/error/success and returns focus; remote action remains disabled.');
    assert.equal(report.pageErrors.length, 0, 'No page errors.');
    assert.equal(report.consoleErrors.length, 0, 'No console errors.');

    await zoom.selectOption({ label: '100%' });
    report.chromeZoomRestored = await getChromeZoom();
    await page.bringToFront();
    await page.waitForTimeout(300);
    report.restored = await metrics(page);
    assert.equal(report.chromeZoomRestored, 1);
    assert.equal(report.restored.dpr, report.before.dpr);
    assert.equal(report.restored.innerWidth, report.before.innerWidth);
    report.checks.push('Native page zoom restored to 100%, confirmed by settingsPrivate, DPR and CSS viewport width.');
    report.projectStatusAfter = git('status', '--porcelain');
    assert.equal(report.projectStatusAfter, '', 'Browser QA did not change the clean consumer checkout.');
    report.status = 'passed';
  } catch (error) {
    report.status = 'failed';
    report.error = String(error.stack || error);
    process.exitCode = 1;
  } finally {
    if (zoom && getChromeZoom) {
      try {
        await zoom.selectOption({ label: '100%' });
        report.cleanupZoom = await getChromeZoom();
      } catch (error) { report.cleanupZoomError = String(error); }
    }
    try {
      await context?.close();
      const resolved = fs.realpathSync(profile);
      assert.equal(path.dirname(resolved), profileParent, 'Profile must be a direct child of the verified temporary directory.');
      assert(path.basename(resolved).startsWith('pui-p03-t3-zoom-'), 'Remove only this script\'s generated profile.');
      assert(!fs.lstatSync(profile).isSymbolicLink(), 'Temporary profile must not be a symlink.');
      fs.rmSync(resolved, { recursive: true, force: true });
      report.cleanup = { ownBrowserClosed: true, ownDisposableProfileRemoved: true };
    } catch (error) {
      report.status = 'failed';
      report.cleanupError = String(error.stack || error);
      process.exitCode = 1;
    }
    fs.writeFileSync(path.join(output, 'zoom-check.json'), `${JSON.stringify(report, null, 2)}\n`);
    console.log(JSON.stringify(report, null, 2));
  }
})();
