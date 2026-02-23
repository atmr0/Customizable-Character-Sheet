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
  borderRadius: '0.5rem',
  paddingBase: '0.5rem',
  gap: '0.5rem',
  shadow: '0 1px 3px rgba(0,0,0,0.08)',
  focusOutline: '0.125rem solid rgba(11,110,253,0.18)',
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


export default defaultTheme;

// All CSS variables from src/styles/variables.css (keeps the CSS names)
export const cssVariables = {
  general: {
    '--primary-color': '#0B6EFD',
    '--secondary-color': '#6C757D',
    '--background': 'transparent',
    '--surface': '#FFFFFF',
    '--text-primary': '#111827',
    '--text-secondary': '#6B7280',

    '--border-color': '#a5a7aB',
    '--border-width': '1/16rem',
    '--border-radius': '0',
    '--border-bottom': '1px solid var(--border-color)',
    '--padding-base': '0.5rem',
    '--gap': '0.5rem',
    '--shadow': '0 1px 3px rgba(0, 0, 0, 0.08)',
    '--control-size': '1.125rem',

    '--font-size': '1rem',
    '--border': 'none'
  },
  checkbox: {
    '--cb-shadow-offset-ratio': '0.7',
    '--cb-v-offset-shadow': '0',
    '--cb-shadow-blur-ratio': '0.1',
    '--cb-outer-box-blur-radius': 'calc(var(--control-size) * var(--cb-shadow-blur-ratio))',
    '--cb-outer-box-shadow': '0 var(--cb-v-offset-shadow) var(--cb-outer-box-blur-radius) var(--cb-accent-shadow, rgba(255, 190, 184, 0.5))',
    '--cb-checked-box-shadow': '0 var(--cb-v-offset-shadow) var(--cb-outer-box-blur-radius) var(--cb-success-shadow, rgba(146, 255, 151, 0.5))',

    '--cb-inner-box-ratio': '0.7',
    '--cb-inner-box-color': '#fff',
    '--cb-inner-box-shadow': 'inset 0 var(--cb-v-offset-shadow) var(--cb-outer-box-blur-radius) var(--cb-accent-shadow)',
    '--cb-inner-box-hover-shadow': 'inset 0 var(--cb-v-offset-shadow) calc(var(--cb-outer-box-blur-radius) * 0.8) var(--cb-accent-hover-shadow)',
    '--cb-inner-box-hover-ratio': '0.55',

    '--cb-tick-size-ratio': '0.7',
    '--cb-tick-border-radius': '2px',
    '--cb-tick-thickness-ratio': '0.1',
    '--cb-tick-short-arm-length-ratio': '0.5',
    '--cb-tick-long-arm-length-ratio': '1',
    '--cb-tick-shadow-color': 'rgba(0, 0, 0, 0.23)',
    '--cb-tick-short-arm-shadow': '-2px 0 5px var(--cb-tick-shadow-color)',
    '--cb-tick-long-arm-shadow': '0 calc(var(--control-size) * 0.03) calc(var(--control-size) * 0.05) var(--cb-tick-shadow-color)',
    '--cb-tick-translate-x-ratio': '0.78',
    '--cb-tick-translate-y-ratio': '0.88',

    '--cb-checkbox-outer-color': 'var(--secondary-color)',
    '--cb-checkbox-checked-color': '#07d410',
    '--cb-tick-color': '#cf0',
    '--cb-accent-shadow': '#ffbeb8',
    '--cb-accent-hover-shadow': '#ff9d96',
    '--cb-success-shadow': '#92ff97',
    '--cb-checkbox-box-border-radius': '5%'
  },
  image: {
    '--img-border': '.125em solid var(--border-color)'
  },
  list: {
    '--list-gap-right': '0.5rem',
    '--list-gap-between-items': '0.25rem',
    '--list-add-btn-padding': '0.25rem 0.5rem'
  },
  attributes: {
    '--attr-input-font-size': '1em',
    '--attr-size': '4em',
    '--attr-input-width': 'var(--attr-size)',
    '--attr-input-height': 'var(--attr-size)',
    '--attr-input-border-radius': '50%',
    '--attr-input-border-width': '0.125em',
    '--attr-input-border': '0.125em solid var(--text-secondary)',
    '--attr-transition-duration': '0.12s',
    '--attr-focus-color': 'blue',
    '--attr-focus-border-width': '0.125em',
    '--attr-focus-box-shadow-width': '0.25em',
    '--attr-focus-outline': 'none'
  }
};

// Helper: normalize keys (accept both 'primary-color' or '--primary-color' or camelCase)
function toCssVarName(key) {
  if (typeof key !== 'string') return key;
  if (key.startsWith('--')) return key;
  // convert camelCase or kebab/no-prefix to --kebab-case
  const kebab = key.replace(/([a-z0-9])([A-Z])/g, '$1-$2').replace(/_/g, '-').toLowerCase();
  return `--${kebab}`;
}

// Apply theme: set CSS variables on :root. `overrides` can use keys with or without `--`.
export function applyTheme(overrides = {}) {
  if (typeof document === 'undefined' || !document.documentElement) return;
  const root = document.documentElement;
  // flatten nested cssVariables (groups) into a single map of varName -> value
  function flattenVars(obj) {
    const out = {};
    Object.entries(obj).forEach(([k, v]) => {
      if (v && typeof v === 'object' && !Array.isArray(v)) {
        Object.assign(out, flattenVars(v));
      } else {
        out[toCssVarName(k)] = v;
      }
    });
    return out;
  }

  const base = flattenVars(cssVariables);
  const flatOverrides = flattenVars(overrides);
  const merged = { ...base, ...flatOverrides };

  Object.entries(merged).forEach(([name, value]) => {
    try {
      root.style.setProperty(name, String(value));
    } catch (e) {
      // ignore invalid values
    }
  });
}
