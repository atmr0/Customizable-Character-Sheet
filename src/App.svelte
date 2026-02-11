<script>
  import CharacterAttribute from "./lib/components/CharacterAttribute.svelte";
  import Grid from "./lib/components/Grid.svelte";
  import ListField from "./lib/components/ListField.svelte";
  import TextField from "./lib/components/TextField.svelte";
  // import sheet from './Sheet/sheet.json';
  import mainSheet from "./MainSheet";
  let sheet = mainSheet;
</script>

<main class="app">
  <h1>Custom RPG Character Sheet</h1>
  <div class="main">
    <Grid {sheet} />
    
  </div>
</main>

<style>
  .app {
    padding: 24px;
    font-family:
      system-ui,
      -apple-system,
      "Segoe UI",
      Roboto,
      "Helvetica Neue",
      Arial;
    background: #f3f4f6;
    min-height: 100vh;
  }
  h1 {
    margin-bottom: 12px;
    color: #0b6efd;
  }
</style>
