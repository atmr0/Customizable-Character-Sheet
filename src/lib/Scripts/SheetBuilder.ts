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
  private styleObj: Record<string, any> = {};
  constructor(title?: string) {
    this.sheet = { title, id: undefined, numberOfRows: 0, cols: 1, rows: [] } as CM.Sheet;
    (this.sheet as any).styles = {};
    (this.sheet as any).styleTag = "";
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

  // apply a single string rule: add to styleObj and set inline style on row cells
  private applyStringRule(rowId: string, key: string, value: string, rowCells: CM.ComponentOps[]) {
    this.styleObj[rowId] = { ...this.styleObj[rowId], [key]: value };
    for (let cell of rowCells) {
      cell.style = { ...(cell.style || {}), [key]: value };
    }
  }

  // apply a function rule per cell: evaluate function, set selector-level rule and inline style
  private applyFunctionRule(targetClass: string, key: string, fn: Function, rowCells: CM.ComponentOps[]) {
    for (let cell of rowCells) {
      const value = fn(cell as CM.ComponentOps);
      const selector = this.createSelector(targetClass, cell);
      console.log(targetClass, key, value)
      this.styleObj[selector] = { ...this.styleObj[selector], [key]: value };
      cell.style = { ...(cell.style || {}), [targetClass]: { ...cell.style?.[targetClass], [key]: value } };
    }
  }

  // apply an object rule by delegating to withStyle for nested selectors
  private applyObjectRule(obj: Record<string, any>, key: string) {
    this.withStyle(obj, key);
  }

  // persist instance styleObj into sheet.styles for serialization
  private syncInstanceStyles() {
    (this.sheet as any).styles = { ...((this.sheet as any).styles || {}), ...this.styleObj };
  }

  withStyle(style: Record<string, any> | Record<string, Record<string, Function>>, targetClass: string = "") {
    const rowId = this.createSelector(targetClass);
    const rowCells = this.sheet.rows[this.rowIndex - 1] || [];

    for (const key in style) {
      if (!style[key]) continue;

      const val = style[key];
      if (typeof val === 'string') {
        this.applyStringRule(rowId, key, val, rowCells);
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

  createSelector(targetClass: string, cell: CM.ComponentOps | null = null) {
    let selector = `#${this.sheet.id}-row-${this.rowIndex}`;
    if (cell) selector += ` #${cell.id}`;
    if (targetClass) selector += ` ${targetClass}`;

    return selector;
  }

  convertStyleObjToTag(obj?: Record<string, any>) {
    const target = obj || this.styleObj || styleObj;
    let styles = '';
    for (const [selector, rules] of Object.entries(target)) {
      styles += `${selector} { ${Object.entries(rules).map(([prop, value]) => `${prop}: ${value};`).join(' ')} }\n`;
    }
    return styles;
  }

  build() {
    const tag = this.convertStyleObjToTag(this.styleObj);
    (this.sheet as any).styleTag = tag;
    (this.sheet as any).styles = { ...((this.sheet as any).styles || {}), ...this.styleObj };

    // keep global compatibility variables updated
    styleObj = { ...styleObj, ...this.styleObj };
    styleTag = tag;

    return this.sheet;
  }
}

export default SheetBuilder;
