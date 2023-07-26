import sys

from lib.tools import createPlayer, get_sleeveless_shirts
from lib.assets import loadAvatarAssets
from lib.renderer import CharacterRenderer


if __name__ == "__main__":
    file_path = "./saves/jack"

    if len(sys.argv) > 1:
        file_path = "./saves/" + sys.argv[1]

    sleeveless_shirts = get_sleeveless_shirts()
    assets = loadAvatarAssets()
    player = createPlayer(file_path)
    player["background"] = "night"
    Avatar = CharacterRenderer(player, assets, sleeveless_shirts)
    avatar = Avatar.render()
    avatar.save("test.png")
