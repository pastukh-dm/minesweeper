import { Graphics } from "pixi.js";
import { GRID_SIZE, CELL_SIZE, DEBUG } from "../consts";

export function createField() {
  const grid = Array.from({ length: GRID_SIZE }, () =>
    Array(GRID_SIZE).fill({ cell: null, mine: false })
  );

  for (let col = 0; col < GRID_SIZE; col++) {
    const mineRow = Math.floor(Math.random() * GRID_SIZE);
    for (let row = 0; row < GRID_SIZE; row++) {
      const mine = row === mineRow;

      const cell = new Graphics();
      cell.rect(0, 0, CELL_SIZE, CELL_SIZE);
      cell.fill({ color: DEBUG && mine ? 0xffcccc : 0xcccccc });
      cell.stroke({ color: 0x000000, width: 2 });
      cell.x = col * CELL_SIZE;
      cell.y = row * CELL_SIZE;
      cell.interactive = true;

      grid[row][col] = { cell, mine };
    }
  }

  console.log({ grid });

  return { grid };
}
