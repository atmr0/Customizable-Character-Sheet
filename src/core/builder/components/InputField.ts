import { BaseComponent } from "./BaseComponent";
import { Constants } from "../../constants";
type InputType = "text" | "number";
export class InputField extends BaseComponent {
  type: string = Constants.InputField;
  value?: string | number;
  placeholder?: string;
  inputType: InputType = 'text';
  allowFloat: boolean = false;
  step: number | string = this.allowFloat ? 'any' : 1;
  min: number | undefined = undefined;
  max: number | undefined = undefined;

  public getValue(): string|number|undefined {
    return this.value;
  }

  public setValue(value: string | number | undefined) {
    if(!this.id) {console.error("InputField has no ID"); return}
    console.log('[InputField setValue]', this.id, value);
    if (this.inputType === "number") {
      const parsed = this.parseNumeric(value as string);
      this.value = parsed;
      value = parsed;
      if (this.id) this.updateValueStore(this.id, parsed);
    } else {
      this.value = value;
      value = value;
      if (this.id) this.updateValueStore(this.id, this.value);
    }
  }

  private parseNumeric(raw: string) {
    if (raw === "" || raw === null || raw === undefined)
      return "";
    const normalized = String(raw).replace(",", ".");
    const num = this.allowFloat
      ? Number(normalized)
      : parseInt(normalized, 10);
    return isNaN(num) ? "" : num;
  }
}
