<script>
  import { BaseComponent } from "@ui/components/index.js";

  export let text = "";
  export let component;
  let noBackground = true;
</script>

<BaseComponent {noBackground} {component}>
  <div class="static-text">{text}</div>
</BaseComponent>
