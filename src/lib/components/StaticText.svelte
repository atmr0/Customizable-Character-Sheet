<script>
  import BaseComponent from './BaseComponent.svelte';

  export let text = '';
  export let label = undefined;
  export let onclick = undefined;
</script>

<BaseComponent onclick={onclick}>
  <div>{text}</div>
</BaseComponent>
