import { BaseComponent } from "./BaseComponent";
import { Constants } from "../../constants";

export class CheckboxField extends BaseComponent {
  type: string = Constants.CheckboxField;
  private value?: boolean = false;

  public getValue(): boolean{
    return this.value!;
  }

  public setValue(value: boolean | undefined) {
    this.value = value;
    this.updateValueStore(this.id!, this.value);
  }
}
