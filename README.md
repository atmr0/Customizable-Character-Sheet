# Custom RPG Character Sheet

Running / Previewing
- Install dependencies and run the dev server:

```bash
npm install
npm run dev
```

## For contributors
Despite it being designed so you clone it and make your sheet to your game. Please, don't forget to submit suggestions and improvements to this repository. Some suggestions of things to improve upon and other TODOs are at the end.

## Why this project exists?
Firstly, for my own enjoyment. Secondly, it has some cool features. Maybe there is a site I don't know that has everything I made here, but I'm very confident that it will be subscription based.

The two main reasons are: 
1. GitHub integration. You can clone it, create a github page, and send it to your friends. It won't be necessary to download the sheet so the players can use it. They can update their sheets, everything will be tracked by github.
2. Customization. You can create any RPG sheet you want easily. And you, as the master, can even set different themes for each player, or class, or whatever.

## Documentation

The project is divided into Svelte components (mostly UI) and TypeScript (TS) components, where data is processed and saved to the `valuesStore`.

Currently the project contains the following components:

#### Layout components
- **Sheet**: the base for everything. It stores all components and styles. Components are organized in cells (a grid) — although the grid layout itself is not stored in the `Sheet`. `Sheet` is responsible for importing and exporting its data.
- **SubGrid**: basically a `Sheet` used to subdivide a cell into another grid.

#### Simple components
- **BaseComponent**: the generic component that others inherit from. It has common attributes such as `id`, `type`, `label`, position and dimensions. It receives an obj
- **CheckboxField**: a simple checkbox.
- **ComputedText**: non-interactive text that computes an expression based on other components' values.
- **ImageField**: set an image and zoom it.
- **InputField**: a simple input (string or numeric).
- **SelectField**: select one option from a list (like radio).
- **StaticText**: static text.

#### Composite components
- **CharacterAttribute**: contains a numeric `InputField` and a `ComputedText` (modifier).
- **ItemList**: a flexible component that manages multiple other components based on a template you provide. It uses a `SubGrid` to create items. For example, you can make a template with `InputField`, `ComputedText`, `StaticText` and `CheckboxField`, and all created items will have the same fields.

#### Other files related to the sheet
- `OrganizingGrid.ts`: helper for the `SheetBuilder` to avoid overlapping components; it allows not specifying every component position by tracking the first empty cell (left-to-right, top-to-bottom).
- `componentsMap.ts`: an index for Svelte components; a legacy artifact that could be merged with other index files.
- `SheetStyler`: responsible for storing and managing sections and custom styles. *A section is a virtual division (not a subgrid); it only serves styling purposes.*


### SheetBuilder
`SheetBuilder.ts` is the recommended way to construct a sheet. As the name suggests, it follows (more or less) the builder design pattern.

It stores the sheet, `OrganizingGrid` and `SheetStyler`.

Methods
- `add`: creates and rehydrates components and adds them to the sheet.
  - Note: the rehydration step was AI-generated. It is necessary so component methods are available. When a plain object is passed as a constructor parameter (e.g. `{ key: value, key2: value2 }`) and `Object.assign` is used, prototype methods are not preserved; rehydration restores them.
- `(componentName)`: calls `add` with the corresponding component.
- `id`: sets the id for the next component.
- `lines`: sets the number of lines. It helps with the appearance of the CSS grid, although it doesn't limit the number of lines.
- `startSection`: begins a section.
- `endSection`: ends the current section.
- `section`: an alternative if you don't want to use `startSection` / `endSection`; it is more compact and better indented.
- `withComponentStyle`: applies style to the last component added.
- `withSectionStyle`: applies style to the last section.
- `withSheetStyle`: applies style to the current sheet; it does not matter where it is called.
- `withStyle`: applies style depending on where it is called. If called immediately after adding a component, it applies to that component; if called after a section, it applies to the section.
  - These methods are proxies to the `SheetStyler` methods.
- `build`: returns the sheet.

### Styling
It uses CSS for styling. All CSS is stored in theme.js. This is so we are able to edit and visualize everything, in real time, in the side menu text editor.

### Ways to create a new component
You can create a new class component in typescript, and its corresponding svelte component.
You can create a subgrid. And you can create an ItemList
For example, the CharacterAttribute could easily be an ItemList. But currently (24/09/2026), but it would be a bit more complicated for styling it.

## Things to improve upon
- The file organization
- Normalizing file and class names.
- Maybe find a way to simplify a little bit the HTML. For example, everything is wrapped in a \[something]-wrapper. I don't really remember why, but it bothers me a bit.
- If someone really is motivated, it would be awesome to change from CSS to a canvas, or whatever. It would open a lot more of customization possibilities, such as add texture to things, like an old paper border. If this is possible with CSS, pardon my ignorance lol.
- A better, more computationally efficient, RNG animation. I thought about making only one set of items and make their locations loop around, instead of creating multiple copies. But idk.

## TODO
- Create a login page
- Save the styles for each player, as mentioned at the beginning.