<script lang="ts">
  import BaseComponent from "./BaseComponent.svelte";
  import { RollButton } from "@builder/components";
  import { eventGlobal } from "@ui/eventGlobal.svelte.js";
  import ComputedText from "./ComputedText.svelte";
  import { Constants } from "@core/constants";
  import { onMount } from "svelte";

  let {component, values} = $props();
  let textComponent: HTMLElement;
  onMount(() => {
    textComponent = document.getElementById(component?.id + 'rolledValue') as HTMLElement;
    textComponent.style.visibility = "hidden";
  });
  $effect(() => {
    if (eventGlobal.message == component?.id + " done") {
      textComponent.innerText = component?.rolledValue ?? "";
      textComponent.style.visibility = "visible";
    }
  });

  function handleClick() {
    if (!component || !component.id) return;
    component.roll();
    eventGlobal.send(component.rng, component.id);
    textComponent.style.visibility = "hidden";
  }

</script>

<BaseComponent {component}>
  <div class={Constants.RollButton}>
    <button on:click={handleClick}>Roll</button>
    <span class="rolledValue" id={component?.id + 'rolledValue'}></span>
  </div>
</BaseComponent>
