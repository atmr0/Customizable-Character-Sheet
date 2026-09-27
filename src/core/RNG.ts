
type RNGConfig = {
  min: number;
  max: number;
  values: number[];
  mod?: number;
};

enum rollDirection {
  UP = -1,
  DOWN = 1
}

export enum critResult {
  NONE = 0,
  CRIT = 1,
  FUMBLE = -1
}

export class RNG {
  public crittable:boolean;
  public mod: number;
  public min: number;
  public max: number;
  public values: number[] = [];
  private length: number = 0;
  private lastResult: { index: number, value: number } | undefined;
  public result: { index: number, value: number } | undefined;
  constructor(RNGConfig: Partial<RNG>) {
    this.values = RNGConfig.values || this.createValues(RNGConfig.min!, RNGConfig.max!);
    this.mod = RNGConfig.mod ?? 0;
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
    if(size % 2 !== 0) { //ex.: [5,1,4,2,3,3]
      values.pop();
    }
    return values;
  }

  setValues(values: number[]) {
    this.values = values;
    this.length = values.length;
  }
  getValues() {
    return this.values;
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

  generateRandom(): { index: number, value: number } {

    if (this.length === 0) throw new Error("No values available for random generation.");
    const randomIndex = Math.floor(Math.random() * this.length);
    this.lastResult = this.result ?? { index: 0, value: this.values[0] }
    this.result = { index: randomIndex, value: this.values[randomIndex] };
    return this.result;
  }

  getAnimationInfo(numberVisibleItems: number, itemSize: number) {
    const direction: number = Math.random() < 0.5 ? rollDirection.UP : rollDirection.DOWN;
    const result = this.result!;
    const lastResult = this.lastResult!;
    let minimumNumberOfItemsToTravel = Math.ceil(Math.random() * 4) + 2;
    let indexDifference = result.index - lastResult.index;
    let rotations = Math.ceil(minimumNumberOfItemsToTravel / this.length);
    let totalItemsToTravel = rotations * this.length + indexDifference * direction;
    let extraCopiesOnEachSide = Math.ceil(numberVisibleItems / this.length); // extra copies at the beginning and end to make the illusion of an infinite loop
    let totalNumberOfCopies = rotations + extraCopiesOnEachSide * 2;

    let valuesToRoll = this.duplicateValues(this.values, totalNumberOfCopies);

    // start with enough items past to create the illusion
    const startIndex = direction == rollDirection.DOWN ?
      lastResult.index + extraCopiesOnEachSide * this.length :
      lastResult.index + (totalNumberOfCopies - extraCopiesOnEachSide) * this.length;
    const endIndex = startIndex + totalItemsToTravel * direction;

    // TODO add random offset, and make it snap to the final position
    const dislocation = (startIndex - endIndex) * itemSize;
    const initialPosition = startIndex * itemSize * -1; // we scroll up
    const duration = Math.random() * 2000 + 1000;

    return {
      initialPosition,
      dislocation,
      duration,
      valuesToRoll
    }
  }
  checkCrit() {
    if(!this.crittable || !this.result) return critResult.NONE;
    if(this.result.value === this.max) return critResult.CRIT;
    if(this.result.value === this.min) return critResult.FUMBLE;
    return critResult.NONE;
  }
}
