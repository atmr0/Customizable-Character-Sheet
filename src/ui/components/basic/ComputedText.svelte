<script lang="ts">
  import { BaseComponent } from "@ui/components/index.js";
  import { setValue, valuesStore } from "@core/valuesStore";
  import { evaluateExpression } from "@core/utils/compute.js";
  import { Constants } from "@core/constants";

  export let expr = "";
  export let label = undefined;
  export let format = (v) => v;
  export let id: string | undefined = undefined;
  let componentClass = Constants.ComputedText;
  let computed = "";
  let lastValue = ""
  $: $valuesStore;
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
