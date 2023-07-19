import os

from PIL import Image


def loadAvatarAssets():
    assets = {
        "base": {
            "male": Image.open(os.path.join("assets", "farmer_base.png")),
            "female": Image.open(os.path.join("assets", "farmer_girl_base.png")),
        },
        "hair": Image.open(os.path.join("assets", "hairstyles.png")),
        "accessories": Image.open(os.path.join("assets", "accessories.png")),
        "shirts": Image.open(os.path.join("assets", "shirts.png")),
        "skinColors": Image.open(os.path.join("assets", "skinColors.png")),
        "shoeColors": Image.open(os.path.join("assets", "shoeColors.png")),
        "pants": Image.open(os.path.join("assets", "pants.png")),
        "hats": Image.open(os.path.join("assets", "hats.png")),
        "background": {
            "day": Image.open(os.path.join("assets", "daybg.png")),
            "night": Image.open(os.path.join("assets", "nightbg.png")),
        },
    }
    return assets
