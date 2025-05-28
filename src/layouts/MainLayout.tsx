import React from 'react';
import { Outlet } from 'react-router-dom';
import { Layout } from 'antd';
import styles from './MainLayout.module.scss';
import Logo from '../components/Logo';
import UserInfo from '../components/UserInfo';
import useLoadUserData from '@/hooks/useLoadUserData';
import SpinLoading from '@/components/SpinLoading';
import useNavPage from '@/hooks/useNavPage';

const { Header, Content, Footer } = Layout;

const MainLayout: React.FC = () => {
  const { waitingUserData } = useLoadUserData();
  useNavPage(waitingUserData);
  return (
    <Layout>
      <Header className={styles.header}>
        <div className={styles.left}>
          <Logo />
        </div>
        <div className={styles.right}>
          <UserInfo />
        </div>
      </Header>
      <Layout className={styles.main}>
        <Content>
          {waitingUserData ? (
            <div className={styles.spin}>
              <SpinLoading size="large" />
            </div>
          ) : (
            <Outlet />
          )}
        </Content>
      </Layout>
      <Footer className={styles.footer}>
        独角兽问卷 &copy; 2023 - present. Created by 亚当老师
      </Footer>
    </Layout>
  );
};

export default MainLayout;
