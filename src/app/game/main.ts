import { Engine, Color } from 'excalibur';
import * as ex from 'excalibur';
import { Grid } from '../objects/grid';
import { Resources } from '../resource';
import { Player } from '../objects/player';
import { loader } from '../resource';

export const initializeGame = (canvasElement: HTMLCanvasElement) => {
  const game = new Engine({
    canvasElement: canvasElement,
    width: 800,
    height: 600,
    backgroundColor: Color.Azure,
    suppressPlayButton: true,
    suppressConsoleBootMessage: true,
    antialiasing: false,
  });
  game.start(loader).then(() => {
    // Todos los recursos han sido cargados aquí
    const grid = new Grid(game, 10, 16);
    const player = new Player(ex.Vector.Zero); 
    game.add(player);
});
  return game;
}

export const startGame = (game: Engine) => {
  game.start();
}
