import { Application, Container, Graphics, Sprite, Assets } from "pixi.js";
import { initDevtools } from "@pixi/devtools";
import { createField } from "./utils/createField";
import { CELL_SIZE, GRID_SIZE } from "./consts";
import { Hero } from "./models/Hero";
import { StateMachine } from "./fsm/StateMachine";

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
  fieldContainer.x = CELL_SIZE * 1.5;
  fieldContainer.y = CELL_SIZE * 1.5;
  app.stage.addChild(fieldContainer);

  const { grid } = createField();
  grid.forEach((row) =>
    row.forEach((cell) => fieldContainer.addChild(cell.cell))
  );

  const hero = new Hero(100);
  fieldContainer.addChild(hero);

  let currentColumn = 0;
  let targetX = 0;
  let targetY = 0;

  let selectedCell: null | { cell: Graphics; mine: boolean } = null;

  const stateMachine = new StateMachine(GameState.INIT);

  function activateColumn(column) {
    grid.forEach((row, rowIndex) => {
      const cell = grid[rowIndex][column].cell;
      cell.interactive = true;
      cell.buttonMode = true;

      // Handle click event
      cell.on("pointerdown", () => {
        deactivateColumn(column);

        selectedCell = grid[rowIndex][column];

        targetY = rowIndex * CELL_SIZE + CELL_SIZE;
        targetX = column * CELL_SIZE + CELL_SIZE;
        stateMachine.changeState(GameState.MOVE);
      });
    });
  }

  function deactivateColumn(column) {
    // Remove interactivity for the current column
    grid.forEach((row, rowIndex) => {
      const cell = grid[rowIndex][column].cell;
      cell.interactive = false;
      cell.buttonMode = false;
      cell.removeAllListeners("pointerdown");
    });
  }

  // Add states and logic to the state machine
  stateMachine.addState(GameState.INIT, {
    onEnter: () => {
      currentColumn = 0;
      hero.setPosition(0, CELL_SIZE * 2);
      stateMachine.changeState(GameState.CHOOSE_OPTION);
    },
  });

  stateMachine.addState(GameState.CHOOSE_OPTION, {
    onEnter: () => {
      activateColumn(currentColumn);
    },
  });

  stateMachine.addState(GameState.MOVE, {
    onEnter: () => {
      console.log(
        `Moving to column ${currentColumn} at position (${targetX}, ${targetY})`
      );
    },

    onUpdate: () => {
      const speed = 0.1; // Adjust interpolation factor for smoothness

      hero.setPosition(
        hero.x + (targetX - hero.x) * speed,
        hero.y + (targetY - hero.y) * speed
      );

      // Check if hero has reached the target position (close enough)
      if (Math.abs(hero.x - targetX) < 1 && Math.abs(hero.y - targetY) < 1) {
        hero.setPosition(targetX, targetY);

        if (!!selectedCell?.mine) {
          stateMachine.changeState(GameState.EXPLODE);
        } else {
          currentColumn++;
          if (currentColumn >= GRID_SIZE) {
            stateMachine.changeState(GameState.WIN);
          } else {
            stateMachine.changeState(GameState.CHOOSE_OPTION);
          }
        }
      }
    },
  });

  stateMachine.addState(GameState.EXPLODE, {
    onEnter: () => {
      hero.startExplosion(() => {
        stateMachine.changeState(GameState.GAME_OVER); // Transition after explosion completes
      });
    },
  });
  

  stateMachine.addState(GameState.WIN, {
    onEnter: () => {
      console.log("You Win!");
      setTimeout(() => stateMachine.changeState(GameState.GAME_OVER), 1000);
    },
  });

  stateMachine.addState(GameState.GAME_OVER, {
    onEnter: () => {
      console.log("Game Over");
      // Optionally, add logic here to restart the game or show a "Game Over" screen
    },
  });

  // Main game loop
  app.ticker.add(({ deltaTime }) => {
    stateMachine.update(deltaTime);
  });
})();
