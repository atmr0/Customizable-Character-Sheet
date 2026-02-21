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

// full set of properties for a component (single source of truth)
export class FullComponentOps {
  type?: string;
  id?: string;
  label?: string;
  primaryIndex?: number;
  secondaryIndex?: number;
  linespan?: number;
  crossLineSpan?: number;
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
  lineLength?: number;
  // use Partial<FullComponentOps> for the grid model
  lines?: Partial<FullComponentOps>[][];
  styles?: Record<string, any>;
  styleTag?: string;
  columnBased?: boolean;
  ignoreLineInLayout?: number[];
};

// concrete ops classes can extend FullComponentOps and provide defaults / specific props
export class InputFieldOps extends FullComponentOps {
  type: string = Constants.InputField;
  value?: string | number;
  placeholder?: string;
  inputType: string = 'text'; // 'text'|'number'
  allowFloat: boolean = false; // allow decimals when numeric
  step: number | string = this.allowFloat ? 'any' : 1;
  min: number | undefined = undefined;
  max: number | undefined = undefined;

  constructor(init?: Partial<FullComponentOps & InputFieldOps>) {
    super(init);
    Object.assign(this, init);
  }
}

export class StaticTextOps extends FullComponentOps {
  type: string = Constants.StaticText;
  text?: string;

  constructor(init?: Partial<FullComponentOps & StaticTextOps>) { super(init); Object.assign(this, init); }
}

export class SubGridOps extends FullComponentOps {
  type: string = Constants.SubGrid;
  sheet?: Sheet;

  constructor(init?: Partial<FullComponentOps & SubGridOps>) { super(init); Object.assign(this, init); }
}

export class ComputedTextOps extends FullComponentOps {
  type: string = Constants.ComputedText;
  expr?: string;

  constructor(init?: Partial<FullComponentOps & ComputedTextOps>) { super(init); Object.assign(this, init); }
}

export class ListFieldOps extends FullComponentOps {
  type: string = Constants.ListField;
  itemTemplate?: Partial<FullComponentOps>[];

  constructor(init?: Partial<FullComponentOps & ListFieldOps>) { super(init); Object.assign(this, init); }
}

export class SelectFieldOps extends FullComponentOps {
  type: string = Constants.SelectField
  options?: string[];
  value?: string | number;

  constructor(init?: Partial<FullComponentOps & SelectFieldOps>) { super(init); Object.assign(this, init); }
}

export class CheckboxFieldOps extends FullComponentOps {
  type: string = Constants.CheckboxField;

  constructor(init?: Partial<FullComponentOps & CheckboxFieldOps>) { super(init); Object.assign(this, init); }
}