// Theme tokens and helpers for the RPG character sheet
export const primaryColor = '#0B6EFD';
export const secondaryColor = '#6C757D';
export const background = '#F7F8FA';
export const surface = '#FFFFFF';
export const textPrimary = '#111827';
export const textSecondary = '#6B7280';
export const borderColor = '#E5E7EB';
export const borderWidth = '1px';
export const borderRadius = '8px';
export const paddingBase = '12px';
export const gap = '12px';
export const shadow = '0 1px 3px rgba(0,0,0,0.08)';
export const focusOutline = '2px solid rgba(11,110,253,0.18)';
export const breakpoints = { sm: 640, md: 768, lg: 1024, xl: 1280 };

export const defaultTheme = {
  primaryColor,
  secondaryColor,
  background,
  surface,
  textPrimary,
  textSecondary,
  borderColor,
  borderWidth,
  borderRadius,
  paddingBase,
  gap,
  shadow,
  focusOutline,
  breakpoints
};

/**
 * Convert a theme object into a CSS variables string for inline style.
 * Example: themeToCssVars({ primaryColor: '#fff' }) -> "--primary-color:#fff;"
 */
export function themeToCssVars(theme = {}){
  return Object.entries(theme).map(([k,v]) => `--${k.replace(/[A-Z]/g, m => '-'+m.toLowerCase())}:${v};`).join(' ');
}

export default defaultTheme;
