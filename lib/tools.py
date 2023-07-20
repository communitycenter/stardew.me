import xmltodict


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

    hat = None
    if doc["SaveGame"]["player"].get("hat"):
        hat = {
            "type": int(doc["SaveGame"]["player"]["hat"]["which"]),
            "hairDrawType": int(doc["SaveGame"]["player"]["hat"]["hairDrawType"]),
            "ignoreHairstyleOffset": True
            if doc["SaveGame"]["player"]["hat"].get("ignoreHairstyleOffset") == "true"
            else False,
        }

    if doc["SaveGame"]["player"].get("shirtItem"):
        shirt = {
            "type": int(doc["SaveGame"]["player"]["shirtItem"]["indexInTileSheet"])
        }
    else:
        if doc["SaveGame"]["player"]["isMale"] == "true":
            shirt = {"type": 209}
        else:
            shirt = {"type": 41}

    player = {
        "isMale": doc["SaveGame"]["player"]["isMale"] == "true",
        "hair": {
            "type": int(doc["SaveGame"]["player"]["hair"]),
            "color": hairColor,
        },
        "skin": int(doc["SaveGame"]["player"]["skin"]),
        "accessory": int(doc["SaveGame"]["player"]["accessory"]),
        "hat": hat,
        "pants": {
            "type": int(doc["SaveGame"]["player"]["pantsItem"]["indexInTileSheet"]),
            "color": pantsColor,
        },
        "shirt": shirt,
        "shoes": int(doc["SaveGame"]["player"]["shoes"]),
        "eyeColor": eyeColor,
    }

    print(player)

    return player
