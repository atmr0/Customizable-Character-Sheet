import {valuesStore, ValuesMap, updateValueStore} from "@core/valuesStore";
import type { Subscriber } from "svelte/store";

export class BaseComponent {
  type?: string;
  id?: string;
  label?: string;
  row?: number;
  col?: number;
  height?: number;
  width?: number;
  // style: Record<string, any> = {};
  protected unsubscribe?: () => void;

  [k: string]: any;

  constructor(init?: Partial<BaseComponent>) {
    if (init) Object.assign(this, init);
    if (!this.width) this.width = 1;
    if (!this.height) this.height = 1;
  }

  protected setValueStoreHandler( sub:Subscriber<ValuesMap>|undefined = undefined) {
    if (this.unsubscribe) this.unsubscribe();
    if (sub) this.unsubscribe = valuesStore.subscribe(sub);
  }

  public getValue(): any {
    // it's temporary for components not yet fully implemented
    // if you see this, i forgot to finish it
    if (this.constructor.name == "BaseComponent") {
      return this.value;
    }

    throw new Error("[BaseComponent] getValue() not implemented for " + this.constructor.name);
  }
  public setValue(value: any): any {
    if (this.constructor.name == "BaseComponent") {
      this.value = value;
      return;
    }
    throw new Error("[BaseComponent] setValue() not implemented for " + this.constructor.name);
  }

  public updateValueStore(id:string, value: any) {
    updateValueStore(id, value);
  }
}

export type ComponentOptions = BaseComponent

