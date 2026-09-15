import { BaseComponent } from "./BaseComponent";
import { Constants } from "../../constants";

export class SelectField extends BaseComponent {
  type: string = Constants.SelectField;
  options?: string[];
  placeholder?: string = "Select...";
  value?: string;

  public getValue(): string {
    return this.value ?? this.placeholder!;
  }
}
