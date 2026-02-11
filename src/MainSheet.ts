import SheetBuilder from './lib/Scripts/SheetBuilder';
import { Constants } from './lib/constants';
// build the nested sub-sheet first
const subSheet = new SheetBuilder('Subgrid Sheet')
  .rows(2)
  .cols(10)
  .row(r => r
    .InputField({ id: 'player_name', label: 'Player Name', placeholder: 'John Doe', colspan: 8 })
    .InputField({ id: 'profile_picture', label: 'Profile Picture', colspan: 2, rowspan: 2 })
  )
  .row(r => r
    .InputField({ id: 'character_name', label: 'Character Name', placeholder: 'Gon Freecss', colspan: 6 })
    .selectField({ id: 'nen_type', label: 'Nen type', placeholder: 'Not discovered yet', options: ['Enhancer', 'Emitter', 'Manipulator', 'Transmuter', 'Conjurer', 'Specialist'], colspan: 2 })
  )
  // .withStyle({ '*': { background: 'red' },
  // StaticText: { background: 'blue' } })
  .build();

// build the main sheet using the subSheet
const mainSheet = new SheetBuilder('Character Sheet')
  .id('test_sheet')
  .cols(6)
  .row(r => r.subGrid({ id: 'subgrid1', label: 'Informations', colspan: 6 }, subSheet))
  .row(r => r
    .characterAttribute({ id: 'str_attr', label: 'Strength', value: 10 })
    .characterAttribute({ id: 'dex_attr', label: 'Dexterity', value: 10 })
    .characterAttribute({ id: 'con_attr', label: 'Constitution', value: 10 })
    .characterAttribute({ id: 'int_attr', label: 'Intelligence', value: 10 })
    .characterAttribute({ id: 'wis_attr', label: 'Wisdom', value: 10 })
    .characterAttribute({ id: 'cha_attr', label: 'Charisma', value: 10 })
  )
  .row(r => r
    .listField({
      id: 'inventory', label: 'Inventory', colspan: 3, itemTemplate: [
        { type: Constants.InputField, label: 'Item Name', placeholder: 'Item name' },
        { type: Constants.InputField, label: 'Quantity', inputType: 'number', value: 0 }
      ]
    })
  )
  .build();

export default mainSheet;
export { mainSheet };
