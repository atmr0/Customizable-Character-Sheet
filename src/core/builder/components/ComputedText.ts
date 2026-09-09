import { BaseComponent } from "./BaseComponent";
import { Constants } from "../../constants";

export class ComputedText extends BaseComponent {
  type: string = Constants.ComputedText;
  expr?: string;
}
