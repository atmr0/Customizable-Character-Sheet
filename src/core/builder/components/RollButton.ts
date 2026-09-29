import { BaseComponent, ComputedText } from '../components';
import { Constants } from '../../constants';
import { RNG } from '@core/RNG';
import { critResult, Dices } from '@core/Dices';

export type RollAnimationInfo = {
  selectedValueIndex: number;
  rotations: number;
  direction: number;
  finalIndex: number;
};
export class RollButton extends BaseComponent {
  type = Constants.RollButton;
  rolledValue: string;
  dices: Dices;
  text:string;
  constructor(opts: Partial<RollButton>) {
    super(opts);
    this.rolledValue = ""
    this.text = opts.text ?? "Roll";
    this.dices = opts.dices ?? new Dices("d20", true);
  }

  public roll() {
    const result = this.dices.roll();
    let value = `${this.dices.getFinalValue()}`
    if (this.dices.checkCrit() != critResult.NONE) {
      value = `nat ${result}`;
    }
    this.rolledValue = value;

  }

  public setValue(value: string) {
    this.dices = new Dices(value);
  }
  public getValue() {
    return //this.rng.getValues();
  }
}