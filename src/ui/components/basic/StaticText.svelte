<script>
  import { BaseComponent } from "@ui/components/index.js";
  import { StaticText } from "@builder/components";

  export let text = "";
  export let component;
  let noBackground = true;
</script>

<BaseComponent {noBackground} {component}>
  <div class="static-text">{text}</div>
</BaseComponent>
