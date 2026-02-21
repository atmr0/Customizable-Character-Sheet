<script lang="ts">
  import { BaseComponent } from "../componentsIndex.js";
  import { setValue, valuesStore } from "../../valuesStore.js";
  import { evaluateExpression } from "../../utils/compute.js";
  import { Constants } from "../../constants";

  export let expr = ""; // expression string, e.g. "player_strength % 10"
  export let label = undefined;
  export let format = (v) => v; // optional formatter
  export let id: string | undefined = undefined;
  let componentClass = Constants.ComputedText;
  let computed = "";
  let lastValue = ""
  $: $valuesStore; // ensure reactive dependency
  $: if (expr) {
    try {
      const val = evaluateExpression(expr, $valuesStore || {});
      computed = val === null || val === undefined ? "" : val;
      if (id && computed !== lastValue) {
        setValue(id, computed);
        lastValue = computed;
      }
    } catch (e) {
      computed = "";
    }
  } else {
    computed = "";
  }
</script>

<BaseComponent {id} {label} {componentClass}>
  <div
    class="computed-text"
  >{format(computed)}</div>
</BaseComponent>
