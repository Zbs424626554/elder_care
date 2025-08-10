import React from 'react';
import { Card, Grid, Button } from 'antd-mobile';
import {
  UserOutline,
  HeartOutline,
  UserAddOutline,
  UnorderedListOutline,
  AddOutline,
  ExclamationCircleOutline,
  PhonebookOutline,
} from 'antd-mobile-icons';
import styles from './Home.module.css';


const Home: React.FC = () => {
  const handleFunctionClick = (type: string) => {
    console.log('点击功能:', type);
  };

  const handleQuickAction = (action: string) => {
    console.log('快捷操作:', action);
  };

  const quickActions = [
    { icon: '📞', title: '紧急呼叫', color: '#ff4d4f' },
    { icon: '❤️', title: '健康监测', color: '#52c41a' },
    { icon: '👩‍⚕️', title: '护工服务', color: '#1890ff' },
    { icon: '📋', title: '订单管理', color: '#722ed1' },
    { icon: '⚠️', title: '健康预警', color: '#fa8c16' },
  ];

  return (
    <div className={styles.home}>
      {/* 欢迎卡片 */}
      <Card className={styles.welcomeCard}>
        <div className={styles.welcomeContent}>
          <div className={styles.welcomeText}>
            <h2>早上好, 张女士</h2>
            <p>今天有2位老人的健康数据需要关注</p>
          </div>
          <div className={styles.welcomeAvatar}>
            <div className={styles.avatarCircle}>张</div>
          </div>
        </div>
      </Card>

      {/* 功能网格 */}
      <div className={styles.functionGrid}>
        <Grid columns={2} gap={16}>
          <Grid.Item>
            <Card
              className={styles.functionCard}
              onClick={() => handleFunctionClick('elderly')}
            >
              <div className={styles.functionIcon} style={{ background: '#667eea' }}>
                <UserOutline />
              </div>
              <div className={styles.functionTitle}>老人管理</div>
              <div className={styles.functionSubtitle}>管理老人信息</div>
            </Card>
          </Grid.Item>
          <Grid.Item>
            <Card
              className={styles.functionCard}
              onClick={() => handleFunctionClick('health')}
            >
              <div className={styles.functionIcon} style={{ background: '#ff6b6b' }}>
                <HeartOutline />
              </div>
              <div className={styles.functionTitle}>健康数据</div>
              <div className={styles.functionSubtitle}>查看健康状态</div>
            </Card>
          </Grid.Item>
          <Grid.Item>
            <Card
              className={styles.functionCard}
              onClick={() => handleFunctionClick('nurses')}
            >
              <div className={styles.functionIcon} style={{ background: '#4ecdc4' }}>
                <UserAddOutline />
              </div>
              <div className={styles.functionTitle}>护工服务</div>
              <div className={styles.functionSubtitle}>预约护工服务</div>
            </Card>
          </Grid.Item>
          <Grid.Item>
            <Card
              className={styles.functionCard}
              onClick={() => handleFunctionClick('orders')}
            >
              <div className={styles.functionIcon} style={{ background: '#45b7d1' }}>
                <UnorderedListOutline />
              </div>
              <div className={styles.functionTitle}>订单管理</div>
              <div className={styles.functionSubtitle}>查看服务订单</div>
            </Card>
          </Grid.Item>
        </Grid>
      </div>

      {/* 快捷操作 */}
      <Card className={styles.quickActions}>
        <div className={styles.quickActionsHeader}>
          <h3>快捷操作</h3>
        </div>
        <div className={styles.quickActionsList}>
          <div
            className={styles.actionItem}
            onClick={() => handleQuickAction('add-elderly')}
          >
            <div className={styles.actionIcon} style={{ background: '#667eea' }}>
              <AddOutline />
            </div>
            <div className={styles.actionContent}>
              <div className={styles.actionTitle}>添加老人</div>
              <div className={styles.actionSubtitle}>绑定新的老人信息</div>
            </div>
            <div className={styles.actionArrow}>›</div>
          </div>
          <div
            className={styles.actionItem}
            onClick={() => handleQuickAction('health-warning')}
          >
            <div className={styles.actionIcon} style={{ background: '#ff6b6b' }}>
              <ExclamationCircleOutline />
            </div>
            <div className={styles.actionContent}>
              <div className={styles.actionTitle}>健康预警</div>
              <div className={styles.actionSubtitle}>查看异常提醒</div>
            </div>
            <div className={styles.actionArrow}>›</div>
          </div>
          <div
            className={styles.actionItem}
            onClick={() => handleQuickAction('emergency-contact')}
          >
            <div className={styles.actionIcon} style={{ background: '#4ecdc4' }}>
              <PhonebookOutline />
            </div>
            <div className={styles.actionContent}>
              <div className={styles.actionTitle}>紧急联系</div>
              <div className={styles.actionSubtitle}>一键联系护工</div>
            </div>
            <div className={styles.actionArrow}>›</div>
          </div>
        </div>
      </Card>

      {/* 健康提醒 */}
      <Card className={styles.healthReminder}>
        <div className={styles.reminderHeader}>
          <h3>今日健康提醒</h3>
          <div className={styles.reminderCount}>2</div>
        </div>
        <div className={styles.reminderList}>
          <div className={styles.reminderItem}>
            <div className={styles.reminderIcon} style={{ color: '#ff6b6b' }}>
              <HeartOutline />
            </div>
            <div className={styles.reminderContent}>
              <div className={styles.reminderTitle}>张爷爷血压偏高</div>
              <div className={styles.reminderDesc}>建议及时关注血压变化</div>
            </div>
            <div className={styles.reminderTime}>10分钟前</div>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default Home;
