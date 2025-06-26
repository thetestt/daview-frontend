// 📁 src/components/admin_components/AdminSidebar.js
import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';
//import './AdminSidebar.css'; // (선택사항) 스타일 분리 시

const AdminSidebar = ({ isCollapsed }) => {

  return (
    <aside style={{ 
      width: isCollapsed ? '0px' : '250px', 
      background: '#2c3e50', 
      color: '#fff', 
      padding: isCollapsed ? '0' : '1rem',
      transition: 'all 0.3s ease',
      position: 'relative',
      height: '100vh',
      overflow: 'hidden',
      flexShrink: 0,
      opacity: isCollapsed ? 0 : 1
    }}>

      {!isCollapsed && (
        <h2 style={{ color: '#ecf0f1', fontSize: '1.2rem', marginTop: '2rem' }}>관리자 메뉴</h2>
      )}

      <nav style={{ marginTop: isCollapsed ? '3rem' : '1rem' }}>
        {!isCollapsed && (
          // 펼쳐진 상태의 메뉴
          <>
            <div>
              <strong style={{ fontSize: '14px', color: '#bdc3c7' }}>대시보드</strong>
              <ul style={{ listStyle: 'none', paddingLeft: '1rem', margin: '0.5rem 0' }}>
                <li><NavLink to="/admin" style={navStyle}>관리자 홈</NavLink></li>
              </ul>
            </div>

            <div style={{ marginTop: '1.5rem' }}>
              <strong style={{ fontSize: '14px', color: '#bdc3c7' }}>서비스 관리</strong>
              <ul style={{ listStyle: 'none', paddingLeft: '1rem', margin: '0.5rem 0' }}>
                <li><NavLink to="/admin/products" style={navStyle}>상품 관리</NavLink></li>
                <li><NavLink to="/admin/reservations" style={navStyle}>예약 관리</NavLink></li>
              </ul>
            </div>

            <div style={{ marginTop: '1.5rem' }}>
              <strong style={{ fontSize: '14px', color: '#bdc3c7' }}>비즈니스 관리</strong>
              <ul style={{ listStyle: 'none', paddingLeft: '1rem', margin: '0.5rem 0' }}>
                <li><NavLink to="/admin/business/partners" style={navStyle}>제휴사 관리</NavLink></li>
              </ul>
            </div>

            <div style={{ marginTop: '1.5rem' }}>
              <strong style={{ fontSize: '14px', color: '#bdc3c7' }}>시스템 관리</strong>
              <ul style={{ listStyle: 'none', paddingLeft: '1rem', margin: '0.5rem 0' }}>
                <li><NavLink to="/admin/system/users" style={navStyle}>유저 권한</NavLink></li>
              </ul>
            </div>

            <div style={{ marginTop: '1.5rem' }}>
              <strong style={{ fontSize: '14px', color: '#bdc3c7' }}>기타 관리</strong>
              <ul style={{ listStyle: 'none', paddingLeft: '1rem', margin: '0.5rem 0' }}>
                <li><NavLink to="/admin/etc/logs" style={navStyle}>로그 관리</NavLink></li>
              </ul>
            </div>
          </>
        )}
      </nav>
    </aside>
  );
};

const navStyle = ({ isActive }) => ({
  color: isActive ? '#1abc9c' : '#bdc3c7',
  textDecoration: 'none',
  display: 'block',
  padding: '0.5rem 0',
  borderRadius: '4px',
  transition: 'all 0.3s ease',
  fontSize: '14px'
});

export default AdminSidebar;
