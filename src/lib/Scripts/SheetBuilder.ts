import * as CM from "./ComponentsMap";
import { Constants } from "../constants";

export let styleObj: Record<string, any> = {};
export let styleTag: string = "";

function ensureId(prefix = 'cell') {
  return `${prefix}-${Math.random().toString(36).slice(2, 9)}`;
}

export class RowBuilder {
  private row: CM.ComponentOps[] = [];
  private last: CM.ComponentOps | null = null;
  add(cell: CM.ComponentOps) {
    if (!cell.id) cell.id = ensureId(cell.type || 'cell');
    this.row.push(cell);
    this.last = cell;
    return this;
  }

  InputField(opts: Partial<CM.InputFieldOps>) { return this.add({ type: Constants.InputField, ...opts }); }
  staticText(opts: Partial<CM.StaticTextOps>) { return this.add({ type: Constants.StaticText, ...opts }); }
  subGrid(opts: Partial<CM.SubGridOps>, sheet: CM.Sheet) { return this.add({ type: Constants.SubGrid, ...opts, sheet }); }
  /* componentops */
  characterAttribute(opts: Partial<CM.ComponentOps>) { return this.add({ type: Constants.CharacterAttribute, ...opts }); }
  computedText(opts: Partial<CM.ComputedTextOps>) { return this.add({ type: Constants.ComputedText, ...opts }); }
  listField(opts: Partial<CM.ListFieldOps>) { return this.add({ type: Constants.ListField, ...opts }); }
  selectField(opts: Partial<CM.SelectFieldOps>) { return this.add({ type: Constants.SelectField, ...opts }); }

  withStyle(style: any) {
    if (this.last) {
      this.last.style = { ...this.last.style, ...style };
    }
    return this;
  }
  build() { return this.row; }
}

export class SheetBuilder {
  private sheet: CM.Sheet;
  private rowIndex: number = 0;
  constructor(title?: string) {
    this.sheet = { title, id: undefined, numberOfRows: 0, cols: 1, rows: [] } as CM.Sheet;
  }

  id(v: string) { this.sheet.id = v; return this; }
  title(v: string) { this.sheet.title = v; return this; }
  cols(n: number) { this.sheet.cols = n; return this; }
  rows(n: number) { this.sheet.numberOfRows = n; return this; }

  row(fn: (r: RowBuilder) => RowBuilder) {
    const rb = new RowBuilder();
    fn(rb);
    this.sheet.rows.push(rb.build());
    this.rowIndex += 1;
    return this;
  }

  rowsFrom(rows: CM.ComponentOps[][]) {
    for (const r of rows) this.sheet.rows.push(r);
    this.rowIndex += rows.length;
    return this;
  }

  withStyle(style: Record<string, any> | Record<string, Record<string, Function>>, targetClass: string = "") {
    let rowId = this.createSelector(targetClass);
    for (const key in style) {
      if (!style[key]) continue;

      if (typeof style[key] === 'string') styleObj[rowId] = { ...styleObj[rowId], [key]: style[key] };

      if (typeof style[key] === 'function')
        for (let cell of this.sheet.rows[this.rowIndex - 1])
          styleObj[this.createSelector(targetClass, cell)] = { ...styleObj[this.createSelector(targetClass, cell)], [key]: style[key](cell as CM.ComponentOps) };

      if (typeof style[key] === 'object') {
        this.withStyle(style[key], key);
      }
    }
    return this;
  }

  createSelector(targetClass: string, cell: CM.ComponentOps | null = null) {
    let selector = `#${this.sheet.id}-row-${this.rowIndex}`;
    if (cell) selector += ` #${cell.id}`;
    if (targetClass) selector += ` ${targetClass}`;

    console.log("Created selector:", selector);
    return selector;
  }

  convertStyleObjToTag() {
    let styles = '';
    for (const [selector, rules] of Object.entries(styleObj)) {
      styles += `${selector} { ${Object.entries(rules).map(([prop, value]) => `${prop}: ${value};`).join(' ')} }\n`;
    }
    return styles;
  }

  build() {
    styleTag = this.convertStyleObjToTag();
    console.log(styleTag)
    return this.sheet;
  }
}

export default SheetBuilder;
