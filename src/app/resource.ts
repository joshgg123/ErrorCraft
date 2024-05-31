import { ImageSource, Loader } from "excalibur";
import mapchipPng from "../../public/assets/pasto.png";

import completed from "../../public/assets/Hero 01.png";
import pasto from "../../public/assets/pastoSprite.png"
import coins from "../../public/assets/coin_Sheet32x32.png"
import heroPath from "../../public/assets/Hero 01.png"
import {Player} from "./objects/player";
import bombaAgua from "../../public/assets/bombaAgua.png"
import factory from "../../public/assets/fabrica.png"

export const Resources = {
    mapchip: new ImageSource(mapchipPng.src),
    pasto: new ImageSource(pasto.src),
    coin: new ImageSource(coins.src), 
    HeroSpriteSheetPng: new ImageSource(heroPath.src),
    factory: new ImageSource(factory.src),
    entityClassNameFactories: {
        player: (props: { pos: any }) => { // Replace 'any' with the appropriate type for 'pos'
            const player = new Player(props.pos);
            player.z = 100;
            return player;
        },
    },
    bombaAgua: new ImageSource(bombaAgua.src)

};
export const loader = new Loader([Resources.mapchip, Resources.factory, Resources.bombaAgua,Resources.HeroSpriteSheetPng, Resources.coin, Resources.pasto]); // Agrega todos los recursos aquí