import { XMLParser } from "fast-xml-parser";
import { findAllByKey } from "./utils";
import { Player, Color, Hat, Pants, Shirt } from "./types/player.types";
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

    let players: any[] = [];
    players = findAllByKey(saveFile.SaveGame, "farmhand");
    let processedPlayers: any[] = [];

    players.forEach((player) => {
      // in here is where we'll call all our parsers and create the player object we'll use
      let processedPlayer = getPlayerData(player);
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

function getPlayerData(doc: any): Player {
  const name = doc["name"];
  const newEyeColor = doc["newEyeColor"];
  const eyeColor: Color = [
    parseInt(newEyeColor["R"]),
    parseInt(newEyeColor["G"]),
    parseInt(newEyeColor["B"]),
    parseInt(newEyeColor["A"]),
  ];

  const hairColor: Color = [
    parseInt(doc["hairstyleColor"]["R"]),
    parseInt(doc["hairstyleColor"]["G"]),
    parseInt(doc["hairstyleColor"]["B"]),
    parseInt(doc["hairstyleColor"]["A"]),
  ];

  let hat: Hat | null = null;
  if (doc["hat"]) {
    hat = {
      type: parseInt(doc["hat"]["which"]),
      hairDrawType: parseInt(doc["hat"]["hairDrawType"]),
      ignoreHairstyleOffset: doc["hat"]["ignoreHairstyleOffset"] ? true : false,
    };
  }

  let shirt: Shirt;
  if (doc["shirtItem"]) {
    const shirtColor: Color = [
      parseInt(doc["shirtItem"]["clothesColor"]["R"]),
      parseInt(doc["shirtItem"]["clothesColor"]["G"]),
      parseInt(doc["shirtItem"]["clothesColor"]["B"]),
      parseInt(doc["shirtItem"]["clothesColor"]["A"]),
    ];
    shirt = {
      type: parseInt(doc["shirtItem"]["indexInTileSheet"]),
      dyeable: doc["shirtItem"]["dyeable"] === "true",
      color: shirtColor,
    };
  } else {
    // default shirt
    shirt =
      doc["isMale"] === "true"
        ? { type: 209, dyeable: false, color: [0, 0, 0, 0] }
        : { type: 41, dyeable: false, color: [0, 0, 0, 0] };
  }

  let pants: Pants;
  if (doc["pantsItem"]) {
    const pantsColor: Color = [
      parseInt(doc["pantsItem"]["clothesColor"]["R"]),
      parseInt(doc["pantsItem"]["clothesColor"]["G"]),
      parseInt(doc["pantsItem"]["clothesColor"]["B"]),
      parseInt(doc["pantsItem"]["clothesColor"]["A"]),
    ];
    pants = {
      type: parseInt(doc["pantsItem"]["indexInTileSheet"]),
      dyeable: doc["pantsItem"]["dyeable"] === "true",
      color: pantsColor,
    };
  } else {
    // default pants
    pants = { type: 14, dyeable: false, color: [0, 0, 0, 0] };
  }

  const player: Player = {
    name,
    isMale: doc["isMale"] === "true",
    hair: {
      type: parseInt(doc["hair"]),
      color: hairColor,
    },
    skin: parseInt(doc["skin"]),
    accessory: parseInt(doc["accessory"]),
    hat: hat,
    pants: pants,
    shirt: shirt,
    shoes: parseInt(doc["shoes"]),
    eyeColor: eyeColor,
  };

  return player;
}
