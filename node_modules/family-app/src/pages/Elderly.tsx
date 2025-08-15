import React, { useState, useEffect } from 'react';
import { Card, Button, Modal, Form, Input, Picker, Avatar, Tag, SearchBar, Toast } from 'antd-mobile';
import { AddOutline, UserOutline, PhonebookOutline } from 'antd-mobile-icons';
import styles from './Elderly.module.css';
import PageHeader from '../components/PageHeader';
import { ElderlyService } from '../services/elderly.service';
import type { ElderlyUser } from '../services/elderly.service';

interface Elderly {
  id: string;
  name: string;
  age?: number;
  gender?: string;
  relationship?: string;
  phone: string;
  address?: string;
  healthStatus?: string;
  bloodPressure?: string;
  bloodSugar?: string;
  heartRate?: string;
  boundYears?: number;
  avatar: string;
  realname: string;
  username: string;
  status: boolean;
  createdTime: string;
}

const Elderly: React.FC = () => {
  const [searchValue, setSearchValue] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);
  const [genderValue, setGenderValue] = useState<string[]>([]);
  const [elderly, setElderly] = useState<Elderly[]>([]);
  const [loading, setLoading] = useState(false);
  const [form] = Form.useForm();

  const genderOptions = ['男', '女'];

  // 获取老人列表
  const fetchElderlyList = async () => {
    try {
      setLoading(true);
      const response = await ElderlyService.getElderlyList();
      if (response.code === 200 && response.data) {
        const elderlyList = response.data.list.map((user: ElderlyUser) => ({
          id: user.id,
          name: user.realname || user.username,
          phone: user.phone,
          avatar: user.avatar || '',
          realname: user.realname || '',
          username: user.username,
          status: user.status,
          createdTime: user.createdTime,
          healthStatus: '良好', // 默认值，实际应该从健康记录获取
          bloodPressure: '120/80',
          bloodSugar: '5.2',
          heartRate: '72',
          boundYears: 1,
        }));
        setElderly(elderlyList);
      }
    } catch (error) {
      console.error('获取老人列表失败:', error);
      Toast.show({
        content: '获取老人列表失败',
        position: 'center',
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchElderlyList();
  }, []);

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
    elderly.phone.includes(searchValue)
  );

  const handleAddElderly = async () => {
    try {
      const values = await form.validateFields();

      // 生成用户名（使用手机号后4位）
      const username = `elderly_${values.phone.slice(-4)}`;

      // 生成默认密码（手机号后6位）
      const defaultPassword = values.phone.slice(-6);

      const params = {
        username,
        password: defaultPassword,
        phone: values.phone,
        realname: values.realname,
        avatar: values.avatar || '',
      };

      const response = await ElderlyService.createElderly(params);

      if (response.code === 200) {
        Toast.show({
          content: '添加老人成功',
          position: 'center',
        });
        setShowAddModal(false);
        form.resetFields();
        fetchElderlyList(); // 刷新列表
      } else {
        Toast.show({
          content: response.message || '添加失败',
          position: 'center',
        });
      }
    } catch (error) {
      console.error('添加老人失败:', error);
      Toast.show({
        content: '添加老人失败',
        position: 'center',
      });
    }
  };

  const handleEditElderly = (elderly: Elderly) => {
    console.log('编辑老人', elderly);
  };

  const handleDeleteElderly = (id: string) => {
    console.log('删除老人', id);
  };

  return (
    <div className={styles.elderly}>
      <PageHeader title="老人管理" />
      {/* 搜索栏 */}
      <div className={styles.searchContainer}>
        <SearchBar
          className={styles.searchBar}
          placeholder="搜索老人姓名或手机号"
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
                    {elderly.phone} | 绑定{elderly.boundYears || 1}年
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
          <Form
            form={form}
            layout="vertical"
            onFinish={handleAddElderly}
          >
            <Form.Item
              label="姓名"
              name="realname"
              rules={[{ required: true, message: '请输入老人姓名' }]}
            >
              <Input placeholder="请输入老人姓名" />
            </Form.Item>
            <Form.Item
              label="联系电话"
              name="phone"
              rules={[
                { required: true, message: '请输入联系电话' },
                { pattern: /^1[3-9]\d{9}$/, message: '请输入正确的手机号' }
              ]}
            >
              <Input placeholder="请输入联系电话" />
            </Form.Item>
            <Form.Item
              label="头像URL"
              name="avatar"
            >
              <Input placeholder="请输入头像URL（可选）" />
            </Form.Item>
            <div style={{ fontSize: '12px', color: '#999', marginTop: '8px' }}>
              系统将自动生成用户名和初始密码（手机号后6位）
            </div>
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
            onClick: handleAddElderly,
          },
        ]}
        onAction={(action) => {
          if (action.key === 'cancel') {
            setShowAddModal(false);
            form.resetFields();
          }
        }}
      />
    </div>
  );
};

export default Elderly;
