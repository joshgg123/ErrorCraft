import { Engine, Color, Loader } from 'excalibur';
import * as ex from 'excalibur';
import { Grid } from '../objects/grid';
import { Resources } from '../resource';
import {Coin} from '../componentes/coins';
export const initializeGame = (canvasElement: HTMLCanvasElement) => {
  const game = new Engine({
    canvasElement: canvasElement,
    width: 1200,
    height: 600,
    backgroundColor: Color.fromHex('#35682d'),
    suppressPlayButton: true,
    suppressConsoleBootMessage: true,
    antialiasing: false,
  });

  // Cargar todos los recursos
  const loader = new Loader([
    Resources.mapchip,
    Resources.constructionImage,
    Resources.completedImage,
    Resources.pasto,
    Resources.coins
  ]);

  // Inicializar el juego después de cargar los recursos
  loader.load().then(() => {
    // Crear e inicializar la grilla de pasto
    const grid = new Grid(game, 10, 19); // Puedes ajustar el tamaño de la grilla según tus necesidades
    // Supongamos que el jugador comienza con 100 unidades de dinero
    let playerMoney = 100;
    // Construir un edificio en la grilla con un costo de 50 unidades
    const buildingCost = 50;
    playerMoney = grid.buildBuilding(game, 5, 5, playerMoney, buildingCost); // Puedes ajustar la posición del edificio según tus necesidades

    console.log(`Player money after building: ${playerMoney}`);
  });

  game.start(loader);

  return game;
}

export const startGame = (game: Engine) => {
  game.start();
}
