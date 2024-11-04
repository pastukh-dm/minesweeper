import { AnimatedSprite, Texture } from "pixi.js";
import gsap from "gsap";

type AnimationName = "idle" | "walk" | "hurt" | "die";

export class Hero extends AnimatedSprite {
  public isExploding: boolean = false;
  public frames: { [key: string]: Texture[] };
  public currentAnimation: string;
  private size: number;

  constructor(
    size: number,
    textures: { [key in AnimationName]: Texture[] },
    initialAnimation: AnimationName = "idle"
  ) {
    super(textures[initialAnimation]);
    this.frames = textures;
    this.currentAnimation = initialAnimation;
    this.scale.set(size / 781);
    this.anchor.set(0.5);
    this.animationSpeed = 0.2;
    this.size = size;
    this.play();
  }
  reset() {
    this.scale.set(this.size / 781);
  }

  setPosition(x: number, y: number) {
    console.log(`Setting hero position to (${x}, ${y})`);
    this.x = x;
    this.y = y;
    return this;
  }

  playAnimation(animation: AnimationName) {
    if (this.currentAnimation !== animation) {
      this.currentAnimation = animation;
      this.textures = this.frames[animation];
      this.loop = true;
      this.play();
    }
  }

  playAnimationOnce(animation: AnimationName, onComplete?: () => void) {
    if (this.currentAnimation !== animation) {
      this.currentAnimation = animation;
      this.textures = this.frames[animation];
      this.loop = false;
      this.play();

      this.onComplete = () => {
        this.onComplete = undefined;
        if (onComplete) onComplete();
      };
    }
  }

  moveTo(x: number, y: number, onComplete?: () => void) {
    this.playAnimation("walk");

    gsap.to(this, {
      x,
      y,
      duration: 1,
      onComplete,
    });
  }
}
