import React, { useState } from 'react';
import { Form, Input, Button, Card, message, Typography, Select } from 'antd';
import { UserOutlined, LockOutlined, PhoneOutlined } from '@ant-design/icons';
import { useNavigate, Link } from 'react-router-dom';
import { AuthService, RegisterParams, UserRole } from '../../services/auth.service';

const { Title, Text } = Typography;
const { Option } = Select;

const Register: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [selectedRole, setSelectedRole] = useState<UserRole>('elderly');
  const navigate = useNavigate();

  const onFinish = async (values: any) => {
    try {
      setLoading(true);

      const registerParams: RegisterParams = {
        role: selectedRole,
        username: values.username,
        password: values.password,
        phone: values.phone,
      };

      const response = await AuthService.register(registerParams);

      if (response.code === 200) {
        // 保存用户信息
        AuthService.saveUserInfo(response.data.token, response.data.user);

        message.success('注册成功');

        // 根据角色重定向到对应的应用
        const roleRedirectMap: Record<UserRole, string> = {
          elderly: '/elderly-app',
          family: '/family-app',
          nurse: '/nurse-app',
          admin: '/admin-panel'
        };

        const redirectPath = roleRedirectMap[selectedRole] || '/login';
        window.location.href = redirectPath;
      }
    } catch (error) {
      message.error('注册失败，请检查输入信息');
    } finally {
      setLoading(false);
    }
  };

  // 只包含用户端角色，移除管理员
  const roleOptions = [
    { value: 'elderly', label: '老人', icon: '👴', desc: '享受养老服务' },
    { value: 'family', label: '家属', icon: '👨‍👩‍👧‍👦', desc: '关注老人健康' },
    { value: 'nurse', label: '护工', icon: '👩‍⚕️', desc: '提供护理服务' }
  ];

  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
    }}>
      <Card style={{ width: 500, boxShadow: '0 4px 12px rgba(0,0,0,0.15)' }}>
        <div style={{ textAlign: 'center', marginBottom: 24 }}>
          <Title level={2} style={{ color: '#1890ff' }}>
            智慧养老平台
          </Title>
          <Text type="secondary">用户注册</Text>
        </div>

        <Form
          name="register"
          onFinish={onFinish}
          autoComplete="off"
          size="large"
          layout="vertical"
        >
          <Form.Item
            label="选择角色"
            name="role"
            rules={[
              { required: true, message: '请选择用户角色' }
            ]}
          >
            <Select
              value={selectedRole}
              onChange={setSelectedRole}
              placeholder="请选择用户角色"
              style={{ width: '100%' }}
            >
              {roleOptions.map(option => (
                <Option key={option.value} value={option.value}>
                  <div style={{ display: 'flex', alignItems: 'center' }}>
                    <span style={{ marginRight: 8, fontSize: '16px' }}>{option.icon}</span>
                    <div style={{ display: 'flex', alignItems: 'center',gap:10 }}>
                      <div style={{ fontWeight: 'bold' }}>{option.label}</div>
                      <div style={{ fontSize: '12px', color: '#999' }}>{option.desc}</div>
                    </div>
                  </div>
                </Option>
              ))}
            </Select>
          </Form.Item>

          <Form.Item
            label="用户名"
            name="username"
            rules={[
              { required: true, message: '请输入用户名' },
              { min: 2, message: '用户名至少2位' }
            ]}
          >
            <Input
              prefix={<UserOutlined />}
              placeholder="请输入用户名"
            />
          </Form.Item>

          <Form.Item
            label="手机号"
            name="phone"
            rules={[
              { required: true, message: '请输入手机号' },
              { pattern: /^1[3-9]\d{9}$/, message: '请输入正确的手机号' }
            ]}
          >
            <Input
              prefix={<PhoneOutlined />}
              placeholder="请输入手机号"
            />
          </Form.Item>

          <Form.Item
            label="密码"
            name="password"
            rules={[
              { required: true, message: '请输入密码' },
              { min: 6, message: '密码至少6位' }
            ]}
          >
            <Input.Password
              prefix={<LockOutlined />}
              placeholder="请输入密码"
            />
          </Form.Item>

          <Form.Item
            label="确认密码"
            name="confirmPassword"
            dependencies={['password']}
            rules={[
              { required: true, message: '请确认密码' },
              ({ getFieldValue }) => ({
                validator(_, value) {
                  if (!value || getFieldValue('password') === value) {
                    return Promise.resolve();
                  }
                  return Promise.reject(new Error('两次输入的密码不一致'));
                },
              }),
            ]}
          >
            <Input.Password
              prefix={<LockOutlined />}
              placeholder="请确认密码"
            />
          </Form.Item>

          <Form.Item>
            <Button
              type="primary"
              htmlType="submit"
              loading={loading}
              style={{ width: '100%' }}
            >
              注册
            </Button>
          </Form.Item>

          <div style={{ textAlign: 'center' }}>
            <Text type="secondary">
              已有账号？{' '}
              <Link to="/login" style={{ color: '#1890ff' }}>
                立即登录
              </Link>
            </Text>
          </div>
        </Form>
      </Card>
    </div>
  );
};

export default Register; 