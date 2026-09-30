import cssStyles from './cssStyles';


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

function toCssVarName(key) {
  if (typeof key !== 'string') return key;
  if (key.startsWith('--')) return key;
  const kebab = key.replace(/([a-z0-9])([A-Z])/g, '$1-$2').replace(/_/g, '-').toLowerCase();
  return `--${kebab}`;
}

export function applyTheme(overrides = {}) {
  if (typeof document === 'undefined' || !document.documentElement) return;
  const root = document.documentElement;
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

function buildCssFromObject(obj, parent) {
  let css = "";
  Object.entries(obj).forEach(([key, value]) => {
    if (value && typeof value === "object" && !Array.isArray(value)) {
      // Combine parent and key into a proper selector handling:
      // - comma-separated selectors
      // - parent reference with '&'
      // - pseudo-classes/attributes (start with ':' or '[') should be appended without a space
      const combineSelectors = (parentSel, keySel) => {
        if (keySel.includes('&')) {
          return keySel.replace(/&/g, parentSel);
        }
        const firstChar = keySel[0] || '';
        if (firstChar === ':' || firstChar === '[') {
          return `${parentSel}${keySel}`;
        }
        return `${parentSel} ${keySel}`;
      };

      const selectors = [];
      if (parent) {
        const parents = parent.split(',').map(s => s.trim());
        const keys = key.split(',').map(s => s.trim());

        // If parent is a comma-separated list and the nested key is a
        // pseudo-class or attribute (starts with ':' or '[') and does
        // not reference '&', prefer the concise :is(...) form.
        const shouldUseIs = parents.length > 1 && keys.length === 1 && (keys[0][0] === ':' || keys[0][0] === '[') && !keys[0].includes('&');
        if (shouldUseIs) {
          selectors.push(`:is(${parents.join(', ')})${keys[0]}`);
        } else {
          parents.forEach(p => {
            keys.forEach(k => {
              selectors.push(combineSelectors(p, k));
            });
          });
        }
      } else {
        selectors.push(key);
      }

      const selector = selectors.join(', ');

      const props = Object.entries(value).filter(([, v]) => typeof v !== 'object');
      if (props.length) {
        css += `${selector} {\n`;
        props.forEach(([p, v]) => {
          css += `  ${p}: ${v};\n`;
        });
        css += `}\n`;
      }
      const nested = Object.fromEntries(Object.entries(value).filter(([, v]) => typeof v === 'object'));
      if (Object.keys(nested).length) {
        css += buildCssFromObject(nested, selector);
      }
    } else {
      if (!parent) return;
    }
  });
  return css;
}

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

// export function applyStyles(styles = cssStyles) {
//   if (typeof document === 'undefined' || !document.head) return;
//   const id = 'theme-styles';
//   let tag = document.getElementById(id);
//   if (!tag) {
//     tag = document.createElement('style');
//     tag.id = id;
//     document.head.appendChild(tag);
//   }
//   try {
//     tag.textContent = generateCss(styles);
//   } catch (e) {
//     // ignore
//   }
// }

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

export let cssTextStorage = generateCss(cssStyles);

export function setCssTextStorage(text) {
  cssTextStorage = text;
  applyCssString(text);
}

try {
  if (typeof document !== 'undefined' && document.documentElement) {
    applyTheme();
    applyCssString(cssTextStorage || generateCss(cssStyles));
  }
} catch (e) {
  // ignore
}
