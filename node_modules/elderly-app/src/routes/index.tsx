import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthService } from '../services/auth.service';
import { PrivateRoute } from '../components/PrivateRoute';
import { Login, Register } from '@smart-aging/packages';

// 老人端页面
import Layout from '../pages/Layout';
import Home from '../pages/Home';
import Profile from '../pages/Profile';
import Health from '../pages/Health';
import Nurses from '../pages/Nurses';
import Orders from '../pages/Orders';
import Emergency from '../pages/Emergency';

// 根路由重定向组件
const RootRedirect: React.FC = () => {
  const isLoggedIn = AuthService.isLoggedIn();
  const currentRole = AuthService.getCurrentRole();

  if (!isLoggedIn) {
    return <Navigate to="/login" replace />;
  }

  // 检查是否是老人角色
  if (currentRole !== 'elderly') {
    // 如果不是老人角色，重定向到对应的应用
    const roleRedirectMap: Record<string, string> = {
      family: '/family-app',
      nurse: '/nurse-app',
      admin: '/admin-panel'
    };

    const redirectPath = roleRedirectMap[currentRole || ''] || '/login';
    window.location.href = redirectPath;
    return null;
  }

  return <Navigate to="/home" replace />;
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
          <Route index element={<Home />} />
          <Route path="profile" element={<Profile />} />
          <Route path="health" element={<Health />} />
          <Route path="nurses" element={<Nurses />} />
          <Route path="orders" element={<Orders />} />
          <Route path="emergency" element={<Emergency />} />
        </Route>

        {/* 404页面 */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
};

export default ElderlyRouter; 