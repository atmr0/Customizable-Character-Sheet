<!--TODO: adapt to receive a component prop instead of individual props -->

<script>
  import {
    BaseComponent,
    InputField,
    ComputedText,
  } from "@ui/components/index.js";
  import { setValue, valuesStore } from "@core/valuesStore";
  import { Constants } from "@core/constants.ts";
  import {
    BaseComponent as BC,
    InputField as IF,
    ComputedText as CT,
  } from "@core/builder/components";
  export let component;
  let id = component?.id;
  let label = component.label;
  let idField = id ? `${id}_field` : undefined;
  let idComputed = id ? `${id}_mod` : undefined;

  let inputComponent = new IF({ id: idField, inputType: "number", value: 10 });
  let computedComponent = new CT({ id: idComputed, expr: `${id} % 10` });
  let value;
  function onInput(e) {
    value = e.target.value;
    component.value = value;
    if (id) setValue(id, Number(value));
  }
  if (id) setValue(id, Number(value));
  component.value = value;

  let format = (v) => {
    const num = Number(v);
    if (isNaN(num)) return "";
    return num >= 0 ? `+${num}` : String(num);
  };
  let modificator;
  $: $valuesStore;
</script>

<BaseComponent {component} showLabel={false}>
  <div class={Constants.CharacterAttribute}>
    {#if label}
      <div class="label">{label}</div>
    {/if}
    <InputField onInput={onInput} component={inputComponent} />
    <ComputedText
      component={computedComponent}
      bind:this={modificator}
      {format}
    />
  </div>
</BaseComponent>
