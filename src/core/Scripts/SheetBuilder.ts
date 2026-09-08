import * as CM from "./ComponentsMap";
import { Constants } from "../constants";
import OrganizingGrid from "./OrganizingGrid";
import SheetStyler from "./SheetStyler";

let sheetStyler: SheetStyler = new SheetStyler();

function ensureId(prefix = 'cell') {
  return `${prefix}-${Math.random().toString(36).slice(2, 9)}`;
}

export class SheetBuilder {
  private sheet: CM.Sheet;
  private organizingGrid: OrganizingGrid = new OrganizingGrid(1)

  constructor(title?: string) {
    this.sheet = { title, id: undefined, numberOfLines: 0, rowLength: 1, components: [] } as CM.Sheet;
    sheetStyler.setSheet(this.sheet)
  }

  setRowLength(length: number): this {
    this.organizingGrid.rowLength = length;
    this.sheet.rowLength = length;
    return this
  }
  add(component: CM.ComponentOps): this {
    if (!component.id) component.id = ensureId(component.type || 'cell');
    let defaultPosition = this.organizingGrid.checkFirstEmpty()
    component.row = component.row ?? defaultPosition[0]
    component.col = component.col ?? defaultPosition[1]

    this.organizingGrid.addItem(component.row, component.col, component.width ?? 1, component.height ?? 1)
    sheetStyler.addComponent(component)
    this.sheet.components!.push(component)
    return this;
  }
  InputField(opts: Partial<CM.InputFieldOps>): this { return this.add(new CM.InputFieldOps(opts)); }
  staticText(opts: Partial<CM.StaticTextOps>): this { return this.add(new CM.StaticTextOps(opts)); }
  subGrid(opts: Partial<CM.SubGridOps>, sheet: Partial<CM.Sheet>): this { return this.add(new CM.SubGridOps(opts, sheet)); }
  characterAttribute(opts: Partial<CM.ComponentOps>): this { return this.add({ type: Constants.CharacterAttribute, ...opts }); }
  computedText(opts: Partial<CM.ComputedTextOps>): this { return this.add(new CM.ComputedTextOps(opts)); }
  listField(opts: Partial<CM.ListFieldOps>): this { return this.add(new CM.ListFieldOps(opts)); }
  selectField(opts: Partial<CM.SelectFieldOps>): this { return this.add(new CM.SelectFieldOps(opts)); }
  checkboxField(opts: Partial<CM.CheckboxFieldOps>): this { return this.add(new CM.CheckboxFieldOps(opts)); }

  // OLD STUFF

  id(v: string): this { this.sheet.id = v; return this; }
  title(v: string): this { this.sheet.title = v; return this; }
  lines(n: number): this { this.sheet.numberOfLines = n; return this; }



  // // apply a function-valued rule across all existing components in the sheet
  // // (useful for per-cell computed styles like focus colors).

  // // apply an object rule by delegating to withStyle for nested selectors
  // private applyObjectRule(obj: Record<string, any>, key: string) {
  //   this.withStyle(obj, key);
  // }

  public startSection(name: string): this {
    sheetStyler.startSection(name)
    return this;
  }
  public section(name: string, fn: (b: SheetBuilder) => SheetBuilder) {
    sheetStyler.startSection(name)
    fn(this)
    sheetStyler.endSection()
    return this;
  }
  public endSection(): this {
    sheetStyler.endSection()
    return this;
  }

  public withStyle(style: Record<string, any> | Record<string, Record<string, Function>>, targetClass: string = ""): this {
    console.log("Entrando withStyle")
    for (const key in style) {
      if (!style[key]) continue;

      const val = style[key];
      if (typeof val === 'string') {
        sheetStyler.applySimpleStyle(targetClass, key, val);
        continue;
      }

      if (typeof val === 'function') {
        console.log("FUNCTION")
        sheetStyler.applyFunctionRule(targetClass, key, val as Function);
        continue;
      }
    }

    sheetStyler.syncInstanceStyles();
    return this;
  }


  public build(): CM.Sheet {
    // this.sheet.styles = { ...(this.sheet.styles || {}), ...sheetStyler. };
    this.sheet.styleTag = sheetStyler.getStyleTag(this.sheet.styles);
    return this.sheet;
  }
}

export default SheetBuilder;
