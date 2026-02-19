
import { Component } from 'svelte';
import { componentsMap } from './ComponentsMap';
import { Sheet } from './ComponentsMap';


// Copies sheet and adds the actual Svelte component to each cell based on its type
// maybe there's a better way to do this
export function buildGrid(sheet: Sheet) {
  const out = { ...sheet, lines: [] as Component[][] };
  for (const row of sheet.lines || []) {
    const newRow: any[] = [];
    for (const cell of row || []) {
      const type = cell.type!;
      const Component = componentsMap[type] || null;
      newRow.push({ ...cell, Component, props: cell });
    }
    out.lines.push(newRow);
  }
  return out;
}
