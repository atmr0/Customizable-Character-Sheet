import { BaseComponent } from "./BaseComponent";
import { Constants } from "../../constants";

export class InputField extends BaseComponent {
  type: string = Constants.InputField;
  value?: string | number;
  placeholder?: string;
  inputType: string = 'text';
  allowFloat: boolean = false;
  step: number | string = this.allowFloat ? 'any' : 1;
  min: number | undefined = undefined;
  max: number | undefined = undefined;
}
