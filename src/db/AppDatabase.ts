import { Dexie } from 'dexie';
import { Framework } from 'data/frameworks';
import {
  PickaxeSets,
  PickaxeParts,
  PickaxeUniquePartNames,
} from 'data/pickaxes';
import { Miner } from 'utils/miner';
import { MinerWeapon } from 'utils/weapons';
import { WeaponSkin } from '../data/weaponskins';

export class AppDatabase extends Dexie {
  overclocks: Dexie.Table<OverclockEntry, number>;
  frameworks: Dexie.Table<FrameworkEntry, number>;
  pickaxes: Dexie.Table<PickaxeEntry, number>;
  pickaxeUniques: Dexie.Table<PickaxeUniquePartEntry, number>;
  weaponSkins: Dexie.Table<WeaponSkinEntry, number>;

  constructor() {
    super('DRG-Completionist');
    this.version(3).stores({
      overclocks: '[weapon+name], weapon',
      frameworks: '[weapon+name], weapon',
      pickaxes: '[part+name], name',
      pickaxeUniques: 'name',
      weaponSkins: '[weapon+name], weapon',
    });

    this.overclocks = this.table('overclocks');
    this.frameworks = this.table('frameworks');
    this.pickaxes = this.table('pickaxes');
    this.pickaxeUniques = this.table('pickaxeUniques');
    this.weaponSkins = this.table('weaponSkins');
  }

  /** Async call to clear all current IndexedDB tables completely. */
  clearAll = () => Promise.all(this.tables.map((t) => t.clear()));
}

export type OverclockEntry = {
  weapon: MinerWeapon<Miner>;
  name: string;
  isForged: boolean;
};

export type FrameworkEntry = {
  weapon: MinerWeapon<Miner>;
  name: Framework
};

export type PickaxeEntry = {
  name: typeof PickaxeSets[number];
  part: PickaxeParts;
};

export type PickaxeUniquePartEntry = {
  name: typeof PickaxeUniquePartNames[number];
};

export type WeaponSkinEntry = {
  weapon: MinerWeapon<Miner>;
  name: WeaponSkin;
}
