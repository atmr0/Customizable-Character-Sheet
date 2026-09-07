<script lang="ts">
  // import { buildGrid } from "../../Scripts/GridBuilder";
  import { type ComponentOps, type Sheet, componentsMap} from "../../Scripts/ComponentsMap";
  export let sheet: any;
  let built: Sheet = sheet;
  // $: built = buildGrid(sheet) || {};

  function gridStyle() {
    let columns = built.columnBased
      ? built.numberOfLines || 1
      : built.lineLength || 1;
    let rows = built.columnBased
      ? built.lineLength || 1
      : built.numberOfLines || 1;

    let style = `grid-template-columns: repeat(${columns}, 1fr); `;
    if (built.numberOfLines)
      style += `grid-template-rows: repeat(${rows}, 1fr);`;
    return style;
  }

  function cellGridStyle(cell: ComponentOps) {
    let style: string;

    let colspan = cell.colspan || 1;
    let rowspan = cell.rowSpan || 1;
    style = `grid-row: ${cell.row} / span ${rowspan}; grid-column: ${cell.col} / span ${colspan}`;
    return style;
  }

  function innerStyleTag(cell: ComponentOps) {
    if (!cell.style) return "";
    const cid = `#cell-${cell.id}`;
    let css = cid + ` {\n`;
    for (const sel in cell.style) {
      const rules = cell.style[sel];
      if (typeof rules === "string") {
        css += `${sel}: ${rules};\n`;
        continue;
      }
      // ensure selector starts with . or # or element; default to class
      const selector = sel.match(/^[.#]/) ? sel : `.${sel}`;
      css += `${selector} { `;
      for (const k in rules) {
        css += `${k}: ${rules[k]}; `;
      }
      css += `}\n`;
    }
    css += `}\n`;
    return css;
  }
</script>

{#if built}
  <div class="grid" style={gridStyle()}>
    {#each built.components as cell}
      <div
        class="sheet-cell"
        style={cellGridStyle(cell)}
        id="cell-{cell.id}"
      >
        {@html innerStyleTag(cell)
          ? `<style>${innerStyleTag(cell)}</style>`
          : ""}
        {#if componentsMap[cell.type]}
          <svelte:component this={componentsMap[cell.type]} {...cell} />
        {:else}
          <div>Unknown component: {cell && cell.type}</div>
        {/if}
      </div>
    {/each}
  </div>
{/if}
