import { Col, BackTop, Layout, Row, Spin } from 'antd';
import 'antd/dist/antd.dark.css';
import React, { lazy, memo } from 'react';
import { Route, Switch } from 'react-router-dom';
import PageFooter from 'components/PageFooter';
import PageHeader from 'components/PageHeader';

const { Content } = Layout;

export type TabName = 'overclocks' | 'frameworks' | 'pickaxes' | 'weaponSkins';

export const DEFAULT_TAB: TabName = 'overclocks';

export const TABS: Array<{
  title: string;
  key: TabName;
  content: React.ComponentType;
}> = [
  {
    title: 'Overclocks',
    key: 'overclocks',
    content: lazy(() => import('pages/overclocks/OverclocksPage')),
  },
  {
    title: 'Weapon Frameworks',
    key: 'frameworks',
    content: lazy(() => import('pages/frameworks/FrameworksPage')),
  },
  // https://github.com/BobertForever/drg-completionist/issues/1
  // {
  //   title: "Weapon Skins",
  //   key: "skins",
  //   content: <></>,
  // },
  // https://github.com/BobertForever/drg-completionist/issues/2
  // {
  //   title: "Miner Accessories",
  //   key: "accessories",
  //   content: <></>,
  // },
  // https://github.com/BobertForever/drg-completionist/issues/3
  {
    title: 'Pickaxes',
    key: 'pickaxes',
    content: lazy(() => import('pages/pickaxes/PickaxesPage')),
  },
  {
    title: 'Weapon Skins',
    key: 'weaponSkins',
    content: lazy(() => import('pages/weaponSkins/WeaponSkinsPage')),
  }
];

const PageSpinner = memo(function PageSpinner() {
  return (
    <div
      style={{
        lineHeight: '50vh',
        width: '100%',
        textAlign: 'center',
      }}
    >
      <Spin />
    </div>
  );
});

export default function App() {
  return (
    <Layout style={{ backgroundColor: '#1a1a1a' }}>
      <BackTop style={{ bottom: 110 }} />
      <Content style={{ marginBottom: 100 }}>
        <Row justify="center">
          <Col xs={22} lg={18}>
            <PageHeader />
          </Col>
          <Col xs={22} lg={18}>
            <Switch>
              {TABS.map((tab) => (
                <Route
                  exact
                  path={
                    [
                      `/${tab.key}`,
                      tab.key === DEFAULT_TAB ? '/' : undefined,
                    ].filter((x) => x !== undefined) as string[]
                  }
                  key={tab.key}
                >
                  <React.Suspense fallback={<PageSpinner />}>
                    <tab.content />
                  </React.Suspense>
                </Route>
              ))}
            </Switch>
          </Col>
        </Row>
      </Content>
      <PageFooter />
    </Layout>
  );
}
