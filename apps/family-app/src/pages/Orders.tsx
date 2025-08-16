import React, { useState } from 'react';
import { Card, Button, Avatar, Tag, Tabs } from 'antd-mobile';
import { UserOutline, CheckOutline, StarOutline, CloseOutline } from 'antd-mobile-icons';
import styles from './Orders.module.css';
import PageHeader from '../components/PageHeader';

interface Order {
  id: string;
  orderNumber: string;
  nurseName: string;
  nurseAvatar?: string;
  serviceType: string;
  serviceDate: string;
  serviceTime: string;
  duration: string;
  price: number;
  status: 'pending' | 'confirmed' | 'in-progress' | 'completed' | 'cancelled';
  address: string;
  description: string;
  rating?: number;
  review?: string;
}

const Orders: React.FC = () => {
  const [activeTab, setActiveTab] = useState('all');

  const orders: Order[] = [
    {
      id: '1',
      orderNumber: 'ORD20240115001',
      nurseName: '王护士',
      serviceType: '居家护理',
      serviceDate: '2024-01-15',
      serviceTime: '09:00-12:00',
      duration: '3小时',
      price: 240,
      status: 'completed',
      address: '北京市朝阳区建国路88号',
      description: '为张爷爷提供日常护理服务，包括生活照料、康复训练等',
      rating: 5,
      review: '服务很好，护士很专业，老人很满意',
    },
    {
      id: '2',
      orderNumber: 'ORD20240115002',
      nurseName: '李护士',
      serviceType: '医疗护理',
      serviceDate: '2024-01-16',
      serviceTime: '14:00-17:00',
      duration: '3小时',
      price: 300,
      status: 'confirmed',
      address: '北京市海淀区中关村大街1号',
      description: '为李奶奶提供医疗护理服务，包括血压监测、用药指导等',
    },
    {
      id: '3',
      orderNumber: 'ORD20240115003',
      nurseName: '张阿姨',
      serviceType: '康复护理',
      serviceDate: '2024-01-17',
      serviceTime: '10:00-12:00',
      duration: '2小时',
      price: 200,
      status: 'pending',
      address: '北京市西城区西单大街100号',
      description: '为王爷爷提供康复训练服务，包括肢体康复、功能训练等',
    },
  ];

  const tabs = [
    { key: 'all', title: '全部' },
    { key: 'pending', title: '待确认' },
    { key: 'confirmed', title: '已确认' },
    { key: 'in-progress', title: '进行中' },
    { key: 'completed', title: '已完成' },
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending':
        return 'warning';
      case 'confirmed':
        return 'primary';
      case 'in-progress':
        return 'success';
      case 'completed':
        return 'success';
      case 'cancelled':
        return 'default';
      default:
        return 'default';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'pending':
        return '待确认';
      case 'confirmed':
        return '已确认';
      case 'in-progress':
        return '进行中';
      case 'completed':
        return '已完成';
      case 'cancelled':
        return '已取消';
      default:
        return '未知';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pending':
        return <CheckOutline />;
      case 'confirmed':
        return <CheckOutline />;
      case 'in-progress':
        return <CheckOutline />;
      case 'completed':
        return <CheckOutline />;
      case 'cancelled':
        return <CloseOutline />;
      default:
        return <CheckOutline />;
    }
  };

  const handleOrderAction = (order: Order, action: string) => {
    console.log(`${action}订单:`, order.orderNumber);
  };

  const filteredOrders = orders.filter(order => {
    if (activeTab === 'all') return true;
    return order.status === activeTab;
  });

  const renderStars = (rating: number) => {
    const stars = [];
    for (let i = 1; i <= 5; i++) {
      stars.push(
        <span key={i} className="star">
          {i <= rating ? <StarOutline style={{ color: '#ffd700' }} /> : <StarOutline />}
        </span>
      );
    }
    return stars;
  };

  return (
    <div className={styles.orders}>
      <PageHeader title="订单管理" />
      {/* 筛选标签 */}
      <div className={styles.filterTabs}>
        <Tabs
          activeKey={activeTab}
          onChange={setActiveTab}
        >
          <Tabs.Tab title="全部" key="all" />
          <Tabs.Tab title="进行中" key="in-progress" />
          <Tabs.Tab title="已完成" key="completed" />
          <Tabs.Tab title="已取消" key="cancelled" />
        </Tabs>
      </div>

      {/* 订单列表 */}
      <div className={styles.ordersList}>
        {filteredOrders.map((order) => (
          <Card key={order.id} className={styles.orderCard}>
            <div className={styles.orderHeader}>
              <div className={styles.orderNumber}>订单号: {order.orderNumber}</div>
              <Tag color={getStatusColor(order.status)}>
                {getStatusText(order.status)}
              </Tag>
            </div>

            <div className={styles.orderContent}>
              <div className={styles.nurseInfo}>
                <Avatar
                  className={styles.nurseAvatar}
                  src={order.nurseAvatar || ''}
                />
                <div className={styles.nurseDetails}>
                  <div className={styles.nurseName}>{order.nurseName}</div>
                  <div className={styles.serviceType}>{order.serviceType}</div>
                </div>
              </div>

              <div className={styles.orderDetails}>
                <div className={styles.detailItem}>
                  <div className={styles.detailLabel}>服务时间:</div>
                  <div className={styles.detailValue}>{order.serviceDate}</div>
                </div>
                <div className={styles.detailItem}>
                  <div className={styles.detailLabel}>服务时长:</div>
                  <div className={styles.detailValue}>{order.duration}</div>
                </div>
                <div className={styles.detailItem}>
                  <div className={styles.detailLabel}>服务地址:</div>
                  <div className={styles.detailValue}>{order.address}</div>
                </div>
                <div className={styles.detailItem}>
                  <div className={styles.detailLabel}>服务描述:</div>
                  <div className={styles.detailValue}>{order.description}</div>
                </div>
              </div>

              {order.rating && (
                <div className="order-rating">
                  <div className="rating-header">
                    <span className="rating-label">服务评价：</span>
                    <div className="rating-stars">
                      {renderStars(order.rating)}
                    </div>
                  </div>
                  {order.review && (
                    <div className="rating-review">
                      {order.review}
                    </div>
                  )}
                </div>
              )}
            </div>

            <div className="order-footer">
              <div className="order-price">
                <span className="price-label">总价：</span>
                <span className="price-value">¥{order.price}</span>
              </div>
              <div className="order-actions">
                {order.status === 'pending' && (
                  <>
                    <Button
                      size="small"
                      fill="outline"
                      onClick={() => handleOrderAction(order, 'cancel')}
                      className="action-btn"
                    >
                      取消订单
                    </Button>
                    <Button
                      size="small"
                      color="primary"
                      onClick={() => handleOrderAction(order, 'confirm')}
                      className="action-btn"
                    >
                      确认订单
                    </Button>
                  </>
                )}
                {order.status === 'confirmed' && (
                  <Button
                    size="small"
                    color="primary"
                    onClick={() => handleOrderAction(order, 'start')}
                    className="action-btn"
                  >
                    开始服务
                  </Button>
                )}
                {order.status === 'in-progress' && (
                  <Button
                    size="small"
                    color="primary"
                    onClick={() => handleOrderAction(order, 'complete')}
                    className="action-btn"
                  >
                    完成服务
                  </Button>
                )}
                {order.status === 'completed' && !order.rating && (
                  <Button
                    size="small"
                    color="primary"
                    onClick={() => handleOrderAction(order, 'review')}
                    className="action-btn"
                  >
                    评价服务
                  </Button>
                )}
                <Button
                  size="small"
                  fill="outline"
                  onClick={() => handleOrderAction(order, 'detail')}
                  className="action-btn"
                >
                  查看详情
                </Button>
              </div>
            </div>
          </Card>
        ))}
      </div>

      {/* 空状态 */}
      {filteredOrders.length === 0 && (
        <div className="empty-state">
          <div className="empty-icon">📋</div>
          <div className="empty-text">暂无订单</div>
          <div className="empty-desc">您还没有相关订单</div>
        </div>
      )}
    </div>
  );
};

export default Orders;