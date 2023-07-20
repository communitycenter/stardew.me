from pydantic import BaseModel
from typing import Tuple, Optional


class Hat(BaseModel):
    type: int
    hairDrawType: int
    ignoreHairstyleOffset: bool


class Hair(BaseModel):
    type: int
    color: Tuple[int, int, int, int]


class Pants(BaseModel):
    type: int
    color: Tuple[int, int, int, int]


class Shirt(BaseModel):
    type: int
    color: Optional[Tuple[int, int, int, int]]


class Player(BaseModel):
    isMale: bool
    hair: Hair
    skin: int
    accessory: int
    hat: Optional[Hat] = None
    pants: Pants
    shirt: Shirt
    shoes: int
    eyeColor: Tuple[int, int, int, int]
