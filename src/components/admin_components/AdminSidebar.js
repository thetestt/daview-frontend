// 📁 src/components/admin_components/AdminSidebar.js
import React from 'react';
import { NavLink } from 'react-router-dom';
//import './AdminSidebar.css'; // (선택사항) 스타일 분리 시

const AdminSidebar = () => {
  return (
    <aside style={{ width: '220px', background: '#2c3e50', color: '#fff', padding: '1rem' }}>
      <h2 style={{ color: '#ecf0f1', fontSize: '1.2rem' }}>관리자 메뉴</h2>

      <nav style={{ marginTop: '1rem' }}>
        <div>
          <strong>서비스 관리</strong>
          <ul style={{ listStyle: 'none', paddingLeft: '1rem' }}>
            <li><NavLink to="/admin/products" style={navStyle}>상품 관리</NavLink></li>
            <li><NavLink to="/admin/reservations" style={navStyle}>예약 관리</NavLink></li>
          </ul>
        </div>

        <div style={{ marginTop: '1rem' }}>
          <strong>비즈니스 관리</strong>
          <ul style={{ listStyle: 'none', paddingLeft: '1rem' }}>
            <li><NavLink to="/admin/business/partners" style={navStyle}>제휴사 관리</NavLink></li>
          </ul>
        </div>

        <div style={{ marginTop: '1rem' }}>
          <strong>시스템 관리</strong>
          <ul style={{ listStyle: 'none', paddingLeft: '1rem' }}>
            <li><NavLink to="/admin/system/users" style={navStyle}>유저 권한</NavLink></li>
          </ul>
        </div>

        <div style={{ marginTop: '1rem' }}>
          <strong>기타 관리</strong>
          <ul style={{ listStyle: 'none', paddingLeft: '1rem' }}>
            <li><NavLink to="/admin/etc/logs" style={navStyle}>로그 관리</NavLink></li>
          </ul>
        </div>
      </nav>
    </aside>
  );
};

const navStyle = ({ isActive }) => ({
  color: isActive ? '#1abc9c' : '#bdc3c7',
  textDecoration: 'none',
  display: 'block',
  padding: '0.3rem 0'
});

export default AdminSidebar;
