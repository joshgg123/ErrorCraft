import {Actor, Scene, Engine, Color} from 'excalibur';

export class GameScene extends Scene{
    onIntialize(engine: Engine){
        this.add(new Actor({
            x: engine.drawWidth / 2,
            y: engine.drawHeight / 2,
            width: 100,
            height: 100,
            color: Color.Red
        }));
    }
}

