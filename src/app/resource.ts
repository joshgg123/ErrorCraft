import { ImageSource } from "excalibur";
import { Loader } from "excalibur";
import mapchipPng from "../../public/assets/pasto.png";
import process from "../../public/assets/constructionB.png";
import completed from "../../public/assets/building.png";
import pasto from "../../public/assets/pastoSprite.png"
import coins from "../../public/assets/coin_Sheet32x32.png"
import heroPath from "../../public/assets/Hero 01.png"
import {Player} from "./objects/player";

export const Resources = {
    mapchip: new ImageSource(mapchipPng.src),
    constructionImage: new ImageSource(process.src),
    completedImage: new ImageSource(completed.src),
    pasto: new ImageSource(pasto.src),
    coin: new ImageSource(coins.src), 
    HeroSpriteSheetPng: new ImageSource(heroPath.src),
    entityClassNameFactories: {
        player: (props: { pos: any }) => { // Replace 'any' with the appropriate type for 'pos'
            const player = new Player(props.pos);
            player.z = 100;
            return player;
        },
    },
};
export const loader = new Loader([Resources.mapchip, Resources.HeroSpriteSheetPng, Resources.constructionImage, Resources.completedImage, Resources.coin, Resources.pasto]); // Agrega todos los recursos aquí