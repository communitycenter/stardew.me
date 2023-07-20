import sys

from lib.tools import createPlayer
from lib.assets import loadAvatarAssets
from lib.renderer import CharacterRenderer


if __name__ == "__main__":
    file_path = "./saves/yuh"

    if len(sys.argv) > 1:
        file_path = "./saves/" + sys.argv[1]

    assets = loadAvatarAssets()
    player = createPlayer(file_path)
    Avatar = CharacterRenderer(player, assets)
    avatar = Avatar.render()
    avatar.save("test/test.png")
