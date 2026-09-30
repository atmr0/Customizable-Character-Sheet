import { BaseComponent } from "./BaseComponent";
import { Constants } from "../../constants";

export class StaticText extends BaseComponent {
  type: string = Constants.StaticText;
  text?: string;

  getValue() {
    return this.text;
  }
  setValue(value: string) {
    this.text = value;
  }
}
