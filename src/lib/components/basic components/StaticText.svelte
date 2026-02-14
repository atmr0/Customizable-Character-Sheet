<script>
  import { BaseComponent } from "../componentsIndex.js";
  import { Constants } from "../../constants.ts";

  export let text = "";
  let componentClass = Constants.StaticText;
  let noBackground = true;
</script>

<BaseComponent {noBackground} {componentClass}>
  <div class="static-text">{text}</div>
</BaseComponent>
