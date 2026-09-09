<script>
  import { BaseComponent, ComputedText } from "@ui/components/index.js";
  import { setValue, valuesStore } from "@core/valuesStore";
  import { Constants } from "@core/constants.ts";
    import InputField from "../basic/InputField.svelte";
  export let id;
  export let label;
  export let value = "";
  export let placeholder = "";
  let componentClass = Constants.CharacterAttribute;

  let idField = id ? `${id}_field` : undefined;
  let idComputed = id ? `${id}_mod` : undefined;
  function onInput(e) {
    value = e.target.value;
    if (id) setValue(id, Number(value));
  }
  if (id) setValue(id, Number(value));

  let format = (v) => {
    const num = Number(v);
    if (isNaN(num)) return "";
    return num >= 0 ? `+${num}` : String(num);
  };

  let modificator;
  $: $valuesStore;
</script>

<BaseComponent {id} {componentClass}>
  <div class="character-attribute">
    {#if label}
      <div class="label">{label}</div>
    {/if}
    <InputField
      id={idField}
      bind:value
      {placeholder}
      oninput={onInput}
      class="input-field"
      inputType="number"
    />
    <ComputedText bind:this={modificator} expr="{id} % 10" id={idComputed} {format} />
  </div>
</BaseComponent>
