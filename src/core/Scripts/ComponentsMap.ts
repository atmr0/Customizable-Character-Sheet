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
  itemTemplate?: ComponentOps[];
}

export class SelectField extends FullComponentOps {
  type: string = Constants.SelectField
  options?: string[];
  value?: string | number;
}

export class CheckboxField extends FullComponentOps {
  type: string = Constants.CheckboxField;
}
