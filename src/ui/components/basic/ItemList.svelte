<!--
  Some of this code was AI generated. I don't understand very much why the __rowId, but it works. Differently of just row.id.
-->

<script lang="ts">
  import { onMount } from "svelte";
  import { BaseComponent, SubGrid } from "@ui/components/index.js";
  import { valuesStore, setValue } from "../../../core/valuesStore";
  import { get } from "svelte/store";
  import type { ItemList, SheetSection } from "../../../core/builder";

  export let id: string | undefined;
  export let label: string | undefined;
  export let items: SheetSection[] = [];
  export let editable: boolean = true;
  export let teste:ItemList|undefined;
  onMount(() => {
    const store = get(valuesStore);
    if (id && !store[id] && items && items.length) {
      setValue(id, items);
    }
    (async () => {
      try {
        const mod = await import("../../../core/builder");
      } catch (err) {
        console.warn("Failed to load components map dynamically", err);
      }
    })();
  });

  $: storeItems = id ? $valuesStore[id] || [] : items;

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
    const newRow = teste!.buildItemFromValues()
    const next = [...current, newRow];
    if (id) setValue(id, next);
    else items = next;
  }

  function removeItem(rowId: string) {
    if (!editable) return;
    const current = storeItems || [];
    const next = current.filter((r: any) => r.__rowId !== rowId);
    if (id) setValue(id, next);
    else items = next;
  }
</script>

<BaseComponent {id} {label}>
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
