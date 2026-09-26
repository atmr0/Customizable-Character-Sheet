<script lang="ts">
  import BaseComponent from "./BaseComponent.svelte";
  import { RollButton } from "@builder/components";
  import { eventGlobal } from "@ui/eventGlobal.svelte.js";
  import ComputedText from "./ComputedText.svelte";
  import { Constants } from "@core/constants";
  import { onMount } from "svelte";

  let {component, values} = $props();
  component = component as RollButton;
  let textComponent: any;
  onMount(() => {
    textComponent = document.getElementById(component!.rolledValue!.id!) as HTMLElement;
    textComponent.style.visibility = "hidden";
  });

  $effect(() => {
    if (eventGlobal.message == component?.id + " done") {
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
    <ComputedText component={component?.rolledValue} />
  </div>
</BaseComponent>

<style>
  button {
    margin-bottom: 0.5rem;
  }

  .RollButton {
    display: flex;
    flex-direction: row;
    /* align-items: center; */
    justify-content: left;
    width: fit-content;
  }
  .RollButton :global(.ComputedText) {
    margin-left: 0.5rem;
  }
</style>
