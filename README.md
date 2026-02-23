# Custom RPG Character Sheet

**Running / previewing**
- Install dependencies and run the dev server:

```bash
npm install
npm run dev
```

## Documentation

### Components
The sheet is built using a flexible layout model. The renderer prefers a `flex`-based line layout for sheets that don't require vertical spanning (simpler and responsive), and will automatically switch to a CSS Grid "grid-mode" when any cell requests vertical spans (`linespan` / `crossLineSpan`). This preserves `linespan`-like behaviour where needed while keeping most sheets simple.

**All components have (none are obligatory):**
- `id` — Useful for styling. Also used for accessing its value in other places;
- `label` — A label displayed at the top/left by default (the `checkbox` is an exception);
- `linespan` — Logical span along the sheet's primary axis. When the sheet is not transposed this behaves like `colspan` (default `1`). When transposed it maps to the other axis.
- `crossLineSpan` — Logical span across the primary axis (complement of `linespan`, default `1`). Together `linespan` and `crossLineSpan` replace `colspan`/`linespan` and make the model axis-agnostic.
- `style` — An object based on CSS that customizes the component;
- `(literally anything)` — You can add any attribute and value, but you will have to code to implement it;


**Current built-in components and their key attributes:**
- `StaticText` — static text;
- `ComputedText` — dynamic text evaluated from an expression;
- `InputField` — text or numeric input (see component for props);
- `SelectField` — dropdown menu with predefined options;
- `ListField` — list of items using an item template;
- `CheckboxField` — checkbox control;
- `ImageField` — upload/preview image (can request `linespan` / `crossLineSpan` to occupy more space);

---
### Component attributes (detailed)
Specific component attributes:
- `StaticText`
  - `text` (string): displayed content.

- `ComputedText`
  - `expr` (string): expression evaluated using the values store (e.g. `cha_attr_mod + 5`).
  - `format` (function): optional formatter called with the computed value.

- `InputField` (see `src/core/components/basic components/InputField.svelte`)
  - `value` (string|number): initial value.
  - `placeholder` (string)
  - `inputType` (string): `'text'` or `'number'`.
  - `allowFloat` (boolean): allow fractional numbers when numeric.
  - `step`, `min`, `max` (number|string): native input constraints.
  - `oninput` (function): callback invoked on raw input events.

- `SelectField`
  - `options` (string[]): available options.
  - `value` (string|number): initial selection.

- `ListField`
  - `itemTemplate` (array): array defining components for each line of the list (use ComponentOps objects).
  - The `ListField` renderer instantiates items from this template and keeps them in the sheet model.

- `CheckboxField`
  - `value` / `checked` (boolean): initial state.

- `ImageField`
  - `src` (string): optional preloaded image URL.
  - Upload/preview UX is implemented in the component; the `style` object can adjust appearance.
  - `linespan` / `crossLineSpan`: the `ImageField` (e.g. profile picture) can request vertical spanning — the renderer will switch to grid-mode when vertical spans are required.

- `CharacterAttribute` (see `src/core/components/CharacterAttribute.svelte`)
  - `value` (number): initial attribute value.
  - `label` (string): label above the circular control.
  - The component wires its numeric input into the central values store using the cell `id`.
  - Attribute-related CSS tokens are prefixed with `--attr-` (ex.: `--attr-focus-color`, `--attr-size`).

---
### `SheetBuilder` & `LineBuilder` methods 
The builder API is a lightweight DSL to build sheet models in code. Files: [src/core/Scripts/SheetBuilder.ts](src/core/Scripts/SheetBuilder.ts) and [src/core/Scripts/ComponentsMap.ts](src/core/Scripts/ComponentsMap.ts).

LineBuilder (used inside `.line(r => ...)`) — convenience helpers to add line cells. Each method returns the `LineBuilder` so you can chain multiple cells in one line.
- `add(cell)` — add any `ComponentOps` object directly.
- `{componentType}(opts)` — add a cell with that type of component. `opts` are `ComponentOps` (see `ComponentsMap.ts`), the attributes previously mentioned.
- `withStyle(style)` — attach a `style` object to the last-added cell in the line (convenience inline style).

SheetBuilder (chainable, returns `this`):
- `new SheetBuilder(title?)` — create a new builder instance.
- `id(v)` — set the sheet `id` (used in selector generation).
- `title(v)` — set sheet title.
- `lineLength(n)` — set expected number of columns per line (used when rendering non-transposed layouts).
- `lines(n)` — set expected number of lines (informational/helpful for layout builders).
- `columnBasedLayout(enabled?)` — switch the sheet to column-based coordinates (transposed behavior).
- `line(fn)` — add a line. `fn` receives a `LineBuilder` instance and should return it after adding cells. Example:

```js
sheet.line(r => r
  .characterAttribute({ id: 'str_attr', label: 'Strength', value: 10 })
  .characterAttribute({ id: 'dex_attr', label: 'Dexterity', value: 12 })
)
```

- `linesFrom(lines)` — append pre-built lines (array of `ComponentOps[]`).
- `withStyle(style, targetClass?)` — attach style rules in three supported forms:
  - string value: will be added to the selector-level `styles` and also applied to each cell in the current line as inline cell `style`.
  - function: evaluated per cell (receives the cell) and result is applied as a style value; useful for per-cell color generation.
  - nested object: used to create nested selectors (delegates back into `withStyle` logic).
  Example of a nested object using selectors.
  ```js
  .withStyle({
    ".input-field": {
      "--attr-focus-color": "#FF00FF"
    }
  })
  ```

  Example using a function to set per-attribute focus color:

  ```js
  .withStyle({
    "--attr-focus-color": (cell) => attributesColors[cell.id]
  })
  ```

- `build()` — finalize and return the `Sheet` model. The builder collects selector-level styles into `sheet.styles` and exposes `sheet.styleTag` (a CSS string) as a convenience for injecting into the DOM.

Layout model
- The internal model is axis-agnostic: use `linespan` and `crossLineSpan` (and optionally `primaryIndex` / `secondaryIndex`) to describe position and spans.
- `primaryIndex` would be the line index in a line based layout, `secondaryIndex` would be the column index.

Implementation notes:
- The builder maintains an internal `styleObj` while building; `withStyle` may write both to `styleObj` (selector-level) and attach inline `cell.style` entries for convenience and serialization.
- `SheetBuilder.convertStyleObjToTag()` produces a concatenated CSS string from the selector-style map. The renderer or `App.svelte` can inject `sheet.styleTag` into the page to apply the generated CSS.


---
### Creating the sheet
You can use the `SheetBuilder` and `LineBuilder` explained above, or you can use pure JSON.
Example of a JSON sheet:
```json
{
  "title": "Character Sheet",
  "id": "test_sheet",
  "lineLength": 6,
  "lines": [
    [
      {
        "type": "InputField",
        "id": "player_name",
        "label": "Player Name",
        "placeholder": "John Doe",
        "linespan": 5
      }
    ],
    [
      {
        "type": "CharacterAttribute",
        "id": "str_attr",
        "label": "Strength",
        "value": 10,
        "style": {
          "--attr-focus-color": "#EF4444"
        }
      }
    ]
  ],
  "styles": {
    "#str_attr": {
      "--attr-focus-color": "#EF4444"
    }
  }
}
```

There is a redundancy of the style in this example, only to show the available options.
**Important**: If the sheet `styles` has the same selector as the specific component style (str_attr), the specific component will overwrite it. Else, the most specific selector will overwrite, like CSS usually does. e.g.: `#test_sheet-line-2 #str_attr` would overwrite the component specific style.
