# Custom RPG Character Sheet

**Running / previewing**
- Install dependencies and run the dev server:

```bash
npm install
npm run dev
```

## Documentation

### Components
The sheet is built using a flexible layout model. The renderer prefers a `flex`-based line layout for sheets that don't require vertical spanning (simpler and responsive), and will automatically switch to a CSS Grid "grid-mode" when any cell requests vertical spans (`colspan` / `rowSpan`). This preserves `colspan`-like behaviour where needed while keeping most sheets simple.

**All components have (none are obligatory):**
- `id` — Useful for styling. Also used for accessing its value in other places;
- `label` — A label displayed at the top/left by default (the `checkbox` is an exception);
- `colspan` — Logical span along the sheet's primary axis. When the sheet is not transposed this behaves like `colspan` (default `1`). When transposed it maps to the other axis.
- `rowSpan` — Logical span across the primary axis (complement of `colspan`, default `1`). Together `colspan` and `rowSpan` replace `colspan`/`colspan` and make the model axis-agnostic.
- `style` — An object based on CSS that customizes the component;
- `(literally anything)` — You can add any attribute and value, but you will have to code to implement it;


**Current built-in components and their key attributes:**
- `StaticText` — static text;
- `ComputedText` — dynamic text evaluated from an expression;
- `InputField` — text or numeric input (see component for props);
- `SelectField` — dropdown menu with predefined options;
- `ListField` — list of items using an item template;
- `CheckboxField` — checkbox control;
- `ImageField` — upload/preview image (can request `colspan` / `rowSpan` to occupy more space);

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
  - `colspan` / `rowSpan`: the `ImageField` (e.g. profile picture) can request vertical spanning — the renderer will switch to grid-mode when vertical spans are required.

- `CharacterAttribute` (see `src/core/components/CharacterAttribute.svelte`)
  - `value` (number): initial attribute value.
  - `label` (string): label above the circular control.
  - The component wires its numeric input into the central values store using the cell `id`.
  - Attribute-related CSS tokens are prefixed with `--attr-` (ex.: `--attr-focus-color`, `--attr-size`).

---
### `SheetBuilder` (grid-based) 
The project now uses a grid-based `SheetBuilder` that places components directly into rows and columns (instead of the previous line-first DSL). The implementation lives in [src/core/Scripts/SheetBuilder.ts](src/core/Scripts/SheetBuilder.ts) and produces a model where components are stored in `sheet.components` with explicit `row`, `col`, `colspan`, `rowSpan` and metadata.

Key ideas and API
- **Grid coordinates:** components may include `row` and `col` (1-based) to explicitly position them. If omitted, the builder places components automatically scanning left→right, top→bottom.
- **Default size:** if no span is specified, a component is `1x1` (`colspan = 1`, `rowSpan = 1`).
- **Occupancy tracking:** the builder tracks occupied grid cells and will throw an error when an explicit placement conflicts with existing components (or you can detect/handle that in your code).
- **Primary methods:**
  - **`new SheetBuilder(title?)`** — create a builder instance.
  - **`setRowLength(n)`** — set the number of columns per row (required to control automatic placement width).
  - **`add(cell)`** — add a `ComponentOps` object. The builder sets `cell.id` if missing, assigns `row`/`col` if omitted (automatic placement), and records `colspan`/`rowSpan`
  - **`withStyle(style)`** — attach sheet-level styles (keeps previous `styleTag` generation).
  - **`build()`** — finalize and return the `Sheet` model. The sheet includes `components` (flat list) and metadata (`rowLength`, `numberOfLines`, `styleTag`).

Example
```js
const sheet = new SheetBuilder('Character Sheet')
  .setRowLength(6)
  .add({ type: 'SubGrid', id: 'subgrid1', row: 1, col: 1, colspan: 6 })
  .add({ type: 'CharacterAttribute', id: 'str_attr', row: 2, col: 1, value: 10 })
  .add({ type: 'CharacterAttribute', id: 'dex_attr', value: 10 }) // automatic placement
  .build();
```

Notes
- The builder ensures components do not overlap when placed; if a conflict occurs on explicit placement it throws an error.
- The builder will fill `sheet.components` (a flat array). The renderer expects `components` and resolves the actual Svelte component for each entry from the registry.

Renderer changes
- The previous `GridBuilder` is no longer required. The renderer (`src/core/components/layout/RenderGrid.svelte`) resolves component constructors dynamically using the `componentsMap` registry (`src/core/Scripts/ComponentsMap.ts`) and instantiates components with the cell object as props.

Migration tips
- Replace previous `line(...).characterAttribute(...)` patterns by calling `setRowLength(...)` then `add(...)` with optional `row`/`col` coordinates.
- If you relied on `ignoreLineInLayout` previously, implement the same behavior by positioning an element at row `1` with `colspan` spanning the full width and then placing subsequent items at row `2` explicitly or by allowing automatic placement to fill left-to-right starting at row 2.


---
### Creating the sheet
You can use the `SheetBuilder` and `LineBuilder` explained above, or you can use pure JSON.
Example of a JSON sheet:
```json
{
  "title": "Character Sheet",
  "id": "test_sheet",
  "rowLength": 6,
  "lines": [
    [
      {
        "type": "InputField",
        "id": "player_name",
        "label": "Player Name",
        "placeholder": "John Doe",
        "colspan": 5
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
