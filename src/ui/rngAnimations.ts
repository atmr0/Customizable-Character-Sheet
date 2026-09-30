import { critResult, Dices, ModOperation } from "@core/Dices";
import { RNGAnimationInfo } from "@core/RNG";
import { gsap } from "gsap";
import CustomEase from "gsap/CustomEase";
import TextPlugin from "gsap/TextPlugin";

gsap.registerPlugin(CustomEase);
gsap.registerPlugin(TextPlugin);
CustomEase.create("lootEase", "M0,0 C0.879,-0.064 0.34,1 1,1");

let center = 0
let itemHeight = 0;
let operation: ModOperation = ModOperation.NONE;
let modValue = 0;
let dices: Dices;
let animationEndGates = 0;
let elementsOnCenter: HTMLElement[] = [];
function updateVisual(column: HTMLElement) {
  let items = column.querySelectorAll(".rng-item");
  let elementOnCenter: HTMLElement;
  items.forEach((item) => {
    let rect = item.getBoundingClientRect();
    if (rect.y < center && rect.y + rect.height > center) {
      item.classList.add("onCenter");
      elementOnCenter = item as HTMLElement;
    } else {
      item.classList.remove("onCenter");
    }
  });
  return elementOnCenter!;
}

function synchronousWaitForAnimationEnd(totalGates: number) {
  return new Promise<void>((resolve) => {
    const interval = setInterval(() => {
      if (animationEndGates >= totalGates) {
        clearInterval(interval);
        resolve();
      }
    }, 100);
  });
}

function animateAllRolls(dice: Dices, animationInfo: RNGAnimationInfo[], columns: HTMLElement[], highlights: HTMLElement, lcenter: number, litemHeight: number, endAnimation: () => void) {
  if (animationInfo.length === 0) {
    endAnimation();
    return;
  }
  center = lcenter;
  itemHeight = litemHeight;
  operation = dice.getModOperation();
  modValue = dice.getModValue();
  dices = dice;
  animationEndGates = 0;
  elementsOnCenter = [];
  for (let i = 0; i < animationInfo.length; i++) {
    animateRoll(animationInfo[i], columns[i]);
  }
  synchronousWaitForAnimationEnd(animationInfo.length).then(() => {
    collapseColumns(columns, highlights);
    endAnimation();
  });
}

function animateRoll(animationInfo: RNGAnimationInfo, column: HTMLElement) {
  const yOffset = center - itemHeight / 2;
  const startY = animationInfo.initialPosition + yOffset;
  const finalY = animationInfo.initialPosition + animationInfo.dislocation + yOffset;
  const durationSec = (animationInfo.duration || 1000) / 1000;

  gsap.set(column, { y: startY });

  gsap.to(column, {
    y: finalY,
    duration: durationSec,
    ease: "lootEase",
    onUpdate: () => {
      updateVisual(column);
    },
    onComplete: () => {
      const elementOnCenter = updateVisual(column);
      elementsOnCenter.push(elementOnCenter);
      // setTimeout(() => animateResult(elementOnCenter), 500);
      setTimeout(() => { animationEndGates += 1 }, 500);
    },
  });
}

function animateResult(elementOnCenter: HTMLElement) {
  const crit = dices.checkCrit();
  if (crit == critResult.CRIT) {
    glow(elementOnCenter, `var(--success-color)`, 1, true);
  } else if (crit == critResult.FUMBLE) {
    glow(elementOnCenter, `var(--failure-color)`, 1, false);
  } else if (operation != ModOperation.NONE && modValue !== 0) {
    animateModificator(elementOnCenter);
  }
}

function animateModificator(elementOnCenter: HTMLElement) {
  if (modValue === 0) return;

  const originalValue = parseInt(elementOnCenter.textContent || "0", 10) || 0;
  let steps = Math.abs(modValue);
  let isMultiplication = false;
  let sign = 1;

  if (operation === ModOperation.MULTIPLICATION) {
    isMultiplication = true;
    // do N-1 additive steps to emulate multiplication (consistent with prior logic)
    steps -= 1
  } else if (operation === ModOperation.SUBTRACTION) {
    sign = -1;
  }

  if (steps === 0) return;

  const totalDuration = 1.0; // seconds
  const proxy = { idx: 0 };
  let lastStep = -1;

  const tl = gsap.timeline();

  tl.to(proxy, {
    idx: steps,
    duration: totalDuration,
    ease: 'none',
    onUpdate: () => {
      const cur = Math.floor(proxy.idx);
      if (cur == steps) return;
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
      let percentage = 100 - Math.round(stepProgress * 100);
      let scale = 1.2 * Math.min(1 / stepProgress, 1.5);
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

function collapseColumns(columns: HTMLElement[], highlights: HTMLElement) {
  let result = 0;
  for (let i = 0; i < columns.length; i += 1) {
    result += parseInt(elementsOnCenter[i].innerText) || 0;
  }
  let highs = Array.from(highlights.children);
  let tl = gsap.timeline()
  for (let i = 0; i < columns.length; i += 1) {
    let column = columns[i];
    let t = Array.from(column.children).filter(child => !child.classList.contains("onCenter"));
    tl.to(t, { color: 'transparent', duration: 0.5, ease: 'power2.in' }, 0);
    tl.to(column, { x: "0", duration: 0.5, ease: 'power2.in' }, 0);
    tl.to(highs[i], { x: 0, width:320, duration: 0.5, ease: 'power2.in' }, 0);
  }

  if(columns.length < 2) {
    tl.to(elementsOnCenter,{onComplete: () => {
      setTimeout(()=>animateResult(elementsOnCenter[0]),0)
    }})
    return
  }

  tl.to(elementsOnCenter, { filter: "blur(2px)", duration: 0.5, ease: 'power2.out' }, 0);
  for (let i = 0; i < elementsOnCenter.length; i += 1) {
    let c = i == 0 ? 'var(--highlight-text-color)' : 'transparent';
    tl.set(elementsOnCenter[i], { color: c });
  }
  tl.set(elementsOnCenter[0], { text: { value: String(result) } });
  tl.to(elementsOnCenter, {
    filter: "none", duration: 0.1, ease: 'power2.in',
    onComplete: () => {
      setTimeout(()=>animateResult(elementsOnCenter[0]),300)
    }
  });
}
export { animateAllRolls };