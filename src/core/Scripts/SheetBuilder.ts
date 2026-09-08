import * as CM from "./ComponentsMap";
import { Constants } from "../constants";
import OrganizingGrid from "./OrganizingGrid";

let styleObj: Record<string, any> = {};

function ensureId(prefix = 'cell') {
  return `${prefix}-${Math.random().toString(36).slice(2, 9)}`;
}

export class SheetBuilder {
  private sheet: CM.Sheet;
  private organizingGrid: OrganizingGrid = new OrganizingGrid(1)
  private currentComponent: any = this;
  constructor(title?: string) {
    this.sheet = { title, id: undefined, numberOfLines: 0, rowLength: 1, components: [], styles: styleObj } as CM.Sheet;
  }

  setRowLength(length: number) {
    this.organizingGrid.rowLength = length;
    this.sheet.rowLength = length;
    return this
  }
  add(cell: CM.ComponentOps) {
    if (!cell.id) cell.id = ensureId(cell.type || 'cell');
    let defaultPosition = this.organizingGrid.checkFirstEmpty()
    cell.row = cell.row ?? defaultPosition[0]
    cell.col = cell.col ?? defaultPosition[1]
    this.organizingGrid.addItem(cell.row, cell.col, cell.width ?? 1, cell.height ?? 1)
    this.sheet.components!.push(cell)
    this.currentComponent = cell;
    return this;
  }
  InputField(opts: Partial<CM.InputFieldOps>) { return this.add({ type: Constants.InputField, ...opts }); }
  staticText(opts: Partial<CM.StaticTextOps>) { return this.add({ type: Constants.StaticText, ...opts }); }
  subGrid(opts: Partial<CM.SubGridOps>, sheet: CM.Sheet) { return this.add({ type: Constants.SubGrid, ...opts, sheet }); }
  characterAttribute(opts: CM.ComponentOps) { return this.add({ type: Constants.CharacterAttribute, ...opts }); }
  computedText(opts: Partial<CM.ComputedTextOps>) { return this.add({ type: Constants.ComputedText, ...opts }); }
  listField(opts: Partial<CM.ListFieldOps>) { return this.add({ type: Constants.ListField, ...opts }); }
  selectField(opts: Partial<CM.SelectFieldOps>) { return this.add({ type: Constants.SelectField, ...opts }); }
  checkboxField(opts: Partial<CM.CheckboxFieldOps>) { return this.add({ type: Constants.CheckboxField, ...opts }); }


  // OLD STUFF

  id(v: string) { this.sheet.id = v; return this; }
  title(v: string) { this.sheet.title = v; return this; }
  lines(n: number) { this.sheet.numberOfLines = n; return this; }

  // persist instance styleObj into sheet.styles for serialization
  private syncInstanceStyles() {
    this.sheet.styles = { ...(this.sheet.styles || {}), ...styleObj };
  }

  // apply a string rule either to the whole sheet (when called on builder)
  // or to the current component (when called after add()).
  private applyStringRule(targetClass: string, key: string, value: string) {
    if (this.currentComponent === this) {
      const selector = this.createSelector(targetClass);
      styleObj[selector] = { ...styleObj[selector], [key]: value };
      return;
    }

    // applying to a specific component
    const comp = this.currentComponent as CM.ComponentOps;
    const selector = targetClass ? this.createSelector(targetClass, comp) : this.createSelector('', comp);
    if (targetClass) {
      styleObj[selector] = { ...styleObj[selector], [key]: value };
    }
    comp.style = { ...(comp.style || {}), [key]: value };
  }

  // apply a function-valued rule across all existing components in the sheet
  // (useful for per-cell computed styles like focus colors).
  private applyFunctionRule(targetClass: string, key: string, fn: Function) {
    const cells = this.sheet.components || [];
    for (let cell of cells) {
      const value = fn(cell as CM.ComponentOps);
      console.log(cell)
      const selector = this.createSelector(targetClass, cell as CM.ComponentOps);
      styleObj[selector] = { ...styleObj[selector], [key]: value };
      cell.style = { ...(cell.style || {}), [key]: value };
    }
  }

  // apply an object rule by delegating to withStyle for nested selectors
  private applyObjectRule(obj: Record<string, any>, key: string) {
    this.withStyle(obj, key);
  }

  withStyle(style: Record<string, any> | Record<string, Record<string, Function>>, targetClass: string = "") {
    for (const key in style) {
      if (!style[key]) continue;

      const val = style[key];
      if (typeof val === 'string') {
        this.applyStringRule(targetClass, key, val);
        continue;
      }

      if (typeof val === 'function') {
        console.log("FUNCTION")
        this.applyFunctionRule(targetClass, key, val as Function);
        continue;
      }

      if (typeof val === 'object') {
        this.applyObjectRule(val as Record<string, any>, key);
        continue;
      }
    }

    this.syncInstanceStyles();
    return this;
  }

  createSelector(targetClass: string, cell: CM.ComponentOps | null = null) {
    let selector = `#${this.sheet.id}`;
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
    console.log(this.sheet.styleTag)
    return this.sheet;
  }
}

export default SheetBuilder;
