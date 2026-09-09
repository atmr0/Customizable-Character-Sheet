<script>
  import { BaseComponent } from "@ui/components/index.js";
  import { Constants } from "@core/constants.ts";

  export let text = "";
  let componentClass = Constants.StaticText;
  let noBackground = true;
</script>

<BaseComponent {noBackground} {componentClass}>
  <div class="static-text">{text}</div>
</BaseComponent>
