import { Engine, Sprite, SpriteSheet, TileMap, Vector, ImageSource } from 'excalibur'
import { config } from "../config";
import { Resources } from "../resource";
import { Building } from "./building"; 


export class Grid {
  public backgroundMap!: TileMap;
  public mapchipSpriteSheet: SpriteSheet;
  public pastoSprite:Sprite;
  public carpaSprites: Sprite[];
  private buildings: Building[] = [];


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
    this.carpaSprites = [
      this.mapchipSpriteSheet.getSprite(46, 10)!, 
      this.mapchipSpriteSheet.getSprite(47, 10)!, 
      this.mapchipSpriteSheet.getSprite(46, 11)!, 
      this.mapchipSpriteSheet.getSprite(47, 11)!, 
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
    this.buildCarpa(5, 5); // Ejemplo de construcción inicial

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
  buildCarpa(row: number, col: number) {
    const positions = [
        { row, col, sprite: this.carpaSprites[0] }, 
        { row, col: col + 1, sprite: this.carpaSprites[1] }, 
        { row: row + 1, col, sprite: this.carpaSprites[2] }, 
        { row: row + 1, col: col + 1, sprite: this.carpaSprites[3] }, 
    ];

    for (const pos of positions) {
        const cell = this.backgroundMap.getTile(pos.col, pos.row);
        if (cell) {
            cell.addGraphic(pos.sprite);
        } else {
            console.warn(`No se pudo obtener el tile en la posición (${pos.col}, ${pos.row})`);
        }
    }
   this.buildings.push(new Building(this.getTileCenter(col, row), this.carpaSprites[0], "Carpa"));
    
}

buildBuilding(engine: Engine, row: number, col: number, playerMoney: number, buildingCost: number, buildingType: string): number {
  if (playerMoney >= buildingCost && !this.isTileOccupied(col, row)) {
      const pos = this.getTileCenter(col, row);

      const buildingSprite = this.getBuildingSprite(buildingType);
      if (buildingSprite) {
          const building = new Building(pos, buildingSprite, buildingType);
          this.buildings.push(building);
          engine.add(building);
          return playerMoney - buildingCost;
      } else {
          console.error(`Sprite no encontrado para el tipo de edificio: ${buildingType}`);
          return playerMoney;
      }
  } else {
      console.log("No hay suficiente dinero o el tile está ocupado");
      return playerMoney;
  }
}
getBuildingSprite(buildingType: string): Sprite | null {
  switch (buildingType) {
      case 'Home':
          const spriteSheetSprite = this.mapchipSpriteSheet.getSprite(54, 18);
          if (spriteSheetSprite) {
              return spriteSheetSprite.clone();
          }
          break; 

      // ... otros casos para sprites de SpriteSheet
     
      // Casos para imágenes simples: 
      case 'Factory': 
          const imageSource = Resources.factory; 
          if (imageSource) {
              return new Sprite({ 
                  image: imageSource,
              }); 
          }
          break;

      default:
          console.error(`Tipo de edificio desconocido: ${buildingType}`);
          return null;
  }

  // Si llegamos aquí, significa que no se encontró el sprite en el SpriteSheet
  // ni se encontró una imagen simple válida, entonces buscamos en Resources:
  const imageFromResources = Resources[`${buildingType}Image`];
  if (imageFromResources) {
      return new Sprite({ image: imageFromResources });
  }

  return null; // Si no se encuentra nada, devolvemos null
}

isTileOccupied(col: number, row: number): boolean {
    return this.buildings.some(building => {
        const buildingTileX = Math.floor(building.pos.x / config.TileWidth);
        const buildingTileY = Math.floor(building.pos.y / config.TileWidth);
        return buildingTileX === col && buildingTileY === row;
    });
}

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
