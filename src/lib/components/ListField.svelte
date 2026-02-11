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

  function getIdItem(tpl: ComponentOps, i: number) {
    let answer = `${id}`;
    if(tpl.id) answer += `-${tpl.id}-${i}`;
    else {
      let tLabel = tpl.label ? tpl.label.replace(/\s+/g, '_').toLowerCase() : 'item';
      answer += `-${tLabel}-${i}`;
    }
    return answer;
  }
</script>

<BaseComponent {id} {label}>
  <div class="list-field">
    <ul
      class="list-items"
      style="grid-template-columns: repeat({storeItems.length}, 1fr);"
    >
      {#each storeItems as it, i}
        <li class="list-item">
          {#each itemTemplate as tpl}
            {@const itemId = getIdItem(tpl, i)}
            <svelte:component this={componentsMap[tpl.type]} {...tpl} id={itemId} />
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