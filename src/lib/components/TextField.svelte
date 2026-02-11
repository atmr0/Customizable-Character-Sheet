<script lang="ts">
  import BaseComponent from "./BaseComponent.svelte";
  import { makeUid } from "../utils/values.js";
   import { setValue } from '../valuesStore.js';

  let cell: any; // TODO: type
  export let value: string = "";
  export let label: string | undefined;
  export let placeholder: string = "";
  export let id: string = makeUid("text-field", cell?.id || "unknown");
  // callbacks
  export let oninput = undefined;
  function handleInput(e) {
    const raw = e.target.value;
    value = raw;
    oninput?.(e);
     // propagate to global values store when id is present
     if(id) setValue(id, value);
  }
</script>

<BaseComponent {id} {label}>
  <input
    id={id}
    bind:value={value}
    placeholder={placeholder}
    oninput={handleInput}
    class="text-input"
  />
</BaseComponent>
