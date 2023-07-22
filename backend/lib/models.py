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
    dyeable: bool
    color: Tuple[int, int, int, int]


class Shirt(BaseModel):
    type: int
    dyeable: bool
    color: Optional[Tuple[int, int, int, int]]


class Player(BaseModel):
    isMale: bool
    hair: Hair
    skin: int
    accessory: int
    hat: Optional[Hat] = None
    pants: Pants  # TODO: make this optional?
    shirt: Shirt  # TODO: make this optional?
    shoes: int
    eyeColor: Tuple[int, int, int, int]
