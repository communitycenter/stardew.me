# I spent too much time looking at SDV source code on how to recolor the player's skin.
from PIL import Image
from PIL.ImageChops import offset
from PIL.ImageOps import grayscale, colorize

from typing import Tuple, List, Dict

from .assets import loadAvatarAssets

Color = Tuple[int, int, int, int]
Offsets = Dict[str, Dict[int, List[int]]]
# example for Offsets: {male: {260: [0,1,2]}}
# for male characters the color at 260 is in indicies 0,1,2


class CharacterRenderer:
    def __init__(self, player: Dict[str, any]):
        self.assets = loadAvatarAssets()
        self.avatar = Image.new("RGBA", (16, 32), (0, 0, 0, 0))
        self.player = player
        self.gender = "male" if player["isMale"] else "female"
        self.__setup_offsets()
        self.base = self.assets["base"][self.gender]
        self.__recolor_base()

    def __change_brightness(self, c: Color, brightness: int):
        r = min(255, max(0, c[0] + brightness))
        g = min(255, max(0, c[1] + brightness))
        # what was concernedape cooking
        b = min(
            255,
            max(
                0,
                c[2] + (brightness * 5 // 6 if brightness > 0 else brightness * 8 // 7),
            ),
        )

        return (r, g, b, c[3])

    def __swap_color(self, source_color_index: int, target_color: Color):
        """Replace all pixels which match the color at source_color_index with target_color

        Args:
            source_color_index (int): index of the color in the original assets
            target_color (Color): color which is replacing the original asset color
        """
        image = self.base.convert("RGBA")
        pixel_data = list(image.getdata())

        for offset in self.__recolorOffsets[source_color_index]:
            pixel_data[offset] = target_color

        image.putdata(pixel_data)

        self.base = image

    def __tint_image(self, img: Image, tint: List[int]):
        """Tint the image with the given color.

        Args:
            tint (Color): color to tint the image with
        """
        tintedImage = colorize(grayscale(img), (0, 0, 0), tint)
        tintedImage.putalpha(img.split()[3])
        return tintedImage

    def __setup_offsets(self):
        self.__recolorOffsets = {}

        self.__recolorOffsets[256] = self.__generate_pixel_indices(
            256
        )  # sleeve darkest
        self.__recolorOffsets[257] = self.__generate_pixel_indices(257)  # sleeve medium
        self.__recolorOffsets[258] = self.__generate_pixel_indices(
            258
        )  # sleeve lightest
        self.__recolorOffsets[268] = self.__generate_pixel_indices(268)  # shoe dark
        self.__recolorOffsets[269] = self.__generate_pixel_indices(269)  # shoe medium
        self.__recolorOffsets[270] = self.__generate_pixel_indices(
            270
        )  # shoe lightest3
        self.__recolorOffsets[271] = self.__generate_pixel_indices(
            271
        )  # shoe lightest2
        self.__recolorOffsets[260] = self.__generate_pixel_indices(260)  # skin dark
        self.__recolorOffsets[261] = self.__generate_pixel_indices(261)  # skin medium
        self.__recolorOffsets[262] = self.__generate_pixel_indices(262)  # skin lightest
        self.__recolorOffsets[276] = self.__generate_pixel_indices(276)  # eye bright
        self.__recolorOffsets[277] = self.__generate_pixel_indices(277)  # eye darker

    def __generate_pixel_indices(self, source_color_index: int) -> list:
        """Generates a list of pixel indices that match the source_color_index.

        Args:
            source_color_index (int): the index of the color to find and match
            texture_file (Image): the image which we're searching for the source_color_index

        Returns:
            list: a list of pixel indices that match the source_color_index
        """
        pixel_indices = []
        image = self.assets["base"][self.gender]
        image = image.convert("RGBA")

        # get a list of rgba values for each pixel in the image
        pixel_data = list(image.getdata())

        color = pixel_data[source_color_index]

        # find all pixels that match the source_color_index
        for index, pixel in enumerate(pixel_data):
            if pixel == color:
                pixel_indices.append(index)

        return pixel_indices

    def __recolor_base(self):
        """Recolor the base image to match the player's skin, eye, shirt, and shoe color choices"""
        self.__apply_skin_color(self.player["skin"])
        self.__apply_eye_color(self.player["eyes"])
        self.__apply_sleeve_color(self.player["shirt"]["type"])
        self.__apply_shoe_color(self.player["shoes"])
        self.base.save("./test/base.png")
        return

    def __apply_skin_color(self, skin_index: int):
        """Replace the stock skin color with the player's chosen skin color.

        Args:
            skin_index (int): Value of the player's skin choice. Found in save game file.
        """
        skinColors = self.assets["skinColors"]

        if (skin_index < 0) or (skin_index > self.assets["skinColors"].height - 1):
            skin_index = 0

        skinColorsData = list(self.assets["skinColors"].getdata())

        # skinColors 1st col is darkest, lightest is 3rd col in image.
        darkest: Color = skinColorsData[skin_index * 3 % (skinColors.height * 3)]
        medium: Color = skinColorsData[skin_index * 3 % (skinColors.height * 3) + 1]
        lightest: Color = skinColorsData[skin_index * 3 % (skinColors.height * 3) + 2]

        self.__swap_color(260, darkest)
        self.__swap_color(261, medium)
        self.__swap_color(262, lightest)

        # self.base.save("./test/base.png")
        return

    def __apply_eye_color(self, eye_color: Color):
        darker = self.__change_brightness(eye_color, -75)
        if eye_color == darker:
            eye_color[2] += 10
        self.__swap_color(276, eye_color)
        self.__swap_color(277, darker)
        # self.base.save("./test/base.png")
        return

    def __apply_sleeve_color(self, shirt_index: int):
        shirtsTexture = self.assets["shirts"].convert("RGBA")
        # crop out 128x608 section of the shirts texture, idk what the right side is for
        shirtsTexture = shirtsTexture.crop((0, 0, 128, 608))
        shirtData = list(shirtsTexture.getdata())

        # don't even ask me how this works...
        # https://github.com/veywrn/StardewValley/blob/3ff171b6e9e6839555d7881a391b624ccd820a83/StardewValley/FarmerRenderer.cs#L646
        index = (
            shirt_index * 8 // 128 * 32 * shirtsTexture.width
            + shirt_index * 8 % 128
            + shirtsTexture.width * 4
        )

        # sleeve color 1, SDV Source does a lot of extra stuff may come back to bite me
        dye_index = index + 128
        self.__swap_color(256, shirtData[dye_index])

        # sleeve color 2
        dye_index -= shirtsTexture.width * 2
        self.__swap_color(257, shirtData[dye_index])

        # sleeve color 3
        dye_index -= shirtsTexture.width * 2
        self.__swap_color(258, shirtData[dye_index])
        return
        # self.base.save("./test/base.png")

    def __apply_shoe_color(self, shoe_index: int):
        shoeColors = self.assets["shoeColors"]
        shoeColorsData = list(shoeColors.getdata())

        # shoeColors 1st col is darkest, lightest is 4th col in image.
        darkest: Color = shoeColorsData[shoe_index * 4 % (shoeColors.height * 4)]
        medium: Color = shoeColorsData[shoe_index * 4 % (shoeColors.height * 4) + 1]
        lightest3: Color = shoeColorsData[shoe_index * 4 % (shoeColors.height * 4) + 2]
        lightest2: Color = shoeColorsData[shoe_index * 4 % (shoeColors.height * 4) + 3]

        self.__swap_color(268, darkest)
        self.__swap_color(269, medium)
        self.__swap_color(270, lightest3)
        self.__swap_color(271, lightest2)
        # self.base.save("./test/base.png")
        return

    def __crop_farmer(self):
        """Crop the 16x32 farmer sprite and arms from the base image, and place them on top of eachother"""
        farmer = self.base.crop((0, 0, 16, 32))
        self.avatar = farmer

    def __draw_arms(self):
        """Draw the arms on top of the farmer"""
        # crop the arms from the base image.
        # the arms are the 6th column of sprites (0-indexed), so the starting x from base is 6 * 16
        # the starting y is 0 since its in the first row of sprites
        # the ending x is 6 * 16 + 16 since we want to crop 16 pixels wide so from the starting x we add 16
        # the ending y is 32 since we want to crop 32 pixels tall so from the starting y we add 32
        arms = self.base.crop((6 * 16, 0, 6 * 16 + 16, 32))
        self.avatar.paste(arms, (0, 0), arms)
        return

    def __crop_image(
        self,
        img: Image,
        index: int,
        width: int,
        object_size: Tuple[int, int],
        group_size: int,
        displacement: Tuple[int, int] = (0, 0),
    ):
        """
        Crop a single object from a spritesheet.
        Part of this was modified from the fellas at upload.farm, check them out!

        Args:
            img (Image): the spritesheet to crop from
            index (int): the index of the object in save file.
            width (int): the width of the spritesheet
            object_size (Tuple[int, int]): the size of the object to crop
            group_size (int): the number of objects grouped together in the spritesheet
            displacement (Tuple[int, int], optional): the displacement of the object in the spritesheet. Defaults to (0, 0).

        Returns:
            Image: the 16x32 image of the single object, placed based on the displacement
        """
        x = (index * object_size[0]) % width
        y = (index * object_size[0] // width) * (object_size[1] * group_size)

        image = offset(img, -x, -y).crop((0, 0, object_size[0], object_size[1]))

        resized = Image.new("RGBA", (16, 32), (0, 0, 0, 0))
        resized.paste(image, displacement, image)
        return resized

    def __draw_shirt(self):
        """Draw the shirt on top of the farmer"""
        displacement = (4, 15) if self.gender == "male" else (4, 16)
        shirt = self.__crop_image(
            self.assets["shirts"],
            self.player["shirt"]["type"],
            128,
            (8, 8),
            4,
            displacement,
        )
        self.avatar.paste(shirt, (0, 0), shirt)
        return

    def __draw_hair(self):
        """
        Draw the hair on top of the farmer.
        For now, this is just tinted, I'm not sure if SDV replaces the pixels like other stuff.
        # ! [BUG]: The hair is slightly off tint (not a big deal), and black hair is completely black (big deal).
        """

        hair = self.__crop_image(
            self.assets["hair"],
            self.player["hair"]
            if self.player["hat"]["hair"] is None
            else self.player["hat"]["hair"],
            128,
            (16, 32),
            3,
            (0, 1),
        )

        hair = self.__tint_image(hair, self.player["hair"]["color"])
        self.avatar.paste(hair, (0, 0), hair)
        return

    def __draw_pants(self):
        """Draw the pants on top of the farmer."""
        pants_x = self.player["pants"]["type"] % 10 * 192
        pants_y = self.player["pants"]["type"] // 10 * 688

        if not self.player["isMale"]:
            pants_x += 96

        pants = self.assets["pants"].crop(
            (pants_x, pants_y, pants_x + 192, pants_y + 688)
        )
        pants.crop((0, 0, 16, 32))
        pants = self.__tint_image(pants, self.player["pants"]["color"])
        self.avatar.paste(pants, (0, 0), pants)

    def __draw_accessories(self):
        """Draw the accessories on top of the farmer"""
        accessory = self.__crop_image(
            self.assets["accessories"],
            self.player["accessory"],
            128,
            (16, 16),
            2,
            (0, 2) if self.player["isMale"] else (0, 3),
        )

        # If one of the 5 facial hair accessories, tint it
        if self.player["accessory"] <= 5:
            accessory = self.__tint_image(accessory, self.player["hair"]["color"])

        self.avatar.paste(accessory, (0, 0), accessory)

    def __draw_hat(self):
        """Draw the hat on top of the farmer"""

        if not self.player["hat"]["type"]:
            return

        hat = self.__crop_image(
            self.assets["hats"],
            self.player["hat"]["type"],
            240,
            (20, 20),
            4,
            (-2, -2),
        )

        self.avatar.paste(hat, (0, 0), hat)

    def render(self):
        self.__crop_farmer()
        self.__draw_pants()
        self.__draw_shirt()
        self.__draw_hair()
        self.__draw_accessories()
        self.__draw_hat()
        self.__draw_arms()
        self.avatar = self.avatar.resize((128, 256), Image.NEAREST)
        # self.avatar.save("./test/avatar.png")
        return self.avatar
