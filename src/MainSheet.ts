import { Input } from 'postcss';
import { ComputedText, InputField, type ComponentOps } from './core/Scripts/ComponentsMap';
import SheetBuilder from './core/Scripts/SheetBuilder';
import { Constants } from './core/constants';
import { attributesColors } from './core/theme';

type keys = keyof typeof attributesColors;
const mainSheet = new SheetBuilder('Character Sheet')
  .id('test_sheet')
  .setRowLength(6)
  .section("Informacoes", b => b
    .InputField({ id: 'player_name', label: 'Player Name', placeholder: 'John Doe', width: 5 })
    .add({ type: 'ImageField', id: 'profile_picture', width: 1, height: 2 })
    .InputField({ id: 'character_name', label: 'Character Name', placeholder: 'Gon Freecss', width: 3 })
    .selectField({ id: 'nen_type', label: 'Nen type', placeholder: 'Not discovered yet', options: ['Enhancer', 'Emitter', 'Manipulator', 'Transmuter', 'Conjurer', 'Specialist'], width: 2 })
  )
  .section("teste", b => b
    .characterAttribute({ id: 'str_attr', label: 'Strength', value: 10, col: 1, row: 3, })
    .characterAttribute({ id: 'dex_attr', label: 'Dexterity', value: 10, col: 1, row: 4, })
    .characterAttribute({ id: 'con_attr', label: 'Constitution', value: 10, col: 1, row: 5, })
  )
  .withStyle({
    "--attr-focus-color": (cell: ComponentOps) => attributesColors[cell.id as keys],
  })
  .subGrid({ id: 'grid_teste', height: 2 },
    new SheetBuilder('t')
      .setRowLength(3)
      .characterAttribute({ id: 'int_attr', label: 'Intelligence', value: 10, })
      .characterAttribute({ id: 'wis_attr', label: 'Wisdom', value: 10, })
      .characterAttribute({ id: 'cha_attr', label: 'Charisma', value: 10, })
      .build()
  )
  // )
  .section("talents", r => r
    .add({ type: Constants.CheckboxField, id: 'trainded', label: 'Trained', height: 1 })
    .listField({
      id: 'skills', label: 'Skills', width: 2,height:5, editable: true,
      itemTemplate: new SheetBuilder('template-list')
        .setRowLength(4)
        .InputField({ placeholder: 'Skill name', inputType: 'text', width: 3 })
        .computedText({ expr: "cha_attr_mod + 5" })
        .build()
      ,
      items: [
        // [
        //   new InputField({ id: 'teste', value: 'Athletics', inputType: 'text' }),
        //   new ComputedText({ expr: "cha_attr_mod + 5" })
        // ],
        // [
        //   new InputField({ value: 'Perception', inputType: 'text' }),
        //   new ComputedText({ expr: "cha_attr_mod + 5" })
        // ]
      ]
    })
  )
  .build();
//

// const mainSheet = new SheetBuilder().setRowLength(6).staticText({text: 'tchau'}).build()
export default mainSheet;
export { mainSheet };
