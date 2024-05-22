import { Engine, Actor, ScreenElement, Vector } from 'excalibur';

export const initializeMenu = (game: Engine, canvasElement: HTMLCanvasElement, startBuildingMode: (buildingType: string) => void) => {
    const menuElement = document.createElement('div');
    menuElement.id = 'game-menu';
    menuElement.style.position = 'absolute';
    menuElement.style.right = '10px';
    menuElement.style.top = '10px';
    menuElement.innerHTML = `
        <button id="menu-button" style="background: none; border: none; cursor: pointer;">
            <img src="/assets/constructionB.png" alt="Menú" style="width: 50px; height: 50px;">
        </button>
        <div id="menu-content" style="display: none;">
            <img src="/assets/building.png" alt="Imagen 1" data-building-type="Home" style="width: 100px; height: auto;">
        </div>
    `;
    document.body.appendChild(menuElement);

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
};
