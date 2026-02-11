import SheetBuilder from './lib/Scripts/SheetBuilder';

// build the nested sub-sheet first
const subSheet = new SheetBuilder('Subgrid Sheet')
  .rows(2)
  .cols(10)
  .row(r => r
    .textField({ id: 'player_name', label: 'Player Name', placeholder: 'Enter player name', colspan: 8 })
    .textField({ id: 'profile_picture', label: 'Profile Picture', colspan: 2, rowspan: 2 })
  )
  .row(r => r
    .textField({ id: 'character_name', label: 'Character Name', colspan: 6 })
    .staticText({ id: 'nested_static_2', text: 'Nested Static 2', colspan: 2 })
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
  .build();

export default mainSheet;
export { mainSheet };
