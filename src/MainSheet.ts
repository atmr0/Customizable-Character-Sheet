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
    .textField({ id: 'nested_static_2', label: 'Nested Static 2', colspan: 2 })
  )
  .build();

// build the main sheet using the subSheet
const mainSheet = new SheetBuilder('Character Sheet')
  .id('test_sheet')
  .cols(6)
  .row(r => r.subGrid({ id: 'subgrid1', label: 'Informations', colspan: 6 }, subSheet))
  .build();

export default mainSheet;
export { mainSheet };
