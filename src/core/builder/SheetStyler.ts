import * as BuilderIndex from "./";


export type styleValues = Record<string, any> | Record<string, Record<string, Function>>;
// Uses CSS to apply styles.
// In the future, maybe I'll use a canvas instead of HTTP DOM
export default class SheetStyler {
  private styleObj: Record<string, any> = { '*': {} };
  // @ts-ignore
  private sheet: BuilderIndex.Sheet;

  private sectionStack: BuilderIndex.ComponentOptions[][] = [];
  private inSection: boolean = false;
  private sectionNameStack: string[] = [];
  private stackSize: number = 0;
  private lastSection: BuilderIndex.ComponentOptions[] | undefined;

  private currentComponent: BuilderIndex.ComponentOptions | undefined;


  public setSheet(sheet: BuilderIndex.Sheet) {
    this.sheet = sheet;

  }
  public addComponent(component: BuilderIndex.ComponentOptions): void {
    if (this.inSection)
      this.sectionStack[this.stackSize - 1].push(component);
    this.currentComponent = component;
  }

  // Apply style to multiple components within the current section
  public startSection(name: string): void {
    this.inSection = true;
    this.sectionNameStack.push(name);
    this.sectionStack.push([])
    this.stackSize += 1;
  }

  public endSection(): void {
    this.lastSection = this.sectionStack.pop();
    this.stackSize -= 1;
    if (this.stackSize == 0) this.inSection = false;
    this.currentComponent = undefined;
  }

  // Don't remember why this exists
  public syncInstanceStyles(): void {
    this.sheet.styles = { ...(this.sheet.styles || {}), ...this.styleObj };
  }

  public applyStyleToSheet(style: Record<string, any> | Record<string, Record<string, Function>>,targetClass:string = ""): void {
    const selector = this.createSelector(targetClass);
    for (const [key, value] of Object.entries(style)) {
      if (!value) continue;
      if (typeof value === 'string') {
        this.styleObj[selector] = { ...this.styleObj[selector], [key]: value };
        continue;
      }
      // TODO implement handling for function values
    }
  }

  public applyStyleToComponent(style: styleValues){
    if(!this.currentComponent){
      throw new Error("No current component to apply style to.");
    }
    const selector = this.createSelector("", this.currentComponent);
    for (const [key, value] of Object.entries(style)) {
      if (!value) continue;
      this.applySingleStyle(selector, key, value, this.currentComponent);
    }
  }

  public applyStyleToSection(style: styleValues, targetClass:string = "") {
    if (!this.lastSection) {
      console.error("NO LAST SECTION")
      return
    }
    for (let i = 0; i < this.lastSection.length; i += 1) {
      const component = this.lastSection[i];
      const selector = this.createSelector(targetClass, component)
      for (const [key, value] of Object.entries(style)) {
        if (!value) continue;
        this.applySingleStyle(selector, key, value, component);
      }
    }
  }

   public applyStyleContextual(style:styleValues, targetClass: string = ""): void {
    if (!this.currentComponent) {
      if (this.lastSection) {
        this.applyStyleToSection(style, targetClass)
        return
      }
      this.applyStyleToSheet(style,targetClass)
      return;
    }
    this.applyStyleToComponent(style);
  }
  
  private applySingleStyle(selector: string, key: string, value: string | Function, component: BuilderIndex.ComponentOptions | null = null): void {
    if (!value) return;
    if (typeof value === 'string') {
      this.styleObj[selector] = { ...this.styleObj[selector], [key]: value };
      return;
    }
    if (typeof value === 'function' && component) {
      let result = value(component);
      this.styleObj[selector] = { ...this.styleObj[selector], [key]: result };
      return;
    }
  }

  private createSelector(targetClass: string, component: BuilderIndex.ComponentOptions | null = null): string {
    let selector = `#${this.sheet.id}`;
    if (component) selector += ` #${component.id}`;
    if (targetClass) selector += ` .${targetClass}`;

    return selector;
  }

  public getStyleTag(obj?: Record<string, any>): string {
    const target = obj || this.styleObj;
    let tag = '';
    for (const [selector, rules] of Object.entries(target)) {
      tag += `${selector} { ${Object.entries(rules).map(([prop, value]) => `${prop}: ${value};`).join(' ')} }\n`;
    }
    return tag;
  }
}
