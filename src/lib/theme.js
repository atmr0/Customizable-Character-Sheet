// Theme tokens and helpers for the RPG character sheet

export const defaultTheme = {
  primaryColor: '#0B6EFD',
  secondaryColor: '#6C757D',
  background: '#F7F8FA',
  surface: '#000030',
  textPrimary: '#111827',
  textSecondary: '#6B7280',
  borderColor: '#E5E7EB',
  borderWidth: '1px',
  borderRadius: '6px',
  paddingBase: '8px',
  gap: '8px',
  shadow: '0 1px 3px rgba(0,0,0,0.08)',
  focusOutline: '2px solid rgba(11,110,253,0.18)',
  breakpoints: { sm: 640, md: 768, lg: 1024, xl: 1280 },
};

export const attributesColors = {
  str_attr: '#EF4444',
  dex_attr: '#F59E0B',
  con_attr: '#10B981',
  int_attr: '#3B82F6',
  wis_attr: '#8B5CF6',
  cha_attr: '#EC4899',
};

/**
 * Convert a theme object into a CSS variables string for inline style.
 * Example: themeToCssVars({ primaryColor: '#fff' }) -> "--primary-color:#fff;"
 */
export function themeToCssVars(theme = {}){
  let s = Object.entries(theme).map(([k,v]) => `--${k.replace(/[A-Z]/g, m => '-'+m.toLowerCase())}:${v};`).join(' ')
  return s;
}

export default defaultTheme;
