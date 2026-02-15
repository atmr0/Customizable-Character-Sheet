<script lang="ts">
  import { buildGrid } from "../../Scripts/GridBuilder";
  import { type Sheet } from "../../Scripts/ComponentsMap";
  export let sheet: any;
  let built: Sheet;
  $: built = sheet ? buildGrid(sheet) : { cols: 1, rows: [], styles: {} };

  function gridStyle() {
    let style = `grid-template-columns: repeat(${built.cols || 1}, 1fr); `;
    if (built.numberOfRows)
      style += `grid-template-rows: repeat(${built.numberOfRows}, 1fr);`;
    return style;
  }

  function innerStyleTag(cell) {
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
    {#each built.rows as row, rowIndex}
      <div class="row" id={`${sheet.id}-row-${rowIndex + 1}`}>
        {#each row as cell}
          <div
            class="sheet-cell"
            style={` grid-column: span ${cell.colspan || 1}; grid-row: span ${cell.rowspan || 1};`}
            id="cell-{cell.id}"
          >
            {@html innerStyleTag(cell)
              ? `<style>${innerStyleTag(cell)}</style>`
              : ""}
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
