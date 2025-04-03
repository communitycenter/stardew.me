export type Color = [number, number, number, number];

export interface XMLColor {
  R: number;
  G: number;
  B: number;
  A: number;
  PackedValue?: number;
}

export interface ShirtItem {
  isLostItem?: boolean;
  category?: number;
  hasBeenInInventory?: boolean;
  name?: string;
  parentSheetIndex?: number;
  specialItem?: boolean;
  isRecipe?: boolean;
  quality?: number;
  stack?: number;
  SpecialVariable?: number;
  price?: number;
  indexInTileSheetFemale?: number;
  clothesType?: string;
  Price?: number;
  // Required fields
  itemId: number | string;
  isPrismatic: boolean;
  dyeable: boolean;
  indexInTileSheet: number;
  clothesColor: XMLColor;
}

export interface Hat {
  isLostItem?: boolean;
  category?: number;
  hasBeenInInventory?: boolean;
  name?: string;
  specialItem?: boolean;
  isRecipe?: boolean;
  quality?: number;
  stack?: number;
  SpecialVariable?: number;
  skipHairDraw?: boolean;
  // Required fields
  itemId: number | string;
  hairDrawType: number;
  isPrismatic: boolean;
  ignoreHairstyleOffset: boolean;
}

export interface PantsItem {
  isLostItem?: boolean;
  category?: number;
  hasBeenInInventory?: boolean;
  name?: string;
  specialItem?: boolean;
  isRecipe?: boolean;
  quality?: number;
  stack?: number;
  SpecialVariable?: number;
  price?: number;
  indexInTileSheetFemale?: number;
  clothesType?: string;
  Price?: number;
  // Required fields
  itemId: number | string;
  isPrismatic: boolean;
  dyeable: boolean;
  indexInTileSheet: number;
  clothesColor: XMLColor;
}

export interface Player {
  name: string;
  gender: "Male" | "Female";
  shirt?: number | string;
  hair: number;
  skin: number;
  shoes: number | string;
  accessory: number;
  hairstyleColor: XMLColor;
  newEyeColor: XMLColor;
  shirtItem: ShirtItem;
  pantsItem: PantsItem;
  hat?: Hat;
  background?: "day" | "night";
}
