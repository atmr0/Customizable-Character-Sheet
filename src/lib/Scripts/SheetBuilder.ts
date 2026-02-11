// Fluent builder API to construct sheet objects in code instead of JSON.
// Usage example:
// const sheet = new SheetBuilder('My Sheet')
//   .cols(6)
//   .row(r => r.textField('player_name', { label: 'Player Name', colspan: 4 }))
//   .row(r => r.staticText('note', { text: 'Some note' }))
//   .build();

export type Cell = {
  type?: string;
  id?: string;
  label?: string;
  text?: string;
  value?: any;
  placeholder?: string;
  colspan?: number;
  rowspan?: number;
  sheet?: Sheet; // for subgrids
  [k: string]: any;
};

export type Sheet = {
  title?: string;
  id?: string;
  rows?: number;
  cols?: number;
  cells: Cell[][];
};

function ensureId(prefix = 'cell'){
  return `${prefix}-${Math.random().toString(36).slice(2,9)}`;
}

export class RowBuilder {
  private row: Cell[] = [];

  add(cell: Cell){
    if(!cell.id) cell.id = ensureId(cell.type || 'cell');
    this.row.push(cell);
    return this;
  }

  textField(idOrOpts: string | Partial<Cell>, opts?: Partial<Cell>){
    if(typeof idOrOpts === 'string'){
      const id = idOrOpts;
      return this.add({ type: 'TextField', id, ...opts });
    }
    return this.add({ type: 'TextField', ...(idOrOpts as Partial<Cell>) });
  }

  staticText(idOrOpts: string | Partial<Cell>, opts?: Partial<Cell>){
    if(typeof idOrOpts === 'string'){
      const id = idOrOpts;
      return this.add({ type: 'StaticText', id, ...opts });
    }
    return this.add({ type: 'StaticText', ...(idOrOpts as Partial<Cell>) });
  }

  subGrid(id: string | Partial<Cell>, sheet: Sheet){
    if(typeof id === 'string'){
      return this.add({ type: 'SubGrid', id, sheet });
    }
    return this.add({ type: 'SubGrid', ...(id as Partial<Cell>), sheet });
  }

  build(){
    return this.row;
  }
}

export class SheetBuilder {
  private sheet: Sheet;

  constructor(title?: string){
    this.sheet = { title, id: undefined, rows: 0, cols: 1, cells: [] } as Sheet;
  }

  id(v: string){ this.sheet.id = v; return this; }
  title(v: string){ this.sheet.title = v; return this; }
  cols(n: number){ this.sheet.cols = n; return this; }
  rows(n: number){ this.sheet.rows = n; return this; }

  row(fn: (r: RowBuilder) => RowBuilder){
    const rb = new RowBuilder();
    fn(rb);
    this.sheet.cells.push(rb.build());
    return this;
  }

  rowsFrom(rows: Cell[][]){
    for(const r of rows) this.sheet.cells.push(r);
    return this;
  }

  build(){
    this.sheet.rows = this.sheet.cells.length || this.sheet.rows;
    return this.sheet;
  }
}

export default SheetBuilder;
