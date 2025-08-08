import React from 'react';
import { Card, Grid } from 'antd-mobile';
import { AuthService } from '../services/auth.service';

const Home: React.FC = () => {
  const currentUser = AuthService.getCurrentUser();

  const quickActions = [
    { icon: '📞', title: '紧急呼叫', color: '#ff4d4f' },
    { icon: '❤️', title: '健康监测', color: '#52c41a' },
    { icon: '👩‍⚕️', title: '护工服务', color: '#1890ff' },
    { icon: '📋', title: '订单管理', color: '#722ed1' },
    { icon: '⚠️', title: '健康预警', color: '#fa8c16' },
  ];

  return (
    <div style={{ padding: '16px', background: '#f5f5f5', minHeight: '100vh' }}>
      {/* 欢迎卡片 */}
      <Card
        style={{
          marginBottom: '16px',
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          color: 'white'
        }}
      >
        <div style={{ textAlign: 'center', padding: '20px 0' }}>
          <h2 style={{ color: 'white', margin: '0 0 8px 0' }}>
            欢迎回来
          </h2>
          <p style={{ color: 'rgba(255,255,255,0.8)', margin: 0 }}>
            {currentUser?.realname || currentUser?.username}
          </p>
        </div>
      </Card>

      {/* 快捷功能 */}
      <Card title="快捷功能" style={{ marginBottom: '16px' }}>
        <Grid columns={2} gap={12}>
          {quickActions.map((action, index) => (
            <Grid.Item key={index}>
              <div style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                padding: '20px',
                background: '#f8f9fa',
                borderRadius: '8px',
                border: `2px solid ${action.color}20`
              }}>
                <div style={{
                  fontSize: '24px',
                  color: action.color,
                  marginBottom: '8px'
                }}>
                  {action.icon}
                </div>
                <span style={{ fontSize: '14px', color: '#666' }}>
                  {action.title}
                </span>
              </div>
            </Grid.Item>
          ))}
        </Grid>
      </Card>

      {/* 今日概览 */}
      <Card title="今日概览">
        <div style={{ textAlign: 'center', padding: '20px 0' }}>
          <p style={{ color: '#999', margin: 0 }}>
            暂无数据，功能开发中...
          </p>
        </div>
      </Card>
    </div>
  );
};

export default Home; 