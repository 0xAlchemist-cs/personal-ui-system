import type { Preview } from '@storybook/react-vite';
import { ShowcaseThemeProvider } from '../src/theme/ShowcaseThemeProvider';

const preview: Preview = {
  decorators: [
    (Story) => (
      <ShowcaseThemeProvider>
        <Story />
      </ShowcaseThemeProvider>
    ),
  ],
  parameters: { layout: 'fullscreen' },
};

export default preview;
