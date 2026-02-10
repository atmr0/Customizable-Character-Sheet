import TextField from "./TextField.svelte";
import StaticText from "./StaticText.svelte";
import SubGrid from "./SubGrid.svelte";

/**
 * Build a sheet structure mapping cell type names to Svelte component constructors
 * and collecting props for each cell. Returns a shallow-copied sheet with
 * `Component` and `props` fields added to every cell.
 */
export function buildGrid(sheet: any) {
  const componentsMap: Record<string, any> = {
    TextField: TextField,
    StaticText: StaticText,
    SubGrid: SubGrid,
    // lowercase aliases
    textfield: TextField,
    statictext: StaticText,
    subgrid: SubGrid,
  };

  function resolveComponent(type: string) {
    if (!type) return null;
    let a = componentsMap[type] || componentsMap[type.toLowerCase()] || null;
    console.log(`Resolving component for type "${type}":`, a);
    return a;
  }

  // shallow copy sheet and map cells
  const out = { ...sheet, cells: [] as any[] };
  for (const row of sheet.cells || []) {
    const newRow: any[] = [];
    for (const cell of row || []) {
      const type = cell.type || cell.component || cell.componentName;
      const Component = resolveComponent(type);

      
      newRow.push({ ...cell, Component, props: cell });
    }
    out.cells.push(newRow);
  }

  return out;
}
