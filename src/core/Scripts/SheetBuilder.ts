import * as CM from "./ComponentsMap";
import { Constants } from "../constants";

let styleObj: Record<string, any> = {};

function ensureId(prefix = 'cell') {
  return `${prefix}-${Math.random().toString(36).slice(2, 9)}`;
}

class OrganizingGrid {
  public rowLength: number;
  public ocuppiedPositions: Set<[number, number]> = new Set();
  public currentRow = 1;
  public currentColumn: number = 1;

  constructor(lineLength: number) {
    this.rowLength = lineLength;
  }

  addItem(row: number, col: number, w: number = 1, h: number = 1) {
    if (this.currentColumn + w - 1 > this.rowLength) console.error("Elemento passando da linha")
    for (let i = row; i < row+h; i += 1) {
      for (let j = col; j < col+w; j += 1) {
        if (this.ocuppiedPositions.has([i, j])) {
          console.error("Componentes se sobrepondo")
        }
        else this.ocuppiedPositions.add([i, j])
      }
    }
    this.increasePosition(w)
  }

  increasePosition(w: number = 1) {
    this.currentColumn += w;
    if (this.currentColumn > this.rowLength) {
      this.currentColumn = 1;
      this.currentRow += 1;
    }
  }

  checkFirstEmpty(): [number, number] {
    while (this.ocuppiedPositions.has([this.currentRow, this.currentColumn])) {
      this.increasePosition()
    }
    return [this.currentRow, this.currentColumn]
  }
}

export class SheetBuilder {
  private sheet: CM.Sheet;
  private lineIndex: number = 0;
  private organizingGrid: OrganizingGrid = new OrganizingGrid(1)

  constructor(title?: string) {
    this.sheet = { title, id: undefined, numberOfLines: 0, lineLength: 1, components: [], styles: styleObj } as CM.Sheet;
  }

  setRowLength(length: number) {
    this.organizingGrid.rowLength = length;
    this.sheet.lineLength = length;
    return this
  }
  add(cell: CM.ComponentOps) {
    if (!cell.id) cell.id = ensureId(cell.type || 'cell');
    let defaultPosition = this.organizingGrid.checkFirstEmpty()
    cell.row = cell.row ?? defaultPosition[0]
    cell.col = cell.col ?? defaultPosition[1]
    this.organizingGrid.addItem(cell.row, cell.col, cell.width ?? 1, cell.height ?? 1)
    this.sheet.components!.push(cell)
    return this;
  }
  InputField(opts: Partial<CM.InputFieldOps>) { return this.add({ type: Constants.InputField, ...opts }); }
  staticText(opts: Partial<CM.StaticTextOps>) { return this.add({ type: Constants.StaticText, ...opts }); }
  subGrid(opts: Partial<CM.SubGridOps>, sheet: CM.Sheet) { return this.add({ type: Constants.SubGrid, ...opts, sheet }); }
  /* componentops */
  characterAttribute(opts: CM.ComponentOps) { return this.add({ type: Constants.CharacterAttribute, ...opts }); }
  computedText(opts: Partial<CM.ComputedTextOps>) { return this.add({ type: Constants.ComputedText, ...opts }); }
  listField(opts: Partial<CM.ListFieldOps>) { return this.add({ type: Constants.ListField, ...opts }); }
  selectField(opts: Partial<CM.SelectFieldOps>) { return this.add({ type: Constants.SelectField, ...opts }); }
  checkboxField(opts: Partial<CM.CheckboxFieldOps>) { return this.add({ type: Constants.CheckboxField, ...opts }); }


  // OLD STUFF

  id(v: string) { this.sheet.id = v; return this; }
  title(v: string) { this.sheet.title = v; return this; }
  lineLength(n: number) { this.sheet.lineLength = n; return this; }
  lines(n: number) { this.sheet.numberOfLines = n; return this; }
  columnBasedLayout(enabled: boolean = true) { this.sheet.columnBased = enabled; return this; }

  rowsFrom(rows: CM.ComponentOps[][]) {
    for (const r of rows) this.sheet.components!.push(r);
    this.lineIndex += rows.length;
    return this;
  }

  // apply a single string rule: add to styleObj and set inline style on line cells
  private applyStringRule(targetClass: string, lineId: string, key: string, value: string, lineCells: CM.ComponentOps[]) {
    styleObj[lineId] = { ...styleObj[lineId], [key]: value };
    for (let cell of lineCells) {
      let styleToAppend: any = { [key]: value };
      if (targetClass) styleToAppend = { [this.createSelector(targetClass, cell)]: styleToAppend };
      cell.style = { ...(cell.style || {}), ...styleToAppend };
    }
  }

  // apply a function rule per cell: evaluate function, set selector-level rule and inline style
  private applyFunctionRule(targetClass: string, key: string, fn: Function, rowCells: CM.ComponentOps[]) {
    for (let cell of rowCells) {
      const value = fn(cell as CM.ComponentOps);
      const selector = this.createSelector(targetClass, cell);
      styleObj[selector] = { ...styleObj[selector], [key]: value };

      let styleToAppend: any = { [key]: value };
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
    const rowCells = this.sheet.components![this.lineIndex - 1] || [];

    for (const key in style) {
      if (!style[key]) continue;

      const val = style[key];
      if (typeof val === 'string') {
        // this.applyStringRule(targetClass, rowId, key, val, rowCells);
        continue;
      }

      if (typeof val === 'function') {
        // this.applyFunctionRule(targetClass, key, val, rowCells);
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
    let selector = `#${this.sheet.id}-line-${this.lineIndex}`;
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
    this.sheet.styles = { ...(this.sheet.styles || {}), ...styleObj };
    this.sheet.styleTag = SheetBuilder.convertStyleObjToTag(this.sheet.styles);
    return this.sheet;
  }
}

export default SheetBuilder;
