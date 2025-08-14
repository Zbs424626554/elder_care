import React, { useState, useEffect } from 'react';
import {
  Typography,
  List,
  Card,
  Button,
  Tag,
  Space,
  Avatar,
  Rate,
  Badge,
  Tabs,
  Input,
  Select,
  message,
  Modal,
  Descriptions,
  Divider,
  Empty
} from 'antd';
import {
  SearchOutlined,
  EnvironmentOutlined,
  ClockCircleOutlined,
  DollarOutlined,
  UserOutlined,
  PhoneOutlined,
  HeartOutlined,
  StarOutlined,
  CheckCircleOutlined,
  ExclamationCircleOutlined
} from '@ant-design/icons';

const { Title, Text } = Typography;
const { Search } = Input;
const { Option } = Select;
const { TabPane } = Tabs;

interface ServiceOrder {
  id: string;
  title: string;
  description: string;
  location: string;
  distance: number;
  price: number;
  duration: string;
  skills: string[];
  elderlyInfo: {
    name: string;
    age: number;
    gender: string;
    avatar?: string;
  };
  familyInfo: {
    name: string;
    phone: string;
    rating: number;
  };
  status: 'pending' | 'assigned' | 'in-progress' | 'completed';
  orderType: 'grab' | 'assign';
  createdAt: string;
  urgent: boolean;
}

const Orders: React.FC = () => {
  const [orders, setOrders] = useState<ServiceOrder[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchText, setSearchText] = useState('');
  const [selectedSkills, setSelectedSkills] = useState<string[]>([]);
  const [selectedOrderType, setSelectedOrderType] = useState<'all' | 'grab' | 'assign'>('all');

  // 模拟订单数据
  const mockOrders: ServiceOrder[] = [
    {
      id: '1',
      title: '居家护理服务',
      description: '需要专业护工为80岁老人提供日常护理，包括生活照料、用药提醒等',
      location: '朝阳区建国门外大街',
      distance: 2.5,
      price: 150,
      duration: '8小时/天',
      skills: ['基础护理', '老年护理', '用药指导'],
      elderlyInfo: {
        name: '张奶奶',
        age: 80,
        gender: '女',
        avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=elderly1'
      },
      familyInfo: {
        name: '张先生',
        phone: '138****1234',
        rating: 4.8
      },
      status: 'pending',
      orderType: 'grab',
      createdAt: '2024-01-15 10:30',
      urgent: true
    },
    {
      id: '2',
      title: '康复护理服务',
      description: '为中风康复期老人提供专业康复护理，包括肢体康复训练、生活能力训练',
      location: '海淀区中关村大街',
      distance: 5.2,
      price: 200,
      duration: '6小时/天',
      skills: ['康复护理', '中风护理', '肢体康复'],
      elderlyInfo: {
        name: '李爷爷',
        age: 75,
        gender: '男',
        avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=elderly2'
      },
      familyInfo: {
        name: '李女士',
        phone: '139****5678',
        rating: 4.9
      },
      status: 'pending',
      orderType: 'assign',
      createdAt: '2024-01-15 09:15',
      urgent: false
    },
    {
      id: '3',
      title: '夜间陪护服务',
      description: '需要夜间陪护，主要关注老人安全，协助如厕，必要时呼叫家属',
      location: '西城区西单北大街',
      distance: 3.8,
      price: 120,
      duration: '12小时/晚',
      skills: ['夜间护理', '安全监护', '紧急处理'],
      elderlyInfo: {
        name: '王奶奶',
        age: 82,
        gender: '女',
        avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=elderly3'
      },
      familyInfo: {
        name: '王先生',
        phone: '137****9012',
        rating: 4.7
      },
      status: 'pending',
      orderType: 'grab',
      createdAt: '2024-01-15 08:45',
      urgent: true
    }
  ];

  useEffect(() => {
    setOrders(mockOrders);
  }, []);

  const skillOptions = [
    '基础护理', '老年护理', '康复护理', '心理护理',
    '急救技能', '营养配餐', '用药指导', '伤口护理',
    '导尿护理', '鼻饲护理', '压疮护理', '糖尿病护理',
    '高血压护理', '心脏病护理', '中风护理', '痴呆症护理',
    '夜间护理', '安全监护', '紧急处理', '肢体康复'
  ];

  const handleGrabOrder = (orderId: string) => {
    Modal.confirm({
      title: '确认接单',
      content: '确定要接这个订单吗？接单后需要按时到达服务地点。',
      onOk: () => {
        setOrders(prev =>
          prev.map(order =>
            order.id === orderId
              ? { ...order, status: 'assigned' as const }
              : order
          )
        );
        message.success('接单成功！');
      }
    });
  };

  const handleAcceptAssignment = (orderId: string) => {
    Modal.confirm({
      title: '确认接受派单',
      content: '平台为您分配了这个订单，是否接受？',
      onOk: () => {
        setOrders(prev =>
          prev.map(order =>
            order.id === orderId
              ? { ...order, status: 'assigned' as const }
              : order
          )
        );
        message.success('已接受派单！');
      }
    });
  };

  const filteredOrders = orders.filter(order => {
    const matchesSearch = order.title.toLowerCase().includes(searchText.toLowerCase()) ||
      order.description.toLowerCase().includes(searchText.toLowerCase());
    const matchesSkills = selectedSkills.length === 0 ||
      selectedSkills.some(skill => order.skills.includes(skill));
    const matchesType = selectedOrderType === 'all' || order.orderType === selectedOrderType;

    return matchesSearch && matchesSkills && matchesType;
  });

  const renderOrderCard = (order: ServiceOrder) => (
    <div style={{
      background: 'white',
      borderRadius: '8px',
      padding: '16px',
      marginBottom: '12px',
      boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
      border: order.urgent ? '2px solid #ff4d4f' : '1px solid #f0f0f0'
    }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '12px' }}>
        <div style={{ flex: 1 }}>
          <div style={{ display: 'flex', alignItems: 'center', marginBottom: '8px' }}>
            <Title level={4} style={{ margin: 0, marginRight: '8px' }}>
              {order.title}
            </Title>
            {order.urgent && (
              <Badge color="red" text="紧急" />
            )}
            <Tag color={order.orderType === 'grab' ? 'blue' : 'green'} style={{ marginLeft: '8px' }}>
              {order.orderType === 'grab' ? '抢单' : '派单'}
            </Tag>
          </div>

          <Text type="secondary" style={{ display: 'block', marginBottom: '8px' }}>
            {order.description}
          </Text>

          <Space size="small" style={{ marginBottom: '8px' }}>
            <EnvironmentOutlined />
            <Text>{order.location}</Text>
            <Text type="secondary">({order.distance}km)</Text>
          </Space>

          <div style={{ display: 'flex', alignItems: 'center', marginBottom: '8px' }}>
            <DollarOutlined style={{ color: '#faad14', marginRight: '4px' }} />
            <Text strong style={{ color: '#faad14' }}>¥{order.price}/天</Text>
            <Text type="secondary" style={{ marginLeft: '8px' }}>
              {order.duration}
            </Text>
          </div>

          <div style={{ marginBottom: '8px' }}>
            <Text type="secondary">所需技能：</Text>
            <Space size="small">
              {order.skills.map(skill => (
                <Tag key={skill} color="blue" size="small">{skill}</Tag>
              ))}
            </Space>
          </div>
        </div>

        <div style={{ textAlign: 'right', marginLeft: '16px' }}>
          <Avatar
            src={order.elderlyInfo.avatar}
            size={48}
            style={{ marginBottom: '8px' }}
          />
          <div>
            <Text strong>{order.elderlyInfo.name}</Text>
            <br />
            <Text type="secondary">{order.elderlyInfo.age}岁 {order.elderlyInfo.gender}</Text>
          </div>
        </div>
      </div>

      <Divider style={{ margin: '12px 0' }} />

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <Text type="secondary">家属：{order.familyInfo.name}</Text>
          <br />
          <Space>
            <Rate disabled defaultValue={order.familyInfo.rating} size="small" />
            <Text type="secondary">{order.familyInfo.rating}</Text>
          </Space>
        </div>

        <Space>
          <Button
            type="primary"
            size="small"
            onClick={() => order.orderType === 'grab' ? handleGrabOrder(order.id) : handleAcceptAssignment(order.id)}
            disabled={order.status !== 'pending'}
          >
            {order.orderType === 'grab' ? '抢单' : '接受派单'}
          </Button>
          <Button size="small">
            查看详情
          </Button>
        </Space>
      </div>
    </div>
  );

  return (
    <div style={{ padding: '16px' }}>
      <Title level={2}>服务订单</Title>

      {/* 搜索和筛选 */}
      <div style={{
        background: 'white',
        padding: '16px',
        borderRadius: '8px',
        marginBottom: '16px',
        boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
      }}>
        <Space direction="vertical" style={{ width: '100%' }}>
          <Search
            placeholder="搜索订单标题或描述"
            value={searchText}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSearchText(e.target.value)}
            style={{ width: '100%' }}
          />

          <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
            <Select
              mode="multiple"
              placeholder="选择技能筛选"
              value={selectedSkills}
              onChange={setSelectedSkills}
              style={{ minWidth: '200px' }}
              allowClear
              options={skillOptions.map(skill => ({ label: skill, value: skill }))}
            />

            <Select
              placeholder="订单类型"
              value={selectedOrderType}
              onChange={setSelectedOrderType}
              style={{ width: '120px' }}
              options={[
                { label: '全部', value: 'all' },
                { label: '抢单', value: 'grab' },
                { label: '派单', value: 'assign' }
              ]}
            />
          </div>
        </Space>
      </div>

      {/* 订单列表 */}
      <div style={{
        background: 'white',
        borderRadius: '8px',
        boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
      }}>
        <Tabs defaultActiveKey="nearby">
          <TabPane tab="附近订单" key="nearby">
            {filteredOrders.length > 0 ? (
              <div style={{ padding: '16px' }}>
                {filteredOrders.map(order => renderOrderCard(order))}
              </div>
            ) : (
              <Empty
                description="暂无符合条件的订单"
                style={{ padding: '40px 16px' }}
              />
            )}
          </TabPane>

          <TabPane tab="我的订单" key="my-orders">
            <Empty
              description="暂无我的订单"
              style={{ padding: '40px 16px' }}
            />
          </TabPane>
        </Tabs>
      </div>
    </div>
  );
};

export default Orders; 