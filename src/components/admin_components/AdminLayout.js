// 📁 src/components/admin_components/AdminLayout.js
import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import AdminSidebar from './AdminSidebar';
//import './AdminLayout.css'; // (선택사항) CSS 분리 시

const AdminLayout = () => {
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);

  return (
    <div style={{ 
      display: 'flex', 
      minHeight: '100vh',
      backgroundColor: '#f9f9f9'
    }}>
      {/* 토글 버튼 - 사이드바 중간에 세로 직사각형 */}
      <button 
        onClick={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
        style={{
          position: 'fixed',
          top: '50%',
          transform: 'translateY(-50%)',
          left: isSidebarCollapsed ? '0px' : '250px',
          background: '#34495e',
          border: 'none',
          color: '#fff',
          borderRadius: '0 8px 8px 0',
          width: '20px',
          height: '60px',
          cursor: 'pointer',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: '12px',
          boxShadow: '2px 0 8px rgba(0,0,0,0.2)',
          zIndex: 1001,
          transition: 'left 0.3s ease'
        }}
      >
        {isSidebarCollapsed ? '▶' : '◀'}
      </button>
      
      <AdminSidebar isCollapsed={isSidebarCollapsed} />
      <main style={{ 
        flex: 1, 
        padding: '1.5rem',
        minHeight: '100vh',
        backgroundColor: '#f9f9f9',
        overflow: 'auto'
      }}>
        <Outlet />
      </main>
    </div>
  );
};

export default AdminLayout;

