import * as CM from "./ComponentsMap";
import { Constants } from "../constants";


function ensureId(prefix = 'cell') {
  return `${prefix}-${Math.random().toString(36).slice(2, 9)}`;
}

export class RowBuilder {
  private row: CM.ComponentOps[] = [];

  add(cell: CM.ComponentOps) {
    if (!cell.id) cell.id = ensureId(cell.type || 'cell');
    this.row.push(cell);
    return this;
  }

  textField(opts: Partial<CM.TextFieldOps>) { return this.add({ type: Constants.TextField , ...opts }); }
  staticText(opts: Partial<CM.StaticTextOps>) { return this.add({ type: Constants.StaticText , ...opts }); }
  subGrid(opts: Partial<CM.SubGridOps>, sheet: CM.Sheet) { return this.add({ type: Constants.SubGrid , ...opts, sheet }); }
  /* componentops */ 
  characterAttribute(opts: Partial<CM.ComponentOps>) { return this.add({ type: Constants.CharacterAttribute , ...opts }); }
  computedText(opts: Partial<CM.ComputedTextOps>) { return this.add({ type: Constants.ComputedText , ...opts }); }
  listField(opts: Partial<CM.ListFieldOps>) { return this.add({ type: Constants.ListField , ...opts }); }
  selectField(opts: Partial<CM.SelectFieldOps>) { return this.add({ type: Constants.SelectField , ...opts }); }

  build() { return this.row; }
}

export class SheetBuilder {
  private sheet: CM.Sheet;

  constructor(title?: string) {
    this.sheet = { title, id: undefined, rows: 0, cols: 1, cells: [] } as CM.Sheet;
  }

  id(v: string) { this.sheet.id = v; return this; }
  title(v: string) { this.sheet.title = v; return this; }
  cols(n: number) { this.sheet.cols = n; return this; }
  rows(n: number) { this.sheet.rows = n; return this; }

  row(fn: (r: RowBuilder) => RowBuilder) {
    const rb = new RowBuilder();
    fn(rb);
    this.sheet.cells.push(rb.build());
    return this;
  }

  rowsFrom(rows: CM.ComponentOps[][]) {
    for (const r of rows) this.sheet.cells.push(r);
    return this;
  }

  withStyle(style: Record<string, Record<string, any>>) {
    for (const cell of this.sheet.cells.flat()) {
      let st = style[cell.type as string] || style['*'];
      if (st)
        cell.style = { ...cell.style, ...st };
    }
    return this;
  }

  build() {
    return this.sheet;
  }
}

export default SheetBuilder;
