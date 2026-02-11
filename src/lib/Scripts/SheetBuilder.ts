import { ComponentOps, ComputedTextOps, Sheet, StaticTextOps, SubGridOps, TextFieldOps } from "./ComponentsMap";


function ensureId(prefix = 'cell') {
  return `${prefix}-${Math.random().toString(36).slice(2, 9)}`;
}

export class RowBuilder {
  private row: ComponentOps[] = [];

  add(cell: ComponentOps) {
    if (!cell.id) cell.id = ensureId(cell.type || 'cell');
    this.row.push(cell);
    return this;
  }

  textField(opts: Partial<TextFieldOps>) { return this.add({ type: 'TextField', ...opts }); }
  staticText(opts: Partial<StaticTextOps>) { return this.add({ type: 'StaticText', ...opts }); }
  subGrid(opts: Partial<SubGridOps>, sheet: Sheet) { return this.add({ type: 'SubGrid', ...opts, sheet }); }
  characterAttribute(opts: Partial<ComponentOps>) { return this.add({ type: 'CharacterAttribute', ...opts }); }
  computedText(opts: Partial<ComputedTextOps>) { return this.add({ type: 'ComputedText', ...opts }); }

  build() { return this.row; }
}

export class SheetBuilder {
  private sheet: Sheet;

  constructor(title?: string) {
    this.sheet = { title, id: undefined, rows: 0, cols: 1, cells: [] } as Sheet;
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

  rowsFrom(rows: ComponentOps[][]) {
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
