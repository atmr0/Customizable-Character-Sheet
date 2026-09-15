<script lang="ts">
  import { BaseComponent } from "@ui/components/index.js";
  import { setValue, valuesStore } from "@core/valuesStore";
  import { ComputedText } from "@builder/components";

  export let component: ComputedText | undefined = undefined;
  let id: string | undefined;
  if(component) {
    id = component.id;
  }
  let computed = "";
  let lastValue = ""
  $: $valuesStore;
  $: if (component && component.expr) {
    try {
      const val = component.evaluateExpression($valuesStore || {});
      computed = val === null || val === undefined ? "" : val;
      if (id && computed !== lastValue) {
        setValue(id, computed);
        lastValue = computed;
      }
    } catch (e) {
      console.error(e);
      computed = "";
    }
  } else {
    computed = "";
  }
</script>

<BaseComponent {component}>
  <div
    class="computed-text"
  >{component?.format(computed)}</div>
</BaseComponent>
