import { Actor, Vector, Sprite, Timer } from 'excalibur';
import { Resources } from '../resource';

export class Building extends Actor {
  public constructionSprite: Sprite;
  public completedSprite: Sprite;
  public cost: number;
  private isCompleted: boolean;

  constructor(pos: Vector, cost: number) {
    super({
      pos,
      width: 32,
      height: 32,
    });

    this.cost = cost;
    this.isCompleted = false;

    this.constructionSprite = new Sprite({
      image: Resources.constructionImage, // Imagen de construcción
      destSize: {
        width: 32,
        height: 32,
      },
    });

    this.completedSprite = new Sprite({
      image: Resources.completedImage, // Imagen de edificio completado
      destSize: {
        width: 32,
        height: 32,
      },
    });

    this.graphics.use(this.constructionSprite);

    // Iniciar el temporizador para cambiar el estado después de 5 segundos
    const timer = new Timer({
      fcn: () => this.completeConstruction(),
      interval: 5000,
      repeats: false
    });

    this.scene?.add(timer);
    timer.start();
  }

  private completeConstruction() {
    this.isCompleted = true;
    this.graphics.use(this.completedSprite);
  }

  public getCost(): number {
    return this.cost;
  }
}
