// Manual P03-T3 evidence runner. QA tooling is external to the consumer app.
const fs = require('node:fs');
const path = require('node:path');
const assert = require('node:assert/strict');
const { execFileSync } = require('node:child_process');
const { chromium } = require(process.env.PLAYWRIGHT_MODULE || 'playwright');
const args = Object.fromEntries(process.argv.slice(2).reduce((pairs, value, i, all) => i % 2 ? pairs : [...pairs, [value.replace(/^--/, ''), all[i + 1]]], []));
const project = path.resolve(args.project);
const output = path.resolve(args.out);
const url = args.url || 'http://127.0.0.1:5186/';
fs.mkdirSync(output, { recursive: true });
const report = { task: 'P03-T3', date: '2026-10-24', sourceSha: execFileSync('git', ['rev-parse', 'HEAD'], { cwd: project, encoding: 'utf8', windowsHide: true }).trim(), url, viewports: [], errors: [] };
const read = name => JSON.parse(fs.readFileSync(path.join(project, '.personal-ui', name), 'utf8'));
const values = { ...read('design-system/tokens/primitives.json').tokens, ...read('design-system/tokens/semantic.json').tokens, ...read('design-system/styles/minimal-saas.json').tokens };
function token(key) { const value = values[key]; assert.equal(typeof value, 'string', key); const alias = value.match(/^\{([^}]+)\}$/); return alias ? token(alias[1]) : value; }
function rgb(hex) { return `rgb(${[1, 3, 5].map(i => parseInt(hex.slice(i, i + 2), 16)).join(', ')})`; }
function contrast(a, b) {
  const lum = s => { const c = s.match(/[\d.]+/g).slice(0, 3).map(Number).map(v => { v /= 255; return v <= .04045 ? v / 12.92 : ((v + .055) / 1.055) ** 2.4; }); return c[0] * .2126 + c[1] * .7152 + c[2] * .0722; };
  const [x, y] = [lum(a), lum(b)].sort((x, y) => y - x); return (x + .05) / (y + .05);
}
async function style(locator, props) { return locator.evaluate((el, keys) => Object.fromEntries(keys.map(k => [k, getComputedStyle(el)[k]])), props); }
(async () => {
  let browser;
  try {
    browser = await chromium.launch({ channel: 'chrome', headless: true });
    report.browserVersion = browser.version();
    report.playwrightVersion = require(path.join(path.dirname(require.resolve(process.env.PLAYWRIGHT_MODULE || 'playwright')), 'package.json')).version;
    for (const width of [375, 768, 1440]) {
      const context = await browser.newContext({ viewport: { width, height: 1000 }, locale: 'zh-CN', timezoneId: 'UTC', reducedMotion: 'reduce', deviceScaleFactor: 1 });
      const page = await context.newPage();
      const sample = { width, checks: [], consoleErrors: [], pageErrors: [], requests: [] };
      report.viewports.push(sample);
      page.on('pageerror', e => sample.pageErrors.push(e.message));
      page.on('console', m => { if (m.type() === 'error') sample.consoleErrors.push(m.text()); });
      page.on('request', r => sample.requests.push(r.url()));
      await page.goto(url, { waitUntil: 'networkidle' });
      await page.getByRole('heading', { level: 1 }).waitFor();
      const input = page.getByRole('textbox');
      const submit = page.locator('button[type="submit"]');
      const reset = page.getByRole('button', { name: /^重\s*置$/ });
      const panel = page.locator('.probe-panel');
      assert.equal(await input.count(), 1);
      assert(await input.getAttribute('id'), 'Associated form field has id');
      const id = await input.getAttribute('id');
      assert.equal(await page.locator(`label[for="${id}"]`).count(), 1, 'Visible label association');
      sample.label = await page.locator(`label[for="${id}"]`).innerText();
      const main = page.locator('main');
      sample.styles = {
        root: await style(page.locator('.theme-root'), ['backgroundColor', 'fontFamily', 'fontSize', 'color']),
        main: await style(main, ['paddingLeft', 'paddingRight', 'maxWidth']),
        panel: await style(panel, ['backgroundColor', 'borderTopColor', 'borderRadius']),
        section: await style(page.locator('.interaction-section'), ['paddingTop']),
        actions: await style(page.locator('.form-actions'), ['gap']),
        input: await style(input, ['height', 'borderRadius', 'borderTopColor', 'fontSize']),
        primary: await style(submit, ['backgroundColor', 'color', 'borderRadius', 'height']),
      };
      sample.expected = { canvas: token('color.canvas'), surface: token('color.surface'), border: token('color.border'), accent: token('color.accent'), font: token('font.body'), radius: token('radius.control'), panelRadius: token('radius.panel'), controlHeight: token(width < 768 ? 'size.controlTouch' : 'size.control'), pagePadding: token(width < 768 ? 'space.pageMobile' : 'space.page'), panelPadding: token('space.panel') };
      const s = sample.styles, e = sample.expected;
      assert.equal(s.root.backgroundColor, rgb(e.canvas));
      assert.equal(s.root.fontSize, token('text.body'));
      assert.equal(s.panel.backgroundColor, rgb(e.surface));
      assert.equal(s.panel.borderTopColor, rgb(e.border));
      assert.equal(s.panel.borderRadius, e.panelRadius);
      assert.equal(s.section.paddingTop, e.panelPadding);
      assert.equal(s.actions.gap, token('space.inline'));
      assert.equal(s.primary.backgroundColor, rgb(e.accent));
      assert.equal(s.primary.borderRadius, e.radius);
      assert.equal(s.input.borderRadius, e.radius);
      assert.equal(s.input.borderTopColor, rgb(token('color.controlBorder')));
      // Chromium reports fractional layout units for AntD's text-derived Input height.
      // Permit at most 0.05 CSS px, while preserving exact expected/actual values.
      sample.controlHeightToleranceCssPx = 0.05;
      assert(Math.abs(parseFloat(s.input.height) - parseFloat(e.controlHeight)) <= .05, 'Input height matches token within subpixel rounding');
      assert(Math.abs(parseFloat(s.primary.height) - parseFloat(e.controlHeight)) <= .05, 'Button height matches token within subpixel rounding');
      assert.equal(s.main.paddingLeft, e.pagePadding);
      assert(s.root.fontFamily.includes('Segoe UI') && s.root.fontFamily.includes('Microsoft YaHei'));
      sample.checks.push('Snapshot tokens match actual body/panel/input/button colors, typography, dimensions, radii and spacing.');
      sample.layout = await page.evaluate(() => ({ width: innerWidth, documentWidth: document.documentElement.scrollWidth, cssZoom: getComputedStyle(document.documentElement).zoom }));
      assert(sample.layout.documentWidth <= width + 1, 'No document horizontal overflow');
      assert.equal(sample.layout.cssZoom, '1');
      await page.screenshot({ path: path.join(output, `default-${width}.png`), fullPage: true });
      await page.keyboard.press('Tab');
      assert(await input.evaluate(el => el === document.activeElement), 'First Tab reaches input');
      await page.keyboard.press('Tab');
      assert(await submit.evaluate(el => el === document.activeElement), 'Second Tab reaches primary');
      sample.focus = await style(submit, ['outlineColor', 'outlineStyle', 'outlineWidth', 'outlineOffset']);
      assert.notEqual(sample.focus.outlineStyle, 'none');
      assert(parseFloat(sample.focus.outlineWidth) >= 2);
      assert.equal(sample.focus.outlineColor, rgb(token('color.focus')));
      await page.screenshot({ path: path.join(output, `focus-${width}.png`) });
      await page.keyboard.press('Enter');
      await page.locator('.ant-form-item-explain-error').waitFor();
      await page.waitForTimeout(150);
      await page.evaluate(() => new Promise(resolve => requestAnimationFrame(() => requestAnimationFrame(resolve))));
      assert.equal(await input.getAttribute('aria-invalid'), 'true');
      const described = (await input.getAttribute('aria-describedby') || '').split(/\s+/).filter(Boolean);
      assert(described.length && (await Promise.all(described.map(d => page.locator(`[id="${d}"]`).count()))).every(Boolean), 'Error/helper description resolves');
      sample.error = await page.locator('.ant-form-item-explain-error').innerText();
      sample.errorStyle = await style(page.locator('.ant-form-item-explain-error').first(), ['color']);
      assert.equal(sample.errorStyle.color, rgb(token('color.error')));
      if (width === 375) await page.screenshot({ path: path.join(output, 'error-375.png'), fullPage: true });
      await input.fill('   ');
      await input.press('Enter');
      await page.locator('.ant-form-item-explain-error').waitFor();
      await input.fill('主题验证');
      await input.press('Tab');
      await page.keyboard.press('Enter');
      const status = page.getByRole('status');
      await status.filter({ hasText: /主题验证/ }).waitFor();
      sample.success = await status.innerText();
      await page.locator('.ant-form-item-explain-error').waitFor({ state: 'hidden' });
      sample.successStyle = await style(page.locator('.success-feedback'), ['backgroundColor', 'color']);
      assert.equal(sample.successStyle.backgroundColor, rgb(token('color.successBackground')));
      assert.equal(sample.successStyle.color, rgb(token('color.success')));
      if (width === 1440) await page.screenshot({ path: path.join(output, 'success-1440.png'), fullPage: true });
      await input.fill('修改后的名称');
      await page.waitForFunction(() => document.querySelector('[role="status"]')?.textContent.trim() === '');
      await input.press('Tab');
      await page.keyboard.press('Enter');
      await status.filter({ hasText: '修改后的名称' }).waitFor();
      sample.editClearsPreviousSuccess = true;
      const disabled = page.getByRole('button', { disabled: true });
      assert.equal(await disabled.count(), 1);
      assert(await disabled.isDisabled());
      sample.disabled = { name: await disabled.innerText(), description: await disabled.getAttribute('aria-describedby') };
      assert(sample.disabled.description && await page.locator(`[id="${sample.disabled.description}"]`).count(), 'Disabled reason associated');
      await page.keyboard.press('Tab');
      assert(await reset.evaluate(el => el === document.activeElement), 'Reset reachable, disabled excluded from tab order');
      await page.keyboard.press('Enter');
      assert.equal(await input.inputValue(), '');
      sample.checks.push('Keyboard required/whitespace error, labelled error association, valid success, reset, visible focus and native disabled reason.');
      await input.fill('A'.repeat(80));
      assert.equal(await input.getAttribute('maxlength'), '40');
      assert.equal((await input.inputValue()).length, 40, 'Native field enforces the documented length limit');
      await input.press('Enter');
      await page.waitForTimeout(50);
      assert((await page.evaluate(() => document.documentElement.scrollWidth)) <= width + 1, 'Long value does not overflow');
      await reset.click();
      sample.reducedMotion = await submit.evaluate(el => ({ reduced: matchMedia('(prefers-reduced-motion: reduce)').matches, transition: getComputedStyle(el).transitionDuration }));
      assert(sample.reducedMotion.reduced);
      assert(sample.reducedMotion.transition.split(',').every(t => parseFloat(t) <= .01));
      sample.contrast = { primary: contrast(s.primary.color, s.primary.backgroundColor), body: contrast(s.root.color, s.root.backgroundColor), errorOnSurface: contrast(sample.errorStyle.color, s.panel.backgroundColor), focusOnSurface: contrast(sample.focus.outlineColor, s.panel.backgroundColor), success: contrast(sample.successStyle.color, sample.successStyle.backgroundColor) };
      assert(sample.contrast.primary >= 4.5 && sample.contrast.body >= 4.5 && sample.contrast.errorOnSurface >= 4.5 && sample.contrast.focusOnSurface >= 3 && sample.contrast.success >= 4.5);
      const session = await context.newCDPSession(page);
      const ax = await session.send('Accessibility.getFullAXTree');
      sample.accessibilityNodes = ax.nodes.filter(n => !n.ignored && ['textbox', 'button', 'heading', 'status'].includes(n.role?.value)).map(n => ({ role: n.role.value, name: n.name?.value, description: n.description?.value, properties: n.properties }));
      assert(sample.accessibilityNodes.some(n => n.role === 'textbox' && n.name));
      assert(sample.accessibilityNodes.some(n => n.role === 'status'), 'Live feedback region remains in accessibility tree while empty');
      assert.equal(sample.pageErrors.length, 0);
      assert.equal(sample.consoleErrors.length, 0);
      assert(sample.requests.every(r => r.startsWith(url) || r.startsWith('data:')), 'Consumer serves without external UI assets');
      sample.status = 'passed';
      await context.close();
    }
    report.status = 'passed';
    report.notCovered = ['Real screen-reader operation', 'Other browsers/operating systems', 'Automated visual regression', 'Loading/empty: no network or list in selected scenario'];
  } catch (error) { report.status = 'failed'; report.errors.push(String(error.stack || error)); process.exitCode = 1; }
  finally { await browser?.close(); fs.writeFileSync(path.join(output, 'browser-check.json'), JSON.stringify(report, null, 2) + '\n'); console.log(JSON.stringify({ status: report.status, sourceSha: report.sourceSha, viewports: report.viewports.length, errors: report.errors })); }
})();
