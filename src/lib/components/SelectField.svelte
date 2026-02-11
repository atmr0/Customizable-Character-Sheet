<script lang="ts">
  import BaseComponent from "./BaseComponent.svelte";
  import { setValue } from "../valuesStore.js";

  export let id: string;
  export let label: string | undefined;
  export let options: Array<string> | Array<{ value: any; label: string }> = [];
  export let value: any = "";
  export let placeholder: string = "Select...";
  export let onchange = undefined;

  function handleChange(e) {
    value = e.target.value;
    onchange?.(e);
    if (id) setValue(id, value);
  }
  if (id) setValue(id, value);
</script>

<BaseComponent {id} {label} componentClass="select-field">
  <select class="select-input" bind:value on:change={handleChange}>
    {#if placeholder}
      <option value="">{placeholder}</option>
    {/if}
    {#each options as opt}
      <option value={opt}>{opt}</option>
    {/each}
  </select>
</BaseComponent>

<style>
  .select-input {
    width: 100%;
    box-sizing: border-box;
    padding: 6px;
    border: 1px solid var(--border-color);
    border-radius: 6px;
    background: var(--surface);
    font-size: 1rem;
  }
</style>
