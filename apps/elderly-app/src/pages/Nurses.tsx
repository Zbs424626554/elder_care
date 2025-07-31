import React from 'react';
import { Card, Typography } from 'antd';

const { Title } = Typography;

const Nurses: React.FC = () => {
  return (
    <div>
      <Title level={2}>护工列表</Title>
      <Card>
        <p>护工列表页面，具体功能待开发...</p>
      </Card>
    </div>
  );
};

export default Nurses; 