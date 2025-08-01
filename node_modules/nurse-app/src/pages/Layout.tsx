import React from 'react';
import { Layout as AntLayout, Menu, Button } from 'antd';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import {
  HomeOutlined,
  UserOutlined,
  FileTextOutlined,
  DollarOutlined,
  CalendarOutlined,
  LogoutOutlined,
  SolutionOutlined
} from '@ant-design/icons';
import { AuthService } from '../services/auth.service';

const { Header, Sider, Content } = AntLayout;

const Layout: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const currentUser = AuthService.getCurrentUser();

  const menuItems = [
    { key: '/home', icon: <HomeOutlined />, label: '首页' },
    { key: '/home/profile', icon: <UserOutlined />, label: '个人信息' },
    { key: '/home/certification', icon: <SolutionOutlined />, label: '资质认证' },
    { key: '/home/orders', icon: <FileTextOutlined />, label: '订单管理' },
    { key: '/home/income', icon: <DollarOutlined />, label: '收入统计' },
    { key: '/home/schedule', icon: <CalendarOutlined />, label: '排班管理' },
  ];

  const handleMenuClick = ({ key }: { key: string }) => {
    navigate(key);
  };

  const handleLogout = () => {
    AuthService.logout();
    navigate('/login');
  };

  return (
    <AntLayout style={{ minHeight: '100vh' }}>
      <Sider>
        <div style={{ 
          height: 64, 
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'center', 
          color: 'white', 
          fontSize: 18, 
          fontWeight: 'bold' 
        }}>
          智慧养老平台
        </div>
        <Menu
          theme="dark"
          mode="inline"
          selectedKeys={[location.pathname]}
          items={menuItems}
          onClick={handleMenuClick}
        />
      </Sider>
      <AntLayout>
        <Header style={{ 
          padding: '0 16px', 
          background: '#fff', 
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'space-between' 
        }}>
          <div>欢迎，{currentUser?.realname || currentUser?.username}</div>
          <Button onClick={handleLogout} icon={<LogoutOutlined />}>
            退出登录
          </Button>
        </Header>
        <Content style={{ 
          margin: '16px', 
          padding: '24px', 
          background: '#fff', 
          borderRadius: '8px', 
          minHeight: 'calc(100vh - 112px)' 
        }}>
          <Outlet />
        </Content>
      </AntLayout>
    </AntLayout>
  );
};

export default Layout; 