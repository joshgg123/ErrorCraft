import { Engine, Sprite, SpriteSheet, TileMap, Vector } from "excalibur";
import { config } from "../config";
import { Resources } from "../resource";
import { Building } from "./building"; // Importa la clase Building

export class Grid {
  public backgroundMap: TileMap;
  public mapchipSpriteSheet: SpriteSheet;
  public grasslandSprite: Sprite;
  public carpaSprites: Sprite[];

  constructor(engine: Engine, numOfRow: number, numOfCol: number) {
    this.mapchipSpriteSheet = SpriteSheet.fromImageSource({
      image: Resources.mapchip,
      grid: {
        rows: 31,
        columns: 57,
        spriteHeight: 16,
        spriteWidth: 16,
      },
      spacing: {
        margin: {
          x: 1,
          y: 1,
        },
      },
    });

    this.grasslandSprite = this.mapchipSpriteSheet.getSprite(5, 0)!;
    this.grasslandSprite.width = config.TileWidth;
    this.grasslandSprite.height = config.TileWidth;

    // Asegúrate de que tienes las cuatro partes del sprite 2x2
    this.carpaSprites = [
      this.mapchipSpriteSheet.getSprite(46, 10)!, // Parte superior izquierda
      this.mapchipSpriteSheet.getSprite(47, 10)!, // Parte superior derecha
      this.mapchipSpriteSheet.getSprite(46, 11)!, // Parte inferior izquierda
      this.mapchipSpriteSheet.getSprite(47, 11)!, // Parte inferior derecha
    ];

    for (const sprite of this.carpaSprites) {
      sprite.width = config.TileWidth;
      sprite.height = config.TileWidth;
    }

    const tileMapConfig = {
      pos: Vector.Zero,
      rows: numOfRow,
      columns: numOfCol,
      tileWidth: config.TileWidth,
      tileHeight: config.TileWidth,
    };
    this.backgroundMap = new TileMap(tileMapConfig);

    engine.add(this.backgroundMap);

    this.initGrassland(numOfRow, numOfCol);

    // Asegúrate de que el tilemap está inicializado antes de intentar añadir carpa
    this.buildCarpa(5, 5);
  }

  initGrassland(numOfRow: number, numOfCol: number) {
    for (let row = 0; row < numOfRow; row++) {
      for (let col = 0; col < numOfCol; col++) {
        this.buildGrassland(row, col);
      }
    }
  }

  buildGrassland = (row: number, col: number) => {
    const cell = this.backgroundMap.getTile(col, row);
    if (cell) {
      cell.addGraphic(this.grasslandSprite);
    } else {
      console.warn(`No se pudo obtener el tile en la posición (${col}, ${row})`);
    }
  };

  buildCarpa = (row: number, col: number) => {
    const positions = [
      { row, col, sprite: this.carpaSprites[0] }, // Parte superior izquierda
      { row, col: col + 1, sprite: this.carpaSprites[1] }, // Parte superior derecha
      { row: row + 1, col, sprite: this.carpaSprites[2] }, // Parte inferior izquierda
      { row: row + 1, col: col + 1, sprite: this.carpaSprites[3] } // Parte inferior derecha
    ];

    for (const pos of positions) {
      const cell = this.backgroundMap.getTile(pos.col, pos.row);
      if (cell) {
        cell.addGraphic(pos.sprite);
      } else {
        console.warn(`No se pudo obtener el tile en la posición (${pos.col}, ${pos.row})`);
      }
    }
  };

  buildBuilding = (engine: Engine, row: number, col: number, playerMoney: number, buildingCost: number) => {
    if (playerMoney >= buildingCost) {
      const pos = this.getTileCenter(col, row);
      const building = new Building(pos, buildingCost);
      engine.add(building);
      return playerMoney - buildingCost; // Deduce el costo del edificio del dinero del jugador
    } else {
      console.log("Not enough money to build the building");
      return playerMoney; // No cambia el dinero del jugador si no hay suficiente
    }
  };

  getTileCenter(x: number, y: number): Vector {
    const tile = this.backgroundMap.getTile(x, y);
    if (tile) {
      return tile.center;
    } else {
      console.warn(`No se pudo obtener el centro del tile en la posición (${x}, ${y})`);
      return Vector.Zero;
    }
  }
}