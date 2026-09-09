export class BaseComponent {
  type?: string;
  id?: string;
  label?: string;
  row?: number;
  col?: number;
  height?: number;
  width?: number;
  style: Record<string, any> = {};

  [k: string]: any;

  constructor(init?: Partial<BaseComponent>) {
    if (init) Object.assign(this, init);
    if (!this.width) this.width = 1;
    if (!this.height) this.height = 1;
  }
}

export type ComponentOptions = Partial<BaseComponent>;

export type Sheet = {
  title?: string;
  id?: string;
  numberOfLines?: number;
  rowLength?: number;
  components?: ComponentOptions[];
  styles?: Record<string, any>;
  styleTag?: string;
};

// For better reading and understanding in SubGrids and Lists
export type SheetSection = Sheet;