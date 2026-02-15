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

export type Sheet = {
  title?: string;
  id?: string;
  numberOfRows?: number;
  cols?: number;
  rows: ComponentOps[][];
  styles: Record<string, any>;
  styleTag?: string;
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

export class CheckboxFieldOps extends ComponentOps{
  type: string = Constants.CheckboxField
}