<script lang="ts">
  import RenderGrid from "./RenderGrid.svelte";
  export let sheet;
</script>

{#if sheet}
  <RenderGrid {sheet} />
{/if}
