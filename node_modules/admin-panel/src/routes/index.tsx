import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthService } from '@smart-aging/services';
import { PrivateRoute } from '@smart-aging/components';

// 公共页面
import Login from '../pages/auth/Login';
import Register from '../pages/auth/Register';

// 管理后台页面
import Layout from '../pages/Layout';
import Dashboard from '../pages/Dashboard';
import Users from '../pages/Users';
import Orders from '../pages/Orders';
import Services from '../pages/Services';
import Settings from '../pages/Settings';

// 根路由重定向组件
const RootRedirect: React.FC = () => {
  const isLoggedIn = AuthService.isLoggedIn();
  const currentRole = AuthService.getCurrentRole();

  if (!isLoggedIn) {
    return <Navigate to="/login" replace />;
  }

  // 检查是否是管理员角色
  if (currentRole !== 'admin') {
    // 如果不是管理员角色，重定向到对应的应用
    const roleRedirectMap: Record<string, string> = {
      elderly: '/elderly-app',
      family: '/family-app',
      nurse: '/nurse-app'
    };

    const redirectPath = roleRedirectMap[currentRole || ''] || '/login';
    window.location.href = redirectPath;
    return null;
  }

  return <Navigate to="/dashboard" replace />;
};

// 管理后台路由组件
const AdminRouter: React.FC = () => {
  return (
    <BrowserRouter>
      <Routes>
        {/* 公共路由 */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* 根路径重定向 */}
        <Route path="/" element={<RootRedirect />} />

        {/* 管理后台路由 */}
        <Route
          path="/dashboard"
          element={
            <PrivateRoute requiredRoles={['admin']}>
              <Layout />
            </PrivateRoute>
          }
        >
          <Route index element={<Dashboard />} />
          <Route path="users" element={<Users />} />
          <Route path="orders" element={<Orders />} />
          <Route path="services" element={<Services />} />
          <Route path="settings" element={<Settings />} />
        </Route>

        {/* 404页面 */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
};

export default AdminRouter; 