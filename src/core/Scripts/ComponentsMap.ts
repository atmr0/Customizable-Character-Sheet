import InputFieldSvelte from "../components/basic components/InputField.svelte";
import StaticTextSvelte from "../components/basic components/StaticTextComponent.svelte";
import SubGridSvelte from "../components/layout/SubGrid.svelte";
import ComputedTextSvelte from "../components/basic components/ComputedText.svelte";
import ListFieldSvelte from "../components/basic components/ListField.svelte";
import CharacterAttributeSvelte from "../components/CharacterAttribute.svelte";
import SelectFieldSvelte from "../components/basic components/SelectField.svelte";
import ImageFieldSvelte from "../components/basic components/ImageField.svelte";
import CheckboxFieldSvelte from "../components/basic components/CheckboxField.svelte";
import { Constants } from "../constants";
import { SheetBuilder } from "./SheetBuilder";
import { makeUid } from "../utils/values";


export const componentsMap: Record<string, any> = {
  [Constants.CharacterAttribute]: CharacterAttributeSvelte,
  [Constants.CheckboxField]: CheckboxFieldSvelte,
  [Constants.ComputedText]: ComputedTextSvelte,
  [Constants.ImageField]: ImageFieldSvelte,
  [Constants.InputField]: InputFieldSvelte,
  [Constants.ListField]: ListFieldSvelte,
  [Constants.SelectField]: SelectFieldSvelte,
  [Constants.StaticText]: StaticTextSvelte,
  [Constants.SubGrid]: SubGridSvelte,
};

export class FullComponentOps {
  type?: string;
  id?: string;
  label?: string;
  row?: number;
  col?: number;
  height?: number;
  width?: number;
  style: Record<string, any> = {};

  // allow extra arbitrary props
  [k: string]: any;

  constructor(init?: Partial<FullComponentOps>) {
    if (init) Object.assign(this, init);
    if (!this.width) this.width = 1;
    if (!this.height) this.height = 1;
  }
}

// a convenience alias for "partial" components where fields are optional
export type ComponentOps = Partial<FullComponentOps>;

export type Sheet = {
  title?: string;
  id?: string;
  numberOfLines?: number;
  rowLength?: number;
  components?: ComponentOps[];
  styles?: Record<string, any>;
  styleTag?: string;
  columnBased?: boolean;
  ignoreLineInLayout?: number[];
};

export class InputField extends FullComponentOps {
  type: string = Constants.InputField;
  value?: string | number;
  placeholder?: string;
  inputType: string = 'text'; // 'text'|'number'
  allowFloat: boolean = false; // allow decimals when numeric
  step: number | string = this.allowFloat ? 'any' : 1;
  min: number | undefined = undefined;
  max: number | undefined = undefined;
}

export class StaticText extends FullComponentOps {
  type: string = Constants.StaticText;
  text?: string;
}

export class SubGrid extends FullComponentOps {
  type: string = Constants.SubGrid;
  sheet?: Sheet;
  constructor(opts: Partial<FullComponentOps & SubGrid>, sheet: Sheet) {
    super(opts);
    this.sheet = sheet;

  }
}

export class ComputedText extends FullComponentOps {
  type: string = Constants.ComputedText;
  expr?: string;
}

export class ListField extends FullComponentOps {
  type: string = Constants.ListField;
  itemTemplate?: Sheet;
  items?: Sheet[];

  teste:ListField = this

  private static __cachedSpec: ComponentOps[] = [];
  private static __cachedRowLength: number = 1
  constructor(opts: Partial<FullComponentOps & ListField>) {
    super(opts)
  }

  public static buildTemplateFromSpec(spec: ComponentOps[], defaults: any[] = [], rowLength: number = 4): Sheet {
    ListField.__cachedSpec = spec;
    ListField.__cachedRowLength = rowLength;
    const b = new SheetBuilder('').setRowLength(rowLength);
    let nSpec = ListField.replaceValuesInObjectList(spec, defaults)
    nSpec.forEach((f: ComponentOps) => {
      b.add(f);
    });
    return b.build();
  }
  // basically the same as buildTemplateFromSpec, but with id
  public static buildItemFromValues(values: any[] = []): Sheet {
    const b = new SheetBuilder('').setRowLength(ListField.__cachedRowLength);
    let nSpec = ListField.replaceValuesInObjectList(ListField.__cachedSpec, values)
    nSpec.forEach((f: ComponentOps) => {
      f.id = f.id ?? makeUid('listSubItem')
      b.add(f);
    });
    b.id(makeUid('listItem'))
    return b.build();
  }
  // the same as the static, but it's used in the Svelte component
  public buildItemFromValues(values: any[] = []): Sheet {
    const b = new SheetBuilder('').setRowLength(this.itemTemplate!.rowLength!);
    b.id(makeUid('listItem'))
    let nSpec = ListField.replaceValuesInObjectList(this.itemTemplate!.components!, values)
    nSpec.forEach((f: ComponentOps) => {
      f.id = makeUid('listSubItem')
      console.log('fid',f.id)
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

export class SelectField extends FullComponentOps {
  type: string = Constants.SelectField
  options?: string[];
  value?: string | number;
}

export class CheckboxField extends FullComponentOps {
  type: string = Constants.CheckboxField;
}
