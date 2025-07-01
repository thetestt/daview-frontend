// 📁 src/components/admin_components/AdminLayout.js
import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import AdminSidebar from './AdminSidebar';
import styles from '../../styles/layouts/AdminLayout.module.css';

const AdminLayout = () => {
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);

  return (
    <div className={styles["admin-layout-container"]}>
      {/* 토글 버튼 - 사이드바 중간에 세로 직사각형 */}
      <button 
        onClick={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
        className={`${styles["toggle-button"]} ${isSidebarCollapsed ? styles["collapsed"] : styles["expanded"]}`}
      >
        {isSidebarCollapsed ? '▶' : '◀'}
      </button>
      
      <AdminSidebar isCollapsed={isSidebarCollapsed} />
      <main className={`${styles["main-content"]} ${isSidebarCollapsed ? styles["sidebar-collapsed"] : styles["sidebar-expanded"]}`}>
        <Outlet />
      </main>
    </div>
  );
};

export default AdminLayout;

