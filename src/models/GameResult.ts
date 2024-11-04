import { Container, Graphics, Text, TextStyle } from "pixi.js";

export class GameResult extends Container {
  private resultText: Text;
  private restartButton: Graphics;

  constructor(onRestart: () => void) {
    super();

    this.resultText = new Text({
      text: "",
      style: {
        fontSize: 24,
        fill: "#ffffff",
        align: "center",
      },
    });
    this.resultText.anchor.set(0.5);
    this.resultText.y = 0;
    this.addChild(this.resultText);

    this.restartButton = new Graphics();
    this.restartButton.rect(0, 0, 100, 40);
    this.restartButton.fill(0x333333);
    this.restartButton.x = -50;
    this.restartButton.y = 40;
    this.restartButton.interactive = true;
    this.restartButton.cursor = "pointer";

    const restartText = new Text({
      text: "Restart",
      style: {
        fontSize: 18,
        fill: "#ffffff",
      },
    });
    restartText.anchor.set(0.5);
    restartText.x = 50;
    restartText.y = 20;
    this.restartButton.addChild(restartText);

    this.addChild(this.restartButton);

    this.restartButton.on("pointerdown", onRestart);

    this.visible = false;
  }

  showResult(message: string) {
    console.log("Showing result:", message);

    this.resultText.text = message;
    this.visible = true;
  }

  hide() {
    this.visible = false;
  }
}
