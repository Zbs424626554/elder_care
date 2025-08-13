import React, { useState } from 'react';
import { Form, Input, Button, message, Typography, Card } from 'antd';
import { UserOutlined, LockOutlined } from '@ant-design/icons';
import { useNavigate, Link } from 'react-router-dom';

const { Title } = Typography;

interface LoginProps {
  onLoginSuccess?: (role: string) => void;
}

const Login: React.FC<LoginProps> = ({ onLoginSuccess }) => {
  const [loading, setLoading] = useState(false);

  const onFinish = async (values: any) => {
    try {
      setLoading(true);
      const loginParams = {
        username: values.username,
        password: values.password,
      };

      // 动态导入避免循环依赖
      const { AuthService } = await import('../../services/auth.service');
      const response = await AuthService.login(loginParams);

      AuthService.saveUserInfo(response.data.token, response.data.user);
      message.success('登录成功');

      const role = response.data.user.role;

      // 使用回调或直接跳转
      if (onLoginSuccess) {
        onLoginSuccess(role);
      } else {
        // 直接跳转到对应应用
        const roleRedirectMap: Record<string, string> = {
          elderly: 'http://localhost:5173',
          family: 'http://localhost:5174',
          nurse: 'http://localhost:5175',
          admin: 'http://localhost:5176'
        };

        const redirectUrl = roleRedirectMap[role];
        if (redirectUrl) {
          setTimeout(() => {
            window.location.href = redirectUrl;
          }, 1000);
        }
      }
    } catch (error) {
      console.error('登录失败:', error);
      message.error('登录失败，请检查用户名和密码');
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
          <Title level={2} style={{ color: '#1890ff', marginBottom: 8 }}>
            智慧养老平台
          </Title>
          <p style={{ color: '#666', margin: 0 }}>请登录您的账户</p>
        </div>

        <Form
          name="login"
          onFinish={onFinish}
          autoComplete="off"
          size="large"
        >
          <Form.Item
            name="username"
            rules={[{ required: true, message: '请输入用户名!' }]}
          >
            <Input
              prefix={<UserOutlined />}
              placeholder="用户名"
            />
          </Form.Item>

          <Form.Item
            name="password"
            rules={[{ required: true, message: '请输入密码!' }]}
          >
            <Input.Password
              prefix={<LockOutlined />}
              placeholder="密码"
            />
          </Form.Item>

          <Form.Item>
            <Button
              type="primary"
              htmlType="submit"
              loading={loading}
              style={{ width: '100%', height: 40 }}
            >
              登录
            </Button>
          </Form.Item>
        </Form>
        <div style={{ textAlign: 'center', marginTop: 18 }}>
          <span style={{ color: '#888' }}>没有账号？</span>{' '}
          <Link to="/register" style={{ color: '#1890ff', fontWeight: 500 }}>
            立即注册
          </Link>
        </div>
      </Card>
    </div>
  );
};

export default Login;