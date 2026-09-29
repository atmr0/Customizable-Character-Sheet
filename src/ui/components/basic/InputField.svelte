<script lang="ts">
  import { BaseComponent } from "@ui/components/index.js";

  import { updateValueStore, valuesStore } from "@core/valuesStore";
  import { Constants } from "@core/constants";
  import { onMount } from "svelte";
  import { get } from "svelte/store";
  import { InputField } from "@builder/components";
  import Decimal from "decimal.js";

  export let component: InputField | undefined = undefined;
  export let onInputExtra: Function;
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

    if (onInputExtra) {
      onInputExtra(e.target.value);
    }
  }

  function handleKeyDown(e: KeyboardEvent) {
    if (!component) return;
    if (inputType !== "number") return;
    if (e.key !== "ArrowUp" && e.key !== "ArrowDown") return;

    e.preventDefault();

    // If I use just a normal number, there will be some IEEE754 shenaningans
    let stepVal = new Decimal("1");
    if (component && component.step != "any")
      stepVal = new Decimal(component.step);

    if (e.shiftKey && component.allowFloat)
      stepVal = stepVal.div(new Decimal(10));

    let cur = value === "" || value === undefined ? 0 : (Number(value) ?? 0);

    const delta = e.key === "ArrowUp" ? stepVal : -stepVal;
    const next = new Decimal(cur).add(delta).toNumber();

    value = component.value;
    component.setValue(next);
    onInputExtra(next);
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
    onkeydown={handleKeyDown}
    {placeholder}
    oninput={handleInput}
    class={Constants.InputField}
    type={inputType === "number" ? "number" : "text"}
    {step}
    {min}
    {max}
  />
</BaseComponent>
