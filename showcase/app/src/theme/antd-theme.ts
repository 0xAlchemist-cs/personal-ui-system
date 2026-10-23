import type { ThemeConfig } from 'antd';

/** Ant Design expects numeric CSS pixel values for these dimensions. */
export function toPixels(value: string, label: string): number {
  const pixels = Number(value.slice(0, -2));
  if (
    !/^-?(?:\d+(?:\.\d+)?|\.\d+)px$/.test(value) ||
    value.trim() !== value ||
    !Number.isFinite(pixels)
  ) {
    throw new Error(`Invalid ${label}: expected a finite px value, received "${value}".`);
  }
  return pixels;
}

/** Line height is a positive, finite, unitless decimal in the token contract. */
export function toLineHeight(value: string): number {
  const lineHeight = Number(value);
  if (
    !/^(?:\d+(?:\.\d+)?|\.\d+)$/.test(value) ||
    value.trim() !== value ||
    !Number.isFinite(lineHeight) ||
    lineHeight <= 0
  ) {
    throw new Error(
      `Invalid line.body: expected a positive finite unitless value, received "${value}".`,
    );
  }
  return lineHeight;
}

/** Adapt resolved semantic values without changing the source tokens. */
export function createAntdTheme(tokens: Readonly<Record<string, string>>): ThemeConfig {
  const token = (name: string): string => {
    const value = tokens[name];
    if (value === undefined) {
      throw new Error(`Missing semantic token "${name}" for Ant Design theme.`);
    }
    return value;
  };

  return {
    token: {
      colorPrimary: token('color.accent'),
      colorPrimaryHover: token('color.accentHover'),
      colorPrimaryBorder: token('color.focus'),
      colorLink: token('color.accent'),
      colorLinkHover: token('color.accentHover'),
      colorLinkActive: token('color.accentHover'),
      colorText: token('color.text'),
      colorTextSecondary: token('color.muted'),
      colorTextPlaceholder: token('color.muted'),
      colorTextDescription: token('color.muted'),
      colorBgLayout: token('color.canvas'),
      colorBgContainer: token('color.surface'),
      colorBgElevated: token('color.elevated'),
      colorBorder: token('color.controlBorder'),
      colorBorderSecondary: token('color.border'),
      colorTextLightSolid: token('color.onAccent'),
      colorSuccess: token('color.success'),
      colorSuccessBg: token('color.successBackground'),
      colorWarning: token('color.warning'),
      colorWarningBg: token('color.warningBackground'),
      colorError: token('color.error'),
      colorErrorBg: token('color.errorBackground'),
      fontFamily: token('font.body'),
      fontFamilyCode: token('font.mono'),
      fontSize: toPixels(token('text.body'), 'text.body'),
      fontSizeHeading1: toPixels(token('text.title'), 'text.title'),
      lineHeight: toLineHeight(token('line.body')),
      borderRadius: toPixels(token('radius.control'), 'radius.control'),
      controlHeight: toPixels(token('size.control'), 'size.control'),
    },
  };
}
