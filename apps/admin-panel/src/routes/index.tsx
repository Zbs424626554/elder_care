import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthService } from '@smart-aging/services';
import { PrivateRoute } from '@smart-aging/components';

// 公共页面
// import Login from '../pages/auth/Login';
// import Register from '../pages/auth/Register';

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

  // 只允许admin访问后台
  if (currentRole !== 'admin') {
    // 你可以选择直接登出并跳转到登录页，或者显示无权限提示
    AuthService.logout(); // 如果有登出方法
    return <Navigate to="/login" replace />;
    // 或者 return <div>无权限访问</div>;
  }

  return <Navigate to="/dashboard" replace />;
};

// 管理后台路由组件
const AdminRouter: React.FC = () => {
  return (
    <BrowserRouter>
      <Routes>
        {/* 公共路由 */}
        {/* <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} /> */}

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