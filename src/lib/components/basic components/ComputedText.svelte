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
  $: $valuesStore; // ensure reactive dependency
  $: if (expr) {
    try {
      const val = evaluateExpression(expr, $valuesStore || {});
      computed = val === null || val === undefined ? "" : val;
    } catch (e) {
      computed = "";
    }
  } else {
    computed = "";
  }

  function onchange(e) {
    if (id) setValue(id, computed);
  }
</script>

<BaseComponent {id} {label} {componentClass}>
  <div
    class="computed-text"
    contenteditable="true"
    bind:innerText={computed}
  ></div>
</BaseComponent>
