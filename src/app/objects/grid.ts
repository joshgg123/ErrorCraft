import { Engine, Sprite, SpriteSheet, TileMap, Vector } from 'excalibur';
import { config } from "../config";
import { Resources } from "../resource";
import { Building } from "./building";
import { doc, setDoc, collection, getDocs, getDoc, updateDoc, onSnapshot } from "firebase/firestore";
import { db } from "../firebase/page"; // Ajusta la ruta según sea necesario

export class Grid {
  public backgroundMap!: TileMap;
  public mapchipSpriteSheet: SpriteSheet;
  public pastoSprite: Sprite;
  public carpaSprites: Sprite[];
  private buildings: Building[] = [];
  private coins: number = 0;
  private iron: number = 0;
  private userId: string;
  private coinCallback: (coins: number) => void;
  private ironCallback: (iron: number) => void;

  constructor(engine: Engine, numOfRow: number, numOfCol: number, userId: string ,coinCallback: (coins: number) => void,ironCallback:(iron:number)=>void) {
    this.userId = userId;
    this.coinCallback = coinCallback;
    this.ironCallback = ironCallback;
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

    // Cargar edificios desde Firebase
    this.loadBuildings(engine, userId).then(() => {
      console.log("Edificios cargados desde Firebase");
      this.startEarningsInterval();
    });
    this.listenToIronChanges();
    // Cargar y escuchar cambios en monedas del usuario desde Firebase
    this.listenToCoinChanges();
  }

  private startEarningsInterval() {
    setInterval(async () => {
      await this.calculateEarnings();
    }, 3000);
  }

  private async loadCoins(): Promise<number> {
    const userDoc = await getDoc(doc(db, "users", this.userId));
    if (userDoc.exists()) {
      return userDoc.data().Coins || 0;
    }
    return 0;
  }

  private async updateCoins(newAmount: number) {
    this.coins = newAmount;
    await updateDoc(doc(db, "users", this.userId), {
      Coins: this.coins,
    });
    
  }
  private async loadIron(): Promise<number> {
    const userDoc = await getDoc(doc(db, "users", this.userId));
    if (userDoc.exists()) {
      return userDoc.data().Iron || 0;
    }
    return 0;
  }
  private async updateIron(newAmount: number) {
    this.iron = newAmount;
    await updateDoc(doc(db, "users", this.userId), {
      Iron: this.iron,
    });
    this.ironCallback(this.iron); // Asegúrate de que el callback se llama para actualizar la UI
  }
  

  private async calculateEarnings() {
    let earnings = 0;
    let iron = 0;
    for (const building of this.buildings) {
      switch (building.type) {
        case 'Factory':
          earnings += 10; // Ejemplo de ganancia por fábrica
          break;
        case 'Home':
          earnings += 5; // Ejemplo de ganancia por casa
          break;
       
        case 'Iron':
          iron += 2 * building.workers; // Producción de hierro por número de trabajadores asignados
          break;
        // Añade más casos según los tipos de edificios
      }
    }
    await this.updateCoins(this.coins + earnings);
    await this.updateIron(this.iron + iron);
  }
  

  private listenToCoinChanges() {
    const coinDoc = doc(db, "users", this.userId);
    onSnapshot(coinDoc, (docSnapshot) => {
      if (docSnapshot.exists()) {
        const data = docSnapshot.data();
        const newCoinValue = data.Coins || 0;
        this.coins = newCoinValue;
        this.coinCallback(this.coins); // Llama al callback para actualizar la interfaz
      }
    });
  }
  private listenToIronChanges() {
    const ironDoc = doc(db, "users", this.userId);
    onSnapshot(ironDoc, (docSnapshot) => {
      if (docSnapshot.exists()) {
        const data = docSnapshot.data();
        const newIronValue = data.Iron || 0;
        this.iron = newIronValue;
        this.ironCallback(this.iron); // Llama al callback para actualizar la interfaz
      }
    });
  }
  async saveBuilding(building: Building, userId: string, buildingType: string) {
    const buildingRef = doc(collection(db, "users", userId, "buildings"));
    await setDoc(buildingRef, {
      pos: { x: building.pos.x, y: building.pos.y },
      type: buildingType,
      // Otros datos que quieras guardar
    });
  }

  async loadBuildings(engine: Engine, userId: string) {
    const querySnapshot = await getDocs(collection(db, "users", userId, "buildings"));
    querySnapshot.forEach(doc => {
      const data = doc.data();
      const pos = new Vector(data.pos.x, data.pos.y);
      const buildingSprite = this.getBuildingSprite(data.type);
      if (buildingSprite) {
        const building = new Building(pos, buildingSprite, data.type);
        this.buildings.push(building);
        engine.add(building);
      } else {
        console.error(`Sprite no encontrado para el tipo de edificio: ${data.type}`);
      }
    });
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

  async buildBuilding(engine: Engine, row: number, col: number, playerMoney: number, playerIron:number, buildingCost: number, buildingType: string, userId: string): Promise<number> {
    console.log(`Intentando construir un edificio en (${col}, ${row}) con tipo ${buildingType}`);
    console.log(`Dinero del jugador: ${playerMoney}, Costo del edificio: ${buildingCost}`);
    
    if (playerMoney >= buildingCost && !this.isTileOccupied(col, row)) {
      console.log(`Construyendo edificio...`);
      const pos = this.getTileCenter(col, row);
    
      const buildingSprite = this.getBuildingSprite(buildingType);
      if (buildingSprite) {
        const building = new Building(pos, buildingSprite, buildingType);
        this.buildings.push(building);
        engine.add(building);
    
        await this.saveBuilding(building, userId, buildingType);
        console.log(`Edificio construido y guardado en Firebase`);
    
        // Actualiza el dinero del jugador localmente
        const newPlayerMoney = playerMoney - buildingCost;
        await this.updateCoins(newPlayerMoney); // Actualiza en Firebase
        return newPlayerMoney; // Devuelve el nuevo valor de dinero
    
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
      // Aquí define los tipos de edificio que necesites
      case 'Home':
        const imageSource = Resources.waterbomb;
        if (imageSource) {
          return new Sprite({
            image: imageSource,
          });
        }
      case 'Factory':
        const imageSource2 = Resources.factory;
        if (imageSource2) {
          return new Sprite({
            image: imageSource2,
          });
        }
        break;
      case 'Iron':
        const imageSource3 = Resources.iron;
        if (imageSource3) {
          return new Sprite({
            image: imageSource3,
          });
        }
        break;

      default:
        console.error(`Tipo de edificio desconocido: ${buildingType}`);
        return null;
    }

    return null;
  }

  isTileOccupied(col: number, row: number): boolean {
    return this.buildings.some(building => {
      const buildingTileX = Math.floor(building.pos.x / config.TileWidth);
      const buildingTileY = Math.floor(building.pos.y / config.TileWidth);
      return buildingTileX === col && buildingTileY === row;
    });
  }
  public getBuildingAt(col: number, row: number): Building | null {
    return this.buildings.find(building => {
      const buildingTileX = Math.floor(building.pos.x / config.TileWidth);
      const buildingTileY = Math.floor(building.pos.y / config.TileWidth);
      return buildingTileX === col && buildingTileY === row;
    }) || null;
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
