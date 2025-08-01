import React from 'react';
import { Card, Typography } from 'antd';

const { Title } = Typography;

const Warnings: React.FC = () => {
  return (
    <div>
      <Title level={2}>预警管理</Title>
      <Card>
        <p>预警管理页面，具体功能待开发...</p>
      </Card>
    </div>
  );
};

export default Warnings; 