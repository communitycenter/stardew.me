export type Color = number[];

export interface Hat {
  type: number;
  hairDrawType: number;
  ignoreHairstyleOffset: boolean;
}

export interface Shirt {
  type: number;
  dyeable: boolean;
  color: Color;
}

export interface Pants {
  type: number;
  dyeable: boolean;
  color: Color;
}

export interface Hair {
  type: number;
  color: Color;
}

export interface Player {
  name: string;
  isMale: boolean;
  hair: Hair;
  skin: number;
  accessory: number;
  hat?: Hat | null;
  pants: Pants;
  shirt: Shirt;
  shoes: number;
  eyeColor: Color;
}
