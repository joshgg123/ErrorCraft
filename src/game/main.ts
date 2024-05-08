import {Engine, Color, Scene} from 'excalibur';

export const initializeGame = (canvasElement: HTMLCanvasElement) => {
    const game = new Engine({
        canvasElement: canvasElement,
        width: 640,
        height: 480,
        backgroundColor: Color.Azure,
        suppressPlayButton: true,
        suppressConsoleBootMessage: true,
        antialiasing: false,
    });

    game.add("main", new GameScene());