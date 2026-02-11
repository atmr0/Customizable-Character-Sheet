<script lang="ts">
  import BaseComponent from "./BaseComponent.svelte";
  import { setValue } from "../valuesStore.js";
  import { Constants } from "../constants.js";

  let cell: any; // TODO: type
  export let value: any = "";
  export let label: string | undefined;
  export let placeholder: string = "";
  export let id: string;
  let componentClass = Constants.InputField;
  
  // input mode/type controls
  export let inputType: string = 'text'; // 'text'|'number'
  export let allowFloat: boolean = false; // allow decimals when numeric
  export let step: number | string = allowFloat ? 'any' : 1;
  export let min: number | undefined = undefined;
  export let max: number | undefined = undefined;
  // callbacks
  export let oninput = undefined;

  function parseNumeric(raw) {
    if (raw === '' || raw === null || raw === undefined) return '';
    // replace comma with dot for locales
    const normalized = String(raw).replace(',', '.');
    const num = allowFloat ? Number(normalized) : parseInt(normalized, 10);
    return isNaN(num) ? '' : num;
  }

  function handleInput(e) {
    const raw = e.target.value;
    if (inputType === 'number') {
      const parsed = parseNumeric(raw);
      value = parsed;
      if (id) setValue(id, parsed);
    } else {
      value = raw;
      if (id) setValue(id, value);
    }
    oninput?.(e);
  }

  if (id) setValue(id, value);
</script>

<BaseComponent {id} {label} {componentClass}>
  <input
    {id}
    bind:value
    {placeholder}
    oninput={handleInput}
    class="text-input"
    type={inputType === 'number' ? 'number' : 'text'}
    {step}
    {min}
    {max}
  />
</BaseComponent>
