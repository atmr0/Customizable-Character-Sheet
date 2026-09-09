<script>
  import {RenderGrid} from "./ui";
  import { mainSheet } from "./MainSheet";
  // import SheetBuilder from "@builder/SheetBuilder";
  import { applyTheme } from "@core/theme";
  import ThemeConfiguration from "./configurations/ThemeConfiguration.svelte";
  import exportSheet from './Sheet/exportSheet';
  import { importSheetFromFile } from './Sheet/importSheet';
  import { valuesStore } from '@core/valuesStore';
  // let sheet = sheetJson;
  // let styleTag = sheet.styleTag || "";
  let sheet = mainSheet;
  let styleTag = sheet.styleTag ;
  let sheetKey = 0;
  applyTheme()

  import { get } from 'svelte/store';
  async function handleExport() {
    const currentValues = get(valuesStore);
    const res = await exportSheet(sheet, 'sheet.json', { values: currentValues });
    if (res.success) {
      // In Node path will be provided; in browser download is triggered
      alert('Export concluído' + (res.path ? `: ${res.path}` : '.'));
    } else {
      alert('Erro ao exportar: ' + res.error);
    }
  }

  let fileInput = null;
  function openFilePicker() {
    if (fileInput) fileInput.click();
  }

  async function handleFileChange(e) {
    const input = e.target;
    const f = input.files && input.files[0];
    if (!f) return;
    const res = await importSheetFromFile(f);
    if (res.success) {
      sheet = res.sheet;
      styleTag = sheet.styleTag || '';
      // restore values if present, otherwise reset so components set initial values on mount
      if (sheet.values && typeof sheet.values === 'object') {
        valuesStore.set(sheet.values);
      } else {
        valuesStore.set({});
      }
      // reapply theme in case imported sheet has different styles
      applyTheme();
      sheetKey += 1;
      alert('Sheet importada com sucesso.');
    } else {
      alert('Erro ao importar: ' + res.error);
    }
    // reset input so same file can be chosen again if needed
    input.value = '';
  }
</script>

<ThemeConfiguration />
<main class="app">
  {@html `<style type="text/css">${styleTag || ""}</style>`}
  <div class="app-header">
    <h1>Custom RPG Character Sheet</h1>
  </div>
  <div class="main">
    <div class="sheet-controls">
      <button on:click={handleExport} title="Exportar sheet como JSON">Exportar Sheet</button>
      <button on:click={openFilePicker} title="Importar sheet a partir de arquivo JSON">Importar Sheet</button>
      <input bind:this={fileInput} type="file" accept="application/json,.json" on:change={handleFileChange} style="display:none" />
    </div>
    {#key sheetKey}
      <RenderGrid {sheet} />
    {/key}
  </div>

</main>
