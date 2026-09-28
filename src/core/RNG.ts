
enum rollDirection {
  UP = -1,
  DOWN = 1
}

// Source - https://stackoverflow.com/a/4467559
// Posted by Enrique, modified by community. See post 'Timeline' for change history
// Retrieved 2026-09-28, License - CC BY-SA 4.0
//@ts-ignore
function modulo(a, n) {
  return ((a % n) + n) % n;
};


export type RNGAnimationInfo = {
  initialPosition: number;
  dislocation: number;
  duration: number;
  valuesToRoll: number[];
};

export class RNG {
  public crittable: boolean;
  public min: number;
  public max: number;
  public values: number[] = [];
  private length: number = 0;

  // auxiliary for animation only
  private lastResult: { index: number, value: number } | undefined;
  public result: { index: number, value: number } | undefined;
  constructor(RNGConfig: Partial<RNG>) {
    this.values = RNGConfig.values || this.createValues(RNGConfig.min!, RNGConfig.max!);
    this.min = RNGConfig.min!;
    this.max = RNGConfig.max!;
    this.crittable = RNGConfig.crittable ?? false;
    this.length = this.values.length;
  }

  createValues(min: number, max: number): number[] {
    const values = [];
    let size = max - min + 1;
    for (let i = 0; i < size / 2; i++) {
      values.push(max - i);
      values.push(min + i);
    }
    if (size % 2 !== 0) { //ex.: [5,1,4,2,3,3]
      values.pop();
    }
    return values;
  }

  setValues(values: number[]) {
    this.values = values;
    this.length = values.length;
  }

  getValue() {
    return this.result?.value;
  }

  duplicateValues(arr: number[], times: number = 2): number[] {
    let result: number[] = [];
    for (let i = 0; i < times; i++) {
      for (let j = 0; j < arr.length; j++) {
        result.push(arr[j]);
      }
    }
    return result;
  }

  generateRandom(): number {

    if (this.length === 0) throw new Error("No values available for random generation.");
    const randomIndex = Math.floor(Math.random() * this.length);
    this.lastResult = this.result ?? { index: 0, value: this.values[0] }
    this.result = { index: 19, value: this.values[19] }//{ index: randomIndex, value: this.values[randomIndex] };
    return this.result.value;
  }

  getAnimationInfo(numberVisibleItems: number, itemSize: number, duration: number = 0): RNGAnimationInfo {
    console.log('---------------------------------------')
    const direction: number = Math.random() < 0.5 ? rollDirection.UP : rollDirection.DOWN;
    const result = this.result!;
    const lastResult = this.lastResult!;

    let minimumTravel = (Math.ceil(Math.random() * 10) + 10)*direction;
    let indexAfterMinimumTravel = modulo((lastResult.index + minimumTravel),this.length);
    let rotations = Math.abs(Math.ceil(minimumTravel / this.length));
    let indexOffset = result.index - indexAfterMinimumTravel;
    let totalTravel = minimumTravel + indexOffset + this.length * direction;

    // copies to create the illusion of being infinite
    let extraCopiesOnEachSide = Math.ceil(numberVisibleItems / this.length);
    let totalNumberOfCopies = extraCopiesOnEachSide * 2 + rotations + 2;
    let valuesToRoll = this.duplicateValues(this.values, totalNumberOfCopies);

    // start with enough items past to create the illusion
    const startIndex = direction == rollDirection.DOWN ?
      lastResult.index + extraCopiesOnEachSide * this.length :
      lastResult.index + (totalNumberOfCopies - extraCopiesOnEachSide - 1) * this.length;
    const endIndex = startIndex + totalTravel;
    
    // TODO add random pixel offset, and make it snap to the final position
    const dislocation = (startIndex - endIndex) * itemSize;
    const initialPosition = startIndex * itemSize * -1; 
    
    duration = duration || Math.random() * 2000 + 1000;

    return {
      initialPosition,
      dislocation,
      duration,
      valuesToRoll
    }
  }

}
