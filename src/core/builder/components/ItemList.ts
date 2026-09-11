import { BaseComponent, ComponentOptions, SheetSection } from "../components";
import { SheetBuilder } from "../SheetBuilder";
import { makeUid } from "../../utils/values";
import { Constants } from "../../constants";

export class ItemList extends BaseComponent {
  type: string = Constants.ItemList;
  itemTemplate?: SheetSection;
  items?: SheetSection[];
  numberOfItens: number = 0;

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
  private static __cachedSpec: ComponentOptions[] = [];
  private static __cachedRowLength: number = 1
  private static __cachedId: string = "";
  private static __numberOfItens: number = 0;
  constructor(opts: Partial<BaseComponent & ItemList>) {
    super(opts)

    // resetting so the count doesn't continue in other lists
    ItemList.__numberOfItens = 0;

    if(!this.itemTemplate || !this.itemTemplate.components || this.itemTemplate.components.length === 0) {
      console.error('Item template is not set for ItemList');
      return;
    }
    if(!this.items) return
    this.numberOfItens = this.items.length * this.itemTemplate.components.length;
  }

  public static buildTemplateFromSpec(id: string, spec: ComponentOptions[], defaults: any[] = [], rowLength: number = 4, opts: (b: any) => SheetBuilder = (b) => b): SheetSection {
    ItemList.__cachedSpec = spec;
    ItemList.__cachedRowLength = rowLength;
    ItemList.__cachedId = id;
    const b = new SheetBuilder('').id(id).setRowLength(rowLength);
    let nSpec = ItemList.replaceValuesInObjectList(spec, defaults)
    nSpec.forEach((f: ComponentOptions) => {
      f.idTemplate = f.id;
      f.id = '' // avoid conflicts for "repeating" the same id 
      b.add(f);
    });
    opts(b);
    return b.build();
  }

  // basically the same as buildTemplateFromSpec, but with id
  public static buildItemFromValues(values: any[] = []): SheetSection {
    const b = new SheetBuilder('').setRowLength(ItemList.__cachedRowLength);
    let nSpec = ItemList.replaceValuesInObjectList(ItemList.__cachedSpec, values)
    let id = ItemList.__cachedId
    const itemId = `${id}-item`;
    nSpec.forEach((f: ComponentOptions) => {
      if (!id) console.error('Cached id is not set for ItemList');
      f.id = `${itemId}-${f.idTemplate ?? f.type}-${ItemList.__numberOfItens++}`;
      b.add(f);
    });
    b.id(itemId)
    return b.build();
  }

  // the same as the static, but it always creates a new Id, and it is used in the Svelte component
  public buildItemFromValues(values: any[] = []): SheetSection {
    const b = new SheetBuilder('').setRowLength(this.itemTemplate!.rowLength!);
    const parentId = (this.id && this.id.length) ? this.id : makeUid('list');
    const itemId = `${parentId}-item`;
    b.id(itemId)
    let nSpec = ItemList.replaceValuesInObjectList(this.itemTemplate!.components!, values)
    nSpec.forEach((f: ComponentOptions) => {
      f.id = `${itemId}-${f.type}-${this.numberOfItens++}`
      b.add(f);
    });
    return b.build();
  }

  private static replaceValuesInObjectList(obj: Record<string, any>[], values: string[] = []): Record<string, any> {
    let newObjList = [];
    for (let i = 0; i < obj.length; i += 1) {
      let newObj = { ...obj[i] };
      for (const key in newObj) {
        if (typeof newObj[key] !== 'string') continue
        if (!newObj[key].startsWith('$')) continue;

        let index = parseInt(newObj[key].slice(1)) - 1
        const v = values[index] ?? ''
        newObj[key] = v
      }
      newObjList.push(newObj)
    }
    return newObjList
  }
}