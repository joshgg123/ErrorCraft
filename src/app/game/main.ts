import { Engine, Actor, ScreenElement, Color, Vector } from 'excalibur';
import { Grid } from '../objects/grid';
import { Player } from '../objects/player';
import { loader,} from '../resource'; 
import { config } from '../config';

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
         

        // --- Creación del menú ---
        const menuElement = document.createElement('div');
        menuElement.id = 'game-menu';
        menuElement.innerHTML = `
            <button id="menu-button">Menú</button>
            <div id="menu-content" style="display: none;">
                <img src="assets/building.png" alt="Building 1" data-building-type="Home">
            </div>
        `;
        document.body.appendChild(menuElement);

        const menuActor = new Actor({
            x: 10,
            y: 10,
            width: menuElement.offsetWidth,
            height: menuElement.offsetHeight
        });

        const menu = new ScreenElement({
            anchor: menuActor.pos.clone(),
            z: 1000
        });
        game.add(menu);
        game.add(menuActor);

        // --- Manejo del clic en el botón del menú ---
        const menuButton = document.getElementById('menu-button') as HTMLButtonElement;
        const menuContent = document.getElementById('menu-content') as HTMLDivElement;

        menuButton.addEventListener('click', () => {
            menuContent.style.display = menuContent.style.display === 'none' ? 'block' : 'none';
        });

        // --- Manejo del clic en las imágenes del menú ---
        const images = menuContent.querySelectorAll('img');
        images.forEach(img => {
            img.addEventListener('click', () => {
                const buildingType = img.getAttribute('data-building-type');
                startBuildingMode(buildingType ?? ''); // Usa ?? para evitar pasar null
            });
        });


 function startBuildingMode(buildingType: string) {
  buildingModeActive = true;
  selectedBuildingType = buildingType;
  menuContent.style.display = 'none'; // Cierra el menú

  // Cambia el cursor del mouse (opcional)
  canvasElement.style.cursor = 'crosshair';

  game.input.pointers.primary.on('down', (event) => {
   if (buildingModeActive) {
    const tileX = Math.floor(event.worldPos.x / config.TileWidth);
    const tileY = Math.floor(event.worldPos.y / config.TileWidth);

    // Llama a la función buildBuilding de tu Grid
    playerMoney = grid.buildBuilding(game, tileY, tileX, playerMoney, buildingCost, selectedBuildingType??''); 

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
