/**
 * Most of this file was AI generated, with a bit of human supervision, of course.
 */

import cssStyles from "./cssStyles";



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

// All CSS variables from src/styles/variables.css (keeps the CSS names)
export const cssVariables = {
  general: {
    '--primary-color': '#0B6EFD',
    '--secondary-color': '#6C757D',
    '--highlight-color': 'rgba(253, 11, 164, 0.78)',
    '--highlight-text-color': '#FFFFFF',
    '--background': 'transparent',
    '--surface': '#FFFFFF',
    '--text-primary': '#111827',
    '--text-secondary': '#6B7280',

    '--border-color': '#a5a7aB',
    '--border-width': '1/16rem',
    '--border-radius': '0',
    '--padding-base': '0.5rem',
    '--gap': '0.5rem',
    '--shadow': '0 1px 3px rgba(0, 0, 0, 0.08)',
    '--control-size': '1.125rem',

    '--font-size': '1rem',
    '--border': 'none'
  },

  list: {
    '--list-gap-between-items': '0.25rem',
  },
  attributes: {
    '--attr-size': '4em',
    '--attr-input-width': 'var(--attr-size)',
    '--attr-input-height': 'var(--attr-size)',
    '--attr-focus-color': 'blue',
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

// A nested JS representation of full CSS rules. Keys are selectors and values
// are maps of property -> value or nested selectors. Example:
// {
//   ".base-component": {
//     "width": "100%",
//     "background": "#fff",
//     ".label": { "color": "#333" }
//   }
// }


function buildCssFromObject(obj, parent) {
  let css = "";
  Object.entries(obj).forEach(([key, value]) => {
    if (value && typeof value === "object" && !Array.isArray(value)) {
      // nested selector or group of properties
      const selector = parent ? `${parent} ${key}` : key;
      // collect primitive props for this selector
      const props = Object.entries(value).filter(([, v]) => typeof v !== 'object');
      if (props.length) {
        css += `${selector} {\n`;
        props.forEach(([p, v]) => {
          css += `  ${p}: ${v};\n`;
        });
        css += `}\n`;
      }
      // handle deeper nesting
      const nested = Object.fromEntries(Object.entries(value).filter(([, v]) => typeof v === 'object'));
      if (Object.keys(nested).length) {
        css += buildCssFromObject(nested, selector);
      }
    } else {
      // top-level property (shouldn't normally happen here)
      if (!parent) return;
    }
  });
  return css;
}

// Generate full stylesheet text from cssStyles object
export function generateCss(styles = cssStyles) {
  let out = "";
  Object.entries(styles).forEach(([selector, rules]) => {
    if (rules && typeof rules === 'object') {
      const primitiveProps = Object.entries(rules).filter(([, v]) => typeof v !== 'object');
      if (primitiveProps.length) {
        out += `${selector} {\n`;
        primitiveProps.forEach(([p, v]) => {
          out += `  ${p}: ${v};\n`;
        });
        out += `}\n`;
      }
      const nested = Object.fromEntries(Object.entries(rules).filter(([, v]) => typeof v === 'object'));
      out += buildCssFromObject(nested, selector);
    }
  });
  return out;
}

// Apply generated CSS into a single <style id="theme-styles"> tag
export function applyStyles(styles = cssStyles) {
  if (typeof document === 'undefined' || !document.head) return;
  const id = 'theme-styles';
  let tag = document.getElementById(id);
  if (!tag) {
    tag = document.createElement('style');
    tag.id = id;
    document.head.appendChild(tag);
  }
  try {
    tag.textContent = generateCss(styles);
  } catch (e) {
    // ignore
  }
}

// Apply a raw CSS string into the same theme <style> tag. Useful when user
// edits freeform CSS.
export function applyCssString(cssText) {
  if (typeof document === 'undefined' || !document.head) return;
  const id = 'theme-styles';
  let tag = document.getElementById(id);
  if (!tag) {
    tag = document.createElement('style');
    tag.id = id;
    document.head.appendChild(tag);
  }
  try {
    tag.textContent = cssText;
  } catch (e) {
    // ignore
  }
}

// Persisted raw CSS string (in-memory export). Call `setCssTextStorage` to update.
export let cssTextStorage = generateCss(cssStyles);

export function setCssTextStorage(text) {
  cssTextStorage = text;
  applyCssString(text);
}

// On module load in the browser, apply theme variables and generated CSS immediately
try {
  if (typeof document !== 'undefined' && document.documentElement) {
    // set CSS variables on :root
    applyTheme();
    // inject generated CSS
    applyCssString(cssTextStorage || generateCss(cssStyles));
  }
} catch (e) {
  // ignore errors during module init
}
