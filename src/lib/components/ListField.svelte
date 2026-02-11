<script lang="ts">
  import BaseComponent from "./BaseComponent.svelte";
  import { valuesStore, setValue } from "../valuesStore.js";
  import { onMount } from "svelte";
  import { ComponentOps } from "../Scripts/ComponentsMap";
  import { componentsMap } from "../Scripts/ComponentsMap";
  
  export let id: string | undefined;
  export let label: string | undefined;
  export let itemTemplate: ComponentOps[];
  export let items: any[] = [];
  export let placeholder: string = "New item";
  export let allowEmpty: boolean = false;
  export let onadd = undefined;
  export let onremove = undefined;

  // Initialize store value if missing
  onMount(() => {
    if (id && !$valuesStore[id] && items && items.length) {
      setValue(id, items);
    }
  });

  $: storeItems = id ? $valuesStore[id] || [] : items;

  function addItem() {
    const v = "";
    const next = [...(storeItems || []), v];
    if (id) setValue(id, next);
    onadd?.(v, next);
  }

  function removeItem(index: number) {
    const next = [...(storeItems || [])];
    const removed = next.splice(index, 1)[0];
    if (id) setValue(id, next);
    onremove?.(removed, index, next);
  }
</script>

<BaseComponent {id} {label}>
  <div class="list-field">
    <ul class="list-items" style="grid-template-columns: repeat({storeItems.length}, 1fr);">
      {#each storeItems as it, i}
        <li class="list-item">
          {#each itemTemplate as tpl}
            {console.log(tpl.type, componentsMap[tpl.type])}
            {console.log(tpl.props)}
            {@const uid = `${id}-${i}-${tpl.id}`}
            <div class="item-field">
              {#if tpl.label}
                <label class="field-label" for={uid}>{tpl.label}</label>
              {/if}
              <svelte:component
              this={  componentsMap[tpl.type]}
              {...tpl.props}
              />
            </div>
          {/each}

          <button
            type="button"
            class="remove-btn"
            on:click={() => removeItem(i)}>×</button
          >
        </li>
      {/each}
    </ul>

    <div class="list-add">
      <button type="button" on:click={addItem}>Add</button>
    </div>
  </div>
</BaseComponent>

<style>
  .list-field {
    display: block;
    flex-direction: column;
    gap: 8px;
  }
  .list-items {
    list-style: none;
    margin: 0;
    padding: 0;
    display: flex;
    flex-direction: column;
    gap: 6px;
  }
  .list-item {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 8px;
  }
  .item-text {
    flex: 1;
  }
  .remove-btn {
    background: transparent;
    border: none;
    color: var(--text-secondary);
    font-size: 1.2rem;
    cursor: pointer;
  }
  .list-add {
    display: flex;
    gap: 8px;
    align-items: center;
  }
  .list-add button {
    padding: 6px 10px;
    border-radius: 6px;
    border: 1px solid var(--border-color);
    background: var(--surface);
  }
</style>
