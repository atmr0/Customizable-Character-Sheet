import { Input } from 'postcss';
import { ComputedText, InputField, type ComponentOptions, } from './core/builder';
import SheetBuilder from './core/builder/SheetBuilder';
import { Constants } from './core/constants';
import { attributesColors } from './core/theme';
import { ItemList } from './core/builder/components/ItemList';

type colors = keyof typeof attributesColors;

const skillSpec: ComponentOptions[] = [
  { type: Constants.InputField, placeholder: 'Skill name', width: 3, value: '$2' },
  { type: Constants.ComputedText, expr: '$1', width: 1 },
];



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
    .characterAttribute({ id: 'int_attr', label: 'Intelligence', value: 10, col: 1, row: 6, })
    .characterAttribute({ id: 'wis_attr', label: 'Wisdom', value: 10, col: 1, row: 7, })
    .characterAttribute({ id: 'cha_attr', label: 'Charisma', value: 10, col: 1, row: 8, })
  )
  .withStyle({
    "--attr-focus-color": (cell: ComponentOptions) => attributesColors[cell.id as colors],
  })
  .section("talents", r => r
    .add({ type: Constants.CheckboxField, id: 'trainded', label: 'Trained', height: 1 })
    .itemList({
      id: 'skills', label: 'Skills', width: 2, height: 5, editable: true,
      itemTemplate: ItemList.buildTemplateFromSpec(skillSpec, ['cha_attr_mod + 2'],4, 
        (b) => b.withStyle({background:'red'})
      ),
      items: [
        ItemList.buildItemFromValues(['str_attr_mod + 5', 'Atletismo'])
      ]
    })
    .itemList({
      id: 'aaa', label: 'Skills', width: 2, height: 5, editable: true,
      itemTemplate: ItemList.buildTemplateFromSpec(skillSpec, ['cha_attr_mod + 2']),
      items: [
        ItemList.buildItemFromValues(['str_attr_mod + 5', 'Carismo'])
      ]
    })
  )
  .build();

// const mainSheet = new SheetBuilder().setRowLength(6).staticText({text: 'tchau'}).build()
export default mainSheet;
export { mainSheet };
