<script>
  import BaseComponent from "./BaseComponent.svelte";
  import Grid from "./Grid.svelte";
  export let sheet = { rows: 0, cols: 1, cells: [] };
  export let label = undefined;
  export let noBackground = false;
</script>

<BaseComponent {label} {noBackground}>
  <div class="sub-grid-wrapper" role="group" aria-label="Sub grid">
    <Grid {sheet} />
  </div>
</BaseComponent>
