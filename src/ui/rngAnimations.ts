import { critResult, Dices, ModOperation } from "@core/Dices";
import { RNG } from "@core/RNG";

// AI generated, it imitates the behavior of CSS cubic-bezier easing functions for animations
export function cubicBezierEasing(x1: number, y1: number, x2: number, y2: number) {
  const getCoord = (t: number, p1: number, p2: number) => {
    return 3 * Math.pow(1 - t, 2) * t * p1 + 3 * (1 - t) * Math.pow(t, 2) * p2 + Math.pow(t, 3);
  };

  const getSlope = (t: number, p1: number, p2: number) => {
    return 3 * Math.pow(1 - t, 2) * p1 + 6 * (1 - t) * t * (p2 - p1) + 3 * Math.pow(t, 2) * (1 - p2);
  };

  const getTForX = (xTarget: number) => {
    let t = xTarget; // Chute inicial

    for (let i = 0; i < 8; i++) {
      const currentX = getCoord(t, x1, x2) - xTarget;
      const slope = getSlope(t, x1, x2);
      if (Math.abs(slope) < 1e-6) break;
      t -= currentX / slope;
    }

    let lower = 0, upper = 1;
    while (Math.abs(getCoord(t, x1, x2) - xTarget) > 1e-4) {
      if (getCoord(t, x1, x2) > xTarget) upper = t;
      else lower = t;
      t = (upper + lower) / 2;
    }
    return t;
  };

  return function (time: number) {
    if (time <= 0) return 0;
    if (time >= 1) return 1;

    const t = getTForX(time);

    return getCoord(t, y1, y2);
  };
}

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


function animateRoll(dice: Dices, rng: RNG, animationInfo: any, column: HTMLElement, center: number, itemHeight: number, endAnimation: () => void) {
  const initialTime = performance.now();
  let easing = cubicBezierEasing(0.879, -0.064, 0.34, 1);
  let yOffset = center - itemHeight / 2
  let operation = dice.getModOperation();
  let modValue = dice.getModValue();

  
  function animate() {
    const currentTime = performance.now();
    const elapsedTime = currentTime - initialTime;
    const animationProgress = easing(elapsedTime / animationInfo.duration);

    const currentDislocation = animationInfo.dislocation * animationProgress
    const newPosition = animationInfo.initialPosition + currentDislocation + yOffset;
    column!.style.transform = `translateY(${newPosition}px)`;
    let elementOnCenter = updateVisual(column, center);
    if (animationProgress < 1) {
      requestAnimationFrame(animate);
    } else {
      setTimeout(() => idk(dice, operation, modValue, elementOnCenter, endAnimation), 500);
    }
  }
  requestAnimationFrame(animate);
}

function idk(dice:Dices, operation: ModOperation, modValue: number, elementOnCenter: HTMLElement, endAnimation: () => void) {
  if (dice.checkCrit() == critResult.CRIT) glow(elementOnCenter, `var(--success-color)`, 1000, true)
  else if (dice.checkCrit() == critResult.FUMBLE) glow(elementOnCenter, `var(--failure-color)`, 1000, false)
  else if (operation != ModOperation.NONE) animateModificator(operation, modValue, elementOnCenter);
  endAnimation();
}

function animateModificator(operation: ModOperation, modValue: number, elementOnCenter: HTMLElement) {
  if(modValue === 0) return;
  const initialTime = performance.now();
  const duration = 1000;
  const endStepsTime = duration * 0.8;

  let lastStep = -1;
  let currentStep = 0;

  let colorOfNumberChange = ""
  let stepFunction: Function;
  if (operation == ModOperation.MULTIPLICATION) {
    modValue -= 1 // 5*4 would sum 5, 4 times resulting in 25
    colorOfNumberChange = "var(--multiply-color)";
    stepFunction = (v: number, o: number) => v + o;
  } else {
    if (operation == ModOperation.SUBTRACTION) {
      modValue = -modValue;
      colorOfNumberChange = "var(--decrease-color)";
    }
    else colorOfNumberChange = "var(--increase-color)"
    stepFunction = (v: number, o: number) => v + (modValue > 0 ? 1 : -1);
  }

  const stepSize = Math.abs(endStepsTime / modValue);
  // An idea to make it stand out more, the text would stay in another color. But I don't know how to make it look good really
  let finalColor = 'var(--highlight-text-color)' // `color-mix(in oklab, ${baseColor}, ${colorOfNumberChange} 50%)`

  let val = parseInt(elementOnCenter.textContent);
  const originalValue = val
  function animate() {
    const currentTime = performance.now();
    const elapsedTime = currentTime - initialTime;
    const animationProgress = Math.min(elapsedTime / duration, 1);

    const stepProgress = (elapsedTime / stepSize) % 1;
    currentStep = Math.floor(elapsedTime / stepSize)
    if (elapsedTime < endStepsTime) {
      if (currentStep !== lastStep) {
        val = stepFunction(val, originalValue)
        elementOnCenter.textContent = val.toString();
        lastStep = currentStep;
      }
      pulsate(stepProgress, finalColor, colorOfNumberChange, elementOnCenter, modValue);
    }
    else {
      elementOnCenter.style.transform = `scale(1)`;
      elementOnCenter.style.color = finalColor;
    }
    if (animationProgress < 1) {
      requestAnimationFrame(animate);
    }
  }
  requestAnimationFrame(animate);
}

function pulsate(stepProgress: number, finalColor: string, colorOfNumberChange: string, elementOnCenter: HTMLElement, mod: number) {
  let scale = Math.min(1 / stepProgress, 1.5);
  if (mod < 0) scale = 1 / scale;
  elementOnCenter.style.transform = `scale(${scale})`;
  let percentage = 100 - stepProgress * 100;
  elementOnCenter.style.color = `color-mix(in oklab, ${finalColor}, ${colorOfNumberChange} ${percentage}%)`;
}

function glow(elementOnCenter: HTMLElement, color: string, duration: number, success: boolean) {
  let timingFunction = 'cubic-bezier(0.4, 0, 0.2, 1)';
  elementOnCenter.style.transition = `text-shadow ${duration}ms ${timingFunction}, transform ${duration}ms ${timingFunction}, color ${duration}ms ${timingFunction}`;
  elementOnCenter.style.textShadow = `${color} 0 0 5px `;
  elementOnCenter.style.color = `color-mix(in oklab, ${success ? 'white' : 'black'}, ${color} 50%)`;
  elementOnCenter.style.transform = `scale(2)`;
}
export { animateModificator, animateRoll };