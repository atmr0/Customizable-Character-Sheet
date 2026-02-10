import TextField from "./TextField.svelte";
import StaticText from "./StaticText.svelte";

/**
 * Build a sheet structure mapping cell type names to Svelte component constructors
 * and collecting props for each cell. Returns a shallow-copied sheet with
 * `Component` and `props` fields added to every cell.
 */
export function buildGrid(sheet: any) {
    const componentsMap: Record<string, any> = {
        TextField: TextField,
        statictext: StaticText,
    };

    function resolveComponent(type: string){
        if (!type) return null;
        let a = componentsMap[type] || componentsMap[type.toLowerCase()] || null;
        console.log(a)
        return a;
    }

    function cellProps(cell: any){
        const p: Record<string, any> = {};
        if (cell.label) p.label = cell.label;
        if (cell.text) p.text = cell.text;
        if (cell.value) p.value = cell.value;
        if (cell.placeholder) p.placeholder = cell.placeholder;
        if (cell.id) p.id = cell.id;
        return p;
    }

    // shallow copy sheet and map cells
    const out = { ...sheet, cells: [] as any[] };
    for (const row of sheet.cells || []){
        const newRow: any[] = [];
        for (const cell of row || []){
            const type = cell.type || cell.component || cell.componentName;
            const Component = resolveComponent(type);
            newRow.push({ ...cell, Component, props: cellProps(cell) });
        }
        out.cells.push(newRow);
    }

    return out;
}
