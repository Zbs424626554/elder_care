import React, { useState, useEffect } from 'react';
import { Card, Button, Modal, Form, Input, Avatar, Tag, SearchBar, Toast, Empty } from 'antd-mobile';
import { AddOutline, UserOutline, LeftOutline } from 'antd-mobile-icons';
import { useNavigate } from 'react-router-dom';
import styles from './Elderly.module.css';
import { ElderlyService } from '../services/elderly.service';
import type { ElderlyUser } from '../services/elderly.service';

interface Elderly {
  id: string;
  name: string;
  phone: string;
  avatar: string;
  realname: string;
  username: string;
  status: boolean;
  createdTime: string;
  healthStatus?: string;
  bloodPressure?: string;
  bloodSugar?: string;
  heartRate?: string;
  boundYears?: number;
}

const Elderly: React.FC = () => {
  const navigate = useNavigate();
  const [searchValue, setSearchValue] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);
  const [elderly, setElderly] = useState<Elderly[]>([]);
  const [loading, setLoading] = useState(false);
  const [availableElderly, setAvailableElderly] = useState<ElderlyUser[]>([]);
  const [form] = Form.useForm();

  // 获取可绑定的老人列表
  const fetchAvailableElderly = async () => {
    try {
      console.log('开始获取可绑定的老人列表...');
      const response = await ElderlyService.getAllElderlyUsers();
      console.log('获取可绑定老人列表响应:', response);

      if (response.code === 200 && response.data) {
        // 过滤出未绑定的老人
        const unboundElderly = response.data.list.filter(user => !user.status);
        console.log('过滤后的未绑定老人:', unboundElderly);
        setAvailableElderly(unboundElderly);
      } else {
        console.log('获取可绑定老人列表失败，响应码:', response.code, '消息:', response.message);
        // 如果获取失败，设置为空数组
        setAvailableElderly([]);
      }
    } catch (error) {
      console.error('获取可绑定老人列表失败:', error);
      // 如果出错，设置为空数组
      setAvailableElderly([]);
    }
  };

  // 获取老人列表
  const fetchElderlyList = async () => {
    try {
      setLoading(true);
      console.log('开始获取老人列表...');
      const response = await ElderlyService.getElderlyList();
      console.log('获取老人列表响应:', response);

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
        console.log('处理后的老人列表:', elderlyList);
        setElderly(elderlyList);
      } else {
        console.error('获取老人列表失败，响应码:', response.code, '消息:', response.message);
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

  // 当打开绑定模态框时，获取可绑定的老人列表
  useEffect(() => {
    if (showAddModal) {
      fetchAvailableElderly();
    }
  }, [showAddModal]);

  // 过滤老人列表
  const filteredElderly = elderly.filter(elderly =>
    elderly.name.toLowerCase().includes(searchValue.toLowerCase()) ||
    elderly.phone.includes(searchValue)
  );

  const handleAddElderly = async () => {
    try {
      const values = await form.validateFields();

      // 只通过username绑定老人
      const params = {
        username: values.username,
      };

      const response = await ElderlyService.bindElderly(params);

      if (response.code === 200) {
        Toast.show({
          content: '绑定老人成功',
          position: 'center',
        });
        setShowAddModal(false);
        form.resetFields();
        fetchElderlyList(); // 刷新列表
      } else {
        Toast.show({
          content: response.message || '绑定失败',
          position: 'center',
        });
      }
    } catch (error) {
      console.error('绑定老人失败:', error);
      Toast.show({
        content: '绑定老人失败',
        position: 'center',
      });
    }
  };

  // 解绑老人
  const handleUnbindElderly = async (id: string, name: string) => {
    // 显示确认对话框
    const confirmed = window.confirm(`确定要解绑老人 ${name} 吗？解绑后该老人将不再出现在您的列表中。`);
    if (!confirmed) {
      return;
    }

    try {
      const response = await ElderlyService.unbindElderly(id);

      if (response.code === 200) {
        Toast.show({
          content: `解绑老人 ${name} 成功`,
          position: 'center',
        });
        fetchElderlyList(); // 刷新列表
      } else {
        Toast.show({
          content: response.message || '解绑失败',
          position: 'center',
        });
      }
    } catch (error) {
      console.error('解绑老人失败:', error);
      Toast.show({
        content: '解绑老人失败',
        position: 'center',
      });
    }
  };

  return (
    <div className={styles.elderly}>
      {/* 页面标题 */}
      <div className={styles.pageHeader}>
        <button className={styles.backButton} onClick={() => navigate(-1)}>
          <LeftOutline />
        </button>
        <h1 className={styles.pageTitle}>老人管理</h1>
      </div>

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
        {loading ? (
          <div className={styles.loadingContainer}>
            <div className={styles.loadingText}>加载中...</div>
          </div>
        ) : filteredElderly.length === 0 ? (
          <Empty
            className={styles.emptyContainer}
            description="暂无老人信息"
            image={<UserOutline style={{ fontSize: 48, color: '#ccc' }} />}
          />
        ) : (
          filteredElderly.map((elderly) => (
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
                    onClick={() => handleUnbindElderly(elderly.id, elderly.name)}
                  >
                    解绑
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
                <Button
                  className={styles.detailBtn}
                  size="small"
                  fill="outline"
                  onClick={() => navigate(`/elderly/${elderly.id}`)}
                >
                  查看详情
                </Button>
              </div>
            </Card>
          ))
        )}
      </div>

      {/* 绑定老人按钮 */}
      <div className={styles.addButtonContainer}>
        <Button
          className={styles.addButton}
          color="primary"
          shape="rounded"
          onClick={() => setShowAddModal(true)}
        >
          <AddOutline />
        </Button>
        {availableElderly.length === 0 && (
          <div className={styles.addButtonHint}>
            暂无可绑定的老人
          </div>
        )}
      </div>

      {/* 测试按钮 */}
      <div className={styles.testContainer}>
        <Button
          className={styles.testButton}
          color="default"
          fill="outline"
          onClick={async () => {
            console.log('测试API连接...');
            try {
              const response = await ElderlyService.getAllElderlyUsers();
              console.log('测试API响应:', response);
              Toast.show({
                content: `API测试成功: ${response.code}`,
                position: 'center',
              });
            } catch (error) {
              console.error('API测试失败:', error);
              Toast.show({
                content: 'API测试失败',
                position: 'center',
              });
            }
          }}
        >
          测试API连接
        </Button>
      </div>

      {/* 添加老人模态框 */}
      <Modal
        visible={showAddModal}
        title="绑定老人"
        content={
          <div className={styles.bindModalContent}>
            {availableElderly.length > 0 ? (
              <>
                <Form
                  form={form}
                  layout="vertical"
                  onFinish={handleAddElderly}
                >
                  <Form.Item
                    label="用户名"
                    name="username"
                    rules={[{ required: true, message: '请输入老人用户名' }]}
                  >
                    <Input placeholder="请输入老人用户名" />
                  </Form.Item>
                </Form>

                <div className={styles.availableElderlyHint}>
                  <div className={styles.hintTitle}>可绑定的老人：</div>
                  <div className={styles.availableElderlyList}>
                    {availableElderly.map((elderly, index) => (
                      <div key={index} className={styles.availableElderlyItem}>
                        <span className={styles.elderlyName}>
                          {elderly.realname || elderly.username}
                        </span>
                        <span className={styles.elderlyUsername}>
                          ({elderly.username})
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className={styles.bindInstructions}>
                  请输入已注册的老人用户名进行绑定
                </div>
              </>
            ) : (
              <div className={styles.noAvailableElderly}>
                <div className={styles.noElderlyIcon}>👴</div>
                <div className={styles.noElderlyTitle}>暂无可绑定的老人</div>
                <div className={styles.noElderlyDesc}>
                  目前系统中没有可绑定的老人用户
                </div>
                <div className={styles.noElderlySuggestions}>
                  <div className={styles.suggestionItem}>
                    • 老人需要先注册账号
                  </div>
                  <div className={styles.suggestionItem}>
                    • 或者联系管理员添加老人用户
                  </div>
                </div>
              </div>
            )}
          </div>
        }
        closeOnAction
        actions={
          availableElderly.length > 0 ? [
            {
              key: 'cancel',
              text: '取消',
            },
            {
              key: 'confirm',
              text: '确认',
              onClick: handleAddElderly,
            },
          ] : [
            {
              key: 'close',
              text: '关闭',
            }
          ]
        }
        onAction={(action) => {
          if (action.key === 'cancel' || action.key === 'close') {
            setShowAddModal(false);
            form.resetFields();
          }
        }}
      />
    </div>
  );
};

export default Elderly;