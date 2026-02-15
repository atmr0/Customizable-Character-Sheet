<script>
  import {RenderGrid} from "./lib/components/componentsIndex";
  import sheetJson from "./Sheet/exported_sheet_json.json";
  import { mainSheet } from "./MainSheet";
    import SheetBuilder from "./lib/Scripts/SheetBuilder";
  let sheet = sheetJson;
  // let styleTag = sheet.styleTag || "";
  // console.log("style tag:", styleTag);
  // let sheet = mainSheet;
  let styleTag = sheet.styleTag || SheetBuilder.convertStyleObjToTag(sheet.styles || {});
  console.log(sheet.styles)
  console.log(styleTag)

  // console.log(JSON.stringify(sheet));
</script>

<main class="app">
  {@html `<style type="text/css">${styleTag || ""}</style>`}
  <h1>Custom RPG Character Sheet</h1>
  <div class="main">
    <RenderGrid {sheet} />
  </div>
</main>
