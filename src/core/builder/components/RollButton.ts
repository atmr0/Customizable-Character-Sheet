import { BaseComponent } from '../components';
import { Constants } from '../../constants';
import { RNG } from '@core/RNG';

export type RollAnimationInfo = {
  selectedValueIndex: number;
  rotations: number;
  direction: number;
  finalIndex: number;
};
export class RollButton extends BaseComponent {
  type = Constants.RollButton;
  rng: RNG;
  constructor(opts: Partial<RollButton>) {
    super(opts);
    this.rng = opts.rng || new RNG({min: 0, max: 5});
  }

  public setValue(value: any) {
    this.rng.setValues(Array.isArray(value) ? value : [value]);
  }
  public getValue() {
    return this.rng.getValues();
  }
}