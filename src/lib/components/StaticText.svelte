<script>
  import BaseComponent from './BaseComponent.svelte';

  export let text = '';
  export let label = undefined;
  export let onclick = undefined;
  let noBackground = true; 
</script>

<BaseComponent {noBackground}>
  <div class="static-text">{text}</div>
</BaseComponent>
