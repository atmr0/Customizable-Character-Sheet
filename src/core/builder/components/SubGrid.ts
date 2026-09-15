import { BaseComponent } from "./BaseComponent";
import { Constants } from "../../constants";
import { Sheet } from "./Sheet";

export class SubGrid extends BaseComponent {
  type: string = Constants.SubGrid;
  sheet?: Sheet;
  constructor(opts: Partial<BaseComponent & SubGrid>, sheet: Sheet) {
    super(opts);
    this.sheet = Object.assign(new Sheet(), sheet);
  }

  public getValue(){
    return this.sheet ? this.sheet.exportData() : {};
  }
}
