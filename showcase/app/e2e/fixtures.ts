import { expect, test as base, type Locator, type Page } from '@playwright/test';

export async function expectNoDocumentOverflow(page: Page) {
  await expect.poll(() => page.evaluate(() => (
    document.documentElement.scrollWidth - window.innerWidth
  )), { message: 'The document must not overflow horizontally; the table scrolls locally.' }).toBeLessThanOrEqual(0);
}

export async function expectHorizontallyContained(control: Locator) {
  await expect(control).toBeVisible();
  await expect.poll(() => control.evaluate((element) => {
    const bounds = element.getBoundingClientRect();
    return bounds.left >= 0 && bounds.right <= window.innerWidth;
  }), { message: 'The complete control must fit within the viewport width.' }).toBe(true);
}

export function memberRows(page: Page) {
  return page.getByRole('region', { name: '成员列表，可横向滚动', exact: true })
    .getByRole('row').filter({ has: page.getByRole('button', { name: /^编辑/ }) });
}

export async function expectMemberNames(page: Page, names: string[]) {
  const rows = memberRows(page);
  await expect(rows).toHaveCount(names.length);
  for (const [index, name] of names.entries()) {
    await expect(rows.nth(index).getByRole('cell').first()).toHaveText(name);
  }
}

export async function selectStatus(
  page: Page,
  value: 'all' | 'active' | 'disabled',
  current: 'all' | 'active' | 'disabled' = 'all',
) {
  const select = page.getByRole('combobox', { name: '成员状态', exact: true });
  await select.press('Enter');
  await expect(select).toHaveAttribute('aria-expanded', 'true');
  const positions = { all: 0, active: 1, disabled: 2 };
  const steps = positions[value] - positions[current];
  for (let index = 0; index < Math.abs(steps); index += 1) {
    await select.press(steps > 0 ? 'ArrowDown' : 'ArrowUp');
  }
  await select.press('Enter');
  await expect(select).toHaveAttribute('aria-expanded', 'false');
}

export async function goToPage(page: Page, number: number) {
  // Ant Design's page links currently have no accessible page-number name.
  const pagination = page.getByRole('navigation', { name: '成员列表分页', exact: true });
  await pagination.locator(`.ant-pagination-item[title="${number}"]`).press('Enter');
  await expect(pagination.locator('.ant-pagination-item-active')).toHaveAttribute('title', String(number));
}

export async function expectFocusTrapped(page: Page, dialog: Locator) {
  for (const key of ['Tab', 'Shift+Tab']) {
    for (let index = 0; index < 8; index += 1) {
      await page.keyboard.press(key);
      await expect.poll(() => dialog.evaluate((element) => (
        element.contains(document.activeElement)
      )), { message: `${key} must keep focus inside the open dialog.` }).toBe(true);
    }
  }
}

export const test = base.extend<{ browserHealth: void }>({
  browserHealth: [async ({ page }, use, testInfo) => {
    const issues: string[] = [];
    page.on('pageerror', (error) => issues.push(`pageerror: ${error.message}`));
    page.on('console', (message) => {
      if (message.type() === 'error') issues.push(`console error: ${message.text()}`);
    });
    await page.goto('/');
    await expect(memberRows(page)).toHaveCount(10);
    await expectNoDocumentOverflow(page);
    await use();
    if (issues.length > 0) {
      await testInfo.attach('browser-errors', {
        body: JSON.stringify(issues, null, 2),
        contentType: 'application/json',
      });
    }
    expect(issues, 'No unhandled browser errors or console errors.').toEqual([]);
    await expectNoDocumentOverflow(page);
  }, { auto: true }],
});

export { expect };
