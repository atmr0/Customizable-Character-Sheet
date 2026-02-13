<script lang="ts">
  import BaseComponent from "./BaseComponent.svelte";
  import { valuesStore, setValue } from "../valuesStore.js";

  export let id: string | undefined;
  export let label: string | undefined;
  export let checked: boolean = false;
  export let disabled: boolean = false;
  export let onchange = undefined;

  // initialize store value
  if (id) setValue(id, checked);

  $: storeVal = id ? ($valuesStore[id] ?? checked) : checked;

  function onChange(e) {
    const v = e.target.checked;
    checked = v;
    if (id) setValue(id, v);
    onchange?.(v, e);
  }
</script>

<BaseComponent {id} componentClass="checkbox-field">
  <div class="checkbox-wrapper">
    <input
      type="checkbox"
      class="checkbox-input"
      {id}
      bind:checked
      on:change={onChange}
      {disabled}
      aria-checked={checked}
    />
    <label for={id}>
      <span class="outer-box">
        <div class="tick_mark"></div>
      </span>
      <span class="label-text">Exemplo de texto</span>
    </label>
  </div>
</BaseComponent>
