/** Resolve the repository's complete-value aliases into semantic token values. */
export function resolveTokens(
  primitives: Readonly<Record<string, string>>,
  semantic: Readonly<Record<string, string>>,
  overrides: Readonly<Record<string, string>>,
): Record<string, string> {
  const primitiveNames = new Set(Object.keys(primitives));
  const semanticNames = new Set(Object.keys(semantic));

  for (const name of primitiveNames) {
    if (semanticNames.has(name)) {
      throw new Error(
        `Token key conflict: "${name}" exists in both primitives and semantic tokens.`,
      );
    }
  }

  for (const name of Object.keys(overrides)) {
    if (!semanticNames.has(name)) {
      throw new Error(
        `Invalid token override: "${name}" is not an existing semantic token.`,
      );
    }
  }

  const values = new Map([
    ...Object.entries(primitives),
    ...Object.entries(semantic),
    ...Object.entries(overrides),
  ]);
  const resolved = new Map<string, string>();
  const trail: string[] = [];

  const resolveToken = (name: string): string => {
    const value = values.get(name);
    if (value === undefined) {
      throw new Error(
        `Unknown token reference: "${name}" in ${trail.join(' -> ')}.`,
      );
    }

    const cached = resolved.get(name);
    if (cached !== undefined) return cached;

    if (trail.includes(name)) {
      throw new Error(`Circular token reference: ${[...trail, name].join(' -> ')}.`);
    }

    trail.push(name);
    let result = value;

    if (/^\{[^{}]+\}$/.test(value) && value.endsWith('}')) {
      const reference = value.slice(1, -1);
      if (primitiveNames.has(name) && semanticNames.has(reference)) {
        throw new Error(
          `Primitive token "${name}" cannot reference semantic token "${reference}".`,
        );
      }
      result = resolveToken(reference);
    } else if (/[{}]/.test(value)) {
      throw new Error(
        `Unsupported token interpolation in "${name}": aliases must occupy the complete value.`,
      );
    }

    trail.pop();
    resolved.set(name, result);
    return result;
  };

  // Validate unused primitives too, so an invalid reverse dependency cannot hide.
  for (const name of primitiveNames) resolveToken(name);

  return Object.fromEntries(
    [...semanticNames].map((name) => [name, resolveToken(name)]),
  );
}
