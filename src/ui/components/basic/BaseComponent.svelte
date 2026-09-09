<script lang="ts">
  export let id: string | undefined;
  export let label: string | undefined = undefined;
  export let noBackground: boolean = true;
  export let componentClass = ''; 

  if(componentClass) componentClass = componentClass+"-wrapper";
</script>

<div
  class="base-component {noBackground ? 'no-bg' : ''} {componentClass}"
  {id}
  {...$$restProps}
>
  {#if label}
    <slot name="label"><div class="label">{label}</div></slot>
  {/if}
  <slot />
</div>
