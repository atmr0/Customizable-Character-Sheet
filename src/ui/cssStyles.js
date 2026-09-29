const cssStyles = {
  "#app": {
    "padding": "24px 10vw",
    "font-family": "system-ui, -apple-system, 'Segoe UI', Roboto, 'Helvetica Neue', Arial",
    "background": "#f3f4f6",
    "min-height": "100vh",
    "h1": {
      "margin-bottom": "12px",
      "color": "#0B6EFD"
    }
  },
  ".base-component": {
    "display": "block",
    "width": "100%",
    "box-sizing": "border-box",
    "padding": "inherit",
    ".label": {
      "font-weight": "600",
      "font-size": "small",
      "color": "var(--text-secondary)",
      "margin-bottom": "1px"
    },
    "&[aria-disabled=\"true\"]": {
      "opacity": "0.6",
      "pointer-events": "none"
    }
  },
  ".wrapper": {
    "width": "fit-content",
    "height": "fit-content",
  },
  ".no-bg": {
    "background": "none",
    "box-shadow": "none",
    "border": "none"
  },
  ":focus-visible": {
    "outline": "var(--highlight-color) solid 1px"
  },
  "::selection": {
    "background": "var(--highlight-color)",
    "color": "var(--highlight-text-color)"
  },
  "::-moz-selection": {
    "background": "var(--highlight-color)",
    "color": "var(--highlight-text-color)"
  },
  /* Chrome, Safari, Edge, Opera */
  "input::-webkit-outer-spin-button, input::-webkit-inner-spin-button": {
    "-webkit-appearance": "none",
    "margin": "0"
  },

  /* Firefox */
  "input[type=number]": {
    "-moz-appearance": "textfield"
  },
  ".InputField, .SelectField": {
    "--border-width": "1px",
    "width": "100%",
    "background": "var(--background)",
    "box-sizing": "border-box",
    "padding": "var(--padding-base)",
    "border": "none",
    "border-bottom": "var(--border-width) solid var(--border-color)",
    "border-radius": "0",
    "font-size": "1rem",
    "padding-bottom": ".25em",
    ":disabled": {
      "opacity": "0.6"
    }
  },
  ".image-wrapper": {
    "position": "relative",
    "width": "100%",
    "aspect-ratio": "1 / 1",
    "max-width": "10em",
    "border-radius": "0.5rem",
    "overflow": "hidden",
    "background": "var(--background)",
    "display": "flex",
    "align-items": "center",
    "justify-content": "center",
    "margin-left": "auto",
    "margin-right": "auto",
    "border": ".125em solid var(--border-color)",
    ".image": {
      "width": "100%",
      "height": "100%",
      "object-fit": "cover",
      "display": "block",
      "cursor": "zoom-in"
    },
    ".placeholder": {
      "color": "var(--text-secondary)",
      "padding": "0.75rem"
    },
    ".overlay": {
      "position": "absolute",
      "inset": "0",
      "display": "flex",
      "align-items": "flex-end",
      "justify-content": "flex-end",
      "padding": "0.5rem",
      "pointer-events": "none"
    },
    ".upload-btn": {
      "pointer-events": "auto",
      "opacity": "0",
      "transform": "translateY(0.375rem)",
      "transition": "opacity 0.15s ease, transform 0.15s ease",
      "padding": "0.375rem 0.625rem",
      "border-radius": "0.375rem",
      "border": "1px solid var(--border-color)",
      "background": "var(--surface)"
    },
  },
  ".image-wrapper:hover .upload-btn": {
    "opacity": "1",
    "transform": "none"
  },
  ".hidden-input": {
    "display": "none"
  },
  ".image-modal": {
    "position": "fixed",
    "inset": "0",
    "background": "rgba(0, 0, 0, 0.6)",
    "display": "flex",
    "align-items": "center",
    "justify-content": "center",
    "z-index": "1000",
    "padding": "24px",
    "box-sizing": "border-box",
    ".close-btn": {
      "position": "absolute",
      "top": "8px",
      "right": "8px",
      "background": "rgba(255,255,255,0.9)",
      "border": "none",
      "border-radius": "4px",
      "padding": "6px 8px",
      "cursor": "pointer",
      "z-index": "2",
      "box-shadow": "0 2px 6px rgba(0,0,0,0.25)"
    },
    ".image-modal-inner": {
      "position": "relative",
      "display": "inline-block",
      "max-width": "100%",
      "max-height": "100%"
    },
    ".zoomed-image": {
      "max-width": "90vw",
      "max-height": "90vh",
      "width": "auto",
      "height": "auto",
      "border-radius": "6px",
      "display": "block",
      "user-select": "none",
      "box-shadow": "0 8px 24px rgba(0,0,0,0.6)",
      "object-fit": "contain"
    },
  },
  ".grid": {
    "display": "grid",
    "gap": "0.5rem",
    "align-items": "stretch"
  },
  ".line": {
    "display": "contents"
  },
  ".sub-grid-wrapper": {
    "padding": "var(--padding-base)"
  },
  ".sheet-cell": {
    "display": "block",
    "align-self": "stretch",
    "padding": "0%",
    "> *": {
      "width": "100%",
      "height": "100%",
      "box-sizing": "border-box"
    },
  },
  ".list-all-items": {
    "list-style": "none",
    "margin": "0",
    "padding": "0",
    "display": "flex",
    "flex-direction": "column",
    "gap": "var(--list-gap-between-items)"
  },

  ".list-item": {
    "display": "flex",
    "align-items": "center",
    "grid-column": "span 1",
    "justify-content": "space-between",
    "gap": "0.5rem",
    ".sub-grid-wrapper": {
      "padding": "0"
    },
    ".remove-btn": {
      "background": "transparent",
      "border": "none",
      "color": "var(--text-secondary)",
      "font-size": "1.2rem",
      "cursor": "pointer"
    },
  },
  ".list-add": {
    "display": "flex",
    "align-items": "center",

    "button": {
      "padding": "0.25rem 0.5rem",
      "margin-top": "var(--list-gap-between-items)",
      "border-radius": "6px",
      "border": "1px solid var(--border-color)",
      "background": "var(--surface)"
    }
  },

  ".ComputedText": {
    "text-align": "center",
    "background-color": "transparent",
    "border": "none",
    "min-height": "1em",
    "width": "inherit",
    "margin": "0",
    "padding": "0",
    "margin-left": "-0.5ch",
  },
  ".CharacterAttribute": {
    "display": "flex",
    "flex-direction": "column",
    "align-items": "center",
    "gap": "0.35rem",
    ".label": {
      "font-size": "0.85rem",
      "color": "var(--text-secondary)",
      "margin-bottom": "0",
      "text-align": "center",
    },
    ".InputField": {
      "font-size": "1.15rem",
      "text-align": "center",
      "border-radius": "50%",
      "border": "0.125em solid var(--border-color)",
      "width": "var(--attr-input-width, 4.25em)",
      "height": "var(--attr-input-height, 4.25em)",
      "display": "block",
      "margin-inline": "auto",
      "align-items": "center",
      "justify-content": "center",
      "font-weight": 800,
      "background": "var(--background)",
      "transition": "transform 120ms ease, box-shadow 120ms ease, border-color 120ms ease",
      ":focus-within, :focus": {
        "outline": "none",
        "border-color": "var(--attr-focus-color)",
        "box-shadow": "0 0 0 0.25rem color-mix(in srgb, var(--attr-focus-color) 20%, transparent)",
        "transform": "translateY(-2px)",
      },
    },

    ".roll-area": {
      "position": "relative",
      "top": "-1rem",
      "display": "flex",
      "width": "calc(var(--attr-input-width, 4.25em)*1.5)",
      ".ComputedText": {
        "font-size": "0.9rem",
        "margin-top": "0.25rem",
        "color": "var(--text-secondary)",
      },
      ".RollButton": {
        "position": "absolute",
        "left": "50%",
        "button": {
          "translate": "-50%",
          ":hover": {
            "background": "color-mix(in srgb, var(--attr-focus-color) 92%, white 8%)",
            "box-shadow": "0px 0px 3px var(--attr-focus-color)",
            "border": "none",
          },
        },
        ".rolledValue": {
          "font-weight": 700,
          "font-size": "1.3rem",
          "color": "var(--attr-focus-color)",
        }
      }
    },
  },
  ".RollButton": {
    "display": "flex",
    "align-items": "center",
    "white-space": "nowrap",
    ".rolledValue": {
      "text-align": "left",
      "font-weight": 700,
      "color": "var(--text-primary)",
      "padding-left": "0.25rem",
      "min-width": "1.5rem",
      "white-space": "nowrap"
    },
    "button": {
      "background": "var(--surface)",
      "color": "var(--text-primary)",
      "border": "1px solid var(--border-color)",
      "padding": "0.25rem 0.5rem",
      "border-radius": "6px",
      "cursor": "pointer",
      "box-shadow": "0 1px 0 rgba(0,0,0,0.03)",
      "transition": "background 120ms ease, transform 120ms ease, box-shadow 120ms ease",
      ":hover": {
        "background": "color-mix(in srgb, var(--surface) 92%, black 8%)",
        "transform": "translateY(-1px)",
      },
      ":active": {
        "transform": "translateY(2px)",
      },
    },
  },
  ".RNG": {
    "--success-color": "#ffd700",
    "--failure-color": "#ff0000",
    "--increase-color": "#3cff00",
    "--decrease-color": "#dd1111",
    "--multiply-color": "var(--success-color)",
    "--base-color": "rgba(0, 0, 0, 1)",

    ".rng-overlay": {
      "visibility": "hidden",
      "position": "fixed",
      "top": "0",
      "left": "0",
      "width": "100%",
      "height": "100%",
      "background": "rgba(0, 0, 0, 0.5)",
      "display": "flex",
      "justify-content": "center",
      "z-index": "1000",
      "gap": "16px",
      "overflow": "hidden",
    },

    ".rng-highlights": {
      "z-index": "-1",
      "position": "absolute",
      "inset": "0",
      "display": "flex",
      "justify-content": "center",
      "align-items": "center",
      "pointer-events": "none",
      "gap": "16px",
      "background": "none",
      "visibility": "visible",
    },

    ".rng-column": {
      "display": "flex",
      "flex-direction": "column",
      "width": "320px",
      "max-width": "calc(100% - 32px)",
    },

    ".rng-highlight": {
      "display": "block",
      "width": "320px",
      "height": "80px",
      "background-color": "var(--highlight-color)",
      "opacity": "0.95",
      "border-radius": "6px",
      "pointer-events": "none",
    },

    ".rng-item": {
      "min-height": "80px",
      "display": "flex",
      "align-items": "center",
      "justify-content": "center",
      "font-weight": "bold",
      "font-size": "xx-large",
    },

  },
};

export default cssStyles
