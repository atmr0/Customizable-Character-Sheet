import { BaseComponent } from "./BaseComponent";
import { Constants } from "../../constants";

export class SelectField extends BaseComponent {
  type: string = Constants.SelectField;
  options?: string[];
  placeholder?: string = "Select...";
  value?: string;

  public getValue(): string|undefined {
    return this.value;
  }

  public setValue(value: string): void {
    this.value = value;
    this.updateValueStore(this.id!, this.value);
  }
}
