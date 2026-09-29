<script lang="ts">
  import { BaseComponent } from "@ui/components/index.js";
  import { updateValueStore, valuesStore } from "@core/valuesStore";
  import { SelectField } from "@builder/components";
  import { Constants } from "@core/constants";

  export let component: SelectField;
  let id: string | undefined = component.id;
  let value:string|undefined = component.value;
  function handleChange(e: any) {
    component.setValue(e.target.value);
  }
  if (id) updateValueStore(id, component.value);

  $: if (id) {
    const storeVal = $valuesStore[id];
    if (storeVal !== undefined && storeVal !== value) {
      value = storeVal;
      if (component) component.value = storeVal;
    }
  }
</script>

<BaseComponent {component}>
  <select class={Constants.SelectField} bind:value on:change={handleChange} disabled={!component.editable}>
    {#if component.placeholder}
      <option value="">{component.placeholder}</option>
    {/if}
    {#each component.options as opt}
      <option value={opt}>{opt}</option>
    {/each}
  </select>
</BaseComponent>
