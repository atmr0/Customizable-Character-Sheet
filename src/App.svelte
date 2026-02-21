<script>
  import {RenderGrid} from "./core/components/componentsIndex";
  import { mainSheet } from "./MainSheet";
  import SheetBuilder from "./core/Scripts/SheetBuilder";
  import { applyTheme } from "./core/theme";
  // let sheet = sheetJson;
  // let styleTag = sheet.styleTag || "";
  let sheet = mainSheet;
  let styleTag = sheet.styleTag || SheetBuilder.convertStyleObjToTag(sheet.styles || {});
  applyTheme()
</script>

<main class="app">
  {@html `<style type="text/css">${styleTag || ""}</style>`}
  <h1>Custom RPG Character Sheet</h1>
  <div class="main">
    <RenderGrid {sheet} />
  </div>
</main>
