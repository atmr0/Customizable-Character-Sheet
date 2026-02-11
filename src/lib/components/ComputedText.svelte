<script>
  import BaseComponent from "./BaseComponent.svelte";
  export let text = '';
  export let label = undefined;
</script>

<BaseComponent {label}>
  <div class="computed-text">{text}</div>
</BaseComponent>