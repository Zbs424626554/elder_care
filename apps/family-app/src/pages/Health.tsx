import React, { useState, useEffect, useRef } from 'react';
import styles from './Health.module.css';
import { generateHealthAdvice } from '../services/ai.service';
import { HealthService } from '../services/health.service';
import { ElderlyService } from '../services/elderly.service';
import type { HealthData } from '../services/health.service';
import type { ElderlyUser } from '../services/elderly.service';

interface Elderly {
  id: string;
  name: string;
  status: string;
}

interface HealthAdvice {
  title: string;
  description: string;
  icon: string;
}

const Health: React.FC = () => {
  const [selectedElderly, setSelectedElderly] = useState('1');
  const [showDropdown, setShowDropdown] = useState(false);
  const [aiAdvice, setAiAdvice] = useState<HealthAdvice[]>([]);
  const [isLoadingAdvice, setIsLoadingAdvice] = useState(false);
  const [showAiAdvice, setShowAiAdvice] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const elderlyList: Elderly[] = [
    { id: '1', name: '张爷爷', status: '健康状态良好' },
    { id: '2', name: '李奶奶', status: '需要关注' },
  ];

  const healthData: HealthData[] = [
    {
      id: '1',
      elderlyId: '1',
      elderlyName: '张爷爷',
      heartRate: 75,
      bloodPressure: '120/80',
      temperature: 36.5,
      oxygenLevel: 98,
      bloodSugar: 5.2,
      lastUpdate: '2024-01-15 10:30',
      status: 'normal',
    },
    {
      id: '2',
      elderlyId: '2',
      elderlyName: '李奶奶',
      heartRate: 95,
      bloodPressure: '140/90',
      temperature: 37.2,
      oxygenLevel: 92,
      bloodSugar: 6.8,
      lastUpdate: '2024-01-15 10:15',
      status: 'warning',
    },
  ];

  const currentHealthData = healthData.find(data => data.elderlyId === selectedElderly);
  const currentElderly = elderlyList.find(elderly => elderly.id === selectedElderly);

  // 点击外部区域关闭下拉菜单
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setShowDropdown(false);
      }
    };

    if (showDropdown) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showDropdown]);

  const handleElderlySelect = (elderlyId: string) => {
    setSelectedElderly(elderlyId);
    setShowDropdown(false);
    // 切换老人时重置AI建议
    setAiAdvice([]);
    setShowAiAdvice(false);
  };

  const toggleDropdown = () => {
    setShowDropdown(!showDropdown);
  };

  // 获取AI健康建议
  const handleGetAiAdvice = async () => {
    if (!currentHealthData || !currentElderly) return;

    setIsLoadingAdvice(true);
    try {
      const advice = await generateHealthAdvice(currentHealthData, currentElderly.name);
      setAiAdvice(advice);
      setShowAiAdvice(true);
    } catch (error) {
      console.error('获取AI建议失败:', error);
      // 使用默认建议
      setAiAdvice([
        {
          title: "定期运动",
          description: "建议每天进行30分钟轻度运动，如散步、太极拳等，有助于改善血液循环和心肺功能。",
          icon: "💡"
        },
        {
          title: "均衡饮食",
          description: "注意营养搭配，少盐少油，多摄入蔬菜水果，控制血糖和血压。",
          icon: "🥗"
        },
        {
          title: "充足睡眠",
          description: "保证7-8小时优质睡眠，有助于身体恢复和免疫系统功能。",
          icon: "😴"
        }
      ]);
      setShowAiAdvice(true);
    } finally {
      setIsLoadingAdvice(false);
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'normal':
        return '正常';
      case 'warning':
        return '注意';
      case 'danger':
        return '异常';
      default:
        return '未知';
    }
  };

  const getHeartRateStatus = (rate: number) => {
    if (rate < 60) return 'danger';
    if (rate > 100) return 'warning';
    return 'normal';
  };

  const getBloodSugarStatus = (sugar: number) => {
    if (sugar < 3.9 || sugar > 6.1) return 'warning';
    return 'normal';
  };

  const getBloodPressureStatus = (pressure: string) => {
    const [systolic, diastolic] = pressure.split('/');
    const systolicNum = parseInt(systolic, 10);
    const diastolicNum = parseInt(diastolic, 10);

    if (systolicNum > 140 || diastolicNum > 90) return 'danger';
    if (systolicNum > 120 || diastolicNum > 80) return 'warning';
    return 'normal';
  };

  const getTemperatureStatus = (temp: number) => {
    if (temp > 37.5) return 'danger';
    if (temp > 37.2) return 'warning';
    return 'normal';
  };

  return (
    <div className={styles.health}>
      {/* 老人选择器 */}
      <div
        ref={dropdownRef}
        className={`${styles.elderlySelector} ${showDropdown ? styles.active : ''}`}
        onClick={toggleDropdown}
      >
        <div className={styles.elderlyInfo}>
          <div className={styles.elderlyAvatar}>{currentElderly?.name?.slice(0, 1) || '长'}</div>
          <div className={styles.elderlyDetails}>
            <div className={styles.elderlyName}>{currentElderly?.name}</div>
            <div className={styles.elderlyStatus}>{currentElderly?.status}</div>
          </div>
          <i className={`fas fa-chevron-down ${styles.selectorArrow}`}></i>
        </div>

        {/* 下拉选项 */}
        {showDropdown && (
          <div className={styles.elderlyDropdown}>
            {elderlyList.map((elderly) => (
              <div
                key={elderly.id}
                className={`${styles.elderlyOption} ${elderly.id === selectedElderly ? styles.selected : ''}`}
                onClick={(e) => {
                  e.stopPropagation();
                  handleElderlySelect(elderly.id);
                }}
              >
                <div className={styles.elderlyOptionAvatar}>{elderly.name.slice(0, 1)}</div>
                <div className={styles.elderlyOptionInfo}>
                  <div className={styles.elderlyOptionName}>{elderly.name}</div>
                  <div className={styles.elderlyOptionStatus}>{elderly.status}</div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* 今日健康数据 */}
      <div className={styles.healthDataCard}>
        <div className={styles.healthDataHeader}>
          <h3>今日健康数据</h3>
          <div className={styles.healthDate}>{currentHealthData?.lastUpdate}</div>
        </div>

        <div className={styles.healthMetricsGrid}>
          {/* 血压 */}
          <div className={styles.metricCard}>
            <div className={styles.metricIcon}>
              <i className="fas fa-heartbeat"></i>
            </div>
            <div className={styles.metricContent}>
              <div className={styles.metricLabel}>血压</div>
              <div className={styles.metricValue}>{currentHealthData?.bloodPressure}</div>
              <div className={styles.metricUnit}>mmHg</div>
            </div>
            {(() => {
              const status = getBloodPressureStatus(currentHealthData?.bloodPressure || '0/0');
              return (
                <span className={`${styles.metricStatus} ${status === 'normal' ? styles.statusNormal : status === 'warning' ? styles.statusWarning : styles.statusDanger}`}>
                  {getStatusText(status)}
                </span>
              );
            })()}
          </div>

          {/* 血糖 */}
          <div className={styles.metricCard}>
            <div className={styles.metricIcon}>
              <i className="fas fa-cubes"></i>
            </div>
            <div className={styles.metricContent}>
              <div className={styles.metricLabel}>血糖</div>
              <div className={styles.metricValue}>{currentHealthData?.bloodSugar}</div>
              <div className={styles.metricUnit}>mmol/L</div>
            </div>
            {(() => {
              const status = getBloodSugarStatus(currentHealthData?.bloodSugar || 0);
              return (
                <span className={`${styles.metricStatus} ${status === 'normal' ? styles.statusNormal : styles.statusWarning}`}>
                  {getStatusText(status)}
                </span>
              );
            })()}
          </div>

          {/* 心率 */}
          <div className={styles.metricCard}>
            <div className={styles.metricIcon}>
              <i className="fas fa-heart"></i>
            </div>
            <div className={styles.metricContent}>
              <div className={styles.metricLabel}>心率</div>
              <div className={styles.metricValue}>{currentHealthData?.heartRate}</div>
              <div className={styles.metricUnit}>bpm</div>
            </div>
            {(() => {
              const status = getHeartRateStatus(currentHealthData?.heartRate || 0);
              return (
                <span className={`${styles.metricStatus} ${status === 'normal' ? styles.statusNormal : status === 'warning' ? styles.statusWarning : styles.statusDanger}`}>
                  {getStatusText(status)}
                </span>
              );
            })()}
          </div>

          {/* 体温 */}
          <div className={styles.metricCard}>
            <div className={styles.metricIcon}>
              <i className="fas fa-temperature-high"></i>
            </div>
            <div className={styles.metricContent}>
              <div className={styles.metricLabel}>体温</div>
              <div className={styles.metricValue}>{currentHealthData?.temperature}</div>
              <div className={styles.metricUnit}>°C</div>
            </div>
            {(() => {
              const status = getTemperatureStatus(currentHealthData?.temperature || 0);
              return (
                <span className={`${styles.metricStatus} ${status === 'normal' ? styles.statusNormal : status === 'warning' ? styles.statusWarning : styles.statusDanger}`}>
                  {getStatusText(status)}
                </span>
              );
            })()}
          </div>
        </div>
      </div>

      {/* AI健康建议 */}
      <div className={styles.healthAdvice}>
        <div className={styles.adviceHeader}>
          <h3>AI健康建议</h3>
          <div className={styles.adviceActions}>
            {showAiAdvice && (
              <button
                className={styles.refreshButton}
                onClick={handleGetAiAdvice}
                disabled={isLoadingAdvice}
                title="重新生成建议"
              >
                <i className="fas fa-sync-alt"></i>
              </button>
            )}
            {!showAiAdvice && (
              <button
                className={styles.aiAdviceButton}
                onClick={handleGetAiAdvice}
                disabled={isLoadingAdvice}
              >
                {isLoadingAdvice ? (
                  <>
                    <i className="fas fa-spinner fa-spin"></i>
                    生成中...
                  </>
                ) : (
                  <>
                    <i className="fas fa-robot"></i>
                    查看AI建议
                  </>
                )}
              </button>
            )}
          </div>
        </div>

        {showAiAdvice && aiAdvice.length > 0 ? (
          <div className={styles.adviceList}>
            {aiAdvice.map((advice, index) => (
              <div key={index} className={styles.adviceItem}>
                <div className={styles.adviceIcon}>{advice.icon}</div>
                <div className={styles.adviceContent}>
                  <div className={styles.adviceTitle}>{advice.title}</div>
                  <div className={styles.adviceDesc}>{advice.description}</div>
                </div>
              </div>
            ))}
          </div>
        ) : !showAiAdvice ? (
          <div className={styles.advicePlaceholder}>
            <div className={styles.placeholderIcon}>🤖</div>
            <div className={styles.placeholderText}>点击"查看AI建议"获取个性化健康建议</div>
          </div>
        ) : null}
      </div>
    </div>
  );
};

export default Health;
