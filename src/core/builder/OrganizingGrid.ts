export default class OrganizingGrid {
  public rowLength: number;
  public occupiedPositions: Set<string> = new Set();
  public currentRow = 1;
  public currentColumn: number = 1;

  constructor(rowLength: number) {
    this.rowLength = rowLength;
  }

  addItem(row: number, col: number, w: number = 1, h: number = 1) {
    if (col + w - 1 > this.rowLength) console.error("Elemento passando da linha")
    for (let i = row; i < row + h; i += 1) {
      for (let j = col; j < col + w; j += 1) {
        if (this.occupiedPositions.has(`${i}, ${j}`)) {
          console.error("Componentes se sobrepondo")
          return
        }
        else this.occupiedPositions.add(`${i}, ${j}`)
      }
    }
  }

  increasePosition(w: number = 1) {
    this.currentColumn += w;
    if (this.currentColumn > this.rowLength) {
      this.currentColumn = 1;
      this.currentRow += 1;
    }
  }

  private isBlockFree(row: number, col: number, w: number, h: number): boolean {
    if (col + w - 1 > this.rowLength) return false;
    for (let i = row; i < row + h; i += 1) {
      for (let j = col; j < col + w; j += 1) {
        if (this.occupiedPositions.has(`${i}, ${j}`)) return false;
      }
    }
    return true;
  }

  checkFirstEmpty(w: number = 1, h: number = 1): [number, number] {
    let attempts = 0;
    const maxAttempts = Math.max(1000, this.rowLength * 1000);
    while (!this.isBlockFree(this.currentRow, this.currentColumn, w, h) && attempts < maxAttempts) {
      this.increasePosition();
      attempts += 1;
    }
    return [this.currentRow, this.currentColumn]
  }
}
