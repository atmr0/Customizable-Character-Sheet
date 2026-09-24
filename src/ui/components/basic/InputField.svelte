<script lang="ts">
  import { BaseComponent } from "@ui/components/index.js";

  import { updateValueStore, valuesStore } from "@core/valuesStore";
  import { Constants } from "@core/constants";
  import { onMount } from "svelte";
  import { get } from "svelte/store";
  import { InputField } from "@builder/components";
  // input mode/type controls

  export let component: InputField | undefined = undefined;
  export let onInput:any;
  let id: string | undefined = component?.id;
  let placeholder: string | undefined = component?.placeholder;
  let inputType: string | undefined = component?.inputType;
  let step: number | string = component?.step ?? 0;
  let min: number | undefined = component?.min;
  let max: number | undefined = component?.max;

  let value: string | number | undefined = component?.value;
  

  function handleInput(e: any) {
    const raw = e.target.value;
    if (!component) return;
    component.setValue(raw);
  }
  onMount(() => {
    if (!id) return;
    if (get(valuesStore)[id] === undefined) updateValueStore(id, value);
  });

  $: if (id) {
    const storeVal = $valuesStore[id];
    if (storeVal !== undefined && storeVal !== value) {
      if (component) component.value = storeVal;
      value = storeVal;
    }
  }
</script>

<BaseComponent {component}>
  <input
    {id}
    bind:value
    {placeholder}
    oninput={(e) => { handleInput(e); if (onInput) onInput(e); }}
    class={Constants.InputField}
    type={inputType === "number" ? "number" : "text"}
    {step}
    {min}
    {max}
  />
</BaseComponent>
