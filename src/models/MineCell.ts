import { Sprite, Texture } from "pixi.js";
import gsap from "gsap";
import { DEBUG } from "../consts";

export class MineCell extends Sprite {
  public mine: boolean;
  public row: number;
  public col: number;
  private mineTexture: Texture;

  constructor(cellSize: number, mine: boolean, row: number, col: number, tileTexture: Texture, mineTexture: Texture) {
      super(mine && DEBUG ? mineTexture : tileTexture);
      this.mineTexture = mineTexture;

    this.mine = mine;
    this.row = row;
    this.col = col;

    this.width = cellSize;
    this.height = cellSize;
    this.alpha = 0.5;

    this.on("pointerover", this.onHoverStart);
    this.on("pointerout", this.onHoverEnd);
  }

  activate() {
    this.interactive = true;
    this.cursor = "pointer";
    this.alpha = 0.75;
  }

  deactivate() {
    this.interactive = false;
    this.cursor = undefined;
    this.alpha = 0.5;
  }

  showMine() {
    this.texture = this.mine ? this.mineTexture : this.texture;
  }

  private onHoverStart = () => {
    if (this.interactive) {
      gsap.to(this, { alpha: 1, duration: 0.1 });
    }
  };

  private onHoverEnd = () => {
    gsap.to(this, { alpha: 0.75, duration: 0.1 });
  };
}
