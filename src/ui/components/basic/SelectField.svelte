<script lang="ts">
  import { BaseComponent } from "@ui/components/index.js";
  import { setValue } from "@core/valuesStore";
  import { SelectField } from "@builder/components";

  export let component: SelectField | undefined;
  let id: string | undefined = component?.id;
  let value:string|undefined = component?.value;
  function handleChange(e: any) {
    if (!component) return;
    component.value = e.target.value;
    value = component.value;
    if (id) setValue(id, component.value);
  }
  if (id) setValue(id, component?.value);
</script>

<BaseComponent {component}>
  <select class="select-input" bind:value on:change={handleChange}>
    {#if component?.placeholder}
      <option value="">{component.placeholder}</option>
    {/if}
    {#each component?.options as opt}
      <option value={opt}>{opt}</option>
    {/each}
  </select>
</BaseComponent>
