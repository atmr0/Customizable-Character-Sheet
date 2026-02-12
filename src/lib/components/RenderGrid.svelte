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

  function innerStyleTag(cell) {
    if(!cell.styleInner) return '';
    let css = '';
    const cid = `cell-${cell.id}`;
    for(const sel in cell.styleInner) {
      const rules = cell.styleInner[sel];
      // ensure selector starts with . or # or element; default to class
      const selector = sel.match(/^[.#]/) ? sel : `.${sel}`;
      css += `#${cid} ${selector} { `;
      for(const k in rules) {
        css += `${k}: ${rules[k]}; `;
      }
      css += `}\n`;
    }
    return css;
  }
</script>

{#if built}
  <div class="grid" style= {gridStyle()}>
    {#each built.cells as row}
        {#each row as cell}
          <div
            class="sheet-cell"
            style={`grid-column: span ${cell.colspan || 1}; grid-row: span ${cell.rowspan || 1};`}
            id="cell-{cell.id}"
          >
            {@html innerStyleTag(cell) ? `<style>${innerStyleTag(cell)}</style>` : ''}
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
