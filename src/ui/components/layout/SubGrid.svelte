<script lang="ts">
  import { SubGrid } from "@builder/components";
  import RenderGrid from "./RenderGrid.svelte";
  export let component: SubGrid;
  export let sheet: any;

  sheet = component?.sheet ?? sheet;
</script>

{#if sheet}
  <RenderGrid sheet={sheet} />
{/if}
