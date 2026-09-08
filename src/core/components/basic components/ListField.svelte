<!--
  Some of this code was AI generated. I coded it a long time ago and didn't remember exactly how it worked, and how to fix a particular problem
-->

<script lang="ts">
  import { onMount } from "svelte";
  import { BaseComponent } from "../componentsIndex";
  import { valuesStore, setValue } from "../../valuesStore";
  import type { ComponentOps } from "../../Scripts/ComponentsMap";
  import { get } from "svelte/store";

  let localComponentsMap: Record<string, any> = {};

  export let id: string | undefined;
  export let label: string | undefined;
  export let itemTemplate: ComponentOps[] = [];
  export let items: ComponentOps[][] = [];
  export let editable: boolean = true;
  export let onadd: ((row: ComponentOps[], all: ComponentOps[][]) => void) | undefined = undefined;
  export let onremove: ((removed: ComponentOps[] | null, rowId: string, all: ComponentOps[][]) => void) | undefined = undefined;

  // Initialize store value if missing and load components map dynamically to avoid circular imports
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
        // if dynamic import fails, leave map empty — template will guard render
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

  $: columnsStyle = `grid-template-columns: repeat(${(rows && rows.length) || 1}, 1fr)`;

  function addItem() {
    if (!editable) return;
    const current = storeItems || [];
    const i = current.length;
    const newRow: ComponentOps[] = itemTemplate.map((tpl, j) => {
      const clone: ComponentOps = { ...(tpl || {}) };
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
    const removed = current.find((r: any) => r.__rowId === rowId) || null;
    if (id) setValue(id, next);
    else items = next;
    onremove?.(removed, rowId, next);
  }

  function ensureId(prefix = 'list-item') {
    return `${prefix}-${Math.random().toString(36).slice(2, 9)}`;
  }

  function getIdItem(row: any, tpl: ComponentOps, i: number, j: number) {
    if (row && row[j] && row[j].id) return row[j].id;
    const base = row && row.__rowId ? row.__rowId : `${id ?? 'list'}-${i}`;
    if (tpl.id) return `${base}-${tpl.id}`;
    if (tpl.label) return `${base}-${tpl.label.replace(/\s+/g, '_').toLowerCase()}`;
    return `${base}-${j}`;
  }
</script>

<BaseComponent {id} {label}>
  <div class="list-field">
    <ul class="list-all-items" style={columnsStyle}>
      {#each rows as row, i (row.__rowId)}
        <li class="list-item">
          {#each row as tpl, j}
            {@const itemId = getIdItem(row, tpl, i, j)}
            {@const itemProp = row[j] || tpl}
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
