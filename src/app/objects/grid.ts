import { Engine, Sprite, SpriteSheet, TileMap, Vector } from "excalibur";
import { config } from "../config";
import { Resources } from "../resource";
import { Building } from "./building"; // Importa la clase Building

export class Grid {
  public backgroundMap!: TileMap;
  public mapchipSpriteSheet: SpriteSheet;
  
  public pastoSprite:Sprite;
  
  constructor(engine: Engine, numOfRow: number, numOfCol: number) {
    this.pastoSprite = new Sprite({
      image: Resources.pasto,
      destSize: {
        width: 64,
        height: 64,
      },
    });
    
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
    this.pastoSprite.width = config.TileWidth;
    this.pastoSprite.height = config.TileWidth;

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
    cell.addGraphic(this.pastoSprite);
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
    return tile.center;
  }
}
