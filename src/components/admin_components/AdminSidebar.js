// 📁 src/components/admin_components/AdminSidebar.js
import React from 'react';
import { NavLink } from 'react-router-dom';
//import './AdminSidebar.css'; // (선택사항) 스타일 분리 시

const AdminSidebar = ({ isCollapsed }) => {

  return (
    <aside style={{ 
      width: isCollapsed ? '0px' : '220px', 
      background: '#2c3e50', 
      color: '#fff', 
      padding: isCollapsed ? '0' : '1rem',
      transition: 'all 0.3s ease',
      position: 'relative',
      minHeight: '100vh',
      height: 'auto',
      overflow: 'visible',
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
              <ul style={{ 
                listStyle: 'none', 
                paddingLeft: '1rem', 
                margin: '0.5rem 0',
                display: 'flex',
                flexDirection: 'column'
              }}>
                <li style={{ 
                  display: 'block', 
                  marginBottom: '8px', 
                  width: '100%',
                  clear: 'both'
                }}>
                  <NavLink to="/admin" style={navStyle}>관리자 홈</NavLink>
                </li>
              </ul>
            </div>

            <div style={{ marginTop: '1.5rem' }}>
              <strong style={{ fontSize: '14px', color: '#bdc3c7' }}>서비스 관리</strong>
              <ul style={{ 
                listStyle: 'none', 
                paddingLeft: '1rem', 
                margin: '0.5rem 0',
                display: 'flex',
                flexDirection: 'column'
              }}>
                <li style={{ 
                  display: 'block', 
                  marginBottom: '8px', 
                  width: '100%',
                  clear: 'both'
                }}>
                  <NavLink to="/admin/products" style={navStyle}>상품 관리</NavLink>
                </li>
                <li style={{ 
                  display: 'block', 
                  marginBottom: '8px', 
                  width: '100%',
                  clear: 'both'
                }}>
                  <NavLink to="/admin/users" style={navStyle}>유저 관리</NavLink>
                </li>
                <li style={{ 
                  display: 'block', 
                  marginBottom: '8px', 
                  width: '100%',
                  clear: 'both'
                }}>
                  <NavLink to="/admin/reservations" style={navStyle}>예약 관리</NavLink>
                </li>
                <li style={{ 
                  display: 'block', 
                  marginBottom: '8px', 
                  width: '100%',
                  clear: 'both'
                }}>
                  <NavLink to="/admin/payments" style={navStyle}>결제 관리</NavLink>
                </li>
                <li style={{ 
                  display: 'block', 
                  marginBottom: '8px', 
                  width: '100%',
                  clear: 'both'
                }}>
                  <NavLink to="/admin/reviews" style={navStyle}>후기 관리</NavLink>
                </li>
                <li style={{ 
                  display: 'block', 
                  marginBottom: '8px', 
                  width: '100%',
                  clear: 'both'
                }}>
                  <NavLink to="/admin/notices" style={navStyle}>공지사항 관리</NavLink>
                </li>
                <li style={{ 
                  display: 'block', 
                  marginBottom: '8px', 
                  width: '100%',
                  clear: 'both'
                }}>
                  <NavLink to="/admin/inquiries" style={navStyle}>1:1 문의관리</NavLink>
                </li>
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
  fontSize: '14px',
  width: '100%',
  whiteSpace: 'nowrap',
  float: 'none',
  clear: 'both',
  lineHeight: '1.5'
});

export default AdminSidebar;
