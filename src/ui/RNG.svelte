<script lang="ts">
  import { Dices } from "@core/Dices";
  import type { RNGAnimationInfo } from "@core/RNG";
  import { eventGlobal } from "./eventGlobal.svelte";
  import { onMount } from "svelte";
  import { animateRoll } from "./rngAnimations";

  const itemHeight = 80;
  // const halfHeight = itemHeight / 2;

  let overlay: HTMLElement;
  let highlights: HTMLElement;
  let viewPortHeight: number;
  let center: number;
  let numberVisibleItems: number;

  let spinning: boolean = false;
  onMount(() => {
    overlay = document.getElementById("rng-overlay") as HTMLElement;
    highlights = document.querySelector(".rng-highlights") as HTMLElement;
    viewPortHeight = overlay?.clientHeight ?? 0;
    center = Math.floor(viewPortHeight / 2);
    numberVisibleItems = Math.ceil(viewPortHeight / itemHeight) + 2;
  });

  let rng: RNG | undefined = undefined;
  // $inspect(eventGlobal.rng);
  $effect(() => {
    if (eventGlobal.dices) {
      roll(eventGlobal.dices);
      rng = eventGlobal.rng;
    }
  });

  function organizeHtmlElements(animationInfo: RNGAnimationInfo[]) {
    let divs = [];
    let hlDivs = []
    for (let i = 0; i < animationInfo.length; i++) {
      let column = document.createElement("div");
      column.classList.add("rng-column");
      for (let j = 0; j < animationInfo[i].valuesToRoll.length; j++) {
        let div = document.createElement("div");
        div.classList.add("rng-item");
        div.textContent = animationInfo[i].valuesToRoll[j].toString();
        
        column.appendChild(div);
      }
      column.style.transform = `translateY(${animationInfo[i].initialPosition + center - itemHeight / 2}px)`;
      divs.push(column);
      let highlight = document.createElement("div")
      highlight.classList.add("rng-highlight");
      hlDivs.push(highlight);
    }
    highlights.replaceChildren(...hlDivs);
    overlay.replaceChildren(...divs);
    overlay.appendChild(highlights);
  }

  function endAnimation() {
    spinning = false;
    eventGlobal.send(null, eventGlobal.message + " done");
  }

  function roll(dices: Dices) {
    if (!dices) throw new Error("Dices instance is required.");
    overlay!.style.visibility = "visible";
    let animationInfos = dices.getAnimationInfos(numberVisibleItems,itemHeight);
    organizeHtmlElements(animationInfos);
    let columns = overlay.querySelectorAll(".rng-column");
    for(let i = 0; i < animationInfos.length; i++) {
      animateRoll(
        dices,
        animationInfos[i],
        columns[i] as HTMLElement,
        center,
        itemHeight,
        endAnimation,
      );
    }
    spinning = true;
  }

  function handleOverlayClick() {
    if (spinning) return;
    overlay!.style.visibility = "hidden";
    overlay.replaceChildren();
  }
</script>

<div class="RNG">
  <div class="rng-overlay" id="rng-overlay" onclick={handleOverlayClick}>
    <div class="rng-highlights"></div>
  </div>
</div>
