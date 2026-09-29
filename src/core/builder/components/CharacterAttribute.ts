import { BaseComponent } from "./BaseComponent";
import { Constants } from "../../constants";
import { InputField } from "./InputField";
import { ComputedText } from "./ComputedText";
import { RollButton } from "./RollButton";
import { Dices, ModOperation } from "@core/Dices";

export class CharacterAttribute extends BaseComponent {
  type: string = Constants.CharacterAttribute;
  input: InputField;
  mod: ComputedText;
  expr: string;
  button: RollButton;
  private input_id: string;
  private mod_id: string;
  constructor(opts: Partial<CharacterAttribute> = {}) {
    super(opts);
    this.input_id = `${this.id}_input`;
    this.input = opts.input ?? new InputField({ id: this.input_id, inputType: "number", value: 10 });

    this.expr = opts.expr ?? `Math.floor((${this.input_id} - 10)/2)`;
    this.mod_id = `${this.id}_mod`;
    this.mod = opts.mod ?? new ComputedText({ id: this.mod_id, expr: this.expr });
    this.mod.format = (v) => {
      const num = Number(v);
      if (isNaN(num)) return "+0";
      return num >= 0 ? `+${num}` : String(num);
    };

    this.button = new RollButton({ id: `${this.id}_button`, dices: new Dices("d20+0" + this.mod.getValue(), true) });
  }

  setValue(value: number) {
    this.input.setValue(value);
    let dices = this.button.dices;
    dices.setModificator(ModOperation.ADDITION, parseInt(this.mod.getValueFormatted()));
  }
  getValue(): number {
    return parseInt(String(this.input.getValue()));
  }
}