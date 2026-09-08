import InputField from "../components/basic components/InputField.svelte";
import StaticText from "../components/basic components/StaticText.svelte";
import SubGrid from "../components/layout/SubGrid.svelte";
import ComputedText from "../components/basic components/ComputedText.svelte";
import ListField from "../components/basic components/ListField.svelte";
import CharacterAttribute from "../components/CharacterAttribute.svelte";
import SelectField from "../components/basic components/SelectField.svelte";
import ImageField from "../components/basic components/ImageField.svelte";
import CheckboxField from "../components/basic components/CheckboxField.svelte";
import { Constants } from "../constants";


export const componentsMap: Record<string, any> = {
  [Constants.CharacterAttribute]: CharacterAttribute,
  [Constants.CheckboxField]: CheckboxField,
  [Constants.ComputedText]: ComputedText,
  [Constants.ImageField]: ImageField,
  [Constants.InputField]: InputField,
  [Constants.ListField]: ListField,
  [Constants.SelectField]: SelectField,
  [Constants.StaticText]: StaticText,
  [Constants.SubGrid]: SubGrid,
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

export class InputFieldOps extends FullComponentOps {
  type: string = Constants.InputField;
  value?: string | number;
  placeholder?: string;
  inputType: string = 'text'; // 'text'|'number'
  allowFloat: boolean = false; // allow decimals when numeric
  step: number | string = this.allowFloat ? 'any' : 1;
  min: number | undefined = undefined;
  max: number | undefined = undefined;
}

export class StaticTextOps extends FullComponentOps {
  type: string = Constants.StaticText;
  text?: string;
}

export class SubGridOps extends FullComponentOps {
  type: string = Constants.SubGrid;
  sheet?: Sheet;
  constructor(opts: Partial<FullComponentOps & SubGridOps>, sheet: Sheet) {
    super(opts);
    this.sheet = sheet;
  }
}

export class ComputedTextOps extends FullComponentOps {
  type: string = Constants.ComputedText;
  expr?: string;
}

export class ListFieldOps extends FullComponentOps {
  type: string = Constants.ListField;
  itemTemplate?: ComponentOps[];
}

export class SelectFieldOps extends FullComponentOps {
  type: string = Constants.SelectField
  options?: string[];
  value?: string | number;
}

export class CheckboxFieldOps extends FullComponentOps {
  type: string = Constants.CheckboxField;
}
