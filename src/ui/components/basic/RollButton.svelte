<script lang="ts">
  import BaseComponent from "./BaseComponent.svelte";
  import { RollButton, type RollAnimationInfo } from "@builder/components";
  import { eventGlobal } from "@ui/idk.svelte.js";
  
  
  export let component: RollButton | undefined;
  export let values: number[] = component?.getValue() || [];
  let itemHeight = 80;

  let idRoulette = component?.id + "-roulette";
  let idRouletteInner = component?.id + "-roulette-inner";

  function hideOverlay(overlay: HTMLElement) {
    overlay.style.display = 'none';
    overlay.style.visibility = 'hidden';
  }

  function handleClick() {
    if (!component || !component.id) return;

    eventGlobal.send(component.rng);
   
  }
</script>
<BaseComponent {component}>
  <button on:click={handleClick}>Roll</button>
</BaseComponent>

<!-- Overlay roulette rendered on top of everything -->
<div class="roulette-overlay" id={idRoulette} style="display:none; visibility:hidden;">
  <div class="roulette-viewport">
    <div class="roulette-inner" id={idRouletteInner} style="transform: translateY(0px);">
      {#each values as value}
      <div class="roulette-item">{value}</div>
      {/each}
    </div>
  </div>
  <div class="hightlight"></div>
</div>

<style>
  button {
    margin-bottom: 0.5rem;
  }

  .roulette-overlay {
    position: fixed;
    inset: 0;
    display: flex;
    align-items: center;
    justify-content: center;
    background: rgba(0,0,0,0.45);
    z-index: 2000;
    pointer-events: auto;
  }
  .hightlight {
    position: absolute;
    top: 50%;
    left: 0;
    width: 100%;
    height: 48px;
    margin-top: -24px;
    background-color: var(--highlight-color);
    pointer-events: none;
    mix-blend-mode: difference;
  }

  .roulette-viewport {
    width: 320px;
    max-width: calc(100% - 32px);
    height: 100%;
    overflow: hidden;
  }

  .roulette-inner {
    display: flex;
    flex-direction: column;
    box-sizing: border-box;
  }

  .roulette-item {
    min-height: 80px;
    display: flex;
    align-items: center;
    justify-content: center;
    font-weight: bold;
    font-size:xx-large;
    color: var(--highlight-color);
  }
</style>
