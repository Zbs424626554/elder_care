import React, { useState } from 'react';
import { Card, Button, Modal, Form, Input, Picker, Avatar, Tag, SearchBar } from 'antd-mobile';
import { AddOutline, UserOutline, PhonebookOutline } from 'antd-mobile-icons';
import styles from './Elderly.module.css';

interface Elderly {
  id: number;
  name: string;
  age: number;
  gender: string;
  relationship: string;
  phone: string;
  address: string;
  healthStatus: string;
  bloodPressure: string;
  bloodSugar: string;
  heartRate: string;
  boundYears: number;
  avatar: string;
}

const Elderly: React.FC = () => {
  const [searchValue, setSearchValue] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);
  const [genderValue, setGenderValue] = useState<string[]>([]);

  const genderOptions = ['男', '女'];

  // 模拟老人数据
  const [elderly] = useState<Elderly[]>([
    {
      id: 1,
      name: '张爷爷',
      age: 75,
      gender: '男',
      relationship: '父亲',
      phone: '138****1234',
      address: '北京市朝阳区',
      healthStatus: '良好',
      bloodPressure: '120/80',
      bloodSugar: '5.2',
      heartRate: '72',
      boundYears: 3,
      avatar: '',
    },
    {
      id: 2,
      name: '李奶奶',
      age: 68,
      gender: '女',
      relationship: '母亲',
      phone: '139****5678',
      address: '北京市海淀区',
      healthStatus: '需关注',
      bloodPressure: '140/90',
      bloodSugar: '6.8',
      heartRate: '85',
      boundYears: 2,
      avatar: '',
    },
    {
      id: 3,
      name: '王爷爷',
      age: 82,
      gender: '男',
      relationship: '爷爷',
      phone: '137****9012',
      address: '北京市西城区',
      healthStatus: '注意',
      bloodPressure: '160/95',
      bloodSugar: '7.5',
      heartRate: '92',
      boundYears: 1,
      avatar: '',
    },
  ]);

  const getHealthStatusColor = (status: string) => {
    switch (status) {
      case '正常':
        return 'success';
      case '异常':
        return 'danger';
      case '注意':
        return 'warning';
      default:
        return 'default';
    }
  };

  // 过滤老人列表
  const filteredElderly = elderly.filter(elderly =>
    elderly.name.toLowerCase().includes(searchValue.toLowerCase()) ||
    elderly.relationship.toLowerCase().includes(searchValue.toLowerCase())
  );

  const handleAddElderly = () => {
    console.log('添加老人');
    setShowAddModal(false);
  };

  const handleEditElderly = (elderly: Elderly) => {
    console.log('编辑老人', elderly);
  };

  const handleDeleteElderly = (id: number) => {
    console.log('删除老人', id);
  };

  return (
    <div className={styles.elderly}>
      {/* 搜索栏 */}
      <div className={styles.searchContainer}>
        <SearchBar
          className={styles.searchBar}
          placeholder="搜索老人姓名"
          value={searchValue}
          onChange={setSearchValue}
        />
      </div>

      {/* 老人列表 */}
      <div className={styles.elderlyList}>
        {filteredElderly.map((elderly) => (
          <Card key={elderly.id} className={styles.elderlyCard}>
            <div className={styles.elderlyHeader}>
              <div className={styles.elderlyInfo}>
                <Avatar
                  className={styles.elderlyAvatar}
                  src={elderly.avatar || ''}
                />
                <div className={styles.elderlyDetails}>
                  <div className={styles.elderlyName}>{elderly.name}</div>
                  <div className={styles.elderlyBasic}>
                    {elderly.age}岁 | {elderly.gender} | 绑定{elderly.boundYears}年
                  </div>
                </div>
              </div>
              <div className={styles.elderlyActions}>
                <Button
                  className={styles.actionBtn}
                  size="small"
                  fill="outline"
                >
                  <UserOutline />
                </Button>
                <Button
                  className={styles.actionBtn}
                  size="small"
                  fill="outline"
                >
                  <PhonebookOutline />
                </Button>
              </div>
            </div>

            <div className={styles.elderlyHealth}>
              <div className={styles.healthStatus}>
                <span className={styles.statusLabel}>健康状态:</span>
                <Tag
                  color={elderly.healthStatus === '良好' ? 'success' : elderly.healthStatus === '需关注' ? 'warning' : 'danger'}
                >
                  {elderly.healthStatus}
                </Tag>
              </div>
              <div className={styles.healthMetrics}>
                <div className={styles.metricItem}>
                  <div className={styles.metricLabel}>血压</div>
                  <div className={styles.metricValue}>{elderly.bloodPressure}</div>
                </div>
                <div className={styles.metricItem}>
                  <div className={styles.metricLabel}>血糖</div>
                  <div className={styles.metricValue}>{elderly.bloodSugar}</div>
                </div>
                <div className={styles.metricItem}>
                  <div className={styles.metricLabel}>心率</div>
                  <div className={styles.metricValue}>{elderly.heartRate}</div>
                </div>
              </div>
            </div>

            <div className={styles.elderlyActionsBottom}>
              <Button className={styles.detailBtn} size="small" fill="outline">
                查看详情
              </Button>
              <Button className={styles.reportBtn} size="small" fill="outline">
                健康报告
              </Button>
            </div>
          </Card>
        ))}
      </div>

      {/* 添加按钮 */}
      <Button
        className={styles.addButton}
        color="primary"
        shape="rounded"
        onClick={() => setShowAddModal(true)}
      >
        <AddOutline />
      </Button>

      {/* 添加老人模态框 */}
      <Modal
        visible={showAddModal}
        title="添加老人"
        content={
          <Form layout="vertical">
            <Form.Item label="姓名" required>
              <Input placeholder="请输入老人姓名" />
            </Form.Item>
            <Form.Item label="年龄" required>
              <Input placeholder="请输入年龄" type="number" />
            </Form.Item>
            <Form.Item label="性别" required>
              <Picker
                columns={[genderOptions]}
                value={genderValue}
              >
                {(items, actions) => (
                  <Button onClick={actions.open}>
                    {genderValue && genderValue[0] ? genderValue[0] : '请选择性别'}
                  </Button>
                )}
              </Picker>
            </Form.Item>
            <Form.Item label="联系电话" required>
              <Input placeholder="请输入联系电话" />
            </Form.Item>
            <Form.Item label="地址">
              <Input placeholder="请输入地址" />
            </Form.Item>
          </Form>
        }
        closeOnAction
        actions={[
          {
            key: 'cancel',
            text: '取消',
          },
          {
            key: 'confirm',
            text: '确认',
          },
        ]}
        onAction={(action) => {
          if (action.key === 'confirm') {
            handleAddElderly();
          }
          setShowAddModal(false);
        }}
      />
    </div>
  );
};

export default Elderly;
