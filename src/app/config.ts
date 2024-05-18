const gameWidth = 1200;
const gameHeight = 600;

export const config = {
  TileWidth: 64, // pixels
  gameWidth, // Not pixels when `DisplayMode.FitScreen` is enable!!
  gameHeight, // Not pixels when `DisplayMode.FitScreen` is enable!!
  PlayerSpeed: 16*2, // pixels per second
  PlayerFrameSpeed: 200, // ms
};
