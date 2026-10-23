import { fileURLToPath } from 'node:url';
import type { StorybookConfig } from '@storybook/react-vite';

const config: StorybookConfig = {
  stories: ['../src/**/*.stories.tsx'],
  framework: { name: '@storybook/react-vite', options: {} },
  core: { disableTelemetry: true },
  viteFinal: async (viteConfig) => ({
    ...viteConfig,
    server: {
      ...viteConfig.server,
      fs: {
        ...viteConfig.server?.fs,
        allow: [
          fileURLToPath(new URL('../', import.meta.url)),
          fileURLToPath(new URL('../../../design-system/', import.meta.url)),
        ],
      },
    },
  }),
};

export default config;
