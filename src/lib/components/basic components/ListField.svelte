<script lang="ts">
  import { onMount } from "svelte";
  import { BaseComponent } from "../componentsIndex";
  import { valuesStore, setValue } from "../../valuesStore.js";
  import type { ComponentOps } from "../../Scripts/ComponentsMap";

  let localComponentsMap: Record<string, any> = {};


  export let id: string | undefined;
  export let label: string | undefined;
  export let itemTemplate: ComponentOps[];
  export let items: any[] = [];
  export let onadd = undefined;
  export let onremove = undefined;

  // // Initialize store value if missing
  // onMount(() => {
  //   if (id && !$valuesStore[id] && items && items.length) {
  //     setValue(id, items);
  //   }

  //   // load components map dynamically to avoid circular imports
  //   (async () => {
  //     const mod = await import("../../Scripts/ComponentsMap");
  //     localComponentsMap = mod.componentsMap || {};
  //   })();
  // });

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
      class="list-all-items"
      style="grid-template-columns: repeat({storeItems.length}, 1fr);"
    >
      {#each storeItems as it, i}
        <li class="list-item">
          {#each itemTemplate as tpl}
            {@const itemId = getIdItem(tpl, i)}
            <svelte:component this={localComponentsMap[tpl.type]} {...tpl} id={itemId} />
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