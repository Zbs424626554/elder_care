import React from 'react';
import { Card, Typography } from 'antd';

const { Title } = Typography;

const Elderly: React.FC = () => {
  return (
    <div>
      <Title level={2}>老人管理</Title>
      <Card>
        <p>老人管理页面，具体功能待开发...</p>
      </Card>
    </div>
  );
};

export default Elderly; 