<script lang="ts">
  import { BaseComponent } from "@ui/components/index.js";
  import { updateValueStore, valuesStore } from "@core/valuesStore";
  import { type ComponentOptions } from "@builder/components";
  import { onMount } from "svelte";

  export let disabled: boolean = false;
  export let component: ComponentOptions;
  let id: string | undefined;
  let label: string | undefined;
  let checked: boolean = false;
  onMount(() => {
    id = component.id;
    label = component.label;
    checked = component.getValue() ?? false;
    if(id) updateValueStore(id, checked);
  });

  $: if (id) {
    const storeVal = $valuesStore[id];
    if (storeVal !== undefined && storeVal !== checked) {
      checked = !!storeVal;
    }
  }

  $: inputId = id ? `${id}_cb` : undefined;
  function onChange(e: any) {
    const v = e.target.checked;
    checked = !v;
    component.setValue(checked)
  }
</script>

<BaseComponent {component}>
  <div class="checkbox-wrapper">
    <label class="checkbox-root" for={inputId}>
      <input
        id={inputId}
        type="checkbox"
        class="checkbox-input"
        bind:checked
        on:change={onChange}
        {disabled}
        aria-checked={checked}
      />
      <span class="outer-box">
        <div class="tick_mark"></div>
      </span>
      <span class="label-text">{label}</span>
    </label>
  </div>
</BaseComponent>
