import { CharacterAttribute, CheckboxField, ComputedText, ImageField, InputField, ItemList, RollButton, SelectField, StaticText, SubGrid } from './components';
import { Sheet } from './components/Sheet';
import { Constants } from '@core/constants';

export function testFunction(t: any) {
  if(!t.type) throw Error("Component type is not defined");
  switch(t.type) {
    case Constants.CharacterAttribute:
      return new CharacterAttribute({...t});
    case Constants.CheckboxField:
      return new CheckboxField({...t});
    case Constants.ComputedText:
      return new ComputedText({...t});
    case Constants.ImageField:
      return new ImageField({...t});
    case Constants.InputField:
      return new InputField({...t});
    case Constants.ItemList:
      return new ItemList({...t});
    case Constants.SelectField:
      return new SelectField({...t});
    case Constants.StaticText:
      return new StaticText({...t});
    case Constants.SubGrid:
      // using only new SubGrid(...) does not work when exporting data
      return Object.assign(new SubGrid({},{} as Sheet), t);
    case Constants.RollButton:
      return new RollButton({...t});
    default:
      throw Error(`Unknown component type: ${t.type}`);
  }
}