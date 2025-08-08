import React, { useState } from 'react';
import { Card, Button, Avatar, Tag } from 'antd-mobile';
import { ExclamationCircleOutline, PhonebookOutline, UserOutline } from 'antd-mobile-icons';
import styles from './Warnings.module.css';

interface Warning {
  id: string;
  title: string;
  description: string;
  type: 'emergency' | 'warning' | 'reminder';
  time: string;
  elderlyName: string;
  elderlyAvatar?: string;
  status: 'unread' | 'read' | 'handled';
  priority: 'high' | 'medium' | 'low';
  location?: string;
  contactInfo?: string;
}

const Warnings: React.FC = () => {
  const [warnings, setWarnings] = useState<Warning[]>([
    {
      id: '1',
      title: '血压异常提醒',
      description: '张爷爷的血压测量值为140/90mmHg，超出正常范围，建议及时关注',
      type: 'warning',
      time: '10分钟前',
      elderlyName: '张爷爷',
      status: 'unread',
      priority: 'high',
      location: '卧室',
    },
    {
      id: '2',
      title: '紧急求助',
      description: '李奶奶按下了紧急求助按钮，请立即联系确认情况',
      type: 'emergency',
      time: '5分钟前',
      elderlyName: '李奶奶',
      status: 'unread',
      priority: 'high',
      location: '客厅',
      contactInfo: '138****8888',
    },
    {
      id: '3',
      title: '用药提醒',
      description: '王爷爷该服用降压药了，请及时提醒',
      type: 'reminder',
      time: '30分钟前',
      elderlyName: '王爷爷',
      status: 'read',
      priority: 'medium',
    },
    {
      id: '4',
      title: '跌倒风险提醒',
      description: '检测到李奶奶在卫生间停留时间过长，可能存在跌倒风险',
      type: 'warning',
      time: '1小时前',
      elderlyName: '李奶奶',
      status: 'read',
      priority: 'medium',
      location: '卫生间',
    },
  ]);

  const getWarningColor = (type: string) => {
    switch (type) {
      case 'emergency':
        return 'danger';
      case 'warning':
        return 'warning';
      case 'reminder':
        return 'primary';
      default:
        return 'default';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high':
        return '#ff6b6b';
      case 'medium':
        return '#ffa726';
      case 'low':
        return '#66bb6a';
      default:
        return '#999';
    }
  };

  const getPriorityText = (priority: string) => {
    switch (priority) {
      case 'high':
        return '高';
      case 'medium':
        return '中';
      case 'low':
        return '低';
      default:
        return '未知';
    }
  };

  const handleWarningAction = (warning: Warning) => {
    console.log('处理预警:', warning.title);
    // 标记为已处理
    setWarnings(warnings.map(w =>
      w.id === warning.id ? { ...w, status: 'handled' } : w
    ));
  };

  const handleContact = (warning: Warning) => {
    console.log('联系老人:', warning.elderlyName);
  };

  const unreadCount = warnings.filter(w => w.status === 'unread').length;

  return (
    <div className={styles.warnings}>
      {/* 预警统计 */}
      <Card className={styles.warningStats}>
        <div className={styles.statsHeader}>
          <div className={styles.statsTitle}>
            <UserOutline className={styles.statsIcon} />
            <span>预警统计</span>
          </div>
          {/* <Badge content={unreadCount} color="#ff6b6b" /> */}
        </div>
        <div className={styles.statsContent}>
          <div className={styles.statItem}>
            <div className={styles.statNumber}>{warnings.filter(w => w.type === 'emergency').length}</div>
            <div className={styles.statLabel}>紧急预警</div>
          </div>
          <div className={styles.statItem}>
            <div className={styles.statNumber}>{warnings.filter(w => w.type === 'warning').length}</div>
            <div className={styles.statLabel}>一般预警</div>
          </div>
          <div className={styles.statItem}>
            <div className={styles.statNumber}>{warnings.filter(w => w.type === 'reminder').length}</div>
            <div className={styles.statLabel}>提醒事项</div>
          </div>
        </div>
      </Card>

      {/* 预警列表 */}
      <div className={styles.warningsList}>
        {warnings.map((warning) => (
          <Card key={warning.id} className={`${styles.warningCard} ${warning.status}`}>
            <div className={styles.warningHeader}>
              <div className={styles.warningInfo}>
                <div className={styles.warningTitle}>{warning.title}</div>
                <div className={styles.warningTime}>{warning.time}</div>
              </div>
              <div className={styles.warningTags}>
                <Tag color={getWarningColor(warning.type)}>
                  {warning.type === 'emergency' ? '紧急' :
                    warning.type === 'warning' ? '一般' : '提醒'}
                </Tag>
                <Tag color={getPriorityColor(warning.priority)}>
                  {warning.priority === 'high' ? '高优先级' :
                    warning.priority === 'medium' ? '中优先级' : '低优先级'}
                </Tag>
              </div>
            </div>

            <div className={styles.warningContent}>
              <div className={styles.warningDescription}>
                {warning.description}
              </div>

              <div className={styles.elderlyInfo}>
                <Avatar
                  src={warning.elderlyAvatar || ''}
                  className={styles.elderlyAvatar}
                />
                <span className={styles.elderlyName}>{warning.elderlyName}</span>
                {warning.location && (
                  <span className={styles.warningLocation}>📍 {warning.location}</span>
                )}
              </div>
            </div>

            <div className={styles.warningActions}>
              {warning.type === 'emergency' && (
                <Button
                  size="small"
                  color="danger"
                  onClick={() => handleContact(warning)}
                  className={styles.actionBtn}
                >
                  <PhonebookOutline />
                  立即联系
                </Button>
              )}
              {warning.type === 'warning' && (
                <Button
                  size="small"
                  color="warning"
                  onClick={() => handleWarningAction(warning)}
                  className={styles.actionBtn}
                >
                  <ExclamationCircleOutline />
                  处理预警
                </Button>
              )}
              {warning.type === 'reminder' && (
                <Button
                  size="small"
                  color="primary"
                  onClick={() => handleWarningAction(warning)}
                  className={styles.actionBtn}
                >
                  {/* <MessageOutline /> */}
                  确认提醒
                </Button>
              )}
              <Button
                size="small"
                fill="outline"
                onClick={() => handleWarningAction(warning)}
                className={styles.actionBtn}
              >
                查看详情
              </Button>
            </div>
          </Card>
        ))}
      </div>

      {/* 空状态 */}
      {warnings.length === 0 && (
        <div className={styles.emptyState}>
          <div className={styles.emptyIcon}>🔔</div>
          <div className={styles.emptyText}>暂无预警信息</div>
          <div className={styles.emptyDesc}>您的老人目前都很安全</div>
        </div>
      )}
    </div>
  );
};

export default Warnings;
