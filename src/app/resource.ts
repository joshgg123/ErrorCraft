import { ImageSource } from "excalibur";

import mapchipPng from "../../public/assets/pasto.png";
import process from "../../public/assets/constructionB.png";
import completed from "../../public/assets/building.png";
import pasto from "../../public/assets/pastoSprite.png"
import coins from "../../public/assets/coin_Sheet32x32.png"
export const Resources = {
    mapchip: new ImageSource(mapchipPng.src),
    constructionImage: new ImageSource(process.src),
    completedImage: new ImageSource(completed.src),
    pasto: new ImageSource(pasto.src),
    coin: new ImageSource(coins.src)
};
