<script>
  import BaseComponent from "./BaseComponent.svelte";
  import { setValue, valuesStore } from "../valuesStore.js";
  import ComputedText from "./ComputedText.svelte";
  import { Constants } from "../constants.js";
  export let id;
  export let label;
  export let value = "";
  export let placeholder = "";
  let componentClass = Constants.CharacterAttribute;

  let idField = id ? `${id}_field` : undefined;
  let idComputed = id ? `${id}_computed` : undefined;
  // atualiza store quando o campo muda
  function onInput(e) {
    value = e.target.value;
    if (id) setValue(id, Number(value));
  }
  if (id) setValue(id, Number(value));

  let format = v => {
    const num = Number(v);
    if (isNaN(num)) return '';;
    return num >= 0 ? `+${num}` : String(num);
  };

  // calcula dinamicamente a expressão com os valores do store
  $: $valuesStore;
</script>

<BaseComponent {id} {componentClass}>
  <div class="attribute">
    {#if label}
      <div class="label">{label}</div>
    {/if}
    <input
      {idField}
      bind:value
      {placeholder}
      oninput={onInput}
      class="text-input"
    />
    <ComputedText expr="{id} % 10" id={idComputed} {format} />
  </div>
</BaseComponent>
