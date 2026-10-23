import primitives from '../../../../design-system/tokens/primitives.json';
import semantic from '../../../../design-system/tokens/semantic.json';
import preset from '../../../../design-system/styles/minimal-saas.json';
import { resolveTokens } from './resolve-tokens';

// Theme and responsive layout consume the same resolved preset.
export const resolvedTokens = resolveTokens(primitives.tokens, semantic.tokens, preset.tokens);
