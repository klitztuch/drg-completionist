import {  WeaponSkins} from '../../data/weaponskins';

export default function WeaponSkinIcon(props: {
  weaponskin: typeof WeaponSkins[number];
}){
  return  (
    <div
      style={{
        position: 'relative',
        height: 100,
        width: 100,
        margin: 'auto',
      }}
    >
      <div
        style={{
          position: 'absolute',
          transform: 'translate(-50%,-50%)',
          top: '50%',
          left: '50%',
        }}
      >
        {/*<Image*/}
        {/*  alt={props.weaponskin}*/}
        {/*  src={WeaponSkinIconMap[props.weaponskin]}*/}
        {/*  style={{ height: 100, width: 100 }}*/}
        {/*/>*/}
      </div>
    </div>
  );
}