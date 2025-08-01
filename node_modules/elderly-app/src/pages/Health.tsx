import React from 'react';
import { Card, Typography } from 'antd';

const { Title } = Typography;

const Health: React.FC = () => {
  return (
    <div>
      <Title level={2}>健康管理</Title>
      <Card>
        <p>健康管理页面，具体功能待开发...</p>
      </Card>
    </div>
  );
};

export default Health; 