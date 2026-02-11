
import { componentsMap } from './ComponentsMap';
export function buildGrid(sheet: any) {

  function resolveComponent(type: string) {
    if (!type) return null;
    let a = componentsMap[type] || componentsMap[type.toLowerCase()] || null;
    return a;
  }

  // shallow copy sheet and map cells
  const out = { ...sheet, cells: [] as any[] };
  for (const row of sheet.cells || []) {
    const newRow: any[] = [];
    for (const cell of row || []) {
      const type = cell.type;
      const Component = resolveComponent(type);

      
      newRow.push({ ...cell, Component, props: cell });
    }
    out.cells.push(newRow);
  }

  return out;
}
