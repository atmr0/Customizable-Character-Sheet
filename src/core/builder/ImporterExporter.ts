import * as BuilderIndex from "./";
import { Constants } from "@core/constants";
import { SheetBuilder } from "./SheetBuilder";

export default class ImporterExporter {

  public static importData(sheet: BuilderIndex.Sheet, values: any): BuilderIndex.Sheet {
    const sheetBuilder = new SheetBuilder();
    for (const key in values) {
      if (typeof values[key] == 'object') {
        // for (const subKey in values[key]) {
        //   sheetBuilder.sheet.components![key][subKey] = values[key][subKey];
        // }
      }
    }
    return sheetBuilder.build();
  }

  public static exportModel(sheet: BuilderIndex.Sheet) {
    let model: any = {};
    for (const key in sheet.components!) {
      if (sheet.components[key].type != Constants.ItemList) {
        model[key] = { ...sheet.components[key] };
        continue;
      }

      

    }
    return model
  }
}