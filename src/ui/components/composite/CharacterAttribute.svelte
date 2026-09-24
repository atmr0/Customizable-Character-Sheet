<!--TODO: adapt to receive a component prop instead of individual props -->

<script>
  import {
    BaseComponent,
    InputField,
    ComputedText,
  } from "@ui/components/index.js";
  import { Constants } from "@core/constants.ts";

  export let component;
  let label = component.label;
  let value;
  function onInput(e) {
    value = e.target.value;
    component.setValue(value);
  }

  let modificator;

</script>

<BaseComponent {component} showLabel={false}>
  <div class={Constants.CharacterAttribute}>
    {#if label}
      <div class="label">{label}</div>
    {/if}
    <InputField onInput={onInput} component={component.input} />
    <ComputedText
      component={component.mod}
      bind:this={modificator}
    />
  </div>
</BaseComponent>
