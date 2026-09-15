interface INeedGetValue{
  getValue(): any;
}
export class BaseComponent {
  type?: string;
  id?: string;
  label?: string;
  row?: number;
  col?: number;
  height?: number;
  width?: number;
  // style: Record<string, any> = {};

  [k: string]: any;

  constructor(init?: Partial<BaseComponent>) {
    if (init) Object.assign(this, init);
    if (!this.width) this.width = 1;
    if (!this.height) this.height = 1;
  }

  public getValue(): any {
    // it's temporary for components not yet fully implemented
    // if you see this, i forgot to finish it
    if(this.constructor.name == "BaseComponent") return '';
    throw new Error("[BaseComponent] getValue() not implemented for " + this.constructor.name);
  }
}

export type ComponentOptions = BaseComponent

