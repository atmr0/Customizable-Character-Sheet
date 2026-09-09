<!--
  Some of this code was AI generated. I don't understand very much why the __rowId, but it works. Differently of just row.id.
-->

<script lang="ts">
  import { onMount } from "svelte";
  import { BaseComponent, SubGrid } from "../componentsIndex";
  import { valuesStore, setValue } from "../../valuesStore";
  import type { ComponentOps } from "../../Scripts/ComponentsMap";
  import { get } from "svelte/store";

  let localComponentsMap: Record<string, any> = {};

  export let id: string | undefined;
  export let label: string | undefined;
  export let itemTemplate: ComponentOps[] = [];
  export let itemWidth:number = 1;
  export let items: ComponentOps[][] = [];
  export let editable: boolean = true;
  export let onadd: ((row: ComponentOps[], all: ComponentOps[][]) => void) | undefined = undefined;
  export let onremove: ((removed: ComponentOps[] | null, rowId: string, all: ComponentOps[][]) => void) | undefined = undefined;

  onMount(() => {
    const store = get(valuesStore);
    if (id && !store[id] && items && items.length) {
      setValue(id, items);
    }
    (async () => {
      try {
        const mod = await import("../../Scripts/ComponentsMap");
        localComponentsMap = mod.componentsMap || {};
      } catch (err) {
        console.warn("Failed to load components map dynamically", err);
        localComponentsMap = {};
      }
    })();
  });

  $: storeItems = id ? $valuesStore[id] || [] : items; // TODO change it to something better

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
    const i = current.length;
    const newRow:Sheet = {... itemTemplate}
    newRow.id = ensureRowId(newRow, i).__rowId
    newRow.components = itemTemplate.components.map((template, j) => {
      const clone: ComponentOps = { ...(template || {}) };
      clone.id = clone.id ?? `${id ?? 'list'}-item-${i}-${j}`;
      return clone;
    });
    (newRow as any).__rowId = `row-${nextRowId++}-${i}`;
    const next = [...current, newRow];
    if (id) setValue(id, next);
    else items = next;
    onadd?.(newRow, next);
  }

  function removeItem(rowId: string) {
    if (!editable) return;
    const current = storeItems || [];
    const next = current.filter((r: any) => r.__rowId !== rowId);
    if (id) setValue(id, next);
    else items = next;
    //                                                                                  dd/mm/yyyy
    // i dont really know why i did this before, maybe ill findout in the future (today 08/09/2026)
    // const removed = current.find((r: any) => r.__rowId === rowId) || null;
    // onremove?.(removed, rowId, next);
  }
</script>

<BaseComponent {id} {label}>
  <div class="list-field">
    <ul class="list-all-items" >
      {#each rows as row, i (row.__rowId)}
      {console.log(row, i)}
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
