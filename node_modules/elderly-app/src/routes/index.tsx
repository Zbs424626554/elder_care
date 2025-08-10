import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthService } from '../services/auth.service';
import { PrivateRoute } from '../components/PrivateRoute';
import { Login, Register } from '@smart-aging/packages';
// 老人端页面
import Layout from '../pages/Layout';
import Home from '../pages/Home';
import Emergency from '../pages/Emergency';
import Orders from '../pages/Orders';
import Nurses from '../pages/Nurses';
import Profile from '../pages/Profile';

// 根路由重定向组件
const RootRedirect: React.FC = () => {
  const isLoggedIn = AuthService.isLoggedIn();
  const currentRole = AuthService.getCurrentRole();

  if (!isLoggedIn) {
    return <Navigate to="/login" replace />;
  }

  if (currentRole === 'elderly') {
    return <Navigate to="/home" replace />;
  }

  // 其他角色或异常情况，统一跳转登录页
  return <Navigate to="/login" replace />;
};

// 老人端路由组件
const ElderlyRouter: React.FC = () => {
  return (
    <BrowserRouter>
      <Routes>
        {/* 公共路由 - 使用共享的认证页面 */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* 根路径重定向 */}
        <Route path="/" element={<RootRedirect />} />

        {/* 老人端路由 */}
        <Route
          path="/home"
          element={
            <PrivateRoute requiredRoles={['elderly']}>
              <Layout />
            </PrivateRoute>
          }
        >
          <Route index element={<Emergency />} />
          <Route path="call" element={<Emergency />} />
          <Route path="orders" element={<Orders />} />
          <Route path="messages" element={<Nurses />} />
          <Route path="mine" element={<Profile />} />
        </Route>

        {/* 404页面 */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
};

export default ElderlyRouter; 