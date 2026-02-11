<script>
  import BaseComponent from './BaseComponent.svelte';
  import { valuesStore } from '../valuesStore.js';
  import { evaluateExpression } from '../utils/compute.js';
  import { Constants } from '../constants.js';
  export let expr = ''; // expression string, e.g. "player_strength % 10"
  export let label = undefined;
  export let format = v => v; // optional formatter
  let componentClass = Constants.ComputedText;
  let computed = '';

  $: $valuesStore; // ensure reactive dependency
  $: if(expr){
    try{
      const val = evaluateExpression(expr, $valuesStore || {});
      computed = val === null || val === undefined ? '' : String(val);
    }catch(e){ computed = '' }
  } else {
    computed = '';
  }
</script>

<BaseComponent {label} {componentClass}>
  <div class="computed-text">{format(computed)}</div>
</BaseComponent>