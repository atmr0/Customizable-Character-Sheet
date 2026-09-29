<!--TODO: adapt to receive a component prop instead of individual props -->

<script>
  import {
    BaseComponent,
    InputField,
    ComputedText,
    RollButton,
  } from "@ui/components/index.js";
  import { Constants } from "@core/constants.ts";

  export let component;
  let label = component.label;
  let value;
  function onInput(v) {
    value = v;
    component.setValue(value);
  }

  let modificator;

</script>

<BaseComponent {component} showLabel={false}>
  <div class={Constants.CharacterAttribute}>
    {#if label}
      <div class="label">{label}</div>
    {/if}
    <InputField onInputExtra={onInput} component={component.input} />

    <div class="roll-area">
      <ComputedText
        component={component.mod}
        bind:this={modificator}
      />
      <RollButton component={component.button} />
    </div>
  </div>
</BaseComponent>
