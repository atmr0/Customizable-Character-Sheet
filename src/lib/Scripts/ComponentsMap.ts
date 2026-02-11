import TextField from "../components/TextField.svelte";
import StaticText from "../components/StaticText.svelte";
import SubGrid from "../components/SubGrid.svelte";
import ComputedText from "../components/ComputedText.svelte";
import ListField from "../components/ListField.svelte";
import CharacterAttribute from "../components/CharacterAttribute.svelte";
import SelectField from "../components/SelectField.svelte";
import { Constants } from "../constants";


export const componentsMap: Record<string, any> = {
  [Constants.TextField]: TextField,
  [Constants.StaticText]: StaticText,
  [Constants.SubGrid]: SubGrid,
  [Constants.ComputedText]: ComputedText,
  [Constants.CharacterAttribute]: CharacterAttribute,
  [Constants.SelectField || 'SelectField']: SelectField,
  SelectField: SelectField,
  Select: SelectField,
  [Constants.ListField]: ListField,
};

export type Sheet = {
  title?: string;
  id?: string;
  rows?: number;
  cols?: number;
  cells: ComponentOps[][];
};

export class ComponentOps{
  type?: string;
  id?: string;
  label?: string;
  colspan?: number;
  rowspan?: number;

  [k: string]: any;
}

export class TextFieldOps extends ComponentOps{
  type: string = Constants.TextField;
  value?: any;
  placeholder?: string;
}

export class StaticTextOps extends ComponentOps{
  type: string = Constants.StaticText;
  text?: string;
}

export class SubGridOps extends ComponentOps{
  type: string = Constants.SubGrid;
  sheet?: Sheet;
}

export class ComputedTextOps extends ComponentOps{
  type: string = Constants.ComputedText;
  expr?: string;
}

export class ListFieldOps extends ComponentOps{
  type: string = Constants.ListField;
  itemTemplate?: Partial<ComponentOps>[];
}

export class SelectFieldOps extends ComponentOps{
  type: string = Constants.SelectField
  options?: string[];
  value?: any;
}