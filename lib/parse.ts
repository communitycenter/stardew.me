import { XMLParser } from "fast-xml-parser";
import { findAllByKey } from "./utils";
import {
  Player,
  XMLColor,
  ShirtItem,
  PantsItem,
  Hat,
} from "./types/player.types";
// eslint-disable-next-line @typescript-eslint/no-require-imports
const semverSatisfies = require("semver/functions/satisfies");

export async function parseSaveFile(file: string): Promise<Player[]> {
  const parser = new XMLParser({ ignoreAttributes: false });
  const saveFile = parser.parse(file);

  try {
    const version = saveFile.SaveGame.gameVersion;

    // make sure game version is at least 1.5.0
    if (!semverSatisfies(version, ">=1.5.0 || <1.6")) {
      throw new Error(
        `Game version ${version} is not supported. stardew.me currently only supports the Stardew Valley 1.5 update.`
      );
    }

    let players: Player[] = [];
    players = findAllByKey(saveFile.SaveGame, "farmhand") as Player[];
    const processedPlayers: Player[] = [];

    players.forEach((player) => {
      const processedPlayer = getPlayerData(player);
      processedPlayers.push(processedPlayer);
    });

    return processedPlayers;
  } catch (e) {
    console.log(e);
    if (e instanceof TypeError) {
      throw new Error(
        "Invalid file uploaded. Please upload a valid Stardew Valley save file."
      );
    } else throw e;
  }
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function getPlayerData(doc: any): Player {
  const name = doc["name"];
  const gender = doc.isMale ? "Male" : "Female";
  const hair = parseInt(doc.hair);
  const skin = parseInt(doc.skin);
  const shoes = parseInt(doc.shoes);
  const accessory = parseInt(doc.accessory);

  const hairstyleColor: XMLColor = {
    R: parseInt(doc.hairstyleColor.R),
    G: parseInt(doc.hairstyleColor.G),
    B: parseInt(doc.hairstyleColor.B),
    A: parseInt(doc.hairstyleColor.A),
  };

  const newEyeColor: XMLColor = {
    R: parseInt(doc.newEyeColor.R),
    G: parseInt(doc.newEyeColor.G),
    B: parseInt(doc.newEyeColor.B),
    A: parseInt(doc.newEyeColor.A),
  };

  let hat: Hat | undefined;
  if (doc.hat) {
    hat = {
      itemId: parseInt(doc.hat.which),
      hairDrawType: parseInt(doc.hat.hairDrawType),
      isPrismatic: false,
      ignoreHairstyleOffset: doc.hat.ignoreHairstyleOffset === true,
    };
  }

  const shirtItem: ShirtItem = doc.shirtItem
    ? {
        itemId: parseInt(doc.shirtItem.indexInTileSheet),
        isPrismatic: false,
        dyeable: doc.shirtItem.dyeable === true,
        indexInTileSheet: parseInt(doc.shirtItem.indexInTileSheet),
        clothesColor: {
          R: parseInt(doc.shirtItem.clothesColor.R),
          G: parseInt(doc.shirtItem.clothesColor.G),
          B: parseInt(doc.shirtItem.clothesColor.B),
          A: parseInt(doc.shirtItem.clothesColor.A),
        },
      }
    : {
        itemId: gender === "Male" ? 209 : 41,
        isPrismatic: false,
        dyeable: false,
        indexInTileSheet: gender === "Male" ? 209 : 41,
        clothesColor: { R: 0, G: 0, B: 0, A: 0 },
      };

  const pantsItem: PantsItem = doc.pantsItem
    ? {
        itemId: parseInt(doc.pantsItem.indexInTileSheet),
        isPrismatic: false,
        dyeable: doc.pantsItem.dyeable === true,
        indexInTileSheet: parseInt(doc.pantsItem.indexInTileSheet),
        clothesColor: {
          R: parseInt(doc.pantsItem.clothesColor.R),
          G: parseInt(doc.pantsItem.clothesColor.G),
          B: parseInt(doc.pantsItem.clothesColor.B),
          A: parseInt(doc.pantsItem.clothesColor.A),
        },
      }
    : {
        itemId: 14,
        isPrismatic: false,
        dyeable: false,
        indexInTileSheet: 14,
        clothesColor: { R: 0, G: 0, B: 0, A: 0 },
      };

  const player: Player = {
    name,
    gender,
    hair,
    skin,
    shoes,
    accessory,
    hairstyleColor,
    newEyeColor,
    shirtItem,
    pantsItem,
    hat,
  };

  return player;
}
