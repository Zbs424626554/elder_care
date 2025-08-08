import React from 'react';
import { Card, List, Avatar, Button } from 'antd-mobile';
import { AuthService } from '../services/auth.service';

const Profile: React.FC = () => {
  const currentUser = AuthService.getCurrentUser();

  const handleLogout = () => {
    AuthService.logout();
  };

  const menuItems = [
    {
      icon: '⚙️',
      title: '账户设置',
      description: '修改密码、绑定手机等',
      onClick: () => console.log('账户设置')
    },
    {
      icon: '❓',
      title: '帮助中心',
      description: '常见问题、使用指南',
      onClick: () => console.log('帮助中心')
    }
  ];

  return (
    <div style={{ padding: '16px', background: '#f5f5f5', minHeight: '100vh' }}>
      {/* 用户信息卡片 */}
      <Card style={{ marginBottom: '16px' }}>
        <div style={{
          display: 'flex',
          alignItems: 'center',
          padding: '16px 0'
        }}>
          <Avatar
            style={{
              '--size': '64px',
              backgroundColor: '#1890ff',
              marginRight: '16px'
            }}
          >
            {currentUser?.realname?.charAt(0) || currentUser?.username?.charAt(0) || 'U'}
          </Avatar>
          <div style={{ flex: 1 }}>
            <h3 style={{ margin: '0 0 4px 0', color: '#333' }}>
              {currentUser?.realname || currentUser?.username || '用户'}
            </h3>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              color: '#666',
              fontSize: '14px'
            }}>
              <span style={{ marginRight: '4px' }}>📱</span>
              {currentUser?.phone || '未绑定手机'}
            </div>
          </div>
          <Button size="small" fill="outline">
            编辑
          </Button>
        </div>
      </Card>

      {/* 功能菜单 */}
      <Card style={{ marginBottom: '16px' }}>
        <List>
          {menuItems.map((item, index) => (
            <List.Item
              key={index}
              prefix={
                <div style={{
                  color: '#1890ff',
                  fontSize: '20px',
                  display: 'flex',
                  alignItems: 'center'
                }}>
                  {item.icon}
                </div>
              }
              description={item.description}
              clickable
              onClick={item.onClick}
            >
              {item.title}
            </List.Item>
          ))}
        </List>
      </Card>

      {/* 退出登录 */}
      <Card>
        <Button
          block
          color="danger"
          fill="outline"
          onClick={handleLogout}
          style={{ height: '48px' }}
        >
          <span style={{ marginRight: '8px' }}>🚪</span>
          退出登录
        </Button>
      </Card>

      {/* 版本信息 */}
      <div style={{
        textAlign: 'center',
        marginTop: '24px',
        color: '#999',
        fontSize: '12px'
      }}>
        智慧养老平台 v1.0.0
      </div>
    </div>
  );
};

export default Profile; 