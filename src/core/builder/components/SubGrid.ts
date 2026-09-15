import { BaseComponent } from "./BaseComponent";
import { Constants } from "../../constants";
import { SheetSection } from "./Sheet";

export class SubGrid extends BaseComponent {
  type: string = Constants.SubGrid;
  sheet?: SheetSection;
  constructor(opts: Partial<BaseComponent & SubGrid>, sheet: SheetSection) {
    super(opts);
    this.sheet = sheet;

  }
}
