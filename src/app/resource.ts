import { ImageSource } from "excalibur";

import mapchipPng from "../../public/assets/pasto.png";
import process from "../../public/assets/construccionB.png";
import completed from "../../public/assets/building.png";
export const Resources = {
    mapchip: new ImageSource(mapchipPng.src),
    constructionImage: new ImageSource(process.src),
    completedImage: new ImageSource(completed.src),
};
