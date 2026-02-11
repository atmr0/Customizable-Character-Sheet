import SheetBuilder from './lib/Scripts/SheetBuilder';
import { background } from './lib/theme';

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
  .row(r => r
    .textField({ id: 'player_strength', label: 'Strength', placeholder: '0', colspan: 2 })
    .add({ type: 'ComputedText', id: 'strength_mod', label: 'Strength % 10', expr: 'player_strength % 10', colspan: 2 })
  )
  // .withStyle({ '*': { background: 'red' },
  // StaticText: { background: 'blue' } })
  .build();

// build the main sheet using the subSheet
const mainSheet = new SheetBuilder('Character Sheet')
  .id('test_sheet')
  .cols(6)
  .row(r => r.subGrid({ id: 'subgrid1', label: 'Informations', colspan: 6 }, subSheet))
  .build();

export default mainSheet;
export { mainSheet };
