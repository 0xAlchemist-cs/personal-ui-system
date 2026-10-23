import { describe, expect, it } from 'vitest';
import primitives from '../../../../design-system/tokens/primitives.json';
import semantic from '../../../../design-system/tokens/semantic.json';
import minimalSaas from '../../../../design-system/styles/minimal-saas.json';
import { resolveTokens } from './resolve-tokens';

describe('resolveTokens', () => {
  it('resolves the actual minimal-saas assets and returns only semantic keys', () => {
    const result = resolveTokens(primitives.tokens, semantic.tokens, minimalSaas.tokens);

    expect(result['color.accent']).toBe('#2563eb');
    expect(result['radius.control']).toBe('8px');
    expect(result['size.control']).toBe('40px');
    expect(Object.keys(result).sort()).toEqual(Object.keys(semantic.tokens).sort());
    for (const name of Object.keys(primitives.tokens)) {
      expect(Object.hasOwn(result, name)).toBe(false);
    }
    expect(Object.values(result).every((value) => !/[{}]/.test(value))).toBe(true);
  });

  it('applies overrides before resolving references to other semantic tokens', () => {
    const result = resolveTokens(
      { blue: '#2563eb', green: '#15803d' },
      { accent: '{blue}', focus: '{accent}' },
      { accent: '{green}' },
    );

    expect(result).toEqual({ accent: '#15803d', focus: '#15803d' });
  });

  it('supports primitive alias chains, semantic alias chains, and literal values', () => {
    expect(
      resolveTokens(
        { blue: '#2563eb', brand: '{blue}' },
        { accent: '{brand}', focus: '{accent}', transparent: 'transparent', empty: '' },
        {},
      ),
    ).toEqual({
      accent: '#2563eb',
      focus: '#2563eb',
      transparent: 'transparent',
      empty: '',
    });
  });

  it('rejects an unknown reference with its source and target names', () => {
    expect(() => resolveTokens({}, { accent: '{missing}' }, {})).toThrow(
      /Unknown token reference.*missing.*accent/,
    );
  });

  it('rejects unknown references introduced by overrides', () => {
    expect(() => resolveTokens({}, { accent: '#2563eb' }, { accent: '{missing}' })).toThrow(
      /Unknown token reference.*missing/,
    );
  });

  it('rejects cycles with the complete reference path', () => {
    expect(() => resolveTokens({}, { accent: '{focus}', focus: '{accent}' }, {})).toThrow(
      /Circular token reference: accent -> focus -> accent/,
    );
  });

  it('rejects a self reference', () => {
    expect(() => resolveTokens({}, { accent: '{accent}' }, {})).toThrow(
      /Circular token reference: accent -> accent/,
    );
  });

  it('rejects primitive and semantic name conflicts before applying overrides', () => {
    expect(() =>
      resolveTokens({ accent: '#2563eb' }, { accent: '#ffffff' }, { accent: '#000000' }),
    ).toThrow(/Token key conflict.*accent/);
  });

  it.each(['newSemantic', 'blue'])('rejects the illegal override %s', (name) => {
    expect(() =>
      resolveTokens({ blue: '#2563eb' }, { accent: '{blue}' }, { [name]: '#ffffff' }),
    ).toThrow(new RegExp(`Invalid token override.*${name}`));
  });

  it('rejects a primitive referencing a semantic token even when unused', () => {
    expect(() =>
      resolveTokens({ blue: '#2563eb', unused: '{accent}' }, { accent: '{blue}' }, {}),
    ).toThrow(/Primitive token "unused" cannot reference semantic token "accent"/);
  });

  it('rejects a primitive reverse dependency through another primitive', () => {
    expect(() =>
      resolveTokens(
        { unused: '{alias}', alias: '{accent}' },
        { accent: '#2563eb' },
        {},
      ),
    ).toThrow(/Primitive token "alias" cannot reference semantic token "accent"/);
  });

  it('validates unknown references in unused primitives', () => {
    expect(() =>
      resolveTokens({ unused: '{missing}' }, { accent: '#2563eb' }, {}),
    ).toThrow(/Unknown token reference.*missing.*unused/);
  });

  it('validates cycles in unused primitives', () => {
    expect(() =>
      resolveTokens({ first: '{second}', second: '{first}' }, { accent: '#2563eb' }, {}),
    ).toThrow(/Circular token reference: first -> second -> first/);
  });

  it.each([
    '1px solid {blue}',
    '{blue} {blue}',
    'calc({blue} + 1px)',
    '{}',
    '{blue',
    '{blue}\n',
    '\n{blue}',
  ])(
    'rejects unsupported alias syntax: %s',
    (value) => {
      expect(() => resolveTokens({ blue: '#2563eb' }, { accent: value }, {})).toThrow(
        /Unsupported token interpolation.*accent/,
      );
    },
  );

  it('validates unsupported interpolation in unused primitives', () => {
    expect(() =>
      resolveTokens({ unused: '1px solid {blue}', blue: '#2563eb' }, { accent: '{blue}' }, {}),
    ).toThrow(/Unsupported token interpolation.*unused/);
  });

  it('does not treat inherited object properties as known tokens', () => {
    expect(() => resolveTokens({}, { accent: '{toString}' }, {})).toThrow(
      /Unknown token reference.*toString/,
    );
  });

  it('preserves all source dictionaries and returns a separate result', () => {
    const sourcePrimitives = Object.freeze({ blue: '#2563eb', green: '#15803d' });
    const sourceSemantic = Object.freeze({ accent: '{blue}', focus: '{accent}' });
    const sourceOverrides = Object.freeze({ accent: '{green}' });

    const result = resolveTokens(sourcePrimitives, sourceSemantic, sourceOverrides);
    result.accent = '#000000';

    expect(sourcePrimitives).toEqual({ blue: '#2563eb', green: '#15803d' });
    expect(sourceSemantic).toEqual({ accent: '{blue}', focus: '{accent}' });
    expect(sourceOverrides).toEqual({ accent: '{green}' });
    expect(result).not.toBe(sourceSemantic);
  });
});
