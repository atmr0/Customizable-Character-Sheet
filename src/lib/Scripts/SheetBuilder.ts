import * as CM from "./ComponentsMap";
import { Constants } from "../constants";

let styleObj: Record<string, any> = {};

function ensureId(prefix = 'cell') {
  return `${prefix}-${Math.random().toString(36).slice(2, 9)}`;
}

export class RowBuilder {
  private row: Partial<CM.ComponentOps>[] = [];
  private last: Partial<CM.ComponentOps> | null = null;
  add(cell: Partial<CM.ComponentOps>) {
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
  checkboxField(opts: Partial<CM.CheckboxFieldOps>) { return this.add({ type: Constants.CheckboxField, ...opts }); }

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
  public columnBased: boolean = false;
  constructor(title?: string) {
    this.sheet = { title, id: undefined, numberOfLines: 0, lineLength: 1, lines: [], styles: styleObj } as CM.Sheet;
  }

  id(v: string) { this.sheet.id = v; return this; }
  title(v: string) { this.sheet.title = v; return this; }
  lineLength(n: number) { this.sheet.lineLength = n; return this; }
  lines(n: number) { this.sheet.numberOfLines = n; return this; }
  columnBasedLayout(enabled: boolean = true) { this.columnBased = enabled; return this; }
  row(fn: (r: RowBuilder) => RowBuilder) {
    const rb = new RowBuilder();
    fn(rb);
    this.sheet.lines!.push(rb.build());
    this.rowIndex += 1;
    return this;
  }

  rowsFrom(rows: Partial<CM.ComponentOps>[][]) {
    for (const r of rows) this.sheet.lines!.push(r);
    this.rowIndex += rows.length;
    return this;
  }

  // apply a single string rule: add to styleObj and set inline style on row cells
  private applyStringRule(targetClass: string, rowId: string, key: string, value: string, rowCells: Partial<CM.ComponentOps>[]) {
    styleObj[rowId] = { ...styleObj[rowId], [key]: value };
    for (let cell of rowCells) {
      let styleToAppend:any = { [key]: value };
      if (targetClass) styleToAppend = { [this.createSelector(targetClass, cell)]: styleToAppend };
      cell.style = { ...(cell.style || {}), ...styleToAppend };
    }
  }

  // apply a function rule per cell: evaluate function, set selector-level rule and inline style
  private applyFunctionRule(targetClass: string, key: string, fn: Function, rowCells: Partial<CM.ComponentOps>[]) {
    for (let cell of rowCells) {
      const value = fn(cell as Partial<CM.ComponentOps>);
      const selector = this.createSelector(targetClass, cell);
        styleObj[selector] = { ...styleObj[selector], [key]: value };

      let styleToAppend:any = { [key]: value };
      if (targetClass) styleToAppend = { [selector]: styleToAppend };
      cell.style = { ...(cell.style || {}), ...styleToAppend };
    }
  }

  // apply an object rule by delegating to withStyle for nested selectors
  private applyObjectRule(obj: Record<string, any>, key: string) {
    this.withStyle(obj, key);
  }

  // persist instance styleObj into sheet.styles for serialization
  private syncInstanceStyles() {
    this.sheet.styles = { ...(this.sheet.styles || {}), ...styleObj };
  }

  withStyle(style: Record<string, any> | Record<string, Record<string, Function>>, targetClass: string = "") {
    const rowId = this.createSelector(targetClass);
    const rowCells = this.sheet.lines![this.rowIndex - 1] || [];

    for (const key in style) {
      if (!style[key]) continue;

      const val = style[key];
      if (typeof val === 'string') {
        this.applyStringRule(targetClass,rowId, key, val, rowCells);
        continue;
      }

      if (typeof val === 'function') {
        this.applyFunctionRule(targetClass, key, val, rowCells);
        continue;
      }

      if (typeof val === 'object') {
        this.applyObjectRule(val, key);
        continue;
      }
    }

    this.syncInstanceStyles();
    return this;
  }

  createSelector(targetClass: string, cell: Partial<CM.ComponentOps> | null = null) {
    let selector = `#${this.sheet.id}-row-${this.rowIndex}`;
    if (cell) selector += ` #${cell.id}`;
    if (targetClass) selector += ` ${targetClass}`;

    return selector;
  }

  public static convertStyleObjToTag(obj?: Record<string, any>) {
    const target = obj || styleObj;
    let tag = '';
    for (const [selector, rules] of Object.entries(target)) {
      tag += `${selector} { ${Object.entries(rules).map(([prop, value]) => `${prop}: ${value};`).join(' ')} }\n`;
    }
    return tag;
  }

  build() {
    if(this.columnBased) {
      styleObj[".grid"] = { ...styleObj[".grid"], "grid-auto-flow": "column" };
      styleObj[".row"] = { ...styleObj[".row"], "display": "grid", "grid-auto-flow": "inherit !important" };
    }
    this.sheet.styles = { ...(this.sheet.styles || {}), ...styleObj };
    this.sheet.styleTag = SheetBuilder.convertStyleObjToTag(this.sheet.styles);
    return this.sheet;
  }
}

export default SheetBuilder;
