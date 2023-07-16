import xmltodict


def formatTime(milliseconds: int):
    seconds = milliseconds // 1000
    minutes = seconds // 60
    hours = minutes // 60

    seconds %= 60
    minutes %= 60

    return f"{hours:02}:{minutes:02}:{seconds:02}"


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
    pantsColor = (
        int(doc["SaveGame"]["player"]["pantsColor"]["R"]),
        int(doc["SaveGame"]["player"]["pantsColor"]["G"]),
        int(doc["SaveGame"]["player"]["pantsColor"]["B"]),
        int(doc["SaveGame"]["player"]["pantsColor"]["A"]),
    )
    hairColor = (
        int(doc["SaveGame"]["player"]["hairstyleColor"]["R"]),
        int(doc["SaveGame"]["player"]["hairstyleColor"]["G"]),
        int(doc["SaveGame"]["player"]["hairstyleColor"]["B"]),
        int(doc["SaveGame"]["player"]["hairstyleColor"]["A"]),
    )

    player = {
        "isMale": doc["SaveGame"]["player"]["isMale"] == "true",
        "hair": {
            "type": int(doc["SaveGame"]["player"]["hair"]),
            "color": hairColor,
        },
        "skin": int(doc["SaveGame"]["player"]["skin"]),
        "accessory": int(doc["SaveGame"]["player"]["accessory"]),
        "hat": {
            "type": int(doc["SaveGame"]["player"]["hat"].get("which"))
            if doc["SaveGame"]["player"].get("hat")
            else None,
            "hair": int(doc["SaveGame"]["player"]["hat"].get("hairDrawType"))
            if doc["SaveGame"]["player"].get("hat")
            else None,
        },
        "pants": {
            "type": int(doc["SaveGame"]["player"]["pantsItem"]["indexInTileSheet"]),
            "color": pantsColor,
        },
        "shirt": {
            "type": int(doc["SaveGame"]["player"]["shirtItem"]["indexInTileSheet"])
        },
        "shoes": int(doc["SaveGame"]["player"]["shoes"]),
        "eyes": eyeColor,
    }

    return player
