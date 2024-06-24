import * as ex from 'excalibur';
import { Resources } from '../resource'; // Ajusta la ruta según sea necesario
import { Engine, Sprite } from "excalibur";

interface CoinOptions {
  
  x: number;
  y: number;
  z?: number;
}

export class Iron extends ex.Actor {
  private numberOfCoins: number;
  private label: ex.Label;
  private coin: Sprite;

  constructor(engine: Engine, options: CoinOptions) {
    super({
      pos: new ex.Vector(options.x, options.y),
      width: 128,
      height: 128,
      z: options.z
    });
    //inicializacion de
    this.numberOfCoins = 0;
    this.coin = Resources.ironOre.toSprite();
    this.graphics.use(this.coin);

   
    // Crear la etiqueta
    this.label = new ex.Label({
      z: 1000,
      text: `${this.numberOfCoins}`,
      pos: new ex.Vector(40, 15), // Ajusta la posición de la etiqueta según sea necesario
      font: new ex.Font({
        size: 24,
        unit: ex.FontUnit.Px,
        color: ex.Color.White,
        textAlign: ex.TextAlign.Center,
        baseAlign: ex.BaseAlign.Middle,
        family: "Arial"
      })
    });

    this.addChild(this.label);
    engine.add(this);
  }

  public setNumberOfCoins(coins: number) {
    this.numberOfCoins = coins;
    this.label.text = `${coins}`;
  }
 
}
