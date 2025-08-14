import React, { useEffect, useState } from 'react';
import styles from './Warnings.module.css';
import { socket, registerUser } from '../socket';
import { AuthService } from '../services/auth.service';
import request from '../utils/request';
import PageHeader from '../components/PageHeader';

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
        return '#ff6b6b';
      case 'warning':
        return '#ffa726';
      case 'reminder':
        return '#42a5f5';
      default:
        return '#999';
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
      <PageHeader title="健康预警" />
      {/* 预警统计 */}
      <div className={styles['warning-stats']}>
        <div className={styles['stats-header']}>
          <div className={styles['stats-title']}>
            <i className="fas fa-user stats-icon"></i>
            <span>预警统计</span>
          </div>
        </div>
        <div className={styles['stats-content']}>
          <div className={styles['stat-item']}>
            <div className={styles['stat-number']}>{warnings.filter(w => w.type === 'emergency').length}</div>
            <div className={styles['stat-label']}>紧急预警</div>
          </div>
          <div className={styles['stat-item']}>
            <div className={styles['stat-number']}>{warnings.filter(w => w.type === 'warning').length}</div>
            <div className={styles['stat-label']}>一般预警</div>
          </div>
          <div className={styles['stat-item']}>
            <div className={styles['stat-number']}>{warnings.filter(w => w.type === 'reminder').length}</div>
            <div className={styles['stat-label']}>提醒事项</div>
          </div>
        </div>
      </div>

      {/* 预警列表 */}
      <div className={styles['warnings-list']}>
        {warnings.map((warning) => (
          <div key={warning.id} className={`${styles['warning-card']} ${styles[warning.status]}`}>
            <div className={styles['warning-header']}>
              <div className={styles['warning-info']}>
                <div className={styles['warning-title']}>{warning.title}</div>
                <div className={styles['warning-time']}>{warning.time}</div>
              </div>
              <div className={styles['warning-tags']}>
                <span className={styles['warning-tag']} style={{ backgroundColor: getWarningColor(warning.type) }}>
                  {warning.type === 'emergency' ? '紧急' :
                    warning.type === 'warning' ? '一般' : '提醒'}
                </span>
                <span className={styles['warning-tag']} style={{ backgroundColor: getPriorityColor(warning.priority) }}>
                  {warning.priority === 'high' ? '高优先级' :
                    warning.priority === 'medium' ? '中优先级' : '低优先级'}
                </span>
              </div>
            </div>

            <div className={styles['warning-content']}>
              <div className={styles['warning-description']}>
                {warning.description}
              </div>

              <div className={styles['elderly-info']}>
                <div className={styles['elderly-avatar']}>
                  {warning.elderlyAvatar ? (
                    <img src={warning.elderlyAvatar} alt="头像" />
                  ) : (
                    <i className="fas fa-user"></i>
                  )}
                </div>
                <span className={styles['elderly-name']}>{warning.elderlyName}</span>
                {warning.location && (
                  <span className={styles['warning-location']}>📍 {warning.location}</span>
                )}
              </div>
            </div>

            <div className={styles['warning-actions']}>
              {warning.type === 'emergency' && (
                <button
                  className={`${styles['action-btn']} ${styles['emergency-btn']}`}
                  onClick={() => handleContact(warning)}
                >
                  <i className="fas fa-phone"></i>
                  立即联系
                </button>
              )}
              {warning.type === 'warning' && (
                <button
                  className={`${styles['action-btn']} ${styles['warning-btn']}`}
                  onClick={() => handleWarningAction(warning)}
                >
                  <i className="fas fa-exclamation-triangle"></i>
                  处理预警
                </button>
              )}
              {warning.type === 'reminder' && (
                <button
                  className={`${styles['action-btn']} ${styles['reminder-btn']}`}
                  onClick={() => handleWarningAction(warning)}
                >
                  <i className="fas fa-check"></i>
                  确认提醒
                </button>
              )}
              <button
                className={`${styles['action-btn']} ${styles['detail-btn']}`}
                onClick={() => { setSelected(warning); setShowModal(true); }}
              >
                查看详情
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* 空状态 */}
      {warnings.length === 0 && (
        <div className={styles['empty-state']}>
          <div className={styles['empty-icon']}>🔔</div>
          <div className={styles['empty-text']}>暂无预警信息</div>
          <div className={styles['empty-desc']}>您的老人目前都很安全</div>
        </div>
      )}

      {/* 模态框 */}
      {showModal && (
        <div className={styles['modal-overlay']} onClick={() => setShowModal(false)}>
          <div className={styles['modal-content']} onClick={(e) => e.stopPropagation()}>
            <div className={styles['modal-header']}>
              <h3>详情</h3>
              <button className={styles['modal-close']} onClick={() => setShowModal(false)}>
                <i className="fas fa-times"></i>
              </button>
            </div>
            <div className={styles['modal-body']}>
              <div className={styles['modal-item']}>
                <span className={styles['modal-label']}>定位:</span>
                <span className={styles['modal-value']}>{selected?.location || '无'}</span>
              </div>
              <div className={styles['modal-item']}>
                <span className={styles['modal-label']}>摘要:</span>
                <span className={styles['modal-value']}>{selected?.description}</span>
              </div>
              {selected?.transcript && (
                <div className={styles['modal-item']}>
                  <span className={styles['modal-label']}>语音内容:</span>
                  <span className={styles['modal-value']}>{selected.transcript}</span>
                </div>
              )}
            </div>
            <div className={styles['modal-footer']}>
              <button className={`${styles['modal-btn']} ${styles['secondary']}`} onClick={() => setShowModal(false)}>
                关闭
              </button>
              <button
                className={`${styles['modal-btn']} ${styles['primary']}`}
                onClick={() => selected && fetchAndPlay(selected.id)}
              >
                播放录音
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Warnings;
