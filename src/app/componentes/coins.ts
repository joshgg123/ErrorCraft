import * as ex from 'excalibur';
import { Resources } from '../resource'; // Ajusta la ruta según sea necesario

interface CoinOptions {
  numberOfCoins: number;
  x: number;
  y: number;
}

export class Coin extends ex.Actor {
  private numberOfCoins: number;
  private label: ex.Label;
    
  constructor(options: CoinOptions) {
    super({
      pos: new ex.Vector(options.x, options.y),
      width: 32,
      height: 32
    });

    this.numberOfCoins = options.numberOfCoins;

    const spriteSheet = ex.SpriteSheet.fromImageSource({
      image: Resources.coins,
      grid: {
        rows: 1,
        columns: 10,
        spriteWidth: 32,
        spriteHeight: 32
      }
    });

    const coinAnimation = ex.Animation.fromSpriteSheet(spriteSheet, ex.range(0, 9), 200);
    this.graphics.add('coin', coinAnimation);
    this.graphics.use('coin');

    this.label = new ex.Label({
      text: `${this.numberOfCoins}`,
      pos: new ex.Vector(40, 16),
      font: new ex.Font({
        size: 24,
        unit: ex.FontUnit.Px,
        color: ex.Color.White
      })
    });

    this.addChild(this.label);
  }

  public setNumberOfCoins(coins: number) {
    this.numberOfCoins = coins;
    this.label.text = `${coins}`;
  }
}
