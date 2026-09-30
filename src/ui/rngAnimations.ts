import { critResult, Dices, ModOperation } from "@core/Dices";
import { gsap } from "gsap";
import CustomEase from "gsap/CustomEase";

gsap.registerPlugin(CustomEase);
CustomEase.create("lootEase", "M0,0 C0.879,-0.064 0.34,1 1,1");

function updateVisual(column: HTMLElement, center: number) {
  let items = column.querySelectorAll(".rng-item");
  let elementOnCenter: HTMLElement;
  items.forEach((item) => {
    let rect = item.getBoundingClientRect();
    if (rect.y < center && rect.y + rect.height > center) {
      //@ts-ignore
      item.style.scale = "1.2";
      //@ts-ignore
      item.style.color = "var(--highlight-text-color)";
      elementOnCenter = item as HTMLElement;
    } else {
      //@ts-ignore
      item.style.scale = "1";
      //@ts-ignore
      item.style.color = "var(--base-color)";
    }
  });
  return elementOnCenter!
}


function animateRoll(dice: Dices, animationInfo: any, column: HTMLElement, center: number, itemHeight: number, endAnimation: () => void) {
  const yOffset = center - itemHeight / 2;
  const operation = dice.getModOperation();
  const modValue = dice.getModValue();

  const startY = animationInfo.initialPosition + yOffset;
  const finalY = animationInfo.initialPosition + animationInfo.dislocation + yOffset;
  const durationSec = (animationInfo.duration || 1000) / 1000;

  gsap.set(column, { y: startY });

  gsap.to(column, {
    y: finalY,
    duration: durationSec,
    ease: "lootEase",
    onUpdate: () => {
      updateVisual(column, center);
    },
    onComplete: () => {
      const elementOnCenter = updateVisual(column, center);
      setTimeout(() => animateResult(dice, operation, modValue, elementOnCenter, endAnimation), 500);
    },
  });
}

function animateResult(dice: Dices, operation: ModOperation, modValue: number, elementOnCenter: HTMLElement, endAnimation: () => void) {
  const crit = dice.checkCrit();
  if (crit == critResult.CRIT) {
    glow(elementOnCenter, `var(--success-color)`, 1, true);
  } else if (crit == critResult.FUMBLE) {
    glow(elementOnCenter, `var(--failure-color)`, 1, false);
  } else if (operation != ModOperation.NONE && modValue !== 0) {
    animateModificator(operation, modValue, elementOnCenter);
  }
  endAnimation();
}

function animateModificator(operation: ModOperation, modValueRaw: number, elementOnCenter: HTMLElement) {
  if (modValueRaw === 0) return;

  const originalValue = parseInt(elementOnCenter.textContent || "0", 10) || 0;
  let steps = Math.abs(modValueRaw);
  let isMultiplication = false;
  let sign = 1;

  if (operation === ModOperation.MULTIPLICATION) {
    isMultiplication = true;
    // do N-1 additive steps to emulate multiplication (consistent with prior logic)
    steps -=1
  } else if (operation === ModOperation.SUBTRACTION) {
    sign = -1;
  }

  if (steps === 0)return;

  const totalDuration = 1.0; // seconds
  const proxy = { idx: 0 };
  let lastStep = -1;

  const tl = gsap.timeline({
    onComplete: () => {
      gsap.to(elementOnCenter, { scale: 1, color: 'var(--highlight-text-color)', duration: 0.12 });
    }
  });

  tl.to(proxy, {
    idx: steps,
    duration: totalDuration,
    ease: 'none',
    onUpdate: () => {
      const cur = Math.floor(proxy.idx);
      if(cur == steps) return;
      if (cur !== lastStep) {
        lastStep = cur;
        let currentVal = parseInt(elementOnCenter.textContent || String(originalValue), 10) || originalValue;
        if (isMultiplication) {
          currentVal = currentVal + originalValue;
        } else {
          currentVal = currentVal + (sign > 0 ? 1 : -1);
        }
        elementOnCenter.textContent = String(currentVal);
      }

      const stepProgress = proxy.idx - Math.floor(proxy.idx);
      let percentage = 100 -  Math.round(stepProgress * 100);
      let scale = Math.min(1 / stepProgress, 1.5);
      if (sign < 0) scale = 1 / scale;
      gsap.set(elementOnCenter, { scale });
      let colorOfNumberChange = sign > 0 ? 'var(--increase-color)' : 'var(--decrease-color)';
      gsap.set(elementOnCenter, { color: `color-mix(in oklab, var(--highlight-text-color), ${colorOfNumberChange} ${percentage}%)` });
    }
  });
}

function glow(elementOnCenter: HTMLElement, color: string, durationSec: number, success: boolean) {
  gsap.killTweensOf(elementOnCenter);
  // not using gsap because its text-shadow is not very well animated. (or im just dumb)  
  let timingFunction = 'cubic-bezier(0.4, 0, 0.2, 1)';
  elementOnCenter.style.transition = `text-shadow ${durationSec}s ${timingFunction}, transform ${durationSec}s ${timingFunction}, color ${durationSec}s ${timingFunction}`;
  elementOnCenter.style.textShadow = `${color} 0 0 5px `;
  elementOnCenter.style.color = `color-mix(in oklab, ${success ? 'white' : 'black'}, ${color} 50%)`;
  elementOnCenter.style.transform = `scale(2)`;
}
export { animateModificator, animateRoll };