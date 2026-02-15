<script lang="ts">
  import { buildGrid } from "../../Scripts/GridBuilder";
  import {type Sheet} from "../../Scripts/ComponentsMap";
  export let sheet: any;
  let built: Sheet;
  $: built = sheet ? buildGrid(sheet) : { cols: 1, rows: [] };

  function gridStyle() {
    let style = `grid-template-columns: repeat(${built.cols || 1}, 1fr); `
    if(built.numberOfRows) style += `grid-template-rows: repeat(${built.numberOfRows}, 1fr);`;
    return style;
  }  

</script>

{#if built}
  <div class="grid" style= {gridStyle()}>
    {#each built.rows as row, rowIndex}
      <div class="row" id="{`${sheet.id}-row-${rowIndex + 1}`}">
        {#each row as cell}
          <div
            class="sheet-cell"
            style={` grid-column: span ${cell.colspan || 1}; grid-row: span ${cell.rowspan || 1};`}
            id="cell-{cell.id}"
          >
            {#if cell.Component}
              <svelte:component this={cell.Component} {...cell.props} />
            {:else}
              <div>Unknown component: {cell.type}</div>
            {/if}
          </div>
        {/each}
      </div>
    {/each}
  </div>
{/if}
