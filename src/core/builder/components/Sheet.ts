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

  public importData(data:any){
    if(!this.components) return;
    for(const key in data){
      if(this.components[key] && this.components[key] instanceof ItemList){
        
      }
    }
  }

  public exportData(){
    let data: Record<string, any> = {};
    if(!this.components) return data;
    for(const key in this.components){
      if(this.components[key] && this.components[key] instanceof ItemList){
        data[key] = this.exportList(key);
      }
    }
    return data;
  }
  private exportList(key:string){
    if(!this.components) return [];
    let list = this.components[key] as ItemList;
    let data = [];
    for(let i = 0; i < list.length; i++){
      data.push(list.get(i));
    }
    return data;
  }

  private importList(key:string, data:any){
    if(!this.components) return;
    let list = this.components[key] as ItemList;
    for(let i = 0; i < list.length; i++){
    }
  }
}

// For better reading and understanding in SubGrids and Lists
export type SheetSection = Sheet;