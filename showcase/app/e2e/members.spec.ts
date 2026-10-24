import {
  expect, expectFocusTrapped, expectHorizontallyContained, expectMemberNames,
  expectNoDocumentOverflow, goToPage, memberRows, selectStatus, test,
} from './fixtures';

const names = (numbers: number[]) => numbers.map((number) => `演示成员${String(number).padStart(2, '0')}`);

test('filter, paginate and sort the fixed member set; clearing preserves sort', async ({ page, browser }, testInfo) => {
  const keyword = page.getByRole('textbox', { name: '姓名或邮箱', exact: true });
  const resultStatus = page.getByRole('status');
  const sort = page.getByRole('columnheader', { name: '创建时间', exact: true });
  await expect(resultStatus).toHaveText('共 30 位成员 · 第 1–10 位');
  await expectMemberNames(page, names([30, 29, 28, 27, 26, 25, 24, 23, 22, 21]));
  await expect(sort).toHaveAttribute('aria-sort', 'descending');
  const environment = {
    browserVersion: browser.version(),
    nodeVersion: process.version,
    viewport: page.viewportSize(),
    ...await page.evaluate(() => ({
      innerWidth: window.innerWidth,
      language: navigator.language,
      userAgent: navigator.userAgent,
      timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
      devicePixelRatio: window.devicePixelRatio,
      reducedMotion: window.matchMedia('(prefers-reduced-motion: reduce)').matches,
    })),
    headingFontFamily: await page.getByRole('heading', { level: 1 }).evaluate((element) => getComputedStyle(element).fontFamily),
  };
  await testInfo.attach(`environment-${testInfo.project.name}`, {
    body: JSON.stringify(environment, null, 2),
    contentType: 'application/json',
  });
  console.info(`Browser environment (${testInfo.project.name}): ${JSON.stringify(environment)}`);
  await testInfo.attach(`default-${testInfo.project.name}`, {
    body: await page.screenshot({ fullPage: true }),
    contentType: 'image/png',
  });

  await goToPage(page, 3);
  await expectMemberNames(page, names([10, 9, 8, 7, 6, 5, 4, 3, 2, 1]));
  // All 30 emails still match, so this proves a keyword change resets page 3.
  await keyword.fill('MEMBER');
  await expect(resultStatus).toHaveText('共 30 位成员 · 第 1–10 位');
  await expectMemberNames(page, names([30, 29, 28, 27, 26, 25, 24, 23, 22, 21]));
  await goToPage(page, 2);
  await selectStatus(page, 'active');
  // Twenty matches retain two pages; status changes must return to page 1.
  await expect(resultStatus).toHaveText('共 20 位成员 · 第 1–10 位');
  await expect(memberRows(page).first().getByRole('cell').first()).toHaveText('演示成员29');

  await selectStatus(page, 'all', 'active');
  await keyword.fill('MEMBER0');
  await expectMemberNames(page, names([9, 8, 7, 6, 5, 4, 3, 2, 1]));
  await selectStatus(page, 'disabled');
  await expect(keyword).toHaveValue('MEMBER0');
  await expect(resultStatus).toHaveText('共 3 位成员 · 第 1–3 位');
  await expectMemberNames(page, names([9, 6, 3]));
  await sort.press('Enter');
  await expect(sort).toHaveAttribute('aria-sort', 'ascending');
  await expectMemberNames(page, names([3, 6, 9]));

  await keyword.fill('no-such-member');
  await expect(page.getByText('没有符合条件的成员', { exact: true })).toBeVisible();
  await expect(memberRows(page)).toHaveCount(0);
  await expect(resultStatus).toHaveText('共 0 位成员');
  await expect(keyword).toHaveValue('no-such-member');
  await expect(page.getByRole('search', { name: '筛选成员', exact: true })).toContainText('已停用');
  await page.getByRole('search', { name: '筛选成员', exact: true })
    .getByRole('button', { name: '清除筛选', exact: true }).click();
  await expect(keyword).toHaveValue('');
  await expect(page.getByRole('search', { name: '筛选成员', exact: true })).toContainText('全部状态');
  await expect(resultStatus).toHaveText('共 30 位成员 · 第 1–10 位');
  await expect(sort).toHaveAttribute('aria-sort', 'ascending');
  await expectMemberNames(page, names([1, 2, 3, 4, 5, 6, 7, 8, 9, 10]));
});

test('validate and cancel an edit, then save in memory and restore data on refresh', async ({ page }) => {
  const trigger = page.getByRole('button', { name: '编辑演示成员30', exact: true });
  await expect(memberRows(page).first()).toContainText('已停用');
  await trigger.click();
  const dialog = page.getByRole('dialog', { name: '编辑成员', exact: true });
  const name = dialog.getByLabel('姓名', { exact: true });
  const email = dialog.getByLabel('邮箱', { exact: true });
  const save = dialog.getByRole('button', { name: /^保\s*存$/ });
  await expect(name).toBeFocused();
  await expectHorizontallyContained(dialog);
  await expect(save).toBeEnabled();
  await name.fill(' ');
  await expect(save).toBeDisabled();
  await expect(dialog.getByText('请输入非空姓名。', { exact: true })).toBeHidden();
  await email.fill('invalid');
  await email.press('Tab');
  await expect(name).toHaveAttribute('aria-invalid', 'true');
  await expect(email).toHaveAttribute('aria-invalid', 'true');
  await expect(name).toHaveAccessibleDescription('请输入非空姓名。');
  await expect(email).toHaveAccessibleDescription('请输入有效的邮箱地址。');
  await expect(save).toBeDisabled();
  await expect(save).toHaveAccessibleDescription('请填写非空姓名和有效邮箱后保存。');
  await expect(dialog.getByText('请填写非空姓名和有效邮箱后保存。', { exact: true })).toBeVisible();
  await expect(name).toHaveValue(' ');
  await expect(email).toHaveValue('invalid');
  await expectFocusTrapped(page, dialog);
  await page.keyboard.press('Escape');
  await expect(dialog).toBeHidden();
  await expect(trigger).toBeFocused();
  await expect(memberRows(page).first()).toContainText('member30@example.test');

  await trigger.press('Enter');
  await expect(name).toBeFocused();
  await expect(name).toHaveValue('演示成员30');
  await expect(email).toHaveValue('member30@example.test');
  await name.fill(' 演示成员30 已编辑 ');
  await email.fill(' edited30@example.test ');
  await expect(save).toBeEnabled();
  await save.click();
  // Assert the short-lived message immediately, before waiting for focus restoration.
  await expect(page.getByText('演示修改已保存，刷新后恢复初始数据。', { exact: true })).toBeVisible();
  await expect(dialog).toBeHidden();
  await expect(page.getByRole('button', { name: '编辑演示成员30 已编辑', exact: true })).toBeFocused();
  await expect(memberRows(page).first().getByRole('cell').first()).toHaveText('演示成员30 已编辑');
  await expect(memberRows(page).first()).toContainText('edited30@example.test');
  await page.reload();
  await expect(memberRows(page)).toHaveCount(10);
  await expect(memberRows(page).first().getByRole('cell').first()).toHaveText('演示成员30');
  await expect(memberRows(page).first()).toContainText('member30@example.test');
  await expect(page.getByText('edited30@example.test', { exact: true })).toHaveCount(0);
});

test('editing the sole match retains the filter, focuses the heading and exposes the updated record on clear', async ({ page }) => {
  const keyword = page.getByRole('textbox', { name: '姓名或邮箱', exact: true });
  await keyword.fill('member30@');
  await expectMemberNames(page, names([30]));
  await page.getByRole('button', { name: '编辑演示成员30', exact: true }).click();
  const dialog = page.getByRole('dialog', { name: '编辑成员', exact: true });
  await dialog.getByLabel('邮箱', { exact: true }).fill('changed@example.test');
  const save = dialog.getByRole('button', { name: /^保\s*存$/ });
  await expect(save).toBeEnabled();
  await save.click();
  await expect(dialog).toBeHidden();
  await expect(page.getByRole('heading', { name: '成员列表', level: 2, exact: true })).toBeFocused();
  await expect(page.getByText('没有符合条件的成员', { exact: true })).toBeVisible();
  await expect(memberRows(page)).toHaveCount(0);
  await expect(page.getByRole('status')).toHaveText('共 0 位成员');
  await expect(keyword).toHaveValue('member30@');
  await expectNoDocumentOverflow(page);
  await expectHorizontallyContained(keyword);
  await expectHorizontallyContained(page.getByRole('combobox', { name: '成员状态', exact: true }));
  const emptyRegion = page.getByRole('region', { name: '成员列表，可横向滚动', exact: true });
  const clear = emptyRegion.getByRole('button', { name: '清除筛选', exact: true });
  await expectHorizontallyContained(clear);
  await clear.click();
  await expect(keyword).toHaveValue('');
  await expect(memberRows(page)).toHaveCount(10);
  await expect(memberRows(page).first().getByRole('cell').first()).toHaveText('演示成员30');
  await expect(memberRows(page).first()).toContainText('changed@example.test');
  await expect(page.getByText('member30@example.test', { exact: true })).toHaveCount(0);
});
