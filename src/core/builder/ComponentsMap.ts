import InputFieldSvelte from "@ui/components/basic/InputField.svelte";
import StaticTextSvelte from "@ui/components/basic/StaticText.svelte";
import SubGridSvelte from "@ui/components/layout/SubGrid.svelte";
import ComputedTextSvelte from "@ui/components/basic/ComputedText.svelte";
import ItemListSvelte from "@ui/components/basic/ItemList.svelte";
import CharacterAttributeSvelte from "@ui/components/composite/CharacterAttribute.svelte";
import SelectFieldSvelte from "@ui/components/basic/SelectField.svelte";
import ImageFieldSvelte from "@ui/components/basic/ImageField.svelte";
import CheckboxFieldSvelte from "@ui/components/basic/CheckboxField.svelte";
import { Constants } from "../constants";



export const componentsMap: Record<string, any> = {
  [Constants.CharacterAttribute]: CharacterAttributeSvelte,
  [Constants.CheckboxField]: CheckboxFieldSvelte,
  [Constants.ComputedText]: ComputedTextSvelte,
  [Constants.ImageField]: ImageFieldSvelte,
  [Constants.InputField]: InputFieldSvelte,
  [Constants.ItemList]: ItemListSvelte,
  [Constants.SelectField]: SelectFieldSvelte,
  [Constants.StaticText]: StaticTextSvelte,
  [Constants.SubGrid]: SubGridSvelte,
};

export type ComponentMap = typeof componentsMap;

export const componentTypes = Object.freeze(Object.keys(componentsMap));

export default componentsMap;
