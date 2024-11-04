import { Application, Container, Assets, Texture } from "pixi.js";
import { initDevtools } from "@pixi/devtools";
import { CELL_SIZE, GRID_SIZE_X, GRID_SIZE_Y, HERO_SIZE } from "./consts";
import { Hero } from "./models/Hero";
import { StateMachine } from "./fsm/StateMachine";
import { MineField } from "./models/MineField";
import { MineCell } from "./models/MineCell";
import gsap from "gsap";
import { GameResult } from "./models/GameResult";

const GameState = {
  INIT: "INIT",
  CHOOSE_OPTION: "CHOOSE_OPTION",
  MOVE: "MOVE",
  EXPLODE: "EXPLODE",
  WIN: "WIN",
  GAME_OVER: "GAME_OVER",
};

(async () => {
  const app = new Application();
  await app.init({
    resizeTo: window,
  });

  initDevtools({ app });
  app.canvas.style.position = "absolute";
  document.body.appendChild(app.canvas);

  const fieldContainer = new Container();
  fieldContainer.x = HERO_SIZE;
  fieldContainer.y = HERO_SIZE;
  app.stage.addChild(fieldContainer);

  const cellTexture = await Assets.load("images/tile.jpg");
  const mineTexture = await Assets.load("images/tile_mine.jpg");

  const mineField = new MineField(
    CELL_SIZE,
    GRID_SIZE_X,
    GRID_SIZE_Y,
    cellTexture,
    mineTexture
  );
  fieldContainer.addChild(mineField);

  const heroSheet = await Assets.load([
    "images/hero_idle/hero_idle.json",
    "images/hero_walk/hero_walk.json",
    "images/hero_hurt/hero_hurt.json",
    "images/hero_die/hero_die.json",
  ]);

  const hero = new Hero(
    HERO_SIZE,
    {
      idle: [
        "1_IDLE_000.png",
        "1_IDLE_001.png",
        "1_IDLE_002.png",
        "1_IDLE_003.png",
        "1_IDLE_004.png",
      ].map((name) => Texture.from(name)),
      walk: [
        "2_WALK_000.png",
        "2_WALK_001.png",
        "2_WALK_002.png",
        "2_WALK_003.png",
        "2_WALK_004.png",
      ].map((name) => Texture.from(name)),
      hurt: [
        "6_HURT_000.png",
        "6_HURT_001.png",
        "6_HURT_002.png",
        "6_HURT_003.png",
        "6_HURT_004.png",
      ].map((name) => Texture.from(name)),
      die: [
        "7_DIE_000.png",
        "7_DIE_002.png",
        "7_DIE_004.png",
        "7_DIE_006.png",
        "7_DIE_009.png",
      ].map((name) => Texture.from(name)),
    },
    "idle"
  );
  fieldContainer.addChild(hero);

  const gameResult = new GameResult(() => {
    gameResult.hide();
    mineField.reset();
    hero.reset();
    hero.playAnimation("idle");
    stateMachine.changeState(GameState.INIT);
  });
  gameResult.x = fieldContainer.x + fieldContainer.width / 2;
  gameResult.y = fieldContainer.y + GRID_SIZE_Y * CELL_SIZE + 40;
  app.stage.addChild(gameResult);

  let currentColumn = 0;
  let targetX = 0;
  let targetY = 0;
  let selectedCell: null | MineCell = null;

  const stateMachine = new StateMachine(GameState.INIT);

  stateMachine.addState(GameState.INIT, {
    onEnter: () => {
      currentColumn = 0;
      const centerY = (GRID_SIZE_Y * CELL_SIZE) / 2;
      hero.setPosition(-hero.width / 2, centerY);
      stateMachine.changeState(GameState.CHOOSE_OPTION);
    },
  });

  stateMachine.addState(GameState.CHOOSE_OPTION, {
    onEnter: () => {
      hero.playAnimation("idle");
      mineField.activateColumn(currentColumn, (cell) => {
        targetX = cell.x + cell.width / 2;
        targetY = cell.y + cell.height / 2;
        selectedCell = cell;
        stateMachine.changeState(GameState.MOVE);
      });
    },
  });

  stateMachine.addState(GameState.MOVE, {
    onEnter: () => {
      hero.moveTo(targetX, targetY, () => {
        if (selectedCell?.mine) {
          stateMachine.changeState(GameState.EXPLODE);
        } else {
          currentColumn++;
          if (currentColumn >= GRID_SIZE_X) {
            stateMachine.changeState(GameState.WIN);
          } else {
            stateMachine.changeState(GameState.CHOOSE_OPTION);
          }
        }
      });
    },
  });

  let scaleAnimation: any | null = null;

  stateMachine.addState(GameState.EXPLODE, {
    onEnter: () => {
      hero.playAnimationOnce("hurt", () => {
        hero.playAnimationOnce("die", () => {
          stateMachine.changeState(GameState.GAME_OVER);
        });
        selectedCell?.showMine();

        scaleAnimation = gsap.to(hero.scale, {
          x: 0,
          y: 0,
          duration: 1,
          ease: "power2.out",
        });
      });
    },
    onExit: () => {
      if (scaleAnimation) {
        scaleAnimation.kill();
        scaleAnimation = null;
      }
    },
  });

  stateMachine.addState(GameState.WIN, {
    onEnter: () => {
      gameResult.showResult("You Win!");
      setTimeout(() => stateMachine.changeState(GameState.GAME_OVER), 1000);
    },
  });

  stateMachine.addState(GameState.GAME_OVER, {
    onEnter: () => {
      if (!gameResult.visible) {
        gameResult.showResult("Game Over");
      }
    },
  });

  app.ticker.add(({ deltaTime }) => {
    stateMachine.update(deltaTime);
  });
})();
