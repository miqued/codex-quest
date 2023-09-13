import { SavingThrowsType } from "./CharacterSheet/SavingThrows/definitions";
import { Abilities } from "./CreateCharacter/CharacterAbilities/definitions";
import { EquipmentItem } from "./EquipmentStore/definitions";

interface HP {
  dice: string;
  points: number;
  max: number;
  desc: string;
}

export interface SpellLevels {
  cleric: number | null;
  "magic-user": number | null;
  druid: number | null;
  illusionist: number | null;
}

export interface Spell {
  name: string;
  range: string;
  level: SpellLevels;
  duration: string;
  description: string;
}

interface SpecialRestriction {
  race: string[];
  class: string[];
}

export interface CharacterData {
  abilities: Abilities;
  avatar: string;
  class: string | string[];
  desc: string | string[];
  equipment: EquipmentItem[];
  gold: number;
  hp: HP;
  id?: string;
  level: number;
  name: string;
  race: string;
  restrictions: SpecialRestriction;
  savingThrows: SavingThrowsType;
  specials: SpecialRestriction;
  spells: Spell[];
  wearing?: { armor: string; shield: string };
  weight: number;
  xp: number;
}

export type Capacity = { light: number; heavy: number };
export type CapacityMap = Record<string, Capacity>;

export type SpellItem = {
  name: string;
};

export interface SpellType {
  name: string;
  range: string;
  level: SpellLevels;
  duration: string;
  description: string;
}

export type SavingThrows = {
  deathRayOrPoison: number;
  magicWands: number;
  paralysisOrPetrify: number;
  dragonBreath: number;
  spells: number;
};

export enum DiceTypes {
  D4 = "d4",
  D6 = "d6",
  D8 = "d8",
  D10 = "d10",
  D12 = "d12",
  D20 = "d20",
  D100 = "d100",
}

export enum ClassNames {
  ASSASSIN = "Assassin",
  BARBARIAN = "Barbarian",
  CLERIC = "Cleric",
  DRUID = "Druid",
  FIGHTER = "Fighter",
  ILLUSIONIST = "Illusionist",
  MAGICUSER = "Magic-User",
  THIEF = "Thief",
  CUSTOM = "Custom",
}

export enum RaceNames {
  DWARF = "Dwarf",
  ELF = "Elf",
  GNOME = "Gnome",
  HALFLING = "Halfling",
  HUMAN = "Human",
  CUSTOM = "Custom",
}
