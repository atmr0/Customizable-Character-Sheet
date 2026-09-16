import { BaseComponent, ComponentOptions, SheetSection } from "../components";
import { SheetBuilder } from "../SheetBuilder";
import { makeUid } from "../../utils/values";
import { Constants } from "../../constants";

export class ItemList extends BaseComponent {
  type: string = Constants.ItemList;
  itemTemplate?: SheetSection;
  items?: SheetSection[]; // better for typing when creating the list using the builder. And rendering it in order of addition
  private itemsRecord: Record<string, SheetSection> = {}; // but this is the one I will be using for search
  numberOfItens: number = 0;
  editable: boolean = true;

  teste: ItemList = this

  /*
  * This allow us to not need to create instances when building the sheet in code
  * ex.: [...].itemList({
  *   itemTemplate: ItemList.buildTemplateFromSpec(...),
  *   items: [
  *     ItemList.buildItemFromValues([...]),
  *     ItemList.buildItemFromValues([...])
  *   ]
  * })
  */

  private static __cachedSpec: BaseComponent[] = [];
  private static __cachedRowLength: number = 1
  private static __cachedId: string = "";
  private static __numberOfItens: number = 0;
  constructor(opts: Partial<BaseComponent & ItemList>) {
    super(opts);
    // resetting so the count doesn't continue in other lists
    ItemList.__numberOfItens = 0;

    if (!this.itemTemplate || !this.itemTemplate.components || Object.keys(this.itemTemplate.components).length === 0) {
      console.error('Item template is not set for ItemList');
      return;
    }
    if (!this.items) return

    for (const item of this.items) {
      if (item && item.id) {
        this.itemsRecord[item.id] = item;
      }
    }
    this.numberOfItens = this.items.length;
  }

  public getValue(): any[] {
    if (!this.items) return [];
    let data: any[] = [];
    for (const item in this.itemsRecord) {
      data.push(this.getItemValues(item))
    }
    return data;
  }

  public getItemValues(id: string): any {
    if (!this.items) return undefined;
    let item = this.itemsRecord[id];
    let values: any = []
    for (const component in item.components) {
      values.push(item.components![component].getValue());
    }
    return values;
  }

  public setValue(values: any[]): void {
    if (!this.items) return;
    this.items = []
    this.itemsRecord = {};
    for (let i = 0; i < values.length; i++) {
      const itemValues = values[i] || [];
      const newItem = this.buildItemFromValues(itemValues);
      if (newItem && newItem.id) {
        this.itemsRecord[newItem.id] = newItem;
        this.items.push(newItem);
      }
    }
    this.updateValueStore(this.id!, this.items);
  }

  public addItem(values: any[] = []): SheetSection | undefined {
    if (!this.editable) return;
    let newItem = this.buildItemFromValues(values);
    if (newItem && newItem.id) {
      this.itemsRecord[newItem.id] = newItem;
      if (this.items) this.items.push(newItem);
    }
    this.updateValueStore(this.id!, this.items);
    return newItem;
  }

  public removeItem(id: string): void {
    if (!this.editable) return;
    if (!this.items) return;
    const item = this.itemsRecord[id];
    if (!item) return;
    this.items = this.items.filter(i => i.id !== id);
    delete this.itemsRecord[id];
    this.updateValueStore(this.id!, this.items);
  }

  public static buildTemplateFromSpec(id: string, spec: BaseComponent[], defaults: any[] = [], rowLength: number = 4, opts: (b: any) => SheetBuilder = (b) => b): SheetSection {
    ItemList.__cachedSpec = spec;
    ItemList.__cachedRowLength = rowLength;
    ItemList.__cachedId = id;
    const b = new SheetBuilder('').id(id).setRowLength(rowLength);
    let nSpec = ItemList.replaceValuesInObjectList(spec, defaults)
    nSpec.forEach((f: BaseComponent) => {
      f.idTemplate = f.id;
      f.id = '' // avoid conflicts for "repeating" the same id. in the line below, it generates a new id.
      b.add(f);
    });
    opts(b);

    return b.build();
  }

  // basically the same as buildTemplateFromSpec, but with id
  public static staticBuildItemFromValues(values: any[] = []): SheetSection {
    const b = new SheetBuilder('').setRowLength(ItemList.__cachedRowLength);
    let nSpec = ItemList.replaceValuesInObjectList(ItemList.__cachedSpec, values)
    let id = ItemList.__cachedId
    const itemId = `${id}-item-${ItemList.__numberOfItens++}`;
    let componentIndex = 0;
    nSpec.forEach((f: BaseComponent) => {
      if (!id) console.error('Cached id is not set for ItemList');
      f.id = `${itemId}-${f.idTemplate ?? f.type}-${componentIndex++}`;
      b.add(f);
    });
    b.id(itemId)
    return b.build();
  }

  // the same as the static, but it always creates a new Id, and it is used in the Svelte component
  public buildItemFromValues(values: any[] = []): SheetSection {
    const b = new SheetBuilder('').setRowLength(this.itemTemplate!.rowLength!);
    const parentId = this.id ? this.id : makeUid('list');
    const itemId = `${parentId}-item-${this.numberOfItens++}`;
    b.id(itemId)
    let nSpec = ItemList.replaceValuesInObjectList(this.itemTemplate!.components!, values)
    let componentIndex = 0;
    nSpec.forEach((f: BaseComponent) => {
      f.id = `${itemId}-${f.type}-${componentIndex++}`
      b.add(f);
    });
    return b.build();
  }

  private static replaceValuesInObjectList(obj: Record<string, any>, values: string[] = []): Record<string, any> {
    let newObjList = [];
    const keys = Object.keys(obj);
    for (let i = 0; i < keys.length; i += 1) {
      let newObj = { ...obj[keys[i]] };
      for (const key in newObj) {
        if (typeof newObj[key] !== 'string') continue
        if (!newObj[key].startsWith('$')) continue;

        let index = parseInt(newObj[key].slice(1)) - 1
        const v = values[index] ?? newObj[key]
        newObj[key] = v
      }
      newObjList.push(newObj)
    }
    return newObjList
  }
}