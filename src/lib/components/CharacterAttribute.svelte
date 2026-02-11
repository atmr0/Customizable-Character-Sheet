<script>
  import BaseComponent from "./BaseComponent.svelte";
  import { setValue, valuesStore } from "../valuesStore.js";
  import { evaluateExpression } from "../utils/compute.js";
  import TextField from "./TextField.svelte";
  import ComputedText from "./ComputedText.svelte";

  export let id;
  export let label;
  export let value = "";
  export let placeholder = "";
  export let attributeKey; // chave para armazenar no valuesStore

  let idField = id ? `${id}_field` : undefined;
  let idComputed = id ? `${id}_computed` : undefined;
  // atualiza store quando o campo muda
  function onInput(e) {
    value = e.target.value;
    if (id) setValue(id, Number(value));
  }

  // calcula dinamicamente a expressão com os valores do store
  $: $valuesStore;
</script>

<BaseComponent {id}>
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
    <ComputedText expr="{id} % 10" id={idComputed} />
  </div>
</BaseComponent>
