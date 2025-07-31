import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthService } from '../services/auth.service';
import { PrivateRoute } from '../components/PrivateRoute';

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
  const isLoggedIn = AuthService.isLoggedIn();
  const currentRole = AuthService.getCurrentRole();

  if (!isLoggedIn) {
    // 重定向到统一登录应用
    window.location.href = 'http://localhost:5173/login';
    return null;
  }

  // 检查是否是家属角色
  if (currentRole !== 'family') {
    // 如果不是家属角色，重定向到对应的应用
    const roleRedirectMap: Record<string, string> = {
      elderly: 'http://localhost:5174',
      nurse: 'http://localhost:5174',
      admin: 'http://localhost:5176'
    };

    const redirectPath = roleRedirectMap[currentRole || ''] || 'http://localhost:5173/login';
    window.location.href = redirectPath;
    return null;
  }

  return <Navigate to="/home" replace />;
};

// 家属端路由组件
const FamilyRouter: React.FC = () => {
  return (
    <BrowserRouter>
      <Routes>
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
          <Route index element={<Home />} />
          <Route path="profile" element={<Profile />} />
          <Route path="elderly" element={<Elderly />} />
          <Route path="health" element={<Health />} />
          <Route path="nurses" element={<Nurses />} />
          <Route path="orders" element={<Orders />} />
          <Route path="warnings" element={<Warnings />} />
        </Route>

        {/* 404页面重定向到统一登录 */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
};

export default FamilyRouter; 