// 📁 src/pages/admin/admin_service/AdminUserList.js
import React, { useEffect, useState, useCallback } from 'react';
import axios from 'axios';
import styles from '../../../styles/admin/AdminUserList.module.css';

const AdminUserList = () => {
  const [users, setUsers] = useState([]);
  const [search, setSearch] = useState('');
  const [selectedRole, setSelectedRole] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);

  // 유저 목록 가져오기
  const fetchUsers = useCallback(async () => {
    try {
      setIsLoading(true);
      console.log('=== fetchUsers 시작 ===');
      
      let url = 'http://localhost:8080/api/admin/users';
      const params = new URLSearchParams();
      
      if (search.trim()) {
        params.append('search', search.trim());
      }
      
      if (selectedRole) {
        params.append('role', selectedRole);
      }
      
      if (params.toString()) {
        url += `?${params.toString()}`;
      }
      
      const response = await axios.get(url, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
          'Content-Type': 'application/json'
        },
        timeout: 10000
      });

      if (response.data.success) {
        setUsers(response.data.users || []);
        console.log('유저 목록 조회 완료:', response.data.users?.length || 0, '명');
      } else {
        console.error('유저 목록 조회 실패:', response.data.message);
        setUsers([]);
      }
      
    } catch (error) {
      console.error('=== fetchUsers 오류 ===');
      console.error('오류 메시지:', error.message);
      setUsers([]);
      
      if (error.response?.status === 401) {
        alert('로그인이 필요합니다. 다시 로그인해주세요.');
        window.location.href = '/login';
      }
    } finally {
      setIsLoading(false);
    }
  }, [search, selectedRole]);

  // 검색 핸들러
  const handleSearch = () => {
    console.log('유저 검색 실행:', search, '역할:', selectedRole);
    fetchUsers();
  };

  // Enter 키 검색 핸들러
  const handleSearchKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  // 역할 필터 변경 핸들러
  const handleRoleChange = (e) => {
    setSelectedRole(e.target.value);
  };

  // 필터 초기화 핸들러
  const handleResetFilters = () => {
    setSearch('');
    setSelectedRole('');
  };

  // 유저 상세 보기
  const handleUserClick = (user) => {
    setSelectedUser(user);
    setIsDetailModalOpen(true);
  };

  // 상세 모달 닫기
  const handleCloseDetailModal = () => {
    setIsDetailModalOpen(false);
    setSelectedUser(null);
  };

  // 유저 상태 변경 (활성화/비활성화)
  const handleToggleUserStatus = async (userId, currentStatus) => {
    const newStatus = currentStatus === 'ACTIVE' ? 'INACTIVE' : 'ACTIVE';
    const action = newStatus === 'ACTIVE' ? '활성화' : '비활성화';
    
    const confirmChange = window.confirm(
      `해당 유저를 ${action}하시겠습니까?`
    );

    if (!confirmChange) {
      return;
    }

    try {
      setIsLoading(true);
      
      const response = await axios.patch(`http://localhost:8080/api/admin/users/${userId}/status`, {
        status: newStatus
      }, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
          'Content-Type': 'application/json'
        }
      });

      if (response.status === 200) {
        alert(`유저가 성공적으로 ${action}되었습니다.`);
        fetchUsers(); // 목록 새로고침
      }

    } catch (error) {
      console.error('유저 상태 변경 실패:', error);
      alert(`유저 상태 변경에 실패했습니다: ${error.response?.data?.message || error.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  // 컴포넌트 마운트 시 데이터 로드
  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  return (
    <div style={{ padding: '1rem' }}>
      <div className={styles["admin-header"]}>
        <h2>👥 유저 관리</h2>
        <div className={styles["header-info"]}>
          <span className={`${styles["server-status"]} ${styles["online"]}`}>
            🟢 실시간 데이터 - 총 {users.length}명
          </span>
        </div>
      </div>

      {/* 필터 영역 */}
      <div className={styles["filter-section"]}>
        <div className={styles["filter-row"]}>
          <div className={styles["filter-group"]}>
            <label>역할</label>
            <select 
              value={selectedRole} 
              onChange={handleRoleChange}
              className={styles["role-filter"]}
            >
              <option value="">▼ 전체 보기</option>
              <option value="USER">👤 일반 사용자</option>
              <option value="CAREGIVER">👩‍⚕️ 요양사</option>
              <option value="COMPANY">🏢 기업</option>
              <option value="ADMIN">👑 관리자</option>
            </select>
          </div>
          
          <div className={styles["filter-group"]}>
            <label>검색</label>
            <div className={styles["search-container"]}>
              <input
                type="text"
                placeholder="이름, 이메일, 전화번호로 검색"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                onKeyPress={handleSearchKeyPress}
                className={styles["search-input"]}
              />
              <button 
                onClick={handleSearch} 
                className={styles["search-btn"]}
                disabled={isLoading}
              >
                {isLoading ? '🔄' : '🔍'} {isLoading ? '검색 중...' : '검색'}
              </button>
            </div>
          </div>

          <div className={styles["filter-group"]}>
            <button 
              onClick={handleResetFilters}
              className={styles["reset-btn"]}
            >
              🔄 초기화
            </button>
          </div>
        </div>
      </div>

      {/* 유저 목록 테이블 */}
      <div className={styles["table-container"]}>
        <table className={styles["user-table"]}>
          <thead>
            <tr>
              <th>ID</th>
              <th>이름</th>
              <th>이메일</th>
              <th>전화번호</th>
              <th>역할</th>
              <th>상태</th>
              <th>가입일</th>
              <th>관리</th>
            </tr>
          </thead>
          <tbody>
            {users.length > 0 ? (
              users.map(user => (
                <tr key={user.id} onClick={() => handleUserClick(user)} style={{ cursor: 'pointer' }}>
                  <td>{user.id}</td>
                  <td>{user.name || '미입력'}</td>
                  <td>{user.email}</td>
                  <td>{user.phone || '미입력'}</td>
                  <td>
                    <span className={`${styles["role-badge"]} ${styles[user.role?.toLowerCase() || 'user']}`}>
                      {user.role === 'USER' ? '👤 사용자' : 
                       user.role === 'CAREGIVER' ? '👩‍⚕️ 요양사' :
                       user.role === 'COMPANY' ? '🏢 기업' :
                       user.role === 'ADMIN' ? '👑 관리자' : user.role}
                    </span>
                  </td>
                  <td>
                    <span className={`${styles["status-badge"]} ${styles[user.status?.toLowerCase() || 'active']}`}>
                      {user.status === 'ACTIVE' ? '🟢 활성' : '🔴 비활성'}
                    </span>
                  </td>
                  <td>{user.createdAt ? new Date(user.createdAt).toLocaleDateString() : '미상'}</td>
                  <td>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleToggleUserStatus(user.id, user.status);
                      }}
                      className={`${styles["status-btn"]} ${user.status === 'ACTIVE' ? styles["deactivate"] : styles["activate"]}`}
                      disabled={isLoading}
                    >
                      {user.status === 'ACTIVE' ? '비활성화' : '활성화'}
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="8" style={{ textAlign: 'center', padding: '2rem', color: '#666' }}>
                  {isLoading ? '로딩 중...' : '유저가 없습니다.'}
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* 유저 상세 모달 */}
      {isDetailModalOpen && selectedUser && (
        <div className={styles["modal-backdrop"]} onClick={handleCloseDetailModal}>
          <div className={styles["modal-content"]} onClick={(e) => e.stopPropagation()}>
            <div className={styles["modal-header"]}>
              <h3>👤 유저 상세 정보</h3>
              <button onClick={handleCloseDetailModal} className={styles["close-btn"]}>✕</button>
            </div>
            
            <div className={styles["modal-body"]}>
              <div className={styles["detail-grid"]}>
                <div className={styles["detail-item"]}>
                  <strong>ID:</strong> {selectedUser.id}
                </div>
                <div className={styles["detail-item"]}>
                  <strong>이름:</strong> {selectedUser.name || '미입력'}
                </div>
                <div className={styles["detail-item"]}>
                  <strong>이메일:</strong> {selectedUser.email}
                </div>
                <div className={styles["detail-item"]}>
                  <strong>전화번호:</strong> {selectedUser.phone || '미입력'}
                </div>
                <div className={styles["detail-item"]}>
                  <strong>역할:</strong> 
                  <span className={`${styles["role-badge"]} ${styles[selectedUser.role?.toLowerCase() || 'user']}`}>
                    {selectedUser.role === 'USER' ? '👤 사용자' : 
                     selectedUser.role === 'CAREGIVER' ? '👩‍⚕️ 요양사' :
                     selectedUser.role === 'COMPANY' ? '🏢 기업' :
                     selectedUser.role === 'ADMIN' ? '👑 관리자' : selectedUser.role}
                  </span>
                </div>
                <div className={styles["detail-item"]}>
                  <strong>상태:</strong>
                  <span className={`${styles["status-badge"]} ${styles[selectedUser.status?.toLowerCase() || 'active']}`}>
                    {selectedUser.status === 'ACTIVE' ? '🟢 활성' : '🔴 비활성'}
                  </span>
                </div>
                <div className={styles["detail-item"]}>
                  <strong>가입일:</strong> {selectedUser.createdAt ? new Date(selectedUser.createdAt).toLocaleString() : '미상'}
                </div>
                <div className={styles["detail-item"]}>
                  <strong>최근 로그인:</strong> {selectedUser.lastLoginAt ? new Date(selectedUser.lastLoginAt).toLocaleString() : '없음'}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminUserList; 