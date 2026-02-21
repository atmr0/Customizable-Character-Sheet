<script lang="ts">
  import { onMount } from "svelte";
  import { BaseComponent } from "../componentsIndex";
  import { valuesStore, setValue } from "../../valuesStore.js";
  import type { ComponentOps } from "../../Scripts/ComponentsMap";
  import { get } from "svelte/store";

  let localComponentsMap: Record<string, any> = {};

  export let id: string | undefined;
  export let label: string | undefined;
  export let itemTemplate: ComponentOps[];
  export let items: ComponentOps[] = [];
  export let editable: boolean = true;
  export let onadd = undefined;
  export let onremove = undefined;

  // Initialize store value if missing and load components map dynamically to avoid circular imports
  onMount(() => {
    if (id && !$valuesStore[id] && items && items.length) {
      setValue(id, items);
    }

    (async () => {
      try {
        const mod = await import("../../Scripts/ComponentsMap");
        localComponentsMap = mod.componentsMap || {};
      } catch (err) {
        // if dynamic import fails, leave map empty — template will guard render
        console.warn("Failed to load components map dynamically", err);
        localComponentsMap = {};
      }
    })();
  });

  $: storeItems = id ? $valuesStore[id] || [] : items;

  function addItem() {
    if (!editable) return;
    const v = "";
    const next = [...(storeItems || []), v];
    if (id) setValue(id, next);
    onadd?.(v, next);
  }

  function removeItem(index: number) {
    if (!editable) return;
    const next = [...(storeItems || [])];
    const removed = next.splice(index, 1)[0];
    if (id) setValue(id, next);
    onremove?.(removed, index, next);
  }

  function getIdItem(tpl: ComponentOps, i: number, j: number) {
    if(i<items.length && items[i][j].id) return items[i][j].id;
    let answer = `${id}`;
    if (tpl.id) answer += `-${tpl.id}-${i}`;
    else {
      let tLabel = tpl.label
        ? tpl.label.replace(/\s+/g, "_").toLowerCase()
        : "item";
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
          {#each itemTemplate as tpl, j}
            {@const itemId = getIdItem(tpl, i, j)}
            {@const itemProp = i<items.length ? items[i][j] : tpl}
            {#if localComponentsMap && localComponentsMap[tpl.type]}
              <svelte:component
                this={localComponentsMap[tpl.type]}
                {...itemProp}
                id={itemId}
              />
            {/if}
          {/each}

          {#if editable}
            <button
              type="button"
              class="remove-btn"
              on:click={() => removeItem(i)}>×</button
            >
          {/if}
        </li>
      {/each}
    </ul>

    {#if editable}
      <div class="list-add">
        <button type="button" on:click={addItem}>Add</button>
      </div>
    {/if}
  </div>
</BaseComponent>
