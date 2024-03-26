import os
import json
import xmltodict

from typing import Set


def createPlayer(file):
    # use xmltodict to parse the xml file into a dict
    with open(file) as fd:
        doc = xmltodict.parse(fd.read())

    # for now we only care about some things so lets return a smaller object
    newEyeColor = doc["SaveGame"]["player"]["newEyeColor"]
    eyeColor = (
        int(newEyeColor["R"]),
        int(newEyeColor["G"]),
        int(newEyeColor["B"]),
        int(newEyeColor["A"]),
    )

    hairColor = (
        int(doc["SaveGame"]["player"]["hairstyleColor"]["R"]),
        int(doc["SaveGame"]["player"]["hairstyleColor"]["G"]),
        int(doc["SaveGame"]["player"]["hairstyleColor"]["B"]),
        int(doc["SaveGame"]["player"]["hairstyleColor"]["A"]),
    )

    # -------------------------- check if player has hat ------------------------- #
    hat = None
    if doc["SaveGame"]["player"].get("hat"):
        print(doc["SaveGame"]["player"]["hat"])
        hat = {
            "type": int(doc["SaveGame"]["player"]["hat"]["itemId"]),
            "hairDrawType": int(doc["SaveGame"]["player"]["hat"]["hairDrawType"]),
            "ignoreHairstyleOffset": (
                True
                if doc["SaveGame"]["player"]["hat"].get("ignoreHairstyleOffset")
                == "true"
                else False
            ),
        }

    # ------------------------ check if player has a shirt ----------------------- #
    if doc["SaveGame"]["player"].get("shirtItem"):
        shirtColor = (
            int(doc["SaveGame"]["player"]["shirtItem"]["clothesColor"]["R"]),
            int(doc["SaveGame"]["player"]["shirtItem"]["clothesColor"]["G"]),
            int(doc["SaveGame"]["player"]["shirtItem"]["clothesColor"]["B"]),
            int(doc["SaveGame"]["player"]["shirtItem"]["clothesColor"]["A"]),
        )
        shirt = {
            "type": int(doc["SaveGame"]["player"]["shirtItem"]["indexInTileSheet"]),
            "dyeable": (
                True
                if doc["SaveGame"]["player"]["shirtItem"]["dyeable"] == "true"
                else False
            ),
            "color": shirtColor,
        }
    else:  # default shirt
        if doc["SaveGame"]["player"]["isMale"] == "true":
            shirt = {"type": 209, "dyeable": False, "color": (0, 0, 0, 0)}
        else:
            shirt = {"type": 41, "dyeable": False, "color": (0, 0, 0, 0)}

    # ------------------------- check if player has pants ------------------------ #
    if doc["SaveGame"]["player"].get("pantsItem"):
        pantsColor = (
            int(doc["SaveGame"]["player"]["pantsItem"]["clothesColor"]["R"]),
            int(doc["SaveGame"]["player"]["pantsItem"]["clothesColor"]["G"]),
            int(doc["SaveGame"]["player"]["pantsItem"]["clothesColor"]["B"]),
            int(doc["SaveGame"]["player"]["pantsItem"]["clothesColor"]["A"]),
        )
        pants = {
            "type": int(doc["SaveGame"]["player"]["pantsItem"]["indexInTileSheet"]),
            "dyeable": (
                True
                if doc["SaveGame"]["player"]["pantsItem"]["dyeable"] == "true"
                else False
            ),
            "color": pantsColor,
        }
    else:  # default pants
        pants = {"type": 14, "dyeable": False, "color": (0, 0, 0, 0)}

    player = {
        "isMale": doc["SaveGame"]["player"]["isMale"] == "true",
        "hair": {
            "type": int(doc["SaveGame"]["player"]["hair"]),
            "color": hairColor,
        },
        "skin": int(doc["SaveGame"]["player"]["skin"]),
        "accessory": int(doc["SaveGame"]["player"]["accessory"]),
        "hat": hat,
        "pants": pants,
        "shirt": shirt,
        "shoes": int(doc["SaveGame"]["player"]["shoes"]),
        "eyeColor": eyeColor,
    }

    return player


def get_sleeveless_shirts() -> Set[int]:
    """Get a set of shirt IDs that are sleeveless

    Returns:
        Set[int]: A set of shirt IDs that are sleeveless
    """
    clothing_info_path = os.path.join("data", "ClothingInformation.json")
    with open(clothing_info_path, "r") as f:
        clothing_info = json.load(f)

    sleeveless_shirts = set()

    for shirt_id, info in clothing_info.items():
        info_split = info.split("/")

        if len(info_split) >= 10 and info_split[9] == "Sleeveless":
            sleeveless_shirts.add(int(shirt_id))

    return sleeveless_shirts
