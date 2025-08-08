import React, { useState } from 'react';
import { Card, Avatar, Tag, Button } from 'antd-mobile';
import { HeartOutline, UserOutline, DownOutline } from 'antd-mobile-icons';
import styles from './Health.module.css';

interface HealthData {
  elderlyId: string;
  elderlyName: string;
  elderlyAvatar?: string;
  heartRate: number;
  bloodPressure: string;
  temperature: number;
  oxygenLevel: number;
  bloodSugar: number;
  lastUpdate: string;
  status: 'normal' | 'warning' | 'danger';
}

const Health: React.FC = () => {
  const [selectedElderly, setSelectedElderly] = useState('1');

  const elderlyList = [
    { label: '张爷爷', value: '1' },
    { label: '李奶奶', value: '2' },
  ];

  const healthData: HealthData[] = [
    {
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
  const currentElderly = elderlyList.find(elderly => elderly.value === selectedElderly);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'normal':
        return 'success';
      case 'warning':
        return 'warning';
      case 'danger':
        return 'danger';
      default:
        return 'default';
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

  const getOxygenStatus = (level: number) => {
    if (level < 95) return 'warning';
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
    return 'success';
  };

  const getTemperatureStatus = (temp: number) => {
    if (temp > 37.5) return 'warning';
    if (temp > 37.2) return 'danger';
    return 'success';
  };

  return (
    <div className={styles.health}>
      {/* 老人选择器 */}
      <Card className={styles.elderlySelector}>
        <div className={styles.elderlyInfo}>
          <Avatar
            className={styles.elderlyAvatar}
            src={currentHealthData?.elderlyAvatar || ''}
          />
          <div className={styles.elderlyDetails}>
            <div className={styles.elderlyName}>{currentHealthData?.elderlyName}</div>
            <div className={styles.elderlyStatus}>健康状态良好</div>
          </div>
          <DownOutline className={styles.selectorArrow} />
        </div>
      </Card>

      {/* 今日健康数据 */}
      <Card className={styles.healthDataCard}>
        <div className={styles.healthDataHeader}>
          <h3>今日健康数据</h3>
          <div className={styles.healthDate}>{currentHealthData?.lastUpdate}</div>
        </div>

        <div className={styles.healthMetricsGrid}>
          <div className={styles.metricCard}>
            <div className={styles.metricIcon}>
              <HeartOutline />
            </div>
            <div className={styles.metricContent}>
              <div className={styles.metricLabel}>血压</div>
              <div className={styles.metricValue}>{currentHealthData?.bloodPressure}</div>
              <div className={styles.metricUnit}>mmHg</div>
            </div>
            <Tag className={styles.metricStatus} color={getBloodPressureStatus(currentHealthData?.bloodPressure || '')}>
              {getBloodPressureStatus(currentHealthData?.bloodPressure || '') === 'success' ? '正常' : '偏高'}
            </Tag>
          </div>

          <div className={styles.metricCard}>
            <div className={styles.metricIcon}>
              <HeartOutline />
            </div>
            <div className={styles.metricContent}>
              <div className={styles.metricLabel}>血糖</div>
              <div className={styles.metricValue}>{currentHealthData?.bloodSugar}</div>
              <div className={styles.metricUnit}>mmol/L</div>
            </div>
            <Tag className={styles.metricStatus} color={getBloodSugarStatus(currentHealthData?.bloodSugar || '')}>
              {getBloodSugarStatus(currentHealthData?.bloodSugar || '') === 'success' ? '正常' : '偏高'}
            </Tag>
          </div>

          <div className={styles.metricCard}>
            <div className={styles.metricIcon}>
              <HeartOutline />
            </div>
            <div className={styles.metricContent}>
              <div className={styles.metricLabel}>心率</div>
              <div className={styles.metricValue}>{currentHealthData?.heartRate}</div>
              <div className={styles.metricUnit}>bpm</div>
            </div>
            <Tag className={styles.metricStatus} color={getHeartRateStatus(currentHealthData?.heartRate || 0)}>
              {getHeartRateStatus(currentHealthData?.heartRate || 0) === 'success' ? '正常' : '异常'}
            </Tag>
          </div>

          <div className={styles.metricCard}>
            <div className={styles.metricIcon}>
              <HeartOutline />
            </div>
            <div className={styles.metricContent}>
              <div className={styles.metricLabel}>体温</div>
              <div className={styles.metricValue}>{currentHealthData?.temperature}</div>
              <div className={styles.metricUnit}>°C</div>
            </div>
            <Tag className={styles.metricStatus} color={getTemperatureStatus(currentHealthData?.temperature || 0)}>
              {getTemperatureStatus(currentHealthData?.temperature || 0) === 'success' ? '正常' : '偏高'}
            </Tag>
          </div>
        </div>
      </Card>

      {/* AI健康分析 */}
      <Card className="ai-analysis">
        <div className="analysis-header">
          <div className="ai-icon">🤖</div>
          <h3>AI健康分析</h3>
        </div>
        <div className="analysis-content">
          <p className="analysis-text">
            根据今日数据，{currentElderly?.label}的健康状况良好：
          </p>
          <ul className="analysis-list">
            <li>血压在正常范围内</li>
            <li>血糖控制良好</li>
            <li>心率稳定</li>
            <li>体温正常</li>
          </ul>
        </div>
      </Card>

      {/* 血压趋势 */}
      <Card className="blood-pressure-trend">
        <div className="trend-header">
          <h3>血压趋势</h3>
          <span className="trend-period">最近7天</span>
        </div>
        <div className="trend-chart">
          <div className="chart-placeholder">
            <div className="chart-icon">📊</div>
            <div className="chart-text">血压趋势图</div>
            <div className="chart-desc">显示收缩压和舒张压变化</div>
          </div>
        </div>
      </Card>

      {/* 健康建议 */}
      <Card className="health-advice">
        <h3>健康建议</h3>
        <div className="advice-list">
          <div className="advice-item">
            <div className="advice-icon">💡</div>
            <div className="advice-content">
              <div className="advice-title">定期运动</div>
              <div className="advice-desc">建议每天进行30分钟轻度运动</div>
            </div>
          </div>
          <div className="advice-item">
            <div className="advice-icon">🥗</div>
            <div className="advice-content">
              <div className="advice-title">均衡饮食</div>
              <div className="advice-desc">注意营养搭配，少盐少油</div>
            </div>
          </div>
          <div className="advice-item">
            <div className="advice-icon">😴</div>
            <div className="advice-content">
              <div className="advice-title">充足睡眠</div>
              <div className="advice-desc">保证7-8小时优质睡眠</div>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default Health;
