# Custom RPG Character Sheet

**Running / previewing**
- Install dependencies and run the dev server:

```bash
npm install
npm run dev
```

## Documentation

### Components
The sheet is built using a grid. You create each row specifying which component it has. You can create subgrids inside a row for easier positioning.

**All components have, none of them are obligatory:**
- `id` — Useful for styling. Also used for accessing its value in other places;
- `label` — A label displayed at the top/left by default, the `checkbox` is a exception;
- `colspan` — It defines how many columns it will occupy. 1 by default;
- `rowspan` — It defines how many rows it will occupy. 1 by default;
- `style` — An object based on CSS that customizes the component;
- `(literally anything)` — You can add any attribute and value, but you will have to code to implement it;


**Current built-in components, and its attributes:**
- `StaticText` — Literally just a text;
- `ComputedText` — A text which its value is dynamic based on a expression given;
- `InputField` — By default it is a simple text input, it can be only numbers as well. Its value can be used for computing other's;
- `SelectField` — A dropdown menu with pre-defined options;
- `ListField` — A list where you can add items according to a given template;
- `CheckboxField` — A checkbox;
- `ImageField` — You can upload a image to it. 
--- 
### Component attributes (detailed)
Specific component attributes:
- `StaticText`
  - `text` (string): displayed content.

- `ComputedText`
  - `expr` (string): expression evaluated using the values store (e.g. `cha_attr_mod + 5`).
  - `format` (function): optional formatter called with the computed value.

- `InputField` (see `src/lib/components/basic components/InputField.svelte`)
  - `value` (string|number): initial value.
  - `placeholder` (string)
  - `inputType` (string): `'text'` or `'number'` (component uses `inputType` prop; renders `type="number"` when numeric).
  - `allowFloat` (boolean): allow fractional numbers when numeric.
  - `step`, `min`, `max` (number|string): native input constraints.
  - `oninput` (function): callback invoked on raw input events.

- `SelectField`
  - `options` (string[]): available options.
  - `value` (string|number): initial selection.

- `ListField`
  - `itemTemplate` (array): array defining components for each row of the list (use ComponentOps objects).
  - The `ListField` renderer instantiates items from this template and keeps them in the sheet model.

- `CheckboxField`
  - `value` / `checked` (boolean): initial state.
  - Style tokens for checkboxes are prefixed with `--cb-`.

- `ImageField`
  - `src` (string): optional preloaded image URL.
  - Upload/preview UX is implemented in the component; the `style` object can adjust appearance.

- `CharacterAttribute` (see `src/lib/components/CharacterAttribute.svelte`)
  - `value` (number): initial attribute value.
  - `label` (string): label above the circular control.
  - The component wires its numeric input into the central values store using the cell `id`.
  - Attribute-related CSS tokens are prefixed with `--attr-` (ex.: `--attr-focus-color`, `--attr-size`).

---
### `SheetBuilder` & `RowBuilder` methods 
The builder API is a lightweight DSL to build sheet models in code. Files: [src/lib/Scripts/SheetBuilder.ts](src/lib/Scripts/SheetBuilder.ts) and [src/lib/Scripts/ComponentsMap.ts](src/lib/Scripts/ComponentsMap.ts).

RowBuilder (used inside `.row(r => ...)`) — convenience helpers to add row cells. Each method returns the `RowBuilder` so you can chain multiple cells in one row.
- `add(cell)` — add any `ComponentOps` object directly.
- `{componentType}(opts)` — add an cell with that type of component. `opts` are `ComponentOps` (see `ComponentsMap.ts`), the attributes previously mentioned.
- `withStyle(style)` — attach a `style` object to the last-added cell in the row (convenience inline style).

SheetBuilder (chainable, returns `this`):
- `new SheetBuilder(title?)` — create a new builder instance.
- `id(v)` — set the sheet `id` (used in selector generation).
- `title(v)` — set sheet title.
- `cols(n)` — set number of grid columns for layout.
- `rows(n)` — set expected number of rows (informational/helpful for layout builders).
- `row(fn)` — add a row. `fn` receives a `RowBuilder` instance and should return it after adding cells. Example:

```js
sheet.row(r => r
  .characterAttribute({ id: 'str_attr', label: 'Strength', value: 10 })
  .characterAttribute({ id: 'dex_attr', label: 'Dexterity', value: 12 })
)
```

- `rowsFrom(rows)` — append pre-built rows (array of `ComponentOps[]`).
- `withStyle(style, targetClass?)` — attach style rules in three supported forms:
  - string value: will be added to the selector-level `styles` and also applied to each cell in the current row as inline cell `style`.
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

Implementation notes:
- The builder maintains an internal `styleObj` while building; `withStyle` may write both to `styleObj` (selector-level) and attach inline `cell.style` entries for convenience and serialization.
- `SheetBuilder.convertStyleObjToTag()` produces a concatenated CSS string from the selector-style map. The renderer or `App.svelte` can inject `sheet.styleTag` into the page to apply the generated CSS.


---
### Creating the sheet
You can use the `SheetBuilder` and `RowBuilder` explained above, or you can use pure JSON.
Example of a JSON sheet:
```json
{
  "title": "Character Sheet",
  "id": "test_sheet",
  "numberOfRows": 0,
  "cols": 6,
  "rows": 
	[
	    [
		    {
				"type": "InputField",
				"id": "player_name",
				"label": "Player Name",
				"placeholder": "John Doe",
				"colspan": 5
		    },
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
	      },
		]
	],
	"styles": {
		"#str_attr": {
	      "--attr-focus-color": "#EF4444"
	    },
	}
}
```

There is a redundancy of the style in this example, only to show the available options.
**Important**: If the sheet "styles" has the same selector as the specific component style (str_attr), the specific component will overwrite it. Else, the most specific selector will overwrite, like CSS usually does. e.g.: "`#test_sheet-row-2 #str_attr`" would overwrite the component specific style.