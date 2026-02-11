<script lang="ts">
  import { buildGrid } from "../Scripts/GridBuilder";

  export let sheet: any;
  export let withoutRows: boolean = false;
  $: built = sheet ? buildGrid(sheet) : { cols: 1, cells: [] };

  function gridStyle() {
    let style = `grid-template-columns: repeat(${built.cols || 1}, 1fr); `
    if(built.rows && !withoutRows) style += `grid-template-rows: repeat(${built.rows}, 1fr);`;
    return style;
  }

  function cellStyle(cell) {
    let style = ""
    for(const key in cell.style) {
      style += `${key}: ${cell.style[key]}; `;
    }
    return style;
  }
</script>

{#if built}
  <div class="grid" style= {gridStyle()}>
    {#each built.cells as row}
        {#each row as cell}
          <div
            class="sheet-cell"
            style={`${cellStyle(cell)} grid-column: span ${cell.colspan || 1}; grid-row: span ${cell.rowspan || 1};`}
            data-id={cell.id}
          >
            {#if cell.Component}
              <svelte:component this={cell.Component} {...cell.props} />
            {:else}
              <div>Unknown component: {cell.type}</div>
            {/if}
          </div>
        {/each}
    {/each}
  </div>
{/if}
