<script>
  import RenderGrid from "./lib/components/RenderGrid.svelte";
  import { styleTag } from "./lib/Scripts/SheetBuilder";
  // import sheet from './Sheet/sheet.json';
  import mainSheet from "./MainSheet";
  let sheet = mainSheet;
</script>

<main class="app">
  {@html `<style type="text/css">${styleTag}</style>`}
  <h1>Custom RPG Character Sheet</h1>
  <div class="main">
    <RenderGrid {sheet} />
  </div>
</main>
