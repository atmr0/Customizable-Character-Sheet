<!--
  Some of this code was AI generated. I don't understand very much why the __rowId, but it works. Differently of just row.id.
-->

<script lang="ts">
  import { onMount } from "svelte";
  import { BaseComponent, SubGrid } from "@ui/components/index.js";
  import { valuesStore, updateValueStore } from "@core/valuesStore";
  import { get } from "svelte/store";
  import type { ItemList, SheetSection } from "@builder/components";

  export let component:ItemList|undefined;
  let id: string | undefined = component?.id;
  onMount(() => {
    const store = get(valuesStore);
    if(!component) return;
    if (id && !store[id] && component.items && component.items.length) {
      updateValueStore(id, component.items);
    }
  });
  
  $: editable = component?.editable ?? true;
  $: rows = id ? $valuesStore[id] || [] : component?.items ;

  function addItem() {
    if(component) component.addItem()    
  }

  function removeItem(rowId: string) {
    if(component) component.removeItem(rowId);
  }
</script>

<BaseComponent {component}>
  <div class="list-field">
      <ul class="list-all-items" >
      {#each rows as row, i (row.id)}
        <li class="list-item">
          <SubGrid sheet={row}  ></SubGrid>
          {#if editable}
            <button
              type="button"
              class="remove-btn"
              on:click={() => removeItem(row.id)}>×</button>
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
