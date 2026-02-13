import { ComponentOps } from './lib/Scripts/ComponentsMap';
import SheetBuilder from './lib/Scripts/SheetBuilder';
import { Constants } from './lib/constants';
import { attributesColors } from './lib/theme';
// build the nested sub-sheet first
const subSheet = new SheetBuilder('Subgrid Sheet')
  .id('informations')
  .rows(2)
  .cols(6)
  .row(r => r
    .InputField({ id: 'player_name', label: 'Player Name', placeholder: 'John Doe', colspan: 5 })
    .add({ type: 'ImageField', id: 'profile_picture', colspan: 1, rowspan: 2 })
  )
  .row(r => r
    .InputField({ id: 'character_name', label: 'Character Name', placeholder: 'Gon Freecss', colspan: 3 })
    .selectField({ id: 'nen_type', label: 'Nen type', placeholder: 'Not discovered yet', options: ['Enhancer', 'Emitter', 'Manipulator', 'Transmuter', 'Conjurer', 'Specialist'], colspan: 2 })
  )
  // .withStyle({ '*': { background: 'red' },
  // StaticText: { background: 'blue' } })
  .build();


type keys = keyof typeof attributesColors;
// build the main sheet using the subSheet
const mainSheet = new SheetBuilder('Character Sheet')
  .id('test_sheet')
  .cols(6)
  .row(r => r.subGrid({ id: 'subgrid1', label: 'Informations', colspan: 6 }, subSheet))
  .row(r => r
    .characterAttribute({ id: 'str_attr', label: 'Strength', value: 10, focusColor: '#ef4444' })
    .characterAttribute({ id: 'dex_attr', label: 'Dexterity', value: 10, focusColor: '#0ea5e9' })
    .characterAttribute({ id: 'con_attr', label: 'Constitution', value: 10, focusColor: '#f59e0b' })
    .characterAttribute({ id: 'int_attr', label: 'Intelligence', value: 10, focusColor: '#8b5cf6' })
    .characterAttribute({ id: 'wis_attr', label: 'Wisdom', value: 10, focusColor: '#10b981' })
    .characterAttribute({ id: 'cha_attr', label: 'Charisma', value: 10, focusColor: '#ec4899' })
  )
  .withStyle({
    ".text-input:focus-within":
    {
      "border-color": (cell: ComponentOps) => attributesColors[cell.id as keys],
      "box-shadow": (cell: ComponentOps) => `0 0 0 2px ${attributesColors[cell.id as keys]}`,
      "border-width": '3px',
    },
  })
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
