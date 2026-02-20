<script lang="ts">
  import { buildGrid } from "../../Scripts/GridBuilder";
  import { ComponentOps, type Sheet } from "../../Scripts/ComponentsMap";
  export let sheet: any;
  let built: Sheet;
  $: built = buildGrid(sheet) || {};
  console.log("AAAAAA", sheet.id);
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

  function cellGridStyle(cell: ComponentOps) {
    let style: string;
    if (built.columnBased) {
      console.log("yesyesyesyes");
      let colspan = cell.crossLineSpan || 1;
      let rowspan = cell.linespan || 1;
      style = `grid-row: ${cell.secondaryIndex} / span ${rowspan}; grid-column: ${cell.primaryIndex} / span ${colspan};`;
      return style
    }
    let colspan = cell.linespan || 1;
    let rowspan = cell.crossLineSpan || 1;
    style = `grid-row: ${cell.primaryIndex} / span ${rowspan}; grid-column: ${cell.secondaryIndex} / span ${colspan}`;
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
    {#each built.lines as line, lineIndex}
      <div class="line" id={`${sheet.id}-line-${lineIndex + 1}`}>
        {#each line as cell}
          {@const cellC = cell as ComponentOps}
          <!-- empty cell, do nothing -->
          {#if !cell.isPlaceholder}
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
          {/if}
        {/each}
      </div>
    {/each}
  </div>
{/if}
