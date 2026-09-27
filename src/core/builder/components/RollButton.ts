import { BaseComponent, ComputedText } from '../components';
import { Constants } from '../../constants';
import { critResult, RNG } from '@core/RNG';

export type RollAnimationInfo = {
  selectedValueIndex: number;
  rotations: number;
  direction: number;
  finalIndex: number;
};
export class RollButton extends BaseComponent {
  type = Constants.RollButton;
  rolledValue:string;
  rng: RNG;
  constructor(opts: Partial<RollButton>) {
    super(opts);
    this.rng = opts.rng || new RNG({crittable: true, min: 1, max: 20});
    this.rolledValue = ""
  }

  public roll() {
    const result = this.rng.generateRandom();
    let mod = this.rng.mod ?? 0;
    let value = `${result.value + mod}`
    if(this.rng.checkCrit() != critResult.NONE) {
      value = `nat ${result.value}`;
    }
    this.rolledValue = value;
    
  }

  public setValue(value: any) {
    this.rng.setValues(Array.isArray(value) ? value : [value]);
  }
  public getValue() {
    return this.rng.getValues();
  }
}