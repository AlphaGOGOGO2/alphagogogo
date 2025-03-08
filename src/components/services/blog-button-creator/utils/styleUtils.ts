
/**
 * Converts a style object to an inline CSS string
 */
export const styleToString = (style: Record<string, any>): string => {
  return Object.keys(style)
    .filter(key => style[key] !== undefined && style[key] !== null)
    .map(key => {
      // Convert camelCase to kebab-case
      const cssKey = key.replace(/([A-Z])/g, "-$1").toLowerCase();
      return `${cssKey}: ${style[key]};`;
    })
    .join(" ");
};
