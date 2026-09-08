import { type ComponentOps } from './core/Scripts/ComponentsMap';
import SheetBuilder from './core/Scripts/SheetBuilder';
import { Constants } from './core/constants';
import { attributesColors } from './core/theme';
// build the nested sub-sheet first
const subSheet = new SheetBuilder('Subgrid Sheet')
  .id('informations')
  .setRowLength(6)
  // .columnBasedLayout()
  .withStyle({ background: 'red' })//StaticText: { background: 'blue' } }
  .InputField({ id: 'player_name', label: 'Player Name', placeholder: 'John Doe', width: 5 })
  .add({ type: 'ImageField', id: 'profile_picture', width: 1, height: 2 })
  .InputField({ id: 'character_name', label: 'Character Name', placeholder: 'Gon Freecss', width: 3 })
  .selectField({ id: 'nen_type', label: 'Nen type', placeholder: 'Not discovered yet', options: ['Enhancer', 'Emitter', 'Manipulator', 'Transmuter', 'Conjurer', 'Specialist'], width: 2 })
  .build();


type keys = keyof typeof attributesColors;
// build the main sheet using the subSheet
const mainSheet = new SheetBuilder('Character Sheet')
  .id('test_sheet')
  .setRowLength(6)
  .withStyle({
    ".character-attribute":
    {
      "--attr-focus-color": (cell: ComponentOps) => attributesColors[cell.id as keys],
    },
  })
  .subGrid({ id: 'subgrid1', label: 'Informations', width: 6 }, subSheet)
  // .line(r => r
  .characterAttribute({ id: 'str_attr', label: 'Strength', value: 10 })
  .characterAttribute({ id: 'dex_attr', label: 'Dexterity', value: 10 })
  .characterAttribute({ id: 'con_attr', label: 'Constitution', value: 10 })
  .characterAttribute({ id: 'int_attr', label: 'Intelligence', value: 10 })
  .characterAttribute({ id: 'wis_attr', label: 'Wisdom', value: 10 })
  .characterAttribute({ id: 'cha_attr', label: 'Charisma', value: 10})
  // )
  // .line(r => r
  //   .add({ type: Constants.CheckboxField, id: 'trainded', label: 'Trained', height: 1 })
  //   .listField({
  //     id: 'skills', label: 'Skills', height: 5, editable: true,
  //     itemTemplate: [
  //       { type: Constants.InputField, placeholder: 'Skill name', inputType: 'text' },
  //       { type: Constants.ComputedText, expr: "cha_attr_mod + 5" }
  //     ],
  //     items: [
  //       [
  //         { type: Constants.InputField, id: 'teste', value: 'Athletics', inputType: 'text' },
  //         { type: Constants.ComputedText, expr: "cha_attr_mod + 5" }
  //       ],
  //       [
  //         { type: Constants.InputField, value: 'Perception', inputType: 'text' },
  //         { type: Constants.ComputedText, expr: "cha_attr_mod + 5" }
  //       ]
  //     ]
  //   })
  // )
  .build();
//

// const mainSheet = new SheetBuilder().setRowLength(6).staticText({text: 'tchau'}).build()
export default mainSheet;
export { mainSheet };
