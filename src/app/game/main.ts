import { Engine, Color, Vector } from 'excalibur';
import { Grid } from '../objects/grid';
import { Player } from '../objects/player';
import { loader } from '../resource'; 
import { config } from '../config';
import { initializeMenu } from '../Componentes/FloatingMenu'; // Importar la función initializeMenu

export const initializeGame = (canvasElement: HTMLCanvasElement) => {
    const game = new Engine({
        canvasElement: canvasElement,
        width: 700, // Ajustar el ancho del canvas
        height: 600,
        backgroundColor: Color.Azure,
        suppressPlayButton: true,
        suppressConsoleBootMessage: true,
        antialiasing: false,
    });

    // Variables para el modo de construcción
    let buildingModeActive = false;
    let selectedBuildingType: string | null = null;
    let playerMoney = 2000;
    let buildingCost = 500;

    game.start(loader).then(() => {
        // Crear Grid y jugador
        const grid = new Grid(game, 10, 16);
        const player = new Player(Vector.Zero);
        player.scale = Vector.One.scale(2);
        game.add(player);
        game.add(grid);

        // Inicializar el menú
        initializeMenu(game, canvasElement, startBuildingMode); // Asegúrate de llamar a initializeMenu correctamente

        function startBuildingMode(buildingType: string) {
            buildingModeActive = true;
            selectedBuildingType = buildingType;
            // Cierra el menú
            const menuContent = document.getElementById('menu-content') as HTMLDivElement;
            menuContent.style.display = 'none';

            // Cambia el cursor del mouse (opcional)
            canvasElement.style.cursor = 'crosshair';

            game.input.pointers.primary.on('down', (event) => {
                if (buildingModeActive) {
                    const tileX = Math.floor(event.worldPos.x / config.TileWidth);
                    const tileY = Math.floor(event.worldPos.y / config.TileWidth);

                    // Llama a la función buildBuilding de tu Grid
                    playerMoney = grid.buildBuilding(game, tileY, tileX, playerMoney, buildingCost, selectedBuildingType ?? '');

                    // Desactiva el modo de construcción y restaura el cursor (opcional)
                    buildingModeActive = false;
                    canvasElement.style.cursor = 'default';

                    // Muestra el dinero restante del jugador (opcional)
                    console.log("Player money:", playerMoney);
                }
            });
        }
    });
    return game;
};

export const startGame = (game: Engine) => {
    game.start();
};
