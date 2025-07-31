import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthService } from '../services/auth.service';
import { PrivateRoute } from '../components/PrivateRoute';

// 公共页面
import Login from '../pages/auth/Login';
import Register from '../pages/auth/Register';

// 老人端页面
import ElderlyLayout from '../pages/elderly/Layout';
import ElderlyHome from '../pages/elderly/Home';
import ElderlyProfile from '../pages/elderly/Profile';
import ElderlyHealth from '../pages/elderly/Health';
import ElderlyNurses from '../pages/elderly/Nurses';
import ElderlyOrders from '../pages/elderly/Orders';
import ElderlyEmergency from '../pages/elderly/Emergency';

// 家属端页面
import FamilyLayout from '../pages/family/Layout';
import FamilyHome from '../pages/family/Home';
import FamilyProfile from '../pages/family/Profile';
import FamilyElderly from '../pages/family/Elderly';
import FamilyHealth from '../pages/family/Health';
import FamilyNurses from '../pages/family/Nurses';
import FamilyOrders from '../pages/family/Orders';
import FamilyWarnings from '../pages/family/Warnings';

// 护工端页面
import NurseLayout from '../pages/nurse/Layout';
import NurseHome from '../pages/nurse/Home';
import NurseProfile from '../pages/nurse/Profile';
import NurseCertification from '../pages/nurse/Certification';
import NurseOrders from '../pages/nurse/Orders';
import NurseIncome from '../pages/nurse/Income';
import NurseSchedule from '../pages/nurse/Schedule';

// 管理员页面
import AdminLayout from '../pages/admin/Layout';
import AdminDashboard from '../pages/admin/Dashboard';
import AdminUsers from '../pages/admin/Users';
import AdminOrders from '../pages/admin/Orders';
import AdminServices from '../pages/admin/Services';
import AdminSettings from '../pages/admin/Settings';

// 根路由重定向组件
const RootRedirect: React.FC = () => {
  const isLoggedIn = AuthService.isLoggedIn();
  const currentRole = AuthService.getCurrentRole();

  if (!isLoggedIn) {
    return <Navigate to="/login" replace />;
  }

  // 根据角色重定向到对应的首页
  const roleRedirectMap: Record<string, string> = {
    elderly: '/elderly',
    family: '/family',
    nurse: '/nurse',
    admin: '/admin'
  };

  const redirectPath = roleRedirectMap[currentRole || ''] || '/login';
  return <Navigate to={redirectPath} replace />;
};

// 主路由组件
const AppRouter: React.FC = () => {
  return (
    <BrowserRouter>
      <Routes>
        {/* 公共路由 */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* 根路径重定向 */}
        <Route path="/" element={<RootRedirect />} />

        {/* 老人端路由 */}
        <Route
          path="/elderly"
          element={
            <PrivateRoute requiredRoles={['elderly']}>
              <ElderlyLayout />
            </PrivateRoute>
          }
        >
          <Route index element={<ElderlyHome />} />
          <Route path="profile" element={<ElderlyProfile />} />
          <Route path="health" element={<ElderlyHealth />} />
          <Route path="nurses" element={<ElderlyNurses />} />
          <Route path="orders" element={<ElderlyOrders />} />
          <Route path="emergency" element={<ElderlyEmergency />} />
        </Route>

        {/* 家属端路由 */}
        <Route
          path="/family"
          element={
            <PrivateRoute requiredRoles={['family']}>
              <FamilyLayout />
            </PrivateRoute>
          }
        >
          <Route index element={<FamilyHome />} />
          <Route path="profile" element={<FamilyProfile />} />
          <Route path="elderly" element={<FamilyElderly />} />
          <Route path="health" element={<FamilyHealth />} />
          <Route path="nurses" element={<FamilyNurses />} />
          <Route path="orders" element={<FamilyOrders />} />
          <Route path="warnings" element={<FamilyWarnings />} />
        </Route>

        {/* 护工端路由 */}
        <Route
          path="/nurse"
          element={
            <PrivateRoute requiredRoles={['nurse']}>
              <NurseLayout />
            </PrivateRoute>
          }
        >
          <Route index element={<NurseHome />} />
          <Route path="profile" element={<NurseProfile />} />
          <Route path="certification" element={<NurseCertification />} />
          <Route path="orders" element={<NurseOrders />} />
          <Route path="income" element={<NurseIncome />} />
          <Route path="schedule" element={<NurseSchedule />} />
        </Route>

        {/* 管理员路由 */}
        <Route
          path="/admin"
          element={
            <PrivateRoute requiredRoles={['admin']}>
              <AdminLayout />
            </PrivateRoute>
          }
        >
          <Route index element={<AdminDashboard />} />
          <Route path="users" element={<AdminUsers />} />
          <Route path="orders" element={<AdminOrders />} />
          <Route path="services" element={<AdminServices />} />
          <Route path="settings" element={<AdminSettings />} />
        </Route>

        {/* 404页面 */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
};

export default AppRouter; 