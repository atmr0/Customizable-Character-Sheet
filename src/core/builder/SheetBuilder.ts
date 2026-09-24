import * as BuilderIndex from "./";
import { Constants } from "../constants";
import OrganizingGrid from "./OrganizingGrid";
import SheetStyler, { type styleValues } from "./SheetStyler";


let onDevelopment = true

// let sheetStyler: SheetStyler = new SheetStyler();

function ensureId(prefix = 'cell') {
  return `${prefix}-${Math.random().toString(36).slice(2, 9)}`;
}

export class SheetBuilder {
  private sheet: BuilderIndex.Sheet;
  private organizingGrid: OrganizingGrid = new OrganizingGrid(1)
  private sheetStyler: SheetStyler = new SheetStyler();

  private static itemIds: Set<string> = new Set();

  constructor(title?: string) {
    this.sheet = { title, id: undefined, rowLength: 1, components: {} } as BuilderIndex.Sheet;
    this.sheetStyler.setSheet(this.sheet)
  }

  add(component: BuilderIndex.ComponentOptions): this {
    // rehydration done by AI ====================================
    // without it, methods from classes like ComputedText would not be available to call, and I couldn't figure it out
    let comp: BuilderIndex.ComponentOptions = component;
    const BaseCtor = (BuilderIndex as any).BaseComponent;
    if (!(component instanceof BaseCtor)) {
      // attempt to construct a typed instance by looking up the ctor by type
      const ctor = (BuilderIndex as any)[component.type as string];
      if (typeof ctor === 'function') {
        // create an instance and copy props to preserve prototype/methods
        comp = Object.assign(new ctor(), component);
      } else {
        // fallback to BaseComponent so we still have default behavior
        comp = Object.assign(new BaseCtor(), component);
      }
    }
    // =======================================================================

    if (!onDevelopment && SheetBuilder.itemIds.has(comp.id!)) {
      throw new Error(`Component with id ${comp.id} already exists in the sheet.`);
    }
    if (!comp.id) comp.id = ensureId(comp.type);
    let defaultPosition = this.organizingGrid.checkFirstEmpty(comp.width ?? 1, comp.height ?? 1)
    comp.row = comp.row ?? defaultPosition[0]
    comp.col = comp.col ?? defaultPosition[1]

    this.organizingGrid.addItem(comp.row, comp.col, comp.width ?? 1, comp.height ?? 1)
    this.sheetStyler.addComponent(comp)
    this.sheet.components![comp.id] = comp
    SheetBuilder.itemIds.add(comp.id!);
    return this;
  }

  inputField(opts: Partial<BuilderIndex.InputField>): this { return this.add(new BuilderIndex.InputField(opts)); }
  staticText(opts: Partial<BuilderIndex.StaticText>): this { return this.add(new BuilderIndex.StaticText(opts)); }
  subGrid(opts: Partial<BuilderIndex.SubGrid>, sheet: BuilderIndex.Sheet): this { return this.add(new BuilderIndex.SubGrid(opts, sheet)); }
  characterAttribute(opts: Partial<BuilderIndex.CharacterAttribute>): this { return this.add(new BuilderIndex.CharacterAttribute(opts)); }
  computedText(opts: Partial<BuilderIndex.ComputedText>): this { return this.add(new BuilderIndex.ComputedText(opts)); }
  itemList(opts: Partial<BuilderIndex.ItemList>): this { return this.add(new BuilderIndex.ItemList(opts)); }
  selectField(opts: Partial<BuilderIndex.SelectField>): this { return this.add(new BuilderIndex.SelectField(opts)); }
  checkboxField(opts: Partial<BuilderIndex.CheckboxField>): this { return this.add(new BuilderIndex.CheckboxField(opts)); }
  imageField(opts: Partial<BuilderIndex.ImageField>): this { return this.add(new BuilderIndex.ImageField(opts)); }

  id(v: string): this { this.sheet.id = v; return this; }
  title(v: string): this { this.sheet.title = v; return this; }
  lines(n: number): this { this.sheet.numberOfLines = n; return this; }
  setRowLength(length: number): this {
    this.organizingGrid.rowLength = length;
    this.sheet.rowLength = length;
    // Ensure organizing grid cursor is valid for the new row length
    if (this.organizingGrid.currentColumn < 1) this.organizingGrid.currentColumn = 1;
    if (this.organizingGrid.currentRow < 1) this.organizingGrid.currentRow = 1;
    if (this.organizingGrid.currentColumn > length) {
      // wrap the column and advance rows proportionally so cursor stays in-bounds
      const overflow = Math.floor((this.organizingGrid.currentColumn - 1) / length);
      this.organizingGrid.currentRow += overflow;
      this.organizingGrid.currentColumn = ((this.organizingGrid.currentColumn - 1) % length) + 1;
    }
    return this
  }

  /* No indentation necessary ex.:
     .startSection("Informacoes")
     .add(...)
     .endSection()
  */
  public startSection(name: string): this {
    this.sheetStyler.startSection(name)
    return this;
  }
  public endSection(): this {
    this.sheetStyler.endSection()
    return this;
  }

  /* Useful for indentation and organization
   * Example usage:
   *   .section("Informacoes", b => b
   *     .add(...)
   *   )
   */
  public section(name: string, fn: (b: SheetBuilder) => SheetBuilder) {
    this.sheetStyler.startSection(name)
    fn(this)
    this.sheetStyler.endSection()
    return this;
  }

  public withComponentStyle(style: styleValues): this {
    this.sheetStyler.applyStyleToComponent(style);
    return this;
  }

  public withSectionStyle(style: styleValues, targetClass: string = ""): this {
    this.sheetStyler.applyStyleToSection(style, targetClass);
    return this;
  }

  public withSheetStyle(style: styleValues, targetClass: string = ""): this {
    this.sheetStyler.applyStyleToSheet(style, targetClass);
    return this;
  }

  public withStyle(style: styleValues, targetClass: string = ""): this {
    this.sheetStyler.applyStyleContextual(style, targetClass)
    return this;
  }


  public build(): BuilderIndex.Sheet {
    this.sheet.styleTag = this.sheetStyler.getStyleTag(this.sheet.styles);
    return this.sheet;
  }
}

export default SheetBuilder;
