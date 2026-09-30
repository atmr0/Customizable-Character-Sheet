<script lang="ts">
  import { BaseComponent, type ComponentOptions } from "@builder/components";
  import { onMount } from "svelte";

  export let component: ComponentOptions | undefined = undefined;
  export let noBackground: boolean = true;
  export let showLabel: boolean = true;
  let wrapperClass: string = component ? component.type + "-wrapper" : "";
  let id: string | undefined;
  let label: string | undefined;
  onMount(() => {
    if (!component) throw new Error("Component is required");
    id = component.id;
    label = component.label;
  });
</script>

<div
  class="base-component {noBackground ? 'no-bg' : ''} wrapper"
  id={component?.id ?? ""}
  {...$$restProps}
>
  {#if showLabel && label}
    <slot name="label"><div class="label">{label}</div></slot>
  {/if}
  <slot />
</div>
