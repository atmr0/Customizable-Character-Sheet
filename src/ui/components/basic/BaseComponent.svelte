<script lang="ts">
  import { BaseComponent, type ComponentOptions } from "@builder/components";

  export let component: ComponentOptions | undefined = undefined;
  export let noBackground: boolean = true;
  export let showLabel: boolean = true;

  // export let onchange: ((event: any, value: any) => void)  = (event: any, value: any) => {
  //   if(id) setValue(id, value)
  // };

  let wrapperClass: string = component ? component.type + "-wrapper" : "";
  let id:string|undefined;
  let label: string|undefined;
  if(component) {
    id = component.id;
    label = component.label;
  }
</script>

<div
  class="base-component {noBackground ? 'no-bg' : ''} {wrapperClass}"
  id={component?.id ?? ''}
  {...$$restProps}
>
  {#if showLabel && label}
    <slot name="label"><div class="label">{label}</div></slot>
  {/if}
  <slot />
</div>
