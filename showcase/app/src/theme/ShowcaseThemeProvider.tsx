import { App, ConfigProvider } from 'antd';
import zhCN from 'antd/locale/zh_CN';
import type { CSSProperties, PropsWithChildren } from 'react';
import { createAntdTheme, toPixels } from './antd-theme';
import { resolvedTokens as tokens } from './tokens';
import './global.css';

const theme = createAntdTheme(tokens);
const variables = Object.fromEntries(
  Object.entries(tokens).map(([name, value]) => [
    `--pui-${name.replaceAll('.', '-').replace(/[A-Z]/g, (letter) => `-${letter.toLowerCase()}`)}`,
    value,
  ]),
) as CSSProperties;

// CSS media conditions require concrete values, not var() expressions.
const medium = toPixels(tokens['layout.breakpointMedium']!, 'layout.breakpointMedium');
const large = toPixels(tokens['layout.breakpointLarge']!, 'layout.breakpointLarge');
const responsiveStyles = `
  @media (min-width: ${medium}px) {
    .pui-preview, .pui-shell-main { padding: var(--pui-space-page); }
  }
  @media (min-width: ${large}px) {
    .pui-preview-grid { grid-template-columns: minmax(0, 1.2fr) minmax(0, 1fr); }
  }
`;

export function ShowcaseThemeProvider({ children }: PropsWithChildren) {
  return (
    <ConfigProvider locale={zhCN} theme={theme}>
      <App className="pui-root" style={variables}>
        <style>{responsiveStyles}</style>
        {children}
      </App>
    </ConfigProvider>
  );
}
