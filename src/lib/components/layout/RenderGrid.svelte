<script lang="ts">
  import { buildGrid } from "../../Scripts/GridBuilder";
  import { ComponentOps, type Sheet } from "../../Scripts/ComponentsMap";
  export let sheet: any;
  let built: Sheet;
  $: built = sheet ? buildGrid(sheet) : {};
  console.log("built grid:", sheet);
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

  function cellGridStyle(cell) {
    let colspan = built.columnBased
      ? cell.crossLineSpan || 1
      : cell.linespan || 1;
    let rowspan = built.columnBased
      ? cell.linespan || 1
      : cell.crossLineSpan || 1;
    let style = "";
    style += `grid-row: span ${rowspan}; `;
    style += `grid-column: span ${colspan}; `;

    // console.log(cell.id, style);
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
    {#each built.lines as line, lineIndex}
      <div class="line" id={`${sheet.id}-line-${lineIndex + 1}`}>
        {#each line as cell}
          {@const cellC = cell as ComponentOps}
          <div
            class="sheet-cell"
            style={cellGridStyle(cellC)}
            id="cell-{cellC.id}"
          >
            {@html innerStyleTag(cellC)
              ? `<style>${innerStyleTag(cellC)}</style>`
              : ""}
            {#if cellC.Component}
              <svelte:component this={cellC.Component} {...cellC.props} />
            {:else}
              <div>Unknown component: {cell.type}</div>
            {/if}
          </div>
        {/each}
      </div>
    {/each}
  </div>
{/if}
