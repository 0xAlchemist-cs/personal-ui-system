import type { Preview } from '@storybook/react-vite';
import { ShowcaseThemeProvider } from '../src/theme/ShowcaseThemeProvider';
import '../src/components/shell.css';
import '../src/features/members/members.css';
import './stories.css';

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
