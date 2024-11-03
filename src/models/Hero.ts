import { Graphics } from "pixi.js";


const DEFAULT_COLOR = 0x00ff00; // Green
const EXPLOSION_COLOR = 0xff0000; // Red
const YELLOW_COLOR = 0xffff00; // Yellow

export class Hero extends Graphics {
  public isExploding: boolean = false;
  private size: number;

  constructor(size: number) {
    super();
    this.size = size;
    this.pivot.set(size / 2, size / 2);
    this.x = size;
    this.y = size;
    this.drawHero();
  }

  setPosition(x: number, y: number) {
    this.x = x;
    this.y = y;
    return this;
  }

  drawHero(color: number = DEFAULT_COLOR) {
    this.clear()
      .rect(-this.size / 2, -this.size / 2, this.size, this.size)
      .fill({ color });
  }

  startExplosion(onComplete: () => void) {
    this.isExploding = true;
    let explosionCount = 0;

    const explosionInterval = setInterval(() => {
      // Toggle scale and color to create explosion effect
    //   this.scale.set(explosionCount % 2 === 0 ? 1.5 : 1);
      this.drawHero(explosionCount % 2 === 0 ? YELLOW_COLOR : EXPLOSION_COLOR);

      explosionCount++;

      if (explosionCount > 6) { // End explosion after a few cycles
        clearInterval(explosionInterval);

        // Reset scale and color to normal
        // this.scale.set(1);
        this.drawHero(EXPLOSION_COLOR); // Final red color

        this.isExploding = false;
        onComplete(); // Callback to proceed to next game state
      }
    }, 100);
  }

  stopExplosion() {
    this.isExploding = false;
    this.drawHero(DEFAULT_COLOR);
  }
}
