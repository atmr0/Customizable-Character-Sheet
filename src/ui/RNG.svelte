<script lang="ts">
  import { Dices } from "@core/Dices";
  import type { RNGAnimationInfo } from "@core/RNG";
  import { eventGlobal } from "./eventGlobal.svelte";
  import { onMount } from "svelte";
  import { animateAllRolls } from "./rngAnimations";

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

    // I'm using position absolute instead of flex to make it easier to animate after.
    let winWidth = window.innerWidth;
    let columnWidth = winWidth / animationInfo.length;

    for (let i = 0; i < animationInfo.length; i++) {
      let column = document.createElement("div");
      column.classList.add("rng-column");
      for (let j = 0; j < animationInfo[i].valuesToRoll.length; j++) {
        let div = document.createElement("div");
        div.classList.add("rng-item");
        div.textContent = animationInfo[i].valuesToRoll[j].toString();
        
        column.appendChild(div);
      }

      let initialPositionY = animationInfo[i].initialPosition + center - itemHeight / 2;
      let initialPositionX = -winWidth/2 + columnWidth * i + columnWidth / 2;
      column.style.transform = `translate(${initialPositionX}px, ${initialPositionY}px)`;
      divs.push(column);

      let highlight = document.createElement("div")
      highlight.classList.add("rng-highlight");
      highlight.style.transform = `translate(${initialPositionX}px, 0px)`;
      highlight.style.width = `${Math.min(columnWidth-10, 320)}px`;
      hlDivs.push(highlight);
    }
    highlights.replaceChildren(...hlDivs);
    overlay.replaceChildren(...divs);
    overlay.appendChild(highlights);
  }

  function endAnimation() {
    spinning = false;
    console.log("ending")
    eventGlobal.send(null, eventGlobal.message + " done");
  }

  function roll(dices: Dices) {
    if (!dices) throw new Error("Dices instance is required.");
    overlay!.style.visibility = "visible";
    let animationInfos = dices.getAnimationInfos(numberVisibleItems,itemHeight);
    organizeHtmlElements(animationInfos);
    let columns = overlay.querySelectorAll(".rng-column");
    animateAllRolls(dices, animationInfos, Array.from(columns) as HTMLElement[], highlights, center, itemHeight, endAnimation);
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
