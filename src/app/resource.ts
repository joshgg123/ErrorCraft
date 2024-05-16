import { ImageSource, ImageFiltering, Loadable, Loader, Resource, TileMap } from "excalibur";
import {TiledResource} from "@excaliburjs/plugin-tiled";

import mapchipPng from "../../public/assets/pasto.png";
import process from "../../public/assets/constructionB.png";
import completed from "../../public/assets/building.png";
import heroPath from "../../public/assets/hero 01.png";
import {Player} from "./objects/player";

export const Resources = {
    mapchip: new ImageSource(mapchipPng.src),
    constructionImage: new ImageSource(process.src),
    completedImage: new ImageSource(completed.src),
    HeroSpriteSheetPng: new ImageSource(heroPath.src),
    entityClassNameFactories: {
        player: (props) => {
            const player = new Player(props.pos);
            player.z = 100;
            return player;
        },
    },
};

export const loader = new Loader([Resources.mapchip, Resources.HeroSpriteSheetPng, Resources.constructionImage, Resources.completedImage]); // Agrega todos los recursos aquí










