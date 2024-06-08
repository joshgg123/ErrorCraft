import { Actor, Vector, Sprite, Timer, SpriteSheet, CollisionType, Animation, Engine } from 'excalibur';
import { Resources } from '../resource';

// Variable global para el dinero del jugador
let playerMoney = 2000;

export class Building extends Actor {
  public constructionSprite: Sprite;
  public BombaSpriteSheet: SpriteSheet;
  public mapchipSpriteSheet: SpriteSheet;
  public completedAnimation: Animation;
  private isCompleted: boolean;

  constructor(pos: Vector, sprite: Sprite, imagePath: string) {
    super({
      pos,
      width: 64,
      height: 64,
      collisionType: CollisionType.Fixed
    });

    this.graphics.add(sprite);
    this.isCompleted = true;
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
    const constructionTimer = new Timer({
      fcn: () => this.completeConstruction(),
      interval: 5000,
      repeats: false
    });
    engine.currentScene.add(constructionTimer);
    constructionTimer.start();

    const moneyTimer = new Timer({
      fcn: () => this.addMoney(),
      interval: 10000, // 10 segundos
      repeats: true
    });
    engine.currentScene.add(moneyTimer);
    moneyTimer.start();
  }

  private completeConstruction() {
    this.isCompleted = true;
    this.graphics.use(this.completedAnimation);
    this.completedAnimation.reset();
  }

  private addMoney() {
    if (this.isCompleted) {
      playerMoney += 100;
      console.log(`Money: ${playerMoney}`);
    }
  }
}
