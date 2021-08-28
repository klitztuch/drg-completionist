import { useCallback } from "react";
import { WeaponSkins } from 'data/weaponskins';
import { AppDatabase } from "db/AppDatabase";
import MinerPageLayout from 'pages/MinerPageLayout';
import { Miner } from "utils/miner";
import { MinerWeapons } from "utils/weapons";
import MinerWeaponSkins from './MinerWeaponSkins';

export default function WeaponSkinsPage() {
    const getProgress = useCallback(async (db: AppDatabase, miner: Miner) => {
        const weapons = MinerWeapons[miner];
        const acquiredWeaponSkins = await db.weaponSkins
          .where('weapon')
          .anyOf(weapons)
          .count();
        console.log(acquiredWeaponSkins);
        console.log(WeaponSkins.length);
        console.log(weapons.length);
        return acquiredWeaponSkins / (WeaponSkins.length * weapons.length);
    }, []);
    return(
      <MinerPageLayout category="WeaponSkins" getProgress={getProgress}>
          {(miner) => <MinerWeaponSkins miner={miner}/>}
      </MinerPageLayout>
    )
}