import React from 'react';
import { Card, Typography } from 'antd';
import { AuthService } from '../services/auth.service';

const { Title } = Typography;

const Home: React.FC = () => {
  const currentUser = AuthService.getCurrentUser();

  return (
    <div>
      <Title level={2}>家属端首页</Title>
      <Card>
        <p>欢迎，{currentUser?.realname || currentUser?.username}</p>
        <p>这里是家属端的首页，具体功能待开发...</p>
      </Card>
    </div>
  );
};

export default Home; 