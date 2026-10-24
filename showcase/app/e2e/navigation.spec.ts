import { expect, expectFocusTrapped, expectHorizontallyContained, test } from './fixtures';

test('narrow navigation traps focus and restores its trigger; the table supports local keyboard scrolling', async ({ page }) => {
  const trigger = page.getByRole('button', { name: '打开工作台导航', exact: true });
  await expectHorizontallyContained(trigger);
  await trigger.focus();
  await page.keyboard.press('Enter');
  const drawer = page.getByRole('dialog', { name: '工作台导航', exact: true });
  await expect(drawer).toBeVisible();
  await expect.poll(() => drawer.evaluate((element) => element.contains(document.activeElement))).toBe(true);
  await expectFocusTrapped(page, drawer);
  await page.keyboard.press('Escape');
  await expect(drawer).toBeHidden();
  await expect(trigger).toBeFocused();
  await trigger.press('Enter');
  await expect(drawer).toBeVisible();
  await drawer.getByRole('button', { name: '关闭工作台导航', exact: true }).press('Enter');
  await expect(drawer).toBeHidden();
  await expect(trigger).toBeFocused();

  const table = page.getByRole('region', { name: '成员列表，可横向滚动', exact: true });
  await expect(table).toHaveAttribute('tabindex', '0');
  await expect(table).toHaveAccessibleDescription('表格可横向滚动；可聚焦后使用左右方向键查看。');
  await expect.poll(() => table.evaluate((element) => element.scrollWidth - element.clientWidth)).toBeGreaterThan(0);
  await table.focus();
  const initialScroll = await table.evaluate((element) => element.scrollLeft);
  await page.keyboard.press('ArrowRight');
  await expect.poll(() => table.evaluate((element) => element.scrollLeft)).toBeGreaterThan(initialScroll);
  // Focus the target directly after checking arrow scrolling; this is not a complete Tab-order audit.
  const edit = page.getByRole('button', { name: '编辑演示成员30', exact: true });
  await edit.focus();
  await expect(edit).toBeFocused();
  await expect(edit).toBeInViewport({ ratio: 1 });
  await expectHorizontallyContained(edit);
  await page.keyboard.press('Enter');
  const modal = page.getByRole('dialog', { name: '编辑成员', exact: true });
  await expect(modal.getByLabel('姓名', { exact: true })).toBeFocused();
  await expectHorizontallyContained(modal);
  await page.keyboard.press('Escape');
  await expect(modal).toBeHidden();
  await expect(edit).toBeFocused();
});
