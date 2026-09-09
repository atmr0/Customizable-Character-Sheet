import * as BuilderIndex from "./";
import { Constants } from "../constants";
import OrganizingGrid from "./OrganizingGrid";
import SheetStyler from "./SheetStyler";

// let sheetStyler: SheetStyler = new SheetStyler();

function ensureId(prefix = 'cell') {
  return `${prefix}-${Math.random().toString(36).slice(2, 9)}`;
}

export class SheetBuilder {
  private sheet: BuilderIndex.Sheet;
  private organizingGrid: OrganizingGrid = new OrganizingGrid(1)
  private sheetStyler:SheetStyler = new SheetStyler();
  constructor(title?: string) {
    this.sheet = { title, id: undefined, rowLength: 1, components: [] } as BuilderIndex.Sheet;
    this.sheetStyler.setSheet(this.sheet)
  }

  setRowLength(length: number): this {
    this.organizingGrid.rowLength = length;
    this.sheet.rowLength = length;
    return this
  }
  add(component: BuilderIndex.ComponentOptions): this {
    if (!component.id) component.id = ensureId(component.type || 'cell');
    let defaultPosition = this.organizingGrid.checkFirstEmpty()
    component.row = component.row ?? defaultPosition[0]
    component.col = component.col ?? defaultPosition[1]

    this.organizingGrid.addItem(component.row, component.col, component.width ?? 1, component.height ?? 1)
    this.sheetStyler.addComponent(component)
    this.sheet.components!.push(component)
    return this;
  }
  InputField(opts: Partial<BuilderIndex.InputField>): this { return this.add(new BuilderIndex.InputField(opts)); }
  staticText(opts: Partial<BuilderIndex.StaticText>): this { return this.add(new BuilderIndex.StaticText(opts)); }
  subGrid(opts: Partial<BuilderIndex.SubGrid>, sheet: Partial<BuilderIndex.Sheet>): this { return this.add(new BuilderIndex.SubGrid(opts, sheet)); }
  characterAttribute(opts: Partial<BuilderIndex.ComponentOptions>): this { return this.add({ type: Constants.CharacterAttribute, ...opts }); }
  computedText(opts: Partial<BuilderIndex.ComputedText>): this { return this.add(new BuilderIndex.ComputedText(opts)); }
  itemList(opts: Partial<BuilderIndex.ItemList>): this { return this.add(new BuilderIndex.ItemList(opts)); }
  selectField(opts: Partial<BuilderIndex.SelectField>): this { return this.add(new BuilderIndex.SelectField(opts)); }
  checkboxField(opts: Partial<BuilderIndex.CheckboxField>): this { return this.add(new BuilderIndex.CheckboxField(opts)); }

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
    this.sheetStyler.startSection(name)
    return this;
  }
  public section(name: string, fn: (b: SheetBuilder) => SheetBuilder) {
    this.sheetStyler.startSection(name)
    fn(this)
    this.sheetStyler.endSection()
    return this;
  }
  public endSection(): this {
    this.sheetStyler.endSection()
    return this;
  }

  public withStyle(style: Record<string, any> | Record<string, Record<string, Function>>, targetClass: string = ""): this {
    for (const key in style) {
      if (!style[key]) continue;

      const val = style[key];
      if (typeof val === 'string') {
        this.sheetStyler.applySimpleStyle(targetClass, key, val);
        continue;
      }

      if (typeof val === 'function') {
        this.sheetStyler.applyFunctionRule(targetClass, key, val as Function);
        continue;
      }
    }

    this.sheetStyler.syncInstanceStyles();
    return this;
  }


  public build(): BuilderIndex.Sheet {
    // this.sheet.styles = { ...(this.sheet.styles || {}), ...this.sheetStyler. };
    this.sheet.styleTag = this.sheetStyler.getStyleTag(this.sheet.styles);
    return this.sheet;
  }
}

export default SheetBuilder;
