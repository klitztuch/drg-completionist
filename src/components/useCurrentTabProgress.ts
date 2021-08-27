import { useLiveQuery } from 'dexie-react-hooks';
import { useEffect, useMemo } from 'react';
import { TabName } from 'App';
import { Frameworks } from 'data/frameworks';
import { Overclocks } from 'data/overclocks';
import {
  PickaxePaintjobNames,
  PickaxeSets,
  PickaxeUniquePartNames,
} from 'data/pickaxes';
import useDB from 'db/useDB';
import { MinerWeapons } from 'utils/weapons';
import { WeaponSkins } from '../data/weaponskins';

type TabProgress = {
  progress: number;
  partialProgress: number | null;
};

export default function useCurrentTabProgress(
  currentTab: TabName
): TabProgress {
  const db = useDB();

  const totalItems: number = useMemo(() => {
    switch (currentTab) {
      case 'weaponSkins':
        return (
          WeaponSkins.length *
            Object.values(MinerWeapons).reduce((p, c) => p + c.length, 0)
        );
      case 'frameworks':
        return (
          Frameworks.length *
          Object.values(MinerWeapons).reduce((p, c) => p + c.length, 0)
        );
      case 'overclocks':
        return Object.values(Overclocks)
          .flatMap((w) => Object.values(w))
          .flat().length;
      case 'pickaxes':
        return (
          PickaxeSets.length * 5 +
          PickaxePaintjobNames.length +
          PickaxeUniquePartNames.length
        );
    }
  }, [currentTab]) as number;

  const p = useLiveQuery(
    async () => {
      switch (currentTab) {
        case 'weaponSkins': {
          const acquiredWeaponSkins: number = await db.weaponSkins.count();
          return {
            progress: (acquiredWeaponSkins / totalItems) * 100,
            partialProgress: null,
          };
          }
        case 'frameworks': {
          const acquiredFrameworks = await db.frameworks.count();
          return {
            progress: (acquiredFrameworks / totalItems) * 100,
            partialProgress: null,
          };
        }
        case 'overclocks': {
          const acquiredOverclocks = await db.overclocks.toArray();
          return {
            progress:
              (acquiredOverclocks.filter((o) => o.isForged).length /
                totalItems) *
              100,
            partialProgress:
              (acquiredOverclocks.filter((o) => !o.isForged).length /
                totalItems) *
              100,
          };
        }
        case 'pickaxes': {
          const acquiredPickaxeParts = await db.pickaxes.count();
          const acquiredPickaxeUniques = await db.pickaxeUniques.count();
          return {
            progress:
              ((acquiredPickaxeParts + acquiredPickaxeUniques) / totalItems) *
              100,
            partialProgress: null,
          };
        }
      }
    },
    [currentTab],
    {
      progress: 0,
      partialProgress: null,
    }
  ) as {progress: number; partialProgress: number};

  useEffect(() => {
    gtag('event', `progress`, {
      event_category: 'tab_progress',
      event_label: currentTab,
      value: Math.round(p.progress),
    });
  }, [p.progress, currentTab]);

  return {
    progress: Math.round(p.progress),
    partialProgress:
      p.partialProgress === null ? null : Math.round(p.partialProgress),
  };
}
