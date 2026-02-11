import TextField from "../components/TextField.svelte";
import StaticText from "../components/StaticText.svelte";
import SubGrid from "../components/SubGrid.svelte";
import ComputedText from "../components/ComputedText.svelte";
import ListField from "../components/ListField.svelte";
import CharacterAttribute from "../components/CharacterAttribute.svelte";


export const componentsMap: Record<string, any> = {
  TextField: TextField,
  StaticText: StaticText,
  SubGrid: SubGrid,
  ComputedText: ComputedText,
  CharacterAttribute: CharacterAttribute,
  ListField: ListField,
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
  type: string = 'TextField';
  value?: any;
  placeholder?: string;
}

export class StaticTextOps extends ComponentOps{
  type: string = 'StaticText';
  text?: string;
}

export class SubGridOps extends ComponentOps{
  type: string = 'SubGrid';
  sheet?: Sheet;
}

export class ComputedTextOps extends ComponentOps{
  type: string = 'ComputedText';
  expr?: string;
}