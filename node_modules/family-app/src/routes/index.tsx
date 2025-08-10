import React, { useEffect, useState } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthService } from '../services/auth.service';
import { PrivateRoute } from '../components/PrivateRoute';
import { Login, Register } from '@smart-aging/packages';

// 家属端页面
import Layout from '../pages/Layout';
import Home from '../pages/Home';
import Profile from '../pages/Profile';
import Elderly from '../pages/Elderly';
import Health from '../pages/Health';
import Nurses from '../pages/Nurses';
import Orders from '../pages/Orders';
import Warnings from '../pages/Warnings';

// 根路由重定向组件
const RootRedirect: React.FC = () => {
  const [isLoggedIn, setIsLoggedIn] = useState<boolean | null>(null);
  const currentRole = AuthService.getCurrentRole();

  useEffect(() => {
    AuthService.isLoggedIn().then(setIsLoggedIn);
  }, []);

  if (isLoggedIn === null) return null; // loading
  if (!isLoggedIn) return <Navigate to="/login" replace />;
  if (currentRole === 'family') return <Navigate to="/home" replace />;
  return <Navigate to="/login" replace />;
};

// 家属端路由组件
const AppRouter: React.FC = () => {
  return (
    <BrowserRouter>
      <Routes>
        {/* 公共路由 - 使用共享的认证页面 */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        {/* 根路径重定向 */}
        <Route path="/" element={<RootRedirect />} />

        {/* 家属端路由 */}
        <Route
          path="/home"
          element={
            <PrivateRoute requiredRoles={['family']}>
              <Layout />
            </PrivateRoute>
          }
        >
          {/* 首页 - 默认路由 */}
          <Route index element={<Home />} />

          {/* 主要标签页路由 */}
          <Route path="elderly" element={<Elderly />} />
          <Route path="health" element={<Health />} />
          <Route path="nurses" element={<Nurses />} />
          <Route path="profile" element={<Profile />} />

          {/* 通过首页链接访问的页面 */}
          <Route path="orders" element={<Orders />} />
          <Route path="warnings" element={<Warnings />} />
        </Route>

        {/* 404页面重定向到统一登录 */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
};

export default AppRouter; 