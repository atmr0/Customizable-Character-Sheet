import * as CM from "./ComponentsMap";

export default class SheetStyler {
  private styleObj: Record<string, any> = { '*': {} };
  private sheet: CM.Sheet;

  private sectionStack: CM.ComponentOps[][] = [];
  private inSection: boolean = false;
  private sectionNameStack: string[] = [];
  private stackSize: number = 0;
  private lastSectionName: string | undefined;
  private lastSection: CM.ComponentOps[] | undefined;

  private currentComponent: CM.ComponentOps | undefined;


  public setSheet(sheet:CM.Sheet){
    this.sheet = sheet;

  }
  public addComponent(component: CM.ComponentOps): void {
    if (this.inSection)
      this.sectionStack[this.stackSize - 1].push(component);
    this.currentComponent = component;
  }

  public startSection(name: string): void {
    this.inSection = true;
    this.sectionNameStack.push(name);
    this.sectionStack.push([])
    this.stackSize += 1;
  }

  public endSection(): void {
    this.lastSectionName = this.sectionNameStack.pop();
    this.lastSection = this.sectionStack.pop();
    this.stackSize -= 1;
    if (this.stackSize == 0) this.inSection = false;
    this.currentComponent = undefined;
  }
  // persist instance styleObj into sheet.styles for serialization
  public syncInstanceStyles(): void {
    this.sheet.styles = { ...(this.sheet.styles || {}), ...this.styleObj };
  }

  public applySimpleStyle(targetClass: string, key: string, value: string): void {
    console.log(this.currentComponent)
    if (!this.currentComponent) {

      if (this.lastSection) {
        this.applyStyleToSection(targetClass, key, value)
        return
      }

      const selector = this.createSelector(targetClass);

      this.styleObj[selector] = { ...this.styleObj[selector], [key]: value };
      return;
    }

    const comp = this.currentComponent as CM.ComponentOps;
    const selector = this.createSelector(targetClass, comp);
    console.log(selector)
    this.styleObj[selector] = { ...this.styleObj[selector], [key]: value };
    // comp.style = { ...(comp.style || {}), [key]: value };
  }

  public applyStyleToSection(targetClass: string, key: string, value: string) {
    if (!this.lastSection) {
      console.error("NO LAST SECTION")
      return
    }
    for (let i = 0; i < this.lastSection.length; i += 1) {
      const component = this.lastSection[i];
      const selector = this.createSelector(targetClass, component)
      this.styleObj[selector] = { ...this.styleObj[selector], [key]: value };
    }
  }

  public applyFunctionRule(targetClass: string, key: string, fn: Function): void {
    if (!this.lastSection) {
      console.error("NO LAST SECTION TO APPLY FUNCTION")
      return
    }
    for (let i = 0; i < this.lastSection.length; i += 1) {
      const component = this.lastSection[i];
      const value = fn(component);
      const selector = this.createSelector(targetClass, component)
      this.styleObj[selector] = { ...this.styleObj[selector], [key]: value };
    }
  }

  public createSelector(targetClass: string, component: CM.ComponentOps | null = null): string {
    let selector = `#${this.sheet.id}`;
    if (component) selector += ` #${component.id}`;
    if (targetClass) selector += ` ${targetClass}`;

    return selector;
  }

  public getStyleTag(obj?: Record<string, any>): string {
    const target = obj || this.styleObj;
    let tag = '';
    for (const [selector, rules] of Object.entries(target)) {
      tag += `${selector} { ${Object.entries(rules).map(([prop, value]) => `${prop}: ${value};`).join(' ')} }\n`;
    }
    console.log(tag)
    return tag;
  }
}
