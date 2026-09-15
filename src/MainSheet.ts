import { Input } from 'postcss';
import { ComputedText, InputField, type ComponentOptions, BaseComponent } from './core/builder';
import SheetBuilder from './core/builder/SheetBuilder';
import { Constants } from './core/constants';
import { attributesColors } from './core/theme';
import { ItemList } from './core/builder/components/ItemList';

type colors = keyof typeof attributesColors;

const skillSpec: ComponentOptions[] = [
  new InputField({id:'skillName', placeholder: 'Skill name', width: 3, value: '$2' }),
  new ComputedText({expr: '$1', width: 1 }),
];



const mainSheet = new SheetBuilder('Character Sheet')
  .id('test_sheet')
  .setRowLength(6)
  // .section('information',(b) => b
  .subGrid({id:'informations',width:6}, 
    new SheetBuilder().setRowLength(6).id('informations')
    .InputField({ id: 'player_name', label: 'Player Name', placeholder: 'John Doe', width: 5 })
    .add(new BaseComponent({ type: 'ImageField', id: 'profile_picture', width: 1, height: 2 }))
    .InputField({ id: 'character_name', label: 'Character Name', placeholder: 'Gon Freecss', row:2, col:1,width: 3 })
    .selectField({ id: 'nen_type', label: 'Nen type', placeholder: 'Not discovered yet', options: ['Enhancer', 'Emitter', 'Manipulator', 'Transmuter', 'Conjurer', 'Specialist'], width: 2, row:2,col:4})
    .withSheetStyle({background: 'red'},Constants.InputField)
    .build()
  )
  .section("teste", b => b
    .characterAttribute({ id: 'str_attr', label: 'Strength', value: 10, col: 1, row: 3, })
    .characterAttribute({ id: 'dex_attr', label: 'Dexterity', value: 10, col: 1, row: 4, })
    .characterAttribute({ id: 'con_attr', label: 'Constitution', value: 10, col: 1, row: 5, })
    .characterAttribute({ id: 'int_attr', label: 'Intelligence', value: 10, col: 1, row: 6, })
    .characterAttribute({ id: 'wis_attr', label: 'Wisdom', value: 10, col: 1, row: 7, })
    .characterAttribute({ id: 'cha_attr', label: 'Charisma', value: 10, col: 1, row: 8, })
  )
  .withSectionStyle({
    "--attr-focus-color": (cell: ComponentOptions) => attributesColors[cell.id as colors],
  })
  .section("talents", r => r
    // .add(new BaseComponent({ type: Constants.CheckboxField, id: 'trainded', label: 'Trained', height: 1 }))
    .itemList({
        id: 'skills', label: 'Skills', width: 2, height: 5, editable: true,
      itemTemplate: ItemList.buildTemplateFromSpec('skills', skillSpec, ['cha_attr_mod + 2']),
      items: [
        ItemList.staticBuildItemFromValues(['str_attr_mod + 5', 'Atletismo'])
      ]
    })
    .itemList({
      id: 'aaa', label: 'Skills', width: 2, height: 5, editable: true,
      itemTemplate: ItemList.buildTemplateFromSpec('aaa', skillSpec, ['cha_attr_mod + 2']),
      items: [
        ItemList.staticBuildItemFromValues(['str_attr_mod + 5', 'Carismo'])
      ]
    })
  )
  .build();

export default mainSheet;
export { mainSheet };
