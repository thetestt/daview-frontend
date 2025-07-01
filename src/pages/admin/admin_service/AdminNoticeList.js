import React, { useState, useEffect } from 'react';
import styles from '../../../styles/admin/AdminNoticeList.module.css';

const AdminNoticeList = () => {
  const [notices, setNotices] = useState([]);
  const [loading, setLoading] = useState(false);
  const [totalElements, setTotalElements] = useState(0);
  const [currentPage, setCurrentPage] = useState(0);
  const [pageSize, setPageSize] = useState(20);
  const [searchKeyword, setSearchKeyword] = useState('');
  const [selectedNotice, setSelectedNotice] = useState(null);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [formData, setFormData] = useState({ title: '', content: '' });

  // 데이터 로드
  const loadNotices = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({
        page: currentPage,
        size: pageSize,
        search: searchKeyword || ''
      });

      const response = await fetch(`/api/admin/notices?${params}`);
      const data = await response.json();
      
      setNotices(data.content || []);
      setTotalElements(data.totalElements || 0);
    } catch (error) {
      console.error('공지사항 목록 로드 실패:', error);
      setNotices([]);
    } finally {
      setLoading(false);
    }
  };

  // 검색 실행
  const handleSearch = () => {
    setCurrentPage(0);
    loadNotices();
  };

  // 상세 보기
  const handleViewDetail = async (notice) => {
    try {
      const response = await fetch(`/api/admin/notices/${notice.id}`);
      const data = await response.json();
      setSelectedNotice(data.notice);
      setShowDetailModal(true);
    } catch (error) {
      console.error('상세 정보 로드 실패:', error);
      alert('상세 정보를 불러올 수 없습니다.');
    }
  };

  // 새 공지사항 등록
  const handleCreate = async () => {
    if (!formData.title.trim() || !formData.content.trim()) {
      alert('제목과 내용을 모두 입력해주세요.');
      return;
    }

    try {
      const response = await fetch('/api/admin/notices', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });

      if (response.ok) {
        setShowCreateModal(false);
        setFormData({ title: '', content: '' });
        loadNotices();
        alert('공지사항이 등록되었습니다.');
      } else {
        alert('등록에 실패했습니다.');
      }
    } catch (error) {
      console.error('등록 실패:', error);
      alert('등록 중 오류가 발생했습니다.');
    }
  };

  // 공지사항 수정
  const handleEdit = async () => {
    if (!formData.title.trim() || !formData.content.trim()) {
      alert('제목과 내용을 모두 입력해주세요.');
      return;
    }

    try {
      const response = await fetch(`/api/admin/notices/${selectedNotice.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });

      if (response.ok) {
        setShowEditModal(false);
        setShowDetailModal(false);
        setFormData({ title: '', content: '' });
        loadNotices();
        alert('공지사항이 수정되었습니다.');
      } else {
        alert('수정에 실패했습니다.');
      }
    } catch (error) {
      console.error('수정 실패:', error);
      alert('수정 중 오류가 발생했습니다.');
    }
  };

  // 공지사항 삭제
  const handleDelete = async (id) => {
    if (!window.confirm('정말 삭제하시겠습니까?')) {
      return;
    }

    try {
      const response = await fetch(`/api/admin/notices/${id}`, {
        method: 'DELETE'
      });

      if (response.ok) {
        loadNotices();
        setShowDetailModal(false);
        alert('공지사항이 삭제되었습니다.');
      } else {
        alert('삭제에 실패했습니다.');
      }
    } catch (error) {
      console.error('삭제 실패:', error);
      alert('삭제 중 오류가 발생했습니다.');
    }
  };

  // 수정 모달 열기
  const openEditModal = (notice) => {
    setFormData({ title: notice.title, content: notice.content });
    setShowDetailModal(false);
    setShowEditModal(true);
  };

  // 페이지 변경
  const handlePageChange = (newPage) => {
    setCurrentPage(newPage);
  };

  // 날짜 포맷
  const formatDate = (dateString) => {
    if (!dateString) return '-';
    return new Date(dateString).toLocaleString('ko-KR');
  };

  // 페이지네이션 계산
  const totalPages = Math.ceil(totalElements / pageSize);

  useEffect(() => {
    loadNotices();
  }, [currentPage, pageSize]);

  return (
    <div className={styles['notice-list-container']}>
      {/* 헤더 */}
      <div className={styles['admin-header']}>
        <h2>📢 공지사항 관리</h2>
        <div className={styles['header-info']}>
          <div className={styles['total-count']}>
            총 {totalElements}개의 공지사항
          </div>
          <button 
            className={styles['create-btn']}
            onClick={() => setShowCreateModal(true)}
          >
            ➕ 새 공지사항
          </button>
        </div>
      </div>

      {/* 검색 섹션 */}
      <div className={styles['search-section']}>
        <div className={styles['search-container']}>
          <input
            type="text"
            className={styles['search-input']}
            placeholder="제목 또는 내용으로 검색"
            value={searchKeyword}
            onChange={(e) => setSearchKeyword(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
          />
          <button 
            className={styles['search-btn']}
            onClick={handleSearch}
            disabled={loading}
          >
            {loading ? '🔄' : '🔍'} {loading ? '검색 중...' : '검색'}
          </button>
        </div>
      </div>

      {/* 테이블 */}
      <div className={styles['table-container']}>
        <table className={styles['notice-table']}>
          <thead>
            <tr>
              <th>번호</th>
              <th>제목</th>
              <th>내용 미리보기</th>
              <th>작성일</th>
              <th>관리</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan="5" className={styles['loading-cell']}>
                  <div className={styles['loading-spinner']}>데이터를 불러오는 중...</div>
                </td>
              </tr>
            ) : notices.length === 0 ? (
              <tr>
                <td colSpan="5" className={styles['empty-cell']}>
                  공지사항이 없습니다.
                </td>
              </tr>
            ) : (
              notices.map((notice, index) => (
                <tr key={notice.id}>
                  <td className={styles['notice-id']}>
                    {totalElements - (currentPage * pageSize + index)}
                  </td>
                  <td className={styles['title']}>{notice.title}</td>
                  <td className={styles['content-preview']}>
                    {notice.content ? notice.content.substring(0, 50) + '...' : '-'}
                  </td>
                  <td>{notice.createdAtString || formatDate(notice.createdAt)}</td>
                  <td>
                    <button
                      className={styles['view-btn']}
                      onClick={() => handleViewDetail(notice)}
                    >
                      상세보기
                    </button>
                    <button
                      className={styles['delete-btn']}
                      onClick={() => handleDelete(notice.id)}
                    >
                      삭제
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* 페이지네이션 */}
      {totalPages > 1 && (
        <div className={styles["pagination-wrapper"]}>
          <div className={styles["pagination-center"]}>
            <button 
              onClick={() => handlePageChange(Math.max(0, currentPage - 1))}
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
                    onClick={() => handlePageChange(pageNum)}
                    className={`${styles["page-btn"]} ${pageNum === currentPage ? styles["active"] : ''}`}
                  >
                    {pageNum + 1}
                  </button>
                );
              })}
            </div>
            
            <button 
              onClick={() => handlePageChange(Math.min(totalPages - 1, currentPage + 1))}
              disabled={currentPage >= totalPages - 1}
              className={`${styles["pagination-btn"]} ${styles["nav-btn"]}`}
            >
              다음 ▶
            </button>
          </div>
        </div>
      )}

      {/* 상세보기 모달 */}
      {showDetailModal && selectedNotice && (
        <div className={styles['modal-backdrop']} onClick={() => setShowDetailModal(false)}>
          <div className={styles['modal-content']} onClick={(e) => e.stopPropagation()}>
            <div className={styles['modal-header']}>
              <h3>공지사항 상세</h3>
              <button onClick={() => setShowDetailModal(false)}>×</button>
            </div>
            <div className={styles['modal-body']}>
              <div className={styles['detail-item']}>
                <strong>제목:</strong>
                <p>{selectedNotice.title}</p>
              </div>
              <div className={styles['detail-item']}>
                <strong>내용:</strong>
                <div className={styles['content-display']}>
                  {selectedNotice.content}
                </div>
              </div>
              <div className={styles['detail-item']}>
                <strong>작성일:</strong>
                <p>{selectedNotice.createdAtString || formatDate(selectedNotice.createdAt)}</p>
              </div>
            </div>
            <div className={styles['modal-footer']}>
              <button 
                className={styles['edit-btn']}
                onClick={() => openEditModal(selectedNotice)}
              >
                수정
              </button>
              <button 
                className={styles['delete-btn']}
                onClick={() => handleDelete(selectedNotice.id)}
              >
                삭제
              </button>
              <button onClick={() => setShowDetailModal(false)}>닫기</button>
            </div>
          </div>
        </div>
      )}

      {/* 등록 모달 */}
      {showCreateModal && (
        <div className={styles['modal-backdrop']} onClick={() => setShowCreateModal(false)}>
          <div className={styles['modal-content']} onClick={(e) => e.stopPropagation()}>
            <div className={styles['modal-header']}>
              <h3>새 공지사항 등록</h3>
              <button onClick={() => setShowCreateModal(false)}>×</button>
            </div>
            <div className={styles['modal-body']}>
              <div className={styles['form-group']}>
                <label>제목:</label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) => setFormData({...formData, title: e.target.value})}
                  placeholder="공지사항 제목을 입력하세요"
                />
              </div>
              <div className={styles['form-group']}>
                <label>내용:</label>
                <textarea
                  value={formData.content}
                  onChange={(e) => setFormData({...formData, content: e.target.value})}
                  placeholder="공지사항 내용을 입력하세요"
                  rows="10"
                />
              </div>
            </div>
            <div className={styles['modal-footer']}>
              <button className={styles['submit-btn']} onClick={handleCreate}>
                등록
              </button>
              <button onClick={() => setShowCreateModal(false)}>취소</button>
            </div>
          </div>
        </div>
      )}

      {/* 수정 모달 */}
      {showEditModal && (
        <div className={styles['modal-backdrop']} onClick={() => setShowEditModal(false)}>
          <div className={styles['modal-content']} onClick={(e) => e.stopPropagation()}>
            <div className={styles['modal-header']}>
              <h3>공지사항 수정</h3>
              <button onClick={() => setShowEditModal(false)}>×</button>
            </div>
            <div className={styles['modal-body']}>
              <div className={styles['form-group']}>
                <label>제목:</label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) => setFormData({...formData, title: e.target.value})}
                />
              </div>
              <div className={styles['form-group']}>
                <label>내용:</label>
                <textarea
                  value={formData.content}
                  onChange={(e) => setFormData({...formData, content: e.target.value})}
                  rows="10"
                />
              </div>
            </div>
            <div className={styles['modal-footer']}>
              <button className={styles['submit-btn']} onClick={handleEdit}>
                수정
              </button>
              <button onClick={() => setShowEditModal(false)}>취소</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminNoticeList; 