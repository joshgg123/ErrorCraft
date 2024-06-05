import { Engine, Actor, ScreenElement, Color, Vector } from 'excalibur';
import { Grid } from '../objects/grid';
import { Player } from '../objects/player';
import { loader } from '../resource'; 
import { config } from '../config';
import { Coin } from '../componentes/coins';
import { db } from '../firebase/page';
import { getDoc, doc, updateDoc } from 'firebase/firestore';

export const initializeGame = async (canvasElement: HTMLCanvasElement, userId: string) => {
  const game = new Engine({
    canvasElement: canvasElement,
    width: 1000,
    height: 600,
    backgroundColor: Color.fromHex('#35682d'),
    suppressPlayButton: true,
    suppressConsoleBootMessage: true,
    antialiasing: false,
  });

  const grid = new Grid(game, 10, 16);

  // Obtén la cantidad de monedas desde Firebase usando el userId
  let playerMoney = await getPlayerMoneyFromDatabase(userId);

  const coin = new Coin(game, {
    x: 40,
    y: 50  
  });
  game.add(coin);
  coin.setNumberOfCoins(playerMoney);

  let buildingModeActive = false;
  let selectedBuildingType: string | null = null;
  let BuildingCost = 1000;

  game.start(loader).then(() => {
    const player = new Player(Vector.Zero);
    player.scale = Vector.One.scale(3);
    player.pos = new Vector(100, 100);
    game.add(player);

    const menuElement = document.createElement('div');
    menuElement.id = 'game-menu';
    menuElement.style.position = 'absolute';
    menuElement.style.top = '10px';
    menuElement.style.right = '10px';
    menuElement.innerHTML = `
      <button id="menu-button" aria-label="Open Menu" style="padding:0"><img src="assets/menu2.png" alt="menu-icon"></button>
      <div id="menu-content" style="display: none;">
        <img src="assets/WaterBomb.png" alt="Imagen 1" data-building-type="Home">
        <img src="assets/fabrica.png" alt="Imagen 2" data-building-type="Factory">
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

    const menuButton = document.getElementById('menu-button') as HTMLButtonElement;
    const menuContent = document.getElementById('menu-content') as HTMLDivElement;

    menuButton.addEventListener('click', () => {
      menuContent.style.display = menuContent.style.display === 'none' ? 'block' : 'none';
    });

    const images = menuContent.querySelectorAll('img');
    images.forEach(img => {
      img.addEventListener('click', () => {
        const buildingType = img.getAttribute('data-building-type');
        startBuildingMode(buildingType ?? '');
      });
    });

    function startBuildingMode(buildingType: string) {
      buildingModeActive = true;
      selectedBuildingType = buildingType;
      menuContent.style.display = 'none';
      canvasElement.style.cursor = 'crosshair';

      game.input.pointers.primary.on('down', (event) => {
        if (buildingModeActive) {
          const tileX = Math.floor(event.worldPos.x / config.TileWidth);
          const tileY = Math.floor(event.worldPos.y / config.TileWidth);

          playerMoney = grid.buildBuilding(game, tileY, tileX, playerMoney, BuildingCost, selectedBuildingType ?? '');
          coin.setNumberOfCoins(playerMoney);

          // Actualizar el campo coin en Firebase
          updatePlayerMoneyInDatabase(userId, playerMoney);

          buildingModeActive = false;
          canvasElement.style.cursor = 'default';
        }
      });
    }
  });

  return game;
}

export const startGame = (game: Engine) => {
  game.start();
}

const getPlayerMoneyFromDatabase = async (userId: string): Promise<number> => {
  const userDoc = await getDoc(doc(db, 'users', userId));
  if (userDoc.exists()) {
    return userDoc.data().coin || 0;
  }
  return 0;
}

const updatePlayerMoneyInDatabase = async (userId: string, money: number) => {
  await updateDoc(doc(db, 'users', userId), {
    coin: money
  });
}
