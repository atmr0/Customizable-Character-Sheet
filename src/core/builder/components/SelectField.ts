import { BaseComponent } from "./BaseComponent";
import { Constants } from "../../constants";

export class SelectField extends BaseComponent {
  type: string = Constants.SelectField;
  options?: string[];
  value?: string | number;
}
