import React, { useEffect, useState } from 'react';
import { Card, Button, Avatar, Tag, Modal } from 'antd-mobile';
import { ExclamationCircleOutline, PhonebookOutline, UserOutline } from 'antd-mobile-icons';
import styles from './Warnings.module.css';
import { socket, registerUser } from '../socket';
import { AuthService } from '../services/auth.service';
import request from '../utils/request';

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
  transcript?: string;
}

const Warnings: React.FC = () => {
  const [warnings, setWarnings] = useState<Warning[]>([]);
  const [selected, setSelected] = useState<Warning | null>(null);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    const user = AuthService.getCurrentUser();
    const uid = (user as any)?.id || (user as any)?._id;
    if (uid) {
      registerUser(uid);
    }
    // 初始化拉取历史
    request.get('/emergency/family').then((resp: any) => {
      const arr = Array.isArray(resp.data) ? resp.data : [];
      const mapped = arr.map((p: any) => ({
        id: String(p._id || p.alertId || Date.now()),
        title: p.status === 'calling' ? '外呼中' : '紧急求助',
        description: p.aiAnalysis ? safeSummary(p.aiAnalysis) : '老人发起紧急呼叫',
        type: 'emergency' as const,
        time: new Date(p.createdAt || Date.now()).toLocaleString(),
        elderlyName: p.elderlyName || String(p.userId || '老人'),
        status: p.status === 'falseAlarm' ? 'handled' : 'unread',
        priority: 'high' as const,
        location: p.location ? JSON.stringify(p.location) : undefined,
        contactInfo: p.contactPhone || '',
        transcript: p.transcript,
        raw: p
      }));
      setWarnings(mapped);
    }).catch(() => void 0);
    const handler = (payload: any) => {
      // 仅处理紧急事件
      const now = new Date();
      const newItem: Warning = {
        id: payload.alertId,
        title: payload.status === 'calling' ? '外呼中' : '紧急求助',
        description: payload.aiAnalysis
          ? (() => {
            try { return safeSummary(payload.aiAnalysis); } catch { return '老人发起紧急呼叫'; }
          })()
          : '老人发起紧急呼叫',
        type: 'emergency',
        time: now.toLocaleString(),
        elderlyName: payload.elderlyName || '老人',
        status: payload.status === 'falseAlarm' ? 'handled' : 'unread',
        priority: 'high',
        location: payload.location ? JSON.stringify(payload.location) : undefined,
        contactInfo: payload.contactPhone,
        transcript: payload.transcript,
      };
      setWarnings(prev => {
        const others = prev.filter(w => w.id !== newItem.id);
        // 若同一告警已存在，则合并更新（状态、描述、定位、联系人等）
        const existing = prev.find(w => w.id === newItem.id);
        if (existing) {
          const merged: Warning = { ...existing, ...newItem };
          return [merged, ...others];
        }
        return [newItem, ...prev];
      });
    };
    socket.off('emergency:updated');
    socket.on('emergency:updated', handler);
    return () => { socket.off('emergency:updated', handler); };
  }, []);

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
    // 标记为已处理
    setWarnings(warnings.map(w =>
      w.id === warning.id ? { ...w, status: 'handled' } : w
    ));
  };

  const handleContact = (warning: Warning) => {
    if (warning.contactInfo) {
      window.location.href = `tel:${warning.contactInfo}`;
    }
  };

  function safeSummary(aiAnalysis: string): string {
    try {
      const obj = typeof aiAnalysis === 'string' ? JSON.parse(aiAnalysis) : aiAnalysis;
      return obj?.summary || '老人发起紧急呼叫';
    } catch {
      return '老人发起紧急呼叫';
    }
  }

  async function fetchAndPlay(id: string) {
    try {
      const resp: any = await request.get(`/emergency/${id}`);
      const base64 = resp?.data?.audioClip as string | undefined;
      if (!base64) return;
      const audio = new Audio(base64);
      audio.play();
    } catch { }
  }

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
              <Button size="small" fill="outline" onClick={() => { setSelected(warning); setShowModal(true); }} className={styles.actionBtn}>查看详情</Button>
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
      <Modal visible={showModal} onClose={() => setShowModal(false)} content={
        <div>
          <div style={{ fontWeight: 700, marginBottom: 8 }}>详情</div>
          <div style={{ fontSize: 12, color: '#666', marginBottom: 6 }}>定位: {selected?.location || '无'}</div>
          <div style={{ fontSize: 12, color: '#666', marginBottom: 6, maxHeight: 120, overflow: 'auto' }}>摘要: {selected?.description}</div>
          {selected?.transcript && (
            <div style={{ fontSize: 12, color: '#666', marginBottom: 6, maxHeight: 120, overflow: 'auto' }}>
              语音内容: {selected.transcript}
            </div>
          )}
          <div style={{ display: 'flex', gap: 8 }}>
            <Button size="small" onClick={() => setShowModal(false)}>关闭</Button>
            <Button size="small" color="primary" onClick={() => selected && fetchAndPlay(selected.id)}>播放录音</Button>
          </div>
        </div>
      } />
    </div>
  );
};

export default Warnings;
