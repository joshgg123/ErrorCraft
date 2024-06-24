import { ImageSource, Loader } from "excalibur";

import mapchipPng from "../../public/assets/pasto.png";//
import menuLogo from "../../public/assets/menu2.png"//
import pasto from "../../public/assets/pastoSprite.png"//
import coins from "../../public/assets/coin_Sheet32x32.png"//
import heroPath from "../../public/assets/Hero 01.png"//
import {Player} from "./objects/player";
import bombaAgua from "../../public/assets/bombaAgua.png"//
import factory from "../../public/assets/fabrica.png"//si
import waterbomb from "../../public/assets/WaterBomb.png"//si
import fabric_anim from "../../public/assets/fabrica_anim.png"//si
import iron from "../../public/assets/iron.png"//si
import ironAnim from "../../public/assets/ironAnim.png"//si
import ironOre from "../../public/assets/iron_ore.png"//si
import addworker from "../../public/assets/add-workers.png"//si
import background from "../../public/assets/background.png"//si
export const Resources = {
    background: new ImageSource(background.src),
    addworker: new ImageSource(addworker.src),
    ironOre: new ImageSource(ironOre.src),
    iron: new ImageSource(iron.src),
    ironAnim: new ImageSource(ironAnim.src),
    fabric_anim: new ImageSource(fabric_anim.src),
    waterbomb: new ImageSource(waterbomb.src),
    menuLogo: new ImageSource(menuLogo.src),
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
export const loader = new Loader([Resources.ironOre,Resources.addworker,Resources.waterbomb,Resources.mapchip,Resources.iron ,Resources.ironAnim,Resources.fabric_anim, Resources.factory, Resources.bombaAgua,Resources.HeroSpriteSheetPng, Resources.coin, Resources.pasto, Resources.menuLogo]); // Agrega todos los recursos aquí