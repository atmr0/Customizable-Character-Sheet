import { BaseComponent, ComponentOptions, SheetSection } from "../components";
import { SheetBuilder } from "../SheetBuilder";
import { makeUid } from "../../utils/values";
import { Constants } from "../../constants";

export class ItemList extends BaseComponent {
  type: string = Constants.ItemList;
  itemTemplate?: SheetSection;
  items?: SheetSection[];

  teste:ItemList = this

  private static __cachedSpec: ComponentOptions[] = [];
  private static __cachedRowLength: number = 1
  constructor(opts: Partial<BaseComponent & ItemList>) {
    super(opts)
  }

  public static buildTemplateFromSpec(spec: ComponentOptions[], defaults: any[] = [], rowLength: number = 4): SheetSection {
    ItemList.__cachedSpec = spec;
    ItemList.__cachedRowLength = rowLength;
    const b = new SheetBuilder('').setRowLength(rowLength);
    let nSpec = ItemList.replaceValuesInObjectList(spec, defaults)
    nSpec.forEach((f: ComponentOptions) => {
      b.add(f);
    });
    return b.build();
  }
  // basically the same as buildTemplateFromSpec, but with id
  public static buildItemFromValues(values: any[] = []): SheetSection {
    const b = new SheetBuilder('').setRowLength(ItemList.__cachedRowLength);
    let nSpec = ItemList.replaceValuesInObjectList(ItemList.__cachedSpec, values)
    nSpec.forEach((f: ComponentOptions) => {
      f.id = f.id ?? makeUid('listSubItem')
      b.add(f);
    });
    b.id(makeUid('listItem'))
    return b.build();
  }
  // the same as the static, but it always creates a new Id, and it is used in the Svelte component
  public buildItemFromValues(values: any[] = []): SheetSection {
    const b = new SheetBuilder('').setRowLength(this.itemTemplate!.rowLength!);
    b.id(makeUid('listItem'))
    let nSpec = ItemList.replaceValuesInObjectList(this.itemTemplate!.components!, values)
    nSpec.forEach((f: ComponentOptions) => {
      f.id = makeUid('listSubItem')
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