<script lang="ts">
  import { RNG } from "@core/RNG";
  import { eventGlobal } from "./eventGlobal.svelte";
  import { onMount } from "svelte";
  import { animateRoll } from "./rngAnimations";

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

  let rng: RNG | undefined = undefined;
  // $inspect(eventGlobal.rng);
  $effect(() => {
    if (eventGlobal.rng) {
      roll(eventGlobal.rng);
      rng = eventGlobal.rng;
    }
  });

  function organizeHtmlElements(animationInfo: any) {
    let divs = [];
    for (let i = 0; i < animationInfo.valuesToRoll.length; i++) {
      let div = document.createElement("div");
      div.classList.add("rng-item");
      div.textContent = animationInfo.valuesToRoll[i].toString();
      if(animationInfo.valuesToRoll[i] == animationInfo.max) div.classList.add("rng-item-max");
      if(animationInfo.valuesToRoll[i] == animationInfo.min) {
        div.classList.add("rng-item-min");
      }
      divs.push(div);
    }
    content.replaceChildren(...divs);
    content.style.transform = `translateY(${animationInfo.initialPosition + center - itemHeight / 2}px)`;
  }

  function endAnimation() {
    spinning = false;
    eventGlobal.send(null, eventGlobal.message + " done");
  }

  function roll(rng: RNG) {
    if (!content) return;
    if (!rng) throw new Error("RNG instance is required.");
    overlay!.style.visibility = "visible";
    let animationInfo = rng.getAnimationInfo(numberVisibleItems, itemHeight);
    organizeHtmlElements(animationInfo);
    animateRoll(rng, animationInfo, content, center, itemHeight, endAnimation);

    spinning = true;
  }

  function handleOverlayClick() {
    if (spinning) return;
    overlay!.style.visibility = "hidden";
    content.replaceChildren();
  }
</script>

<div class="RNG">
  <div class="rng-overlay" id="rng-overlay" onclick={handleOverlayClick}>
    <div class="rng-highlight" id="rng-highlight"></div>
    <div class="rng-content" id="rng-content"></div>
  </div>
</div>
