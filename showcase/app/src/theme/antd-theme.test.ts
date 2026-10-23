import { describe, expect, it } from 'vitest';
import primitives from '../../../../design-system/tokens/primitives.json';
import semantic from '../../../../design-system/tokens/semantic.json';
import minimalSaas from '../../../../design-system/styles/minimal-saas.json';
import { createAntdTheme, toLineHeight, toPixels } from './antd-theme';
import { resolveTokens } from './resolve-tokens';

const resolveMinimalSaas = () =>
  resolveTokens(primitives.tokens, semantic.tokens, minimalSaas.tokens);

describe('createAntdTheme', () => {
  it('adapts the actual minimal-saas colors, fonts and dimensions', () => {
    const theme = createAntdTheme(resolveMinimalSaas());

    expect(theme.token).toMatchObject({
      colorPrimary: '#2563eb',
      colorPrimaryHover: '#1d4ed8',
      colorText: '#0f172a',
      colorTextSecondary: '#475569',
      colorBgLayout: '#f8fafc',
      colorBgContainer: '#ffffff',
      colorBgElevated: '#ffffff',
      colorBorder: '#64748b',
      colorBorderSecondary: '#e2e8f0',
      colorTextLightSolid: '#ffffff',
      colorSuccess: '#15803d',
      colorSuccessBg: '#f0fdf4',
      colorWarning: '#92400e',
      colorWarningBg: '#fffbeb',
      colorError: '#b91c1c',
      colorErrorBg: '#fef2f2',
      fontFamily: primitives.tokens['font.ui'],
      fontFamilyCode: primitives.tokens['font.code'],
      fontSize: 14,
      fontSizeHeading1: 32,
      lineHeight: 1.6,
      borderRadius: 8,
      controlHeight: 40,
    });
  });

  it('keeps resolved tokens and original JSON dictionaries unchanged', () => {
    const source = structuredClone({ primitives, semantic, minimalSaas });
    const tokens = Object.freeze(resolveMinimalSaas());
    const before = { ...tokens };

    const theme = createAntdTheme(tokens);
    if (theme.token) theme.token.colorPrimary = '#000000';

    expect(tokens).toEqual(before);
    expect({ primitives, semantic, minimalSaas }).toEqual(source);
  });

  it('reports the missing semantic token', () => {
    const tokens = resolveMinimalSaas();
    delete tokens['color.accent'];

    expect(() => createAntdTheme(tokens)).toThrow(/Missing semantic token "color.accent"/);
  });

  it.each(['text.body', 'text.title', 'radius.control', 'size.control'])(
    'rejects an invalid px unit in %s with the token name',
    (name) => {
      const tokens = { ...resolveMinimalSaas(), [name]: '1rem' };

      expect(() => createAntdTheme(tokens)).toThrow(new RegExp(`Invalid ${name}`));
    },
  );

  it('rejects an invalid line-height unit from resolved tokens', () => {
    expect(() =>
      createAntdTheme({ ...resolveMinimalSaas(), 'line.body': '24px' }),
    ).toThrow(/Invalid line.body/);
  });
});

describe('toPixels', () => {
  it.each([
    ['8px', 8],
    ['40px', 40],
    ['0px', 0],
    ['8.5px', 8.5],
  ])('converts %s to %s', (value, expected) => {
    expect(toPixels(value as string, 'radius.control')).toBe(expected);
  });

  it.each([
    '1rem', '8', '8%', '8PX', '8px extra', '', ' 8px', '8px\n',
    'NaNpx', 'Infinitypx', '-Infinitypx', `${'9'.repeat(400)}px`,
  ])('rejects invalid or non-finite px value %j', (value) => {
    expect(() => toPixels(value, 'radius.control')).toThrow(/Invalid radius.control/);
  });
});

describe('toLineHeight', () => {
  it.each([
    ['1.6', 1.6],
    ['2', 2],
    ['0.8', 0.8],
  ])('converts %s to %s', (value, expected) => {
    expect(toLineHeight(value as string)).toBe(expected);
  });

  it.each([
    '1.6px', '1rem', '160%', '', ' 1.6', '1.6\n', '0', '-1.6',
    'NaN', 'Infinity', '-Infinity', '9'.repeat(400),
  ])('rejects invalid or non-finite line height %j', (value) => {
    expect(() => toLineHeight(value)).toThrow(/Invalid line.body/);
  });
});
