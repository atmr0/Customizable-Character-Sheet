<script lang="ts">
  import { buildGrid } from "./GridBuilder";
  // sheet: { rows, cols, cells: [ [cell...] ] }
  export let sheet: any;

  $: built = sheet ? buildGrid(sheet) : { cols: 1, cells: [] };
</script>

{#if built}
  <div class="sheet-grid" style={`grid-template-columns: repeat(${built.cols || 1}, 1fr);`}>
    {#each built.cells as row}
      {#each row as cell}
        <div class="sheet-cell" style={`grid-column: span ${cell.colspan || 1};`} data-id={cell.id}>
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
