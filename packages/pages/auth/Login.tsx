import React, { useState } from 'react';
import { Form, Input, Button, Card, message, Typography } from 'antd';
import { UserOutlined, LockOutlined } from '@ant-design/icons';
import { useNavigate, Link } from 'react-router-dom';
import { AuthService, LoginParams } from '../../services/auth.service';

const { Title, Text } = Typography;

const Login: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const onFinish = async (values: any) => {
    try {
      setLoading(true);
      const loginParams = {
        username: values.username,
        password: values.password,
      };
      const response = await AuthService.login(loginParams);
      message.success('登录成功');
      const role = response.data.user.role;
      console.log(role)
      const roleRedirectMap: Record<string, string> = {
        elderly: 'http://localhost:5174/home',
        family: 'http://localhost:5175/home',
        nurse: 'http://localhost:5173/home',
        admin: 'http://localhost:5176/home'
      };
      setTimeout(() => {
        window.location.href = roleRedirectMap[role] || '/home';
      }, 500);
    } catch (error) {
      // 不要再弹 message.error，拦截器已经弹了
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
    }}>
      <Card style={{ width: 400, boxShadow: '0 4px 12px rgba(0,0,0,0.15)' }}>
        <div style={{ textAlign: 'center', marginBottom: 24 }}>
          <Title level={2} style={{ color: '#1890ff' }}>
            智慧养老平台
          </Title>
          <Text type="secondary">统一登录系统</Text>
        </div>

        <Form
          name="login"
          onFinish={onFinish}
          autoComplete="off"
          size="large"
        >
          <Form.Item
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

          <Form.Item>
            <Button
              type="primary"
              htmlType="submit"
              loading={loading}
              style={{ width: '100%' }}
            >
              登录
            </Button>
          </Form.Item>

          <div style={{ textAlign: 'center' }}>
            <Text type="secondary">
              还没有账号？{' '}
              <Link to="/register" style={{ color: '#1890ff' }}>
                立即注册
              </Link>
            </Text>
          </div>
        </Form>
      </Card>
    </div>
  );
};

export default Login; 