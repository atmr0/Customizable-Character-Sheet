<script>
  import BaseComponent from "./BaseComponent.svelte";
  import { Constants } from "../constants.js";
  export let text = "";
  export let label = undefined;
  export let onclick = undefined;
  let componentClass = Constants.StaticText;
  let noBackground = true;
</script>

<BaseComponent {noBackground} {componentClass}>
  <div class="static-text">{text}</div>
</BaseComponent>
