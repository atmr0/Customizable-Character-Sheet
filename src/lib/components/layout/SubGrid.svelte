<script lang="ts">
  import { type  Sheet } from "../../Scripts/ComponentsMap.js";
  import { BaseComponent, RenderGrid } from "../componentsIndex.js";
  export let sheet: Sheet = {};
  export let label = undefined;
  export let noBackground = true;
  export let id;
</script>

<BaseComponent {id} {label} {noBackground}>
  <div class="sub-grid-wrapper" role="group" aria-label="Sub grid">
    <RenderGrid {sheet} />
  </div>
</BaseComponent>
