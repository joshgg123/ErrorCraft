
import { Actor, Vector, Sprite, Timer, SpriteSheet, CollisionType, Animation, range} from 'excalibur';
import { Resources } from '../resource';
import { Engine } from 'excalibur';
import ex from 'excalibur';
import { config } from '../config';
import { Coin } from '../componentes/coins';
export class Building extends Actor {
  public constructionSprite: Sprite;
  public BombaSpriteSheet: SpriteSheet;
  public mapchipSpriteSheet: SpriteSheet;
  public completedAnimation: Animation;
  private isCompleted: boolean;
  private moneyProductionInterval: number; // Intervalo en milisegundos para producir dinero
  private moneyProductionAmount: number; // Cantidad de dinero producida en cada intervalo
  private playerMoney: number; // Referencia al dinero del jugador
  constructor(pos: Vector, sprite: Sprite) {
    super({
      pos,
      width: 64,
      height: 64,
      collisionType: CollisionType.Fixed
    });
    //colision con el jugador 
    
    this.graphics.add(sprite);
    //this.cost = cost;
    this.isCompleted = false;
    this.moneyProductionInterval = 2000; // Producción de dinero cada 2 segundos
    this.moneyProductionAmount = 100; // Produce 100 unidades de dinero cada vez
    this.playerMoney = config.PlayerMoney; // Referencia al dinero del jugador
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
    this.BombaSpriteSheet = SpriteSheet.fromImageSource({
      image: Resources.bombaAgua,
      grid: {
        rows: 1,
        columns: 5,
        spriteWidth: 68,
        spriteHeight: 64
      }
      
    });
    
    this.completedAnimation = Animation.fromSpriteSheet(this.BombaSpriteSheet, [0, 1, 2, 3, 4], 200);

    this.constructionSprite = this.mapchipSpriteSheet.getSprite(41, 10)!;
    this.constructionSprite.width = 64;
    this.constructionSprite.height = 64;
    this.graphics.use(this.constructionSprite);

  }
  onInitialize(engine: Engine) {
    const timer = new Timer({
      fcn: () => this.completeConstruction(engine),
      interval: 5000,
      repeats: false
    });
    engine.currentScene.add(timer);
    timer.start();
  }
  private completeConstruction(engine: Engine) {
    this.isCompleted = true;
    this.graphics.use(this.completedAnimation);
    this.completedAnimation.reset();
    // Iniciar el temporizador para producir dinero
    const moneyProductionTimer = new Timer({
      fcn: () => this.produceMoney(),
      interval: this.moneyProductionInterval,
      repeats: true
    });
    engine.currentScene.add(moneyProductionTimer);
    moneyProductionTimer.start();
  }


  private produceMoney() {
    this.playerMoney += this.moneyProductionAmount;
    console.log(`Player money: ${this.playerMoney}`); // Mostrar el dinero del jugador en la consola
    
    
  }

}


