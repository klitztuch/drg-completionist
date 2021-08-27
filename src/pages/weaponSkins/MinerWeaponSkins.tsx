import { Row } from 'antd';
import React from 'react';
import WeaponDivider from '../../components/WeaponDivider';
import { WeaponSkins } from '../../data/weaponskins';
import { Miner } from '../../utils/miner';
import { MinerWeapon, MinerWeapons } from '../../utils/weapons';
import WeaponSkinCard from './WeaponSkinCard';

export default function MinerWeaponSkins<T extends  Miner>(props: {miner: T}){
  const { miner } = props;

  return (
    <>
      {(MinerWeapons[miner] as readonly MinerWeapon<T>[]).map((weapon) => (
        <React.Fragment key={weapon}>
          <WeaponDivider weapon={weapon} />
          <Row gutter={[16, 16]}>
            {WeaponSkins.map((weaponSkin) => (
              <WeaponSkinCard
                key={weaponSkin}
                miner={miner}
                weapon={weapon}
                weaponSkin={weaponSkin}
              />
            ))}
          </Row>
        </React.Fragment>
      ))}
    </>
  )
}