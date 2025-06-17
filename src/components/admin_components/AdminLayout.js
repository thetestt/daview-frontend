// 📁 src/components/admin_components/AdminLayout.js
import React from 'react';
import { Outlet } from 'react-router-dom';
import AdminSidebar from './AdminSidebar';
//import './AdminLayout.css'; // (선택사항) CSS 분리 시

const AdminLayout = () => {
  return (
    <div style={{ display: 'flex', minHeight: '100vh' }}>
      <AdminSidebar />
      <main style={{ flex: 1, padding: '1.5rem', backgroundColor: '#f9f9f9' }}>
        <Outlet />
      </main>
    </div>
  );
};

export default AdminLayout;

