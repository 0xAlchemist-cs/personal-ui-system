import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App';
import { ShowcaseThemeProvider } from './theme/ShowcaseThemeProvider';

const root = document.getElementById('root');
if (!root) throw new Error('Application root element is missing.');

createRoot(root).render(
  <StrictMode>
    <ShowcaseThemeProvider>
      <App />
    </ShowcaseThemeProvider>
  </StrictMode>,
);
