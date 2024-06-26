import { ImageSource, Loader } from "excalibur";
import mapchipPng from "../../public/assets/pasto.png";
import menuLogo from "../../public/assets/menu2.png";
import pasto from "../../public/assets/pastoSprite.png";
import coins from "../../public/assets/coin_Sheet32x32.png";
import heroPath from "../../public/assets/Hero 01.png";
import { Player } from "./objects/player";
import bombaAgua from "../../public/assets/bombaAgua.png";
import factory from "../../public/assets/fabrica.png";
import waterbomb from "../../public/assets/WaterBomb.png";
import fabric_anim from "../../public/assets/fabrica_anim.png";
import iron from "../../public/assets/iron.png";
import ironAnim from "../../public/assets/ironAnim.png";
import ironOre from "../../public/assets/iron_ore.png";
import addworker from "../../public/assets/add-workers.png";

// Initialize resources
export const Resources = {
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
    bombaAgua: new ImageSource(bombaAgua.src),
    entityClassNameFactories: {
        player: (props: { pos: any }) => { 
            const player = new Player(props.pos);
            player.z = 100;
            return player;
        },
    },
};

export const loader = new Loader([
    Resources.ironOre,
    Resources.addworker,
    Resources.waterbomb,
    Resources.mapchip,
    Resources.iron,
    Resources.ironAnim,
    Resources.fabric_anim,
    Resources.factory,
    Resources.bombaAgua,
    Resources.HeroSpriteSheetPng,
    Resources.coin,
    Resources.pasto,
    Resources.menuLogo,
]);



