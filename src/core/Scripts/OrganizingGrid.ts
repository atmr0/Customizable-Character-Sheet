export default class OrganizingGrid {
  public rowLength: number;
  public ocuppiedPositions: Set<[number, number]> = new Set();
  public currentRow = 1;
  public currentColumn: number = 1;

  constructor(rowLength: number) {
    this.rowLength = rowLength;
  }

  addItem(row: number, col: number, w: number = 1, h: number = 1) {
    if (this.currentColumn + w - 1 > this.rowLength) console.error("Elemento passando da linha")
    for (let i = row; i < row+h; i += 1) {
      for (let j = col; j < col+w; j += 1) {
        if (this.ocuppiedPositions.has([i, j])) {
          console.error("Componentes se sobrepondo")
        }
        else this.ocuppiedPositions.add([i, j])
      }
    }
    this.increasePosition(w)
  }

  increasePosition(w: number = 1) {
    this.currentColumn += w;
    if (this.currentColumn > this.rowLength) {
      this.currentColumn = 1;
      this.currentRow += 1;
    }
  }

  checkFirstEmpty(): [number, number] {
    while (this.ocuppiedPositions.has([this.currentRow, this.currentColumn])) {
      this.increasePosition()
    }
    return [this.currentRow, this.currentColumn]
  }
}