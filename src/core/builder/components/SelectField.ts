import { BaseComponent } from "./BaseComponent";
import { Constants } from "../../constants";

export class SelectField extends BaseComponent {
  type: string = Constants.SelectField;
  options?: string[];
  editable?: boolean;
  placeholder?: string = "Select...";
  value?: string;

  constructor(opts?: Partial<SelectField>) {
    super(opts);
    if (opts) {
      this.options = opts.options;
      this.editable = opts.editable ?? true;
      this.placeholder = opts.placeholder ?? this.placeholder;
      this.value = opts.value;
    }
  }

  public getValue(): string|undefined {
    return this.value;
  }

  public setValue(value: string): void {
    this.value = value;
    this.updateValueStore(this.id!, this.value);
  }
}
