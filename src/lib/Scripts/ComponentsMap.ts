import InputField from "../components/InputField.svelte";
import StaticText from "../components/StaticText.svelte";
import SubGrid from "../components/SubGrid.svelte";
import ComputedText from "../components/ComputedText.svelte";
import ListField from "../components/ListField.svelte";
import CharacterAttribute from "../components/CharacterAttribute.svelte";
import SelectField from "../components/SelectField.svelte";
import ImageField from "../components/ImageField.svelte";
import { Constants } from "../constants";


export const componentsMap: Record<string, any> = {
  [Constants.InputField]: InputField,
  [Constants.StaticText]: StaticText,
  [Constants.SubGrid]: SubGrid,
  [Constants.ComputedText]: ComputedText,
  [Constants.CharacterAttribute]: CharacterAttribute,
  [Constants.SelectField]: SelectField,
  [Constants.ListField]: ListField,
  [Constants.ImageField]: ImageField, // placeholder for future ImageField component
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

export class InputFieldOps extends ComponentOps{
  type: string = Constants.InputField;
  value?: string | number;
  placeholder?: string;
  inputType: string = 'text'; // 'text'|'number'
  allowFloat: boolean = false; // allow decimals when numeric
  step: number | string = this.allowFloat ? 'any' : 1;
  min: number | undefined = undefined;
  max: number | undefined = undefined;
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
  value?: string | number;
}