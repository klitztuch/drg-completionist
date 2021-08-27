import { Badge, Card, Col } from 'antd';
import { useCallback } from 'react';
import { WeaponSkin } from '../../data/weaponskins';
import useDB from '../../db/useDB';
import useSuspendedLiveQuery from '../../db/useSuspendedLiveQuery';
import { Miner, MinerColor } from '../../utils/miner';
import { MinerWeapon } from '../../utils/weapons';
import WeaponSkinIcon from './WeaponSkinIcon';

export default function WeaponSkinCard(props: {
  miner: Miner;
  weapon: MinerWeapon<Miner>;
  weaponSkin: WeaponSkin;
}){
  const db = useDB();
  const query = useSuspendedLiveQuery(
    () => db.weaponSkins.get({weapon: props.weapon, name: props.weaponSkin}),
    [props.weapon, props.weaponSkin]
  );

  const onClick = useCallback(() => {
    if (query === undefined) {
      db.weaponSkins.add({
        weapon: props.weapon,
        name: props.weaponSkin,
      });
    } else {
      db.weaponSkins
        .where({
          weapon: props.weapon,
          name: props.weaponSkin,
        })
        .delete();
    }
  }, [db.weaponSkins, props.weaponSkin, props.weapon, query]);

  return (
    <Col xxl={4} xl={4} lg={8} md={8} sm={8} xs={12} key={props.weaponSkin}>
      <Badge.Ribbon className="weaponskin-ribbon" text={props.weaponSkin}>
        <Card
          hoverable
          onClick={onClick}
          size="small"
          style={{
            backgroundColor: query ? MinerColor[props.miner] : 'inherit',
            transition: 'all 0.3s ease',
          }}
        >
          <WeaponSkinIcon weaponskin={props.weaponSkin} />
        </Card>
      </Badge.Ribbon>
    </Col>
  );
}