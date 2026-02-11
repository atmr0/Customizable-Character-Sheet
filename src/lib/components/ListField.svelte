<script lang="ts">
  import BaseComponent from './BaseComponent.svelte';
  import { valuesStore, setValue } from '../valuesStore.js';
  import { onMount } from 'svelte';

  export let id: string | undefined;
  export let label: string | undefined;
  export let items: string[] = [];
  export let placeholder: string = 'New item';
  export let allowEmpty: boolean = false;
  export let onadd = undefined;
  export let onremove = undefined;

  let newItem = '';

  // Initialize store value if missing
  onMount(() => {
    if (id && !$valuesStore[id] && items && items.length) {
      setValue(id, items);
    }
  });

  $: storeItems = id ? ($valuesStore[id] || []) : items;

  function addItem() {
    const v = newItem.trim();
    if (!v && !allowEmpty) return;
    const next = [...(storeItems || []), v];
    if (id) setValue(id, next);
    newItem = '';
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
    <ul class="list-items">
      {#each storeItems as it, i}
        <li class="list-item">
          <span class="item-text">{it}</span>
          <button type="button" class="remove-btn" on:click={() => removeItem(i)}>×</button>
        </li>
      {/each}
    </ul>

    <div class="list-add">
      <input class="text-input" bind:value={newItem} placeholder={placeholder} on:keydown={(e) => e.key === 'Enter' && addItem()} />
      <button type="button" on:click={addItem}>Add</button>
    </div>
  </div>
</BaseComponent>

<style>
  .list-field { display:flex; flex-direction:column; gap:8px; }
  .list-items { list-style:none; margin:0; padding:0; display:flex; flex-direction:column; gap:6px; }
  .list-item { display:flex; align-items:center; justify-content:space-between; gap:8px; }
  .item-text{ flex:1; }
  .remove-btn { background:transparent; border:none; color:var(--text-secondary); font-size:1.2rem; cursor:pointer; }
  .list-add { display:flex; gap:8px; align-items:center; }
  .list-add button { padding:6px 10px; border-radius:6px; border:1px solid var(--border-color); background:var(--surface); }
</style>
