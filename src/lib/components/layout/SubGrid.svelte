<script>
  import { BaseComponent, RenderGrid } from "../componentsIndex.js";
  export let sheet = { rows: 0, cols: 1, cells: [] };
  export let label = undefined;
  export let noBackground = true;
</script>

<BaseComponent {label} {noBackground}>
  <div class="sub-grid-wrapper" role="group" aria-label="Sub grid">
    <RenderGrid {sheet} />
  </div>
</BaseComponent>
