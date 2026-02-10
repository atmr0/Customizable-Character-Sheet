<script>
  import StaticText from './lib/components/StaticText.svelte';
  import TextField from './lib/components/TextField.svelte';
  import Grid from './lib/components/Grid.svelte';
  import sheet from './Sheet/sheet.json';
</script>
<main class="app">
  <h1>Custom RPG Character Sheet</h1>

  <Grid {sheet} />
  <TextField label="Example Text Field" placeholder="Type something..." />

</main>

<style>
  .app{
    padding:24px;
    font-family: system-ui, -apple-system, 'Segoe UI', Roboto, 'Helvetica Neue', Arial;
    background:#f3f4f6;
    min-height:100vh;
  }
  h1{ margin-bottom:12px; color:#0B6EFD; }
</style>
