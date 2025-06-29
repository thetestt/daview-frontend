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
  
  // 페이지네이션 상태 추가
  const [currentPage, setCurrentPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [totalElements, setTotalElements] = useState(0);
  const [pageSize, setPageSize] = useState(10);

  // 유저 목록 가져오기
  const fetchUsers = useCallback(async () => {
    try {
      setIsLoading(true);
      console.log('=== fetchUsers 시작 ===');
      
      let url = 'http://localhost:8080/api/admin/users';
      const params = new URLSearchParams();
      
      // 페이지네이션 파라미터 추가
      params.append('page', currentPage.toString());
      params.append('size', pageSize.toString());
      
      if (search.trim()) {
        params.append('search', search.trim());
      }
      
      if (selectedRole) {
        params.append('role', selectedRole);
      }
      
      url += `?${params.toString()}`;
      
      const response = await axios.get(url, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
          'Content-Type': 'application/json'
        },
        timeout: 10000
      });

      if (response.data.success) {
        const userData = response.data.data;
        setUsers(userData.users || []);
        setTotalPages(userData.totalPages || 0);
        setTotalElements(userData.totalElements || 0);
        console.log('유저 목록 조회 완료:', userData.users?.length || 0, '명');
        console.log('전체 유저 수:', userData.totalElements);
        console.log('총 페이지 수:', userData.totalPages);
        console.log('현재 페이지:', currentPage + 1);
      } else {
        console.error('유저 목록 조회 실패:', response.data.message);
        setUsers([]);
        setTotalPages(0);
        setTotalElements(0);
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
  }, [search, selectedRole, currentPage, pageSize]);

  // 검색 핸들러
  const handleSearch = () => {
    console.log('유저 검색 실행:', search, '역할:', selectedRole);
    setCurrentPage(0); // 검색 시 첫 페이지로
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
    setCurrentPage(0); // 필터 변경 시 첫 페이지로
  };

  // 필터 초기화 핸들러
  const handleResetFilters = () => {
    setSearch('');
    setSelectedRole('');
    setCurrentPage(0); // 초기화 시 첫 페이지로
  };

  // 페이지네이션 핸들러들
  const handlePreviousPage = () => {
    if (currentPage > 0) {
      setCurrentPage(currentPage - 1);
    }
  };

  const handleNextPage = () => {
    if (currentPage < totalPages - 1) {
      setCurrentPage(currentPage + 1);
    }
  };

  const handlePageClick = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  // 페이지 크기 변경 핸들러
  const handlePageSizeChange = (e) => {
    const newSize = parseInt(e.target.value);
    setPageSize(newSize);
    setCurrentPage(0); // 첫 페이지로 이동
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
    <div className={styles["user-list-container"]}>
      <div className={styles["admin-header"]}>
        <h2>👥 유저 관리</h2>
        <div className={styles["header-info"]}>
          <span className={`${styles["server-status"]} ${styles["online"]}`}>
            🟢 실시간 데이터 - 총 {totalElements}명 (페이지 {currentPage + 1}/{totalPages})
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
              users.map(user => {
                const userStatus = user.withdrawn === 0 ? 'ACTIVE' : 'INACTIVE';
                const statusText = userStatus === 'ACTIVE' ? '🟢 활성' : '🔴 비활성';
                
                return (
                  <tr key={user.memberId} onClick={() => handleUserClick(user)} style={{ cursor: 'pointer' }}>
                    <td>{user.memberId}</td>
                    <td>{user.name || '미입력'}</td>
                    <td>{user.email}</td>
                    <td>{user.phone || '미입력'}</td>
                    <td>
                      <span className={`${styles["role-badge"]} ${styles[user.role?.toLowerCase() || 'user']}`}>
                        {user.role === 'USER' ? '👤 사용자' : 
                         user.role === 'ADMIN' ? '👑 관리자' : user.role}
                      </span>
                    </td>
                    <td>
                      <span className={`${styles["status-badge"]} ${styles[userStatus?.toLowerCase() || 'active']}`}>
                        {statusText}
                      </span>
                    </td>
                    <td>{user.createAt ? new Date(user.createAt).toLocaleDateString() : '미상'}</td>
                    <td>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleToggleUserStatus(user.memberId, userStatus);
                        }}
                        className={`${styles["status-btn"]} ${userStatus === 'ACTIVE' ? styles["deactivate"] : styles["activate"]}`}
                        disabled={isLoading}
                      >
                        {userStatus === 'ACTIVE' ? '비활성화' : '활성화'}
                      </button>
                    </td>
                  </tr>
                );
              })
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

      {/* 페이지네이션 */}
      <div className={styles["pagination-wrapper"]}>
        {/* 왼쪽: 표시 개수 정보 */}
        <div className={styles["pagination-info"]}>
          {totalElements > 0 && (
            <span className={styles["showing-text"]}>
              테이블 총 {currentPage * pageSize + 1}-{Math.min((currentPage + 1) * pageSize, totalElements)}개 표시
            </span>
          )}
        </div>

        {/* 중앙: 페이지 버튼들 */}
        {totalPages > 1 && (
          <div className={styles["pagination-center"]}>
            <button 
              onClick={handlePreviousPage}
              disabled={currentPage === 0}
              className={`${styles["pagination-btn"]} ${styles["nav-btn"]}`}
            >
              ◀ 이전
            </button>
            
            <div className={styles["page-numbers"]}>
              {Array.from({ length: Math.min(totalPages, 5) }, (_, index) => {
                const startPage = Math.max(0, Math.min(currentPage - 2, totalPages - 5));
                const pageNum = startPage + index;
                
                if (pageNum >= totalPages) return null;
                
                return (
                  <button
                    key={pageNum}
                    onClick={() => handlePageClick(pageNum)}
                    className={`${styles["page-btn"]} ${pageNum === currentPage ? styles["active"] : ''}`}
                  >
                    {pageNum + 1}
                  </button>
                );
              })}
            </div>
            
            <button 
              onClick={handleNextPage}
              disabled={currentPage >= totalPages - 1}
              className={`${styles["pagination-btn"]} ${styles["nav-btn"]}`}
            >
              다음 ▶
            </button>
          </div>
        )}

        {/* 오른쪽: 페이지당 표시 개수 선택 */}
        <div className={styles["pagination-controls"]}>
          <span className={styles["control-label"]}>페이지당 표시</span>
          <select 
            value={pageSize} 
            onChange={handlePageSizeChange}
            className={styles["page-size-select"]}
          >
            <option value={5}>5개</option>
            <option value={10}>10개</option>
            <option value={20}>20개</option>
            <option value={50}>50개</option>
          </select>
        </div>
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
                  <strong>ID:</strong> {selectedUser.memberId}
                </div>
                <div className={styles["detail-item"]}>
                  <strong>사용자명:</strong> {selectedUser.username || '미입력'}
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
                     selectedUser.role === 'ADMIN' ? '👑 관리자' : selectedUser.role}
                  </span>
                </div>
                <div className={styles["detail-item"]}>
                  <strong>상태:</strong>
                  <span className={`${styles["status-badge"]} ${styles[(selectedUser.withdrawn === 0 ? 'active' : 'inactive')]}`}>
                    {selectedUser.withdrawn === 0 ? '🟢 활성' : '🔴 비활성'}
                  </span>
                </div>
                <div className={styles["detail-item"]}>
                  <strong>가입일:</strong> {selectedUser.createAt ? new Date(selectedUser.createAt).toLocaleString() : '미상'}
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