<script lang="ts">
  import { RNG } from "@core/RNG";
  import { eventGlobal } from "./idk.svelte";
  import { onMount } from "svelte";
  import { cubicBezier } from "./animationEasing";

  const itemHeight = 80;
  // const halfHeight = itemHeight / 2;

  let content: HTMLElement;
  let overlay: HTMLElement;
  let viewPortHeight: number;
  let center: number;
  let numberVisibleItems: number;

  let spinning: boolean = false;
  onMount(() => {
    content = document.getElementById("rng-content") as HTMLElement;
    overlay = document.getElementById("rng-overlay") as HTMLElement;
    viewPortHeight = overlay?.clientHeight ?? 0;
    center = Math.floor(viewPortHeight / 2);
    numberVisibleItems = Math.ceil(viewPortHeight / itemHeight) + 2;
  });

  $inspect(eventGlobal.rng);
  $effect(() => {
    if (eventGlobal.rng) {
      roll(eventGlobal.rng);
      eventGlobal.rng = null;
    }
  });

  function updateVisual() {
    let items = document.querySelectorAll(".rng-item");
    items.forEach((item, index) => {
      let rect = item.getBoundingClientRect();

      if (rect.y < center && rect.y + rect.height > center) {
        item.style.scale = "1.2";
        item.style.color = "var(--highlight-text-color)";
      } else {
        item.style.scale = "1";
        item.style.color = "black";
      }
    });
  }

  function organizeHtmlElements(result: any) {
    let divs = [];
    for (let i = 0; i < result.valuesToRoll.length; i++) {
      let div = document.createElement("div");
      div.classList.add("rng-item");
      div.textContent = result.valuesToRoll[i].toString();
      divs.push(div);
    }
    content.replaceChildren(...divs);
    content.style.transform = `translateY(${result.initialPosition + center - itemHeight / 2}px)`;
  }

  function animateContent(result: any) {
    const initialTime = performance.now();
    let easing = cubicBezier(0.879, -0.064, 0.34, 1);
    function animate() {
      const currentTime = performance.now();
      const elapsedTime = currentTime - initialTime;
      const animationProgress = easing(elapsedTime / result.duration);

      const newPosition =
        result.initialPosition +
        result.dislocation * animationProgress +
        center -
        itemHeight / 2;
      content!.style.transform = `translateY(${newPosition}px)`;
      updateVisual();
      if (animationProgress < 1) {
        requestAnimationFrame(animate);
      }
      else {
        spinning = false;

      }
    }
    requestAnimationFrame(animate);
  }

  function roll(rng: RNG) {
    if (!content) return;
    if (!rng) throw new Error("RNG instance is required.");
    overlay!.style.visibility = "visible";
    let result = rng.getAnimationInfo(numberVisibleItems, itemHeight);
    organizeHtmlElements(result);
    animateContent(result);
    spinning = true;
  }

  function handleOverlayClick() {
    if (spinning) return;
    overlay!.style.visibility = "hidden";
    content.replaceChildren();
  }
</script>

<div class="rng-overlay" id="rng-overlay" onclick={handleOverlayClick}>
  <div class="rng-highlight" id="rng-highlight"></div>
  <div class="rng-content" id="rng-content"></div>
</div>

<style>
  .rng-overlay {
    visibility: hidden;
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: rgba(0, 0, 0, 0.5);
    display: flex;
    justify-content: center;
    z-index: 1000;
  }

  .rng-content {
    display: flex;
    flex-direction: column;
    width: 320px;
    max-width: calc(100% - 32px);
  }

  .rng-highlight {
    position: absolute;
    top: 50%;
    left: 50%;
    width: 100%;
    height: 80px;
    margin-top: -40px;
    margin-left: -160px;
    background-color: var(--highlight-color);
    width: 320px;

    pointer-events: none;
  }
  :global(.rng-item) {
    min-height: 80px;
    display: flex;
    align-items: center;
    justify-content: center;
    font-weight: bold;
    font-size: xx-large;
  }
</style>
