<script lang="ts">
  import {
    type ComponentOptions,
    type Sheet,
    componentsMap,
  } from "@builder";
  export let sheet: Sheet;

  function gridStyle() {
    let columns = sheet.rowLength;
    let rows = sheet.numberOfLines;

    let style = `grid-template-columns: repeat(${columns}, 1fr); `;
    if (sheet.numberOfLines)
      style += `grid-template-rows: repeat(${rows}, 1fr);`;
    return style;
  }

  function cellGridStyle(cell: ComponentOptions) {
    let colspan = cell.width || 1;
    let rowspan = cell.height || 1;
    return `grid-row: ${cell.row} / span ${rowspan}; grid-column: ${cell.col} / span ${colspan}`;
  }
</script>

{#if sheet}
  {@html `<style type="text/css">${sheet.styleTag || ""}</style>`}
  <div id={sheet.id} class="grid" style={gridStyle()}>
    {#each sheet.components as cell}
      <div class="sheet-cell" style={cellGridStyle(cell)} id="cell-{cell.id}">
        {#if componentsMap[cell.type!]}
          <svelte:component this={componentsMap[cell.type!]} {...cell} />
        {:else}
          <div>Unknown component: {cell && cell.type}</div>
        {/if}
      </div>
    {/each}
  </div>
{/if}
