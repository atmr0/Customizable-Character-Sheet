<script lang="ts">
  import { BaseComponent } from "../componentsIndex.js";
  import { setValue } from "../../valuesStore.js";
  import { Constants } from "../../constants";


  export let id: string;
  export let label: string | undefined;
  export let options: Array<string> | Array<{ value: any; label: string }> = [];
  export let value: any = "";
  export let placeholder: string = "Select...";
  export let onchange = undefined;
  let componentClass = Constants.SelectField;
  function handleChange(e) {
    value = e.target.value;
    onchange?.(e);
    if (id) setValue(id, value);
  }
  if (id) setValue(id, value);
</script>

<BaseComponent {id} {label} {componentClass}>
  <select class="select-input" bind:value on:change={handleChange}>
    {#if placeholder}
      <option value="">{placeholder}</option>
    {/if}
    {#each options as opt}
      <option value={opt}>{opt}</option>
    {/each}
  </select>
</BaseComponent>
