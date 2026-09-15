import { ItemList } from "./ItemList";
import { type ComponentOptions } from "./BaseComponent";

export class Sheet {
  title?: string;
  id?: string;
  numberOfLines?: number;
  rowLength?: number;
  components?: Record<string, ComponentOptions>;
  styles?: Record<string, any>;
  styleTag?: string;
  constructor(init?: Partial<Sheet>) {
    if (init) Object.assign(this, init);
  }

  public importData(data: any) {
    if (!this.components) return;
    for (const key in data) {
      if (this.components[key] && this.components[key] instanceof ItemList) {

      }
    }
  }

  public exportData() {
    let data: Record<string, any> = {};
    if (!this.components) return data;
    for (const key in this.components) {
      let value = this.components[key].getValue();
      if(value) data[key] = value;
    }
    console.log(this.id, data)
    return data;
  }
}

// For better reading and understanding in SubGrids and Lists
export type SheetSection = Sheet;