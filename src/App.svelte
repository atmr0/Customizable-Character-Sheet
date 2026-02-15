<script>
  import {RenderGrid} from "./lib/components/componentsIndex";
  import mainSheet from "./MainSheet";
  import { styleTag } from "./lib/Scripts/SheetBuilder";
  let sheet = mainSheet;
  // console.log(JSON.stringify(sheet));
</script>

<main class="app">
  <!-- {@html `<style type="text/css">${styleTag}</style>`} -->
  <h1>Custom RPG Character Sheet</h1>
  <div class="main">
    <RenderGrid {sheet} />
  </div>
</main>
