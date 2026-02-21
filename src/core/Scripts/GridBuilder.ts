
import { type ComponentOps, componentsMap } from './ComponentsMap';
import { Sheet } from './ComponentsMap';

// Copies sheet and adds the actual Svelte component to each cell based on its type
// It creates a matrix representing the grid layout, for example: 
// [[c1, c1, c2], [c1, c1, c3]], containing the props and Svelte Component

// Maybe there's a better, more efficient way to do this. 
// But a character sheet is not going to be huge, so it doesn't matter that much.

export function buildGrid(sheet: Sheet) {

  if (!sheet.lines) return undefined;
  console.log(sheet.ignoreLineInLayout)
  let grid = [] as ComponentOps[][];
  let offset = 0;
  let startLine = 0;
  let startColumn = 0;

  for (let i = 0; i < (sheet.lines?.length || 1); i += 1) {
    const line = sheet.lines![i];
    startColumn = 0;
    if (grid.length < sheet.lines!.length)
      grid.push(new Array(sheet.lineLength).fill(undefined));

    for (let j = 0; j < line.length; j += 1) {
      const cell = sheet.lines?.[i]?.[j];
      if (!cell) continue

      while (grid[startLine][startColumn]) {
        startColumn += 1;
      }

      const Component = componentsMap[cell.type!] || null;
      sheet.lines![i][j] = { ...cell, Component, props: { ...cell }, primaryIndex: startLine + 1 - offset, secondaryIndex: startColumn + 1, };
      fillGrid(grid, startLine, startColumn, cell);
      startColumn += cell.linespan || 1;
    }
    if (sheet.ignoreLineInLayout?.includes(i)) {
      console.log("ignoring line in layout:", i);
      offset += 1;
    }
    startLine += 1;
  }

  return sheet;
}

function fillGrid(grid: ComponentOps[][], startLine: number, startColumn: number, cell: ComponentOps) {
  const lineSpan = cell.linespan || 1;
  const crossLineSpan = cell.crossLineSpan || 1;
  let firstFilled = false;
  for (let i = startLine; i < startLine + crossLineSpan; i += 1) {
    if (!grid[i]) grid.push(new Array(grid[0]?.length).fill(undefined));
    for (let j = startColumn; j < startColumn + lineSpan; j += 1) {
      // to reduce memory use and facilitate in RenderGrid, we only keep the full cell props in the first cell
      if (!firstFilled)
        firstFilled = true;
      else grid[i][j] = { 'id': cell.id, 'isPlaceholder': true };
    }
  }
}
