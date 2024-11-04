import { Container, Texture } from "pixi.js";
import { MineCell } from "./MineCell";

export class MineField extends Container {
  private cellSize: number;
  private tileTexture: Texture;
  private mineTexture: Texture;
  private gridSizeX: number;
  private gridSizeY: number;

  constructor(
    cellSize: number,
    gridSizeX: number,
    gridSizeY: number,
    tileTexture: Texture,
    mineTexture: Texture
  ) {
    super();
    this.cellSize = cellSize;
    this.tileTexture = tileTexture;
    this.mineTexture = mineTexture;
    this.gridSizeX = gridSizeX;
    this.gridSizeY = gridSizeY;
    this.generateGrid();
  }

  private generateGrid() {
    for (let col = 0; col < this.gridSizeX; col++) {
      const mineRow = Math.floor(Math.random() * this.gridSizeY);
      for (let row = 0; row < this.gridSizeY; row++) {
        const mine = row === mineRow;
        const cell = new MineCell(
          this.cellSize,
          mine,
          row,
          col,
          this.tileTexture,
          this.mineTexture
        );

        cell.x = col * (this.cellSize + 5);
        cell.y = row * (this.cellSize + 5);
        this.addChild(cell);
      }
    }
  }

  reset() {
    this.removeChildren();
    this.generateGrid();
  }

  activateColumn(column: number, onClick: (cell: MineCell) => void) {
    this.children.forEach((child) => {
      if (child instanceof MineCell && child.col === column) {
        child.activate();

        child.on("pointerdown", () => {
          this.deactivateColumn(column);
          onClick(child);
        });
      }
    });
  }

  deactivateColumn(column: number) {
    this.children.forEach((child) => {
      if (child instanceof MineCell && child.col === column) {
        child.deactivate();
        child.removeAllListeners("pointerdown");
        if (child.mine) {
          setTimeout(() => {
            child.showMine();
          }, 1000);
        }
      }
    });
  }
}
