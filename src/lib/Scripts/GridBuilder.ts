
import { Component } from 'svelte';
import { componentsMap } from './ComponentsMap';
import { Sheet } from './ComponentsMap';
export function buildGrid(sheet: Sheet) {

  // shallow copy sheet and map cells
  const out = { ...sheet, rows: [] as Component[][] };
  for (const row of sheet.rows || []) {
    const newRow: any[] = [];
    for (const cell of row || []) {
      const type = cell.type!;
      const Component = componentsMap[type] || null;
      newRow.push({ ...cell, Component, props: cell });
    }
    out.rows.push(newRow);
  }

  return out;
}
