import React from 'react';
import { Card, Typography } from 'antd';

const { Title } = Typography;

const Orders: React.FC = () => {
  return (
    <div>
      <Title level={2}>订单管理</Title>
      <Card>
        <p>订单管理页面，具体功能待开发...</p>
      </Card>
    </div>
  );
};

export default Orders; 