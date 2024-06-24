import { Engine, Actor, ScreenElement, Color, Vector } from 'excalibur';
import { Grid } from '../objects/grid';
import { Player } from '../objects/player';
import { loader } from '../resource';
import { config } from '../config';
import { Coin } from '../componentes/coins';
import { db } from '../firebase/page';
import { getDoc, doc, updateDoc } from 'firebase/firestore';
import { Iron } from '../componentes/iron';

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

  // Obtén la cantidad de monedas desde Firebase usando el userId
  let playerMoney = await getPlayerMoneyFromDatabase(userId);
  let playerIron = await getPlayerIronFromDatabase(userId);

  const ironInstance = new Iron(game, {
    x: 40,
    y: 90,
    z: 1000
  });
  const coinInstance = new Coin(game, {
    x: 40,
    y: 50,
    z: 1000
  });
  game.add(coinInstance);
  game.add(ironInstance);
  ironInstance.setNumberOfCoins(playerIron);
  coinInstance.setNumberOfCoins(playerMoney);

  const updateCoinDisplay = (coins: number) => {
    coinInstance.setNumberOfCoins(coins);
  };
  const updateIronDisplay = (iron: number) => {
    ironInstance.setNumberOfCoins(iron);
  }

  const grid = new Grid(game, 10, 16, userId, updateCoinDisplay, updateIronDisplay);

  // array con los nombres y costos de edificios 
  const buildings = [
    {
      name: 'Home',
      cost: 1000
    },
    {
      name: 'Factory',
      cost: 2000
    },
    {
      name: 'Iron',
      cost: 3000
    }
  ];

  let buildingModeActive = false;
  let assignWorkersModeActive = false;
  let selectedBuildingType: string | null = null;
  let BuildingCost = 0;

  game.start(loader).then(() => {
    const player = new Player(Vector.Zero);
    player.scale = Vector.One.scale(3);
    player.pos = new Vector(100, 100);
    game.add(player);

    // Crear el menú
    const menuElement = document.createElement('div');
    menuElement.id = 'game-menu';
    menuElement.style.position = 'absolute';
    menuElement.style.top = '10px';
    menuElement.style.right = '10px';
    menuElement.innerHTML = `
      <button id="menu-button" aria-label="Open Menu" style="padding:0"><img src="assets/menu2.png" alt="menu-icon"></button>
      <div id="menu-content" style="display: none;">
        <div>
          <img src="assets/WaterBomb.png" alt="Imagen 1" data-building-type="Home" data-cost="1000" data-benefit="10">
          <p>Cost: 1000, Benefit: 10</p>
        </div>
        <div>
          <img src="assets/fabrica.png" alt="Imagen 2" data-building-type="Factory" data-cost="2000" data-benefit="20">
          <p>Cost: 2000, Benefit: 20</p>
        </div>
        <div>
          <img src="assets/iron.png" alt="Imagen 3" data-building-type="Iron" data-cost="3000" data-benefit="5 iron">
          <p>Cost: 3000, Benefit: 5 iron</p>
        </div>
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
        startBuildingMode(buildingType ?? '', parseInt(img.getAttribute('data-cost') ?? '0', 10));
      });
    });

    // Crear el botón de asignar trabajadores
    const addButton = document.createElement('button');
    addButton.id = 'add-workers-button';
    addButton.style.position = 'absolute';
    addButton.style.top = '100px'; // Justo debajo del menú desplegable
    addButton.style.right = '10px';
    addButton.style.padding = '0';
    addButton.style.zIndex = '1001'; // Asegurar que esté por encima del canvas
    addButton.innerHTML = `<img src="assets/add-workers.png" alt="add-workers-icon">`; // Reemplaza 'add-workers.png' con la ruta de tu imagen
    document.body.appendChild(addButton);

    addButton.addEventListener('click', () => {
      assignWorkersModeActive = true;
      canvasElement.style.cursor = 'crosshair';
    });

    function startBuildingMode(buildingType: string, cost: number) {
      buildingModeActive = true;
      selectedBuildingType = buildingType;
      BuildingCost = cost;

      menuContent.style.display = 'none';
      canvasElement.style.cursor = 'crosshair';
    }

    game.input.pointers.primary.on('down', async (event) => {
      const tileX = Math.floor(event.worldPos.x / config.TileWidth);
      const tileY = Math.floor(event.worldPos.y / config.TileWidth);

      if (buildingModeActive) {
        // Obtener el dinero más reciente del jugador desde Firebase
        playerMoney = await getPlayerMoneyFromDatabase(userId);

        playerMoney = await grid.buildBuilding(game, tileY, tileX, playerMoney, playerIron, BuildingCost, selectedBuildingType ?? '', userId);
        coinInstance.setNumberOfCoins(playerMoney);
        ironInstance.setNumberOfCoins(playerIron);
        // Actualizar el campo coin en Firebase
        await updatePlayerMoneyInDatabase(userId, playerMoney);

        buildingModeActive = false;
        canvasElement.style.cursor = 'default';
      } else if (assignWorkersModeActive) {
        const building = grid.getBuildingAt(tileX, tileY);
        if (building && building.type === 'Iron') {
          if (building.workers < 3) {
            building.workers++;
            console.log(`Asignado 1 trabajador. Total de trabajadores: ${building.workers}`);
          } else {
            console.log('No se pueden asignar más de 3 trabajadores a este edificio');
          }
        } else if (building) {
          console.log('Este edificio no es una mina de hierro');
        } else {
          console.log('No hay ningún edificio en esta posición');
        }

        assignWorkersModeActive = false;
        canvasElement.style.cursor = 'default';
      }
    });
  });

  return game;
}

<<<<<<< HEAD
=======
const getPlayerIronFromDatabase = async (userId: string): Promise<number> => {
  const userDoc = await getDoc(doc(db, 'users', userId));
  if (userDoc.exists()) {
    return userDoc.data().Iron || 0;
  }
  return 0;
}
const updatePlayerIronInDatabase = async (userId: string, iron: number) => {
  await updateDoc(doc(db, 'users', userId), {
    Iron: iron
  });
}

const getPlayerMoneyFromDatabase = async (userId: string): Promise<number> => {
  const userDoc = await getDoc(doc(db, 'users', userId));
  if (userDoc.exists()) {
    return userDoc.data().Coins || 0;
  }
  return 0;
}

const updatePlayerMoneyInDatabase = async (userId: string, money: number) => {
  await updateDoc(doc(db, 'users', userId), {
    Coins: money
  });
}

>>>>>>> BrunoJoshua
export const startGame = (game: Engine) => {
  game.start();
}
