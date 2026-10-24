import { defineConfig } from '@playwright/test';
import os from 'node:os';

export default defineConfig({
  testDir: './e2e',
  fullyParallel: false,
  workers: 1,
  retries: 0,
  forbidOnly: !!process.env.CI,
  timeout: 30_000,
  expect: { timeout: 10_000 },
  outputDir: 'test-results/artifacts',
  reporter: [
    ['list'],
    ['json', { outputFile: 'test-results/results.json' }],
    ['html', { outputFolder: 'playwright-report', open: 'never' }],
  ],
  metadata: {
    node: process.version,
    platform: os.platform(),
    osRelease: os.release(),
    purpose: 'Behavior and layout smoke tests; screenshots are diagnostic, without pixel baselines.',
  },
  updateSnapshots: 'none',
  use: {
    browserName: 'chromium',
    baseURL: 'http://127.0.0.1:5187/',
    locale: 'zh-CN',
    timezoneId: 'UTC',
    deviceScaleFactor: 1,
    colorScheme: 'light',
    contextOptions: { reducedMotion: 'reduce' },
    serviceWorkers: 'block',
    trace: 'retain-on-failure',
    screenshot: 'only-on-failure',
    video: 'off',
  },
  projects: [
    { name: 'desktop', use: { viewport: { width: 1440, height: 900 } }, testIgnore: '**/navigation.spec.ts' },
    { name: 'tablet', use: { viewport: { width: 768, height: 1024 } } },
    { name: 'mobile', use: { viewport: { width: 375, height: 812 } } },
  ],
  webServer: {
    command: 'node node_modules/vite/bin/vite.js preview --host 127.0.0.1 --port 5187 --strictPort',
    url: 'http://127.0.0.1:5187/',
    reuseExistingServer: false,
    timeout: 30_000,
    stdout: 'pipe',
    stderr: 'pipe',
  },
});
