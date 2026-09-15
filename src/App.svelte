<script>
  import {RenderGrid} from "./ui";
  import { mainSheet } from "./MainSheet";
  // import SheetBuilder from "@builder/SheetBuilder";
  import { applyTheme } from "@core/theme";
  import ThemeConfiguration from "./configurations/ThemeConfiguration.svelte";
  import { exportSheetModel, exportSheetData } from './Sheet/exportSheet';
  import { importSheetFromFile } from './Sheet/importSheet';
  import { SHEET_BASE, GIT_OWNER, GIT_REPO, GIT_BRANCH, GIT_TOKEN } from './config.js';
  import { valuesStore, setSheet} from '@core/valuesStore';
  import GitRepoManager from './core/GitRepoManager';
  import { get } from 'svelte/store';
  import { Sheet as SheetClass } from './core/builder/components/Sheet';
  
  let sheet = mainSheet;
  // rehydrate to class instance so helper methods like exportData exist
  if (sheet && typeof sheet.exportData !== 'function') {
    sheet = Object.assign(new SheetClass(), sheet);
  }
  setSheet(sheet);
  // let sheet = sheetJson;
  // let styleTag = sheet.styleTag || "";
  let styleTag = sheet.styleTag ;
  let sheetKey = 0;
  applyTheme()

  let a = typeof sheet.exportData === 'function' ? sheet.exportData() : {};
  async function handleExportModel() {
    const sheetId = sheet && sheet.id ? sheet.id : 'sheet';
    try {
      const res = await exportSheetModel(sheet, `${sheetId}_model.json`);
      if (res.success) {
        alert('Export do modelo concluído' + (res.path ? `: ${res.path}` : '.'));
      } else {
        alert('Erro ao exportar modelo: ' + res.error);
      }
    } catch (e) {
      alert('Erro ao exportar modelo: ' + (e?.message || String(e)));
    }
  }

  async function handleExportData() {
    const currentValues = get(valuesStore);
    if (!currentValues || !Object.keys(currentValues).length) return alert('Não há dados para exportar');
    const sheetId = sheet && sheet.id ? sheet.id : 'sheet';
    try {
      const res = await exportSheetData(sheet, `${sheetId}_data.json`);
      if (res.success) {
        alert('Export dos dados concluído' + (res.path ? `: ${res.path}` : '.'));
      } else {
        alert('Erro ao exportar dados: ' + res.error);
      }
    } catch (e) {
      alert('Erro ao exportar dados: ' + (e?.message || String(e)));
    }
  }

  let fileInput = null;
  function openFilePicker() {
    if (fileInput) fileInput.click();
  }
  
  const gitManager = new GitRepoManager({ owner: GIT_OWNER, repo: GIT_REPO, branch: GIT_BRANCH, token: GIT_TOKEN });
  let { owner: gitOwner, repo: gitRepo, branch: gitBranch, token: gitToken } = gitManager.getSettings();

  let saving = false;

  function saveSettings() {
    gitManager.saveSettings({ owner: gitOwner, repo: gitRepo, branch: gitBranch, token: gitToken });
    alert('Configurações salvas localmente (sessionStorage).');
  }

  async function saveToRepo() {
    if (!sheet) return alert('Sheet não definida');
    // Sync current form values into gitManager so saveSheet sees them
    gitManager.saveSettings({ owner: gitOwner, repo: gitRepo, branch: gitBranch, token: gitToken });
    saving = true;
    const path = SHEET_BASE || 'sheets/sheet.json';
    const currentValues = get(valuesStore);
    const contentObj = { ...(sheet || {}), values: currentValues };
    try {
      await gitManager.saveSheet(path, contentObj, `Update sheet ${path}`);
      alert('Salvo no repositório com sucesso.');
    } catch (e) {
      console.error(e);
      alert('Erro ao salvar: ' + (e?.message || String(e)));
    } finally {
      saving = false;
    }
  }

  async function handleFileChange(e) {
    const input = e.target;
    const f = input.files && input.files[0];
    if (!f) return;
    const res = await importSheetFromFile(f);
    if (!res.success) {
      alert('Erro ao importar: ' + res.error);
      input.value = '';
      return;
    }

    if (res.kind === 'model') {
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
      alert('Sheet (modelo) importado com sucesso.');
    } else if (res.kind === 'data') {
      // apply only values
      valuesStore.set(res.values || {});

      alert('Dados do sheet importados com sucesso.');
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
      <button on:click={handleExportModel} title="Exportar modelo do sheet">Exportar Modelo</button>
      <button on:click={handleExportData} title="Exportar dados do sheet">Exportar Dados</button>
      <button on:click={openFilePicker} title="Importar sheet a partir de arquivo JSON">Importar Sheet</button>
      <button on:click={saveToRepo} disabled={!gitOwner || !gitRepo || !gitToken || saving} title="Salvar sheet no repositório GitHub">{saving ? 'Salvando...' : 'Salvar no GitHub'}</button>
      <input bind:this={fileInput} type="file" accept="application/json,.json" on:change={handleFileChange} style="display:none" />

      <details>
        <summary>Configurações GitHub (opcional, para salvar)</summary>
        <label>Owner (usuário/org):
          <input type="text" bind:value={gitOwner} placeholder="github-username" />
        </label>
        <label>Repo:
          <input type="text" bind:value={gitRepo} placeholder="repo-name" />
        </label>
        <label>Branch:
          <input type="text" bind:value={gitBranch} placeholder="main" />
        </label>
        <label>Personal Access Token (coloque com escopo repo/public_repo):
          <input type="password" bind:value={gitToken} placeholder="ghp_xxx..." />
        </label>
        <button on:click={saveSettings}>Salvar configurações</button>
      </details>
    </div>
    {#key sheetKey}
      <RenderGrid {sheet} />
    {/key}
  </div>

</main>
