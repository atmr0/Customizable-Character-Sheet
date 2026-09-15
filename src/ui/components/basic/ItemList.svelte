<!--
  Some of this code was AI generated. I don't understand very much why the __rowId, but it works. Differently of just row.id.
-->

<script lang="ts">
  import { onMount } from "svelte";
  import { BaseComponent, SubGrid } from "@ui/components/index.js";
  import { valuesStore, setValue } from "@core/valuesStore";
  import { get } from "svelte/store";
  import type { ItemList, SheetSection } from "@builder/components";

  export let component:ItemList|undefined;
  let id: string | undefined = component?.id;
  $: editable = component?.editable ?? true;
  onMount(() => {
    const store = get(valuesStore);
    if(!component) return;
    if (id && !store[id] && component.items && component.items.length) {
      setValue(id, component.items);
    }
    // (async () => {
    //   try {
    //     const mod = await import("@builder/components");
    //   } catch (err) {
    //     console.warn("Failed to load components map dynamically", err);
    //   }
    // })();
  });

  $: storeItems = id ? $valuesStore[id] || [] : component?.items ;

  let nextRowId = 1;

  function ensureRowId(row: any, idx: number) {
    if (!row) return row;
    if (!row.__rowId) row.__rowId = `row-${nextRowId++}-${idx}`;
    return row;
  }

  $: rows = (storeItems || []).map((r: any, idx: number) => ensureRowId(r, idx));

  function addItem() {
    if (!editable) return;
    const current = storeItems || [];
    const newRow = component!.addItem()
    const next = [...current, newRow];
    if (id) setValue(id, next);
    else component!.items = next;
  }

  function removeItem(rowId: string) {
    if (!editable) return;
    const current = storeItems || [];
    const next = current.filter((r: any) => r.__rowId !== rowId);
    if (id) setValue(id, next);
    else component!.items = next;
  }
</script>

<BaseComponent {component}>
  <div class="list-field">
      <ul class="list-all-items" >
      {#each rows as row, i (row.__rowId)}
        <li class="list-item">
          <SubGrid sheet={row}  ></SubGrid>
          {#if editable}
            <button
              type="button"
              class="remove-btn"
              on:click={() => removeItem(row.__rowId)}>×</button>
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
