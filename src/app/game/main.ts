import { Building } from './../objects/building';

import { Engine, Actor, ScreenElement, Color, Vector } from 'excalibur';
import * as ex from 'excalibur';
import { Grid } from '../objects/grid';
import { Player } from '../objects/player';
import { loader,} from '../resource'; 
import { config } from '../config';
import { Coin } from '../componentes/coins';

export const initializeGame = (canvasElement: HTMLCanvasElement) => {
  const game = new Engine({
    canvasElement: canvasElement,
    width: 1000,
    height: 600,
    backgroundColor: Color.fromHex('#35682d'),
    suppressPlayButton: true,
    suppressConsoleBootMessage: true,
    antialiasing: false,
  });
  let buildingModeActive = false;
        let selectedBuildingType: string | null = null;
        let playerMoney = config.PlayerMoney;
        let BuildingCost=1000;
        
  
  game.start(loader).then(() => {
      
      // Crear Grid y jugador
      const grid = new Grid(game, 10, 16);
      const player = new Player(Vector.Zero);
      player.scale = Vector.One.scale(3);
      game.add(player);{}
      //monedas
      const coin = new Coin(game, {
        x: 50, // Ajusta la posición X según sea necesario
        y: 50  // Ajusta la posición Y según sea necesario
      });
      game.add(coin);
      
      
        
        // --- Creación del menú ---
        const menuElement = document.createElement('div');
        menuElement.id = 'game-menu';
        menuElement.innerHTML = `
            <button id="menu-button">Menú</button>
            <div id="menu-content" style="display: none;">
                <img src="" alt="Imagen 1" data-building-type="Home">
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
    playerMoney = grid.buildBuilding(game, tileY, tileX, playerMoney, BuildingCost, selectedBuildingType??''); 

    // Desactiva el modo de construcción y restaura el cursor (opcional)
    buildingModeActive = false;
    canvasElement.style.cursor = 'default';

    // Muestra el dinero restante del jugador (opcional)
    
    coin.setNumberOfCoins(playerMoney);
   }
  });
  
 }
    });
    return game;
}


export const startGame = (game: Engine) => {
  game.start();
}
