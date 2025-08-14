import React from 'react';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import { TabBar, SafeArea } from 'antd-mobile';
import {
  AppOutline,
  UserOutline,
  HeartOutline,
  UserAddOutline,
  UnorderedListOutline,
  ExclamationCircleOutline,
} from 'antd-mobile-icons';
import styles from './Layout.module.css';

const Layout: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const tabs = [
    {
      key: '/home',
      title: '首页',
      icon: <AppOutline />,
    },
    {
      key: '/home/elderly',
      title: '老人',
      icon: <UserOutline />,
    },
    {
      key: '/home/health',
      title: '健康',
      icon: <HeartOutline />,
    },
    {
      key: '/home/nurses',
      title: '护工',
      icon: <UserAddOutline />,
    },
    {
      key: '/home/profile',
      title: '我的',
      icon: <UserOutline />,
    },
  ];

  const getActiveKey = () => {
    const path = location.pathname;
    if (path === '/home') return '/home';
    return path;
  };

  const handleTabChange = (key: string) => {
    navigate(key);
  };

  return (
    <div className={styles.layout}>
      {/* 顶部安全区 */}
      <SafeArea position="top" />

      {/* 导航栏 */}
      <div className={styles.navBar}>
        <span>智慧养老</span>
        <i className="fas fa-bell notification-icon"></i>
      </div>

      {/* 内容区域 */}
      <div className={styles.content}>
        <Outlet />
      </div>

      {/* 底部标签栏 */}
      <div className={styles.tabBarContainer}>
        <TabBar
          activeKey={getActiveKey()}
          onChange={handleTabChange}
          className={styles.customTabBar}
        >
          {tabs.map((item) => (
            <TabBar.Item key={item.key} icon={item.icon} title={item.title} />
          ))}
        </TabBar>
        {/* 底部安全区 */}
        <SafeArea position="bottom" />
      </div>
    </div>
  );
};

export default Layout;
