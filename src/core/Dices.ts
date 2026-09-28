import { RNG } from "./RNG";
export enum ModOperation {
  NONE = 0,
  ADDITION = 1,
  SUBTRACTION = 2,
  MULTIPLICATION = 3
}
export enum critResult {
  NONE = 0,
  CRIT = 1,
  FUMBLE = -1
}
export class Dices {
  private rngs: RNG[] = []
  private mod: string;
  private results: number[] = [];
  private finalResult: number = 0;
  private modOperation: ModOperation;
  private modValue: number = 0;
  public crittable: boolean;
  constructor(dices: string, crittable: boolean = false) {
    // dXX*A + YYdYY+B ...
    ///(?:\s*\+?\s*(\d*d\d+([+\-*\/]\d+)*))/g    Try to implement multiple dice types later
    const re = /(\d*)d(\d+)([+\-*]\d+)?/
    let value = dices.match(re);
    if (value == null) throw Error("Invalid dice string");
    let numberOfDices = value[1] === "" ? 1 : parseInt(value[1]);
    let sides = parseInt(value[2])
    if (sides <= 0) throw Error("Invalid number of sides");
    if (numberOfDices > 1) this.crittable = false;
    else this.crittable = crittable;
    this.mod = value[3];
    for (let i = 0; i < numberOfDices; i++) {
      this.rngs.push(new RNG({ min: 1, max: sides }));
    }
    if (!this.mod) {
      this.modOperation = ModOperation.NONE;
      return
    }
    switch (this.mod[0]) {
      case '+': this.modOperation = ModOperation.ADDITION; break;
      case '-': this.modOperation = ModOperation.SUBTRACTION; break;
      case '*': this.modOperation = ModOperation.MULTIPLICATION; break;
      default: throw Error("Invalid Operation")
    }
    this.modValue = parseInt(this.mod.slice(1));
  }


  public getModOperation(): number {
    return this.modOperation;
  }

  public getModValue(): number {
    return this.modValue;
  }
  public getFinalValue(): number {
    return this.finalResult;
  }
  public checkCrit() {
    if (this.results.length === 0) return critResult.NONE;
    if (!this.crittable || this.results.length === 0) return critResult.NONE;
    if (this.results[0] === this.rngs[0].max) return critResult.CRIT;
    if (this.results[0] === this.rngs[0].min) return critResult.FUMBLE;
    return critResult.NONE;
  }
  public roll() {
    this.results = []
    this.finalResult = 0;
    for (let i = 0; i < this.rngs.length; i += 1) {
      let v = this.rngs[i].generateRandom();
      this.results.push(v)
      this.finalResult += v
    }
    if (this.modOperation == ModOperation.ADDITION) this.finalResult += this.modValue;
    else if (this.modOperation == ModOperation.SUBTRACTION) this.finalResult -= this.modValue;
    else if (this.modOperation == ModOperation.MULTIPLICATION) this.finalResult *= this.modValue;
    return this.finalResult;
  }

  public getAnimationInfos(numberVisibleItems: number, itemHeight: number): any[] {
    const duration = Math.random() * 4000 + 1000;
    return this.rngs.map(rng => rng.getAnimationInfo(numberVisibleItems, itemHeight, duration));
  }
}