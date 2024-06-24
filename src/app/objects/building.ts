import { Actor, Vector, Sprite, Timer, SpriteSheet, CollisionType, Animation, Engine } from 'excalibur';
import { Resources } from '../resource';

export class Building extends Actor {
  public constructionSprite: Sprite;
  public BombaSpriteSheet: SpriteSheet;
  public mapchipSpriteSheet: SpriteSheet;
  public completedAnimation!: Animation;
  public factorySprite: SpriteSheet;
  public isCompleted: boolean;
  public type: string;
  public iron:SpriteSheet;
  public workers: number;

  constructor(pos: Vector, sprite: Sprite, type: string) {
    super({
      pos,
      width: 64,
      height: 64,
      collisionType: CollisionType.Fixed
    });
    this.type = type;
    this.workers = 0;
    
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
    this.iron = SpriteSheet.fromImageSource({
      image: Resources.ironAnim,
      grid: {
        rows: 1,
        columns: 14,
        spriteWidth: 65,
        spriteHeight: 64
      }
    });
    this.factorySprite = SpriteSheet.fromImageSource({
      image: Resources.fabric_anim,
      grid: {
        rows: 1,
        columns: 2,
        spriteWidth: 64,
        spriteHeight: 64
      }
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

    const bomba_anim = Animation.fromSpriteSheet(this.BombaSpriteSheet, [0, 1, 2, 3, 4], 200);
    const fabric_anim = Animation.fromSpriteSheet(this.factorySprite, [0, 1], 300); 
    const iron_anim = Animation.fromSpriteSheet(this.iron, [0, 1, 2, 3, 4,5,6,7,8,9,10,11,12,13], 200);
    if (this.type === "Factory") {
      console.log('Configuring factory animation');
      this.completedAnimation = fabric_anim;
    } else if (this.type === "Home") {
      console.log('Configuring home animation');
      this.completedAnimation = bomba_anim;
    }
    else if (this.type === "Iron") {
      console.log('Configuring iron animation');
      this.completedAnimation = iron_anim;
    }

    this.constructionSprite = this.mapchipSpriteSheet.getSprite(41, 10)!;
    this.constructionSprite.width = 64;
    this.constructionSprite.height = 64;
    this.graphics.use(this.constructionSprite);
  }

  onInitialize(engine: Engine) {
    const timer = new Timer({
      fcn: () => this.completeConstruction(),
      interval: 5000,
      repeats: false
    });
    engine.currentScene.add(timer);
    timer.start();
  }

  private completeConstruction() {
    console.log('Completing construction, setting animation');
    this.isCompleted = true;
    this.graphics.use(this.completedAnimation);
    this.completedAnimation.reset();
  }
}
