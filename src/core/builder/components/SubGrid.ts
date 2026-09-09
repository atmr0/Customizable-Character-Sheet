import { BaseComponent, SheetSection } from "./BaseComponent";
import { Constants } from "../../constants";

export class SubGrid extends BaseComponent {
  type: string = Constants.SubGrid;
  sheet?: SheetSection;
  constructor(opts: Partial<BaseComponent & SubGrid>, sheet: SheetSection) {
    super(opts);
    this.sheet = sheet;

  }
}
