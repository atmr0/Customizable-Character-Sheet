<script lang="ts">
  import BaseComponent from "./BaseComponent.svelte";
  import { valuesStore, setValue } from "../valuesStore.js";

  export let id: string | undefined;
  export let label: string | undefined;
  export let checked: boolean = false;
  export let disabled: boolean = false;
  export let onchange = undefined;

  if (id) setValue(id, checked);

  $: storeVal = id ? ($valuesStore[id] ?? checked) : checked;
  $: inputId = id ? `${id}_cb` : undefined;
  function onChange(e) {
    const v = e.target.checked;
    checked = v;
    if (id) setValue(id, v);
    onchange?.(v, e);
  }
</script>

<!-- 
INSPIRED BY Himalaiya Singh's Code Pen:
https://codepen.io/singhimalaya/pen/dBJBMO

Access in 02/2026
-->

<BaseComponent {id} componentClass="checkbox-field">
  <div class="checkbox-wrapper">
    <label class="checkbox-root" for={inputId}>
      <input
        id={inputId}
        type="checkbox"
        class="checkbox-input"
        bind:checked
        on:change={onChange}
        {disabled}
        aria-checked={checked}
      />
      <span class="outer-box">
        <div class="tick_mark"></div>
      </span>
      <span class="label-text">{label}</span>
    </label>
  </div>
</BaseComponent>
