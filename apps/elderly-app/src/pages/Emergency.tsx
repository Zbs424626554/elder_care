import React from 'react';
import { Card, Typography } from 'antd';

const { Title } = Typography;

const Emergency: React.FC = () => {
  return (
    <div>
      <Title level={2}>紧急呼叫</Title>
      <Card>
        <p>紧急呼叫页面，具体功能待开发...</p>
      </Card>
    </div>
  );
};

export default Emergency; 