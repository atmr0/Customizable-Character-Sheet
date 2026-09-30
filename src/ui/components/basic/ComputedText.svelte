<script lang="ts">
  import { BaseComponent } from "@ui/components/index.js";
  import { valuesStore } from "@core/valuesStore";
  import { ComputedText } from "@builder/components";
    import { Constants } from "@core/constants";

  export let component: ComputedText | undefined = undefined;
  let id: string | undefined;
  if(component) {
    id = component.id;
  }
  $: computed = "";
  $: if (component && component.expr) {
    try {
      const val = $valuesStore[""]; // it does nothing, only makes it so this block always stay updated
      computed = component.getValueFormatted();
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
    class={Constants.ComputedText}
  >{computed}</div>
</BaseComponent>
