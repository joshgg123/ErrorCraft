import { Engine, Color } from 'excalibur';
import * as ex from 'excalibur';
import { Grid } from '../objects/grid';
import { Resources } from '../resource';

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

  // Cargar recursos antes de inicializar el juego
  Resources.mapchip.load().then(() => {
    // Crear e inicializar la grilla de pasto
    const grid = new Grid(game, 10, 16); // Puedes ajustar el tamaño de la grilla según tus necesidades

  });

  return game;
}

export const startGame = (game: Engine) => {
  game.start();
}
