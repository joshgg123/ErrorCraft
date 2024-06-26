import * as ex from 'excalibur';
import { Resources } from '../resource'; // Ajusta la ruta según sea necesario
import { Engine, Vector, Animation, SpriteSheet, ImageSource } from "excalibur";

interface CoinOptions {
  
  x: number;
  y: number;
  z?: number;
}

export class Coin extends ex.Actor {
  private numberOfCoins: number;
  private label: ex.Label;

  constructor(engine: Engine, options: CoinOptions) {
    super({
      pos: new ex.Vector(options.x, options.y),
      width: 128,
      height: 128,
      z: options.z
    });
    //inicializacion de
    this.numberOfCoins = 2000;

    // Crear la spritesheet
    const coinSpriteSheet = ex.SpriteSheet.fromImageSource({
      image: Resources.coin as ImageSource,
      grid: {
        rows: 1,
        columns: 10,
        spriteWidth: 32,
        spriteHeight: 32
      }
    });

    // Crear una animación a partir de la spritesheet
    const coinAnimation = ex.Animation.fromSpriteSheet(coinSpriteSheet, ex.range(0, 7), 100);

    // Usar la animación en lugar de un sprite estático
    this.graphics.use(coinAnimation);

    // Crear la etiqueta
    this.label = new ex.Label({
      z: 1000,
      text: `${this.numberOfCoins}`,
      pos: new ex.Vector(35, 3.5), // Ajusta la posición de la etiqueta según sea necesario
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
