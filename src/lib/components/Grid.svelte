<script lang="ts">
  import { buildGrid } from "./GridBuilder";
  // sheet: { rows, cols, cells: [ [cell...] ] }
  export let sheet: any;
  $: built = sheet ? buildGrid(sheet) : { cols: 1, cells: [] };

  function gridStyle() {
    let style = `grid-template-columns: repeat(${built.cols || 1}, 1fr); `
    if(built.rows) style += `grid-template-rows: repeat(${built.rows}, 1fr);`;
    return style;
  }
</script>

{#if built}
  <div class="grid" style= {gridStyle()}>
    {#each built.cells as row}
        {#each row as cell}
          <div
            class="sheet-cell"
            style={`grid-column: span ${cell.colspan || 1}; grid-row: span ${cell.rowspan || 1};`}
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
