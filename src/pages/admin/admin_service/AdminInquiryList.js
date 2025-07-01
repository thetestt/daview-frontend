import React, { useState, useEffect } from 'react';
import styles from '../../../styles/admin/AdminInquiryList.module.css';

const AdminInquiryList = () => {
  const [inquiries, setInquiries] = useState([]);
  const [loading, setLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(0);
  const [pageSize, setPageSize] = useState(10);
  const [totalElements, setTotalElements] = useState(0);
  const [searchKeyword, setSearchKeyword] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [selectedInquiry, setSelectedInquiry] = useState(null);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [showReplyModal, setShowReplyModal] = useState(false);
  const [replyContent, setReplyContent] = useState('');

  // 상태 옵션
  const statusOptions = [
    { value: 'all', label: '전체' },
    { value: 'pending', label: '대기중' },
    { value: 'processing', label: '처리중' },
    { value: 'completed', label: '완료' },
    { value: 'closed', label: '닫힘' }
  ];

  // 임시 데이터 (백엔드 API 연동 전)
  const sampleInquiries = [
    {
      id: 1,
      title: '서비스 이용 관련 문의',
      memberName: '김철수',
      category: '이용문의',
      status: 'pending',
      createdAt: '2025-01-01T10:30:00',
      content: '서비스 이용 중 문제가 발생했습니다.',
      reply: null,
      repliedAt: null
    },
    {
      id: 2,
      title: '결제 취소 요청',
      memberName: '이영희',
      category: '결제',
      status: 'completed',
      createdAt: '2024-12-30T14:20:00',
      content: '결제 취소를 원합니다.',
      reply: '결제 취소가 완료되었습니다.',
      repliedAt: '2024-12-31T09:15:00'
    }
  ];

  // 문의 목록 로드 (임시)
  const loadInquiries = async () => {
    setLoading(true);
    try {
      // 임시로 샘플 데이터 사용
      setTimeout(() => {
        setInquiries(sampleInquiries);
        setTotalElements(sampleInquiries.length);
        setLoading(false);
      }, 500);
    } catch (error) {
      console.error('문의 목록 로드 실패:', error);
      setLoading(false);
    }
  };

  // 검색
  const handleSearch = () => {
    setCurrentPage(0);
    loadInquiries();
  };

  // 상태 변경
  const handleStatusChange = async (inquiryId, newStatus) => {
    try {
      const response = await fetch(`/api/admin/inquiries/${inquiryId}/status`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ status: newStatus })
      });

      if (response.ok) {
        alert('상태가 변경되었습니다.');
        loadInquiries();
        if (selectedInquiry && selectedInquiry.id === inquiryId) {
          setSelectedInquiry({ ...selectedInquiry, status: newStatus });
        }
      } else {
        throw new Error('상태 변경 실패');
      }
    } catch (error) {
      console.error('상태 변경 실패:', error);
      alert('상태 변경에 실패했습니다.');
    }
  };

  // 답변 작성
  const handleReply = async () => {
    if (!replyContent.trim()) {
      alert('답변 내용을 입력해주세요.');
      return;
    }

    try {
      const response = await fetch(`/api/admin/inquiries/${selectedInquiry.id}/reply`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ content: replyContent })
      });

      if (response.ok) {
        alert('답변이 등록되었습니다.');
        setReplyContent('');
        setShowReplyModal(false);
        loadInquiries();
        
        // 상세 정보 새로고침
        if (selectedInquiry) {
          handleViewDetail(selectedInquiry);
        }
      } else {
        throw new Error('답변 등록 실패');
      }
    } catch (error) {
      console.error('답변 등록 실패:', error);
      alert('답변 등록에 실패했습니다.');
    }
  };

  // 상세 보기
  const handleViewDetail = (inquiry) => {
    setSelectedInquiry(inquiry);
    setShowDetailModal(true);
  };

  // 페이지 변경
  const handlePageChange = (newPage) => {
    setCurrentPage(newPage);
  };

  // 페이지 크기 변경
  const handlePageSizeChange = (newSize) => {
    setPageSize(parseInt(newSize));
    setCurrentPage(0);
  };

  // 상태 배지 스타일
  const getStatusBadge = (status) => {
    const statusConfig = {
      pending: { class: 'pending', text: '대기중' },
      processing: { class: 'processing', text: '처리중' },
      completed: { class: 'completed', text: '완료' },
      closed: { class: 'closed', text: '닫힘' }
    };
    
    const config = statusConfig[status] || { class: 'pending', text: '알수없음' };
    return <span className={`${styles['status-badge']} ${styles[config.class]}`}>{config.text}</span>;
  };

  // 날짜 포맷
  const formatDate = (dateString) => {
    if (!dateString) return '-';
    return new Date(dateString).toLocaleString('ko-KR');
  };

  // 페이지네이션 계산
  const totalPages = Math.ceil(totalElements / pageSize);

  useEffect(() => {
    loadInquiries();
  }, [currentPage, pageSize]);

  return (
    <div className={styles['inquiry-list-container']}>
      {/* 헤더 */}
      <div className={styles['admin-header']}>
        <h2>💬 1:1 문의관리</h2>
        <div className={styles['header-info']}>
          <div className={styles['total-count']}>
            총 {totalElements}건의 문의
          </div>
        </div>
      </div>

      {/* 필터 섹션 */}
      <div className={styles['filter-section']}>
        <div className={styles['filter-row']}>
          <div className={styles['filter-group']}>
            <label>상태</label>
            <select 
              className={styles['status-filter']}
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
            >
              {statusOptions.map(option => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>
          
          <div className={styles['filter-group']}>
            <label>검색</label>
            <div className={styles['search-container']}>
              <input
                type="text"
                className={styles['search-input']}
                placeholder="제목, 작성자, 내용으로 검색"
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
        </div>
      </div>

      {/* 테이블 */}
      <div className={styles['table-container']}>
        <table className={styles['inquiry-table']}>
          <thead>
            <tr>
              <th>번호</th>
              <th>제목</th>
              <th>작성자</th>
              <th>문의유형</th>
              <th>상태</th>
              <th>작성일</th>
              <th>답변일</th>
              <th>관리</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan="8" className={styles['loading-cell']}>
                  <div className={styles['loading-spinner']}>데이터를 불러오는 중...</div>
                </td>
              </tr>
            ) : inquiries.length === 0 ? (
              <tr>
                <td colSpan="8" className={styles['empty-cell']}>
                  문의 내역이 없습니다.
                </td>
              </tr>
            ) : (
              inquiries.map((inquiry, index) => (
                <tr key={`inquiry-${inquiry.id || index}`}>
                  <td>{inquiry.id}</td>
                  <td className={styles['title-cell']}>
                    <span 
                      className={styles['inquiry-title']}
                      onClick={() => handleViewDetail(inquiry)}
                    >
                      {inquiry.title}
                    </span>
                  </td>
                  <td>{inquiry.memberName || '-'}</td>
                  <td>{inquiry.category || '일반'}</td>
                  <td>{getStatusBadge(inquiry.status)}</td>
                  <td>{formatDate(inquiry.createdAt)}</td>
                  <td>{inquiry.repliedAt ? formatDate(inquiry.repliedAt) : '-'}</td>
                  <td>
                    <button
                      className={styles['view-btn']}
                      onClick={() => handleViewDetail(inquiry)}
                    >
                      상세보기
                    </button>
                  </td>
                </tr>
              ))
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
              총 {currentPage * pageSize + 1}-{Math.min((currentPage + 1) * pageSize, totalElements)}개 표시
            </span>
          )}
        </div>

        {/* 중앙: 페이지 버튼들 */}
        {totalPages > 1 && (
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
                    key={`inquiry-page-${pageNum}`}
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
        )}

        {/* 오른쪽: 페이지당 표시 개수 선택 */}
        <div className={styles["pagination-controls"]}>
          <span className={styles["control-label"]}>페이지당 표시</span>
          <select 
            value={pageSize} 
            onChange={(e) => handlePageSizeChange(e.target.value)}
            className={styles["page-size-select"]}
          >
            <option value={10}>10개</option>
            <option value={20}>20개</option>
            <option value={50}>50개</option>
          </select>
        </div>
      </div>

      {/* 상세 정보 모달 */}
      {showDetailModal && selectedInquiry && (
        <div className={styles['modal-backdrop']} onClick={() => setShowDetailModal(false)}>
          <div className={styles['modal-content']} onClick={(e) => e.stopPropagation()}>
            <div className={styles['modal-header']}>
              <h3>문의 상세 정보</h3>
              <button 
                className={styles['modal-close']}
                onClick={() => setShowDetailModal(false)}
              >
                ×
              </button>
            </div>
            
            <div className={styles['modal-body']}>
              <div className={styles['detail-section']}>
                <h4>기본 정보</h4>
                <div className={styles['detail-grid']}>
                  <div className={styles['detail-item']}>
                    <label>문의 번호:</label>
                    <span>{selectedInquiry.id}</span>
                  </div>
                  <div className={styles['detail-item']}>
                    <label>제목:</label>
                    <span>{selectedInquiry.title}</span>
                  </div>
                  <div className={styles['detail-item']}>
                    <label>작성자:</label>
                    <span>{selectedInquiry.memberName}</span>
                  </div>
                  <div className={styles['detail-item']}>
                    <label>문의유형:</label>
                    <span>{selectedInquiry.category || '일반'}</span>
                  </div>
                  <div className={styles['detail-item']}>
                    <label>상태:</label>
                    <span>{getStatusBadge(selectedInquiry.status)}</span>
                  </div>
                  <div className={styles['detail-item']}>
                    <label>작성일:</label>
                    <span>{formatDate(selectedInquiry.createdAt)}</span>
                  </div>
                </div>
              </div>

              <div className={styles['detail-section']}>
                <h4>문의 내용</h4>
                <div className={styles['content-area']}>
                  {selectedInquiry.content}
                </div>
              </div>

              {selectedInquiry.reply && (
                <div className={styles['detail-section']}>
                  <h4>답변 내용</h4>
                  <div className={styles['reply-area']}>
                    <div className={styles['reply-meta']}>
                      답변일: {formatDate(selectedInquiry.repliedAt)}
                    </div>
                    <div className={styles['reply-content']}>
                      {selectedInquiry.reply}
                    </div>
                  </div>
                </div>
              )}
            </div>

            <div className={styles['modal-footer']}>
              <div className={styles['action-buttons']}>
                <div className={styles['status-change-section']}>
                  <label>상태 변경:</label>
                  <select 
                    className={styles['status-select']}
                    value={selectedInquiry.status}
                    onChange={(e) => handleStatusChange(selectedInquiry.id, e.target.value)}
                  >
                    {statusOptions.filter(option => option.value !== 'all').map(option => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                </div>
                
                {!selectedInquiry.reply && (
                  <button 
                    className={styles['reply-btn']}
                    onClick={() => setShowReplyModal(true)}
                  >
                    답변하기
                  </button>
                )}
                
                <button 
                  className={styles['close-btn']}
                  onClick={() => setShowDetailModal(false)}
                >
                  닫기
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 답변 작성 모달 */}
      {showReplyModal && (
        <div className={styles['modal-backdrop']} onClick={() => setShowReplyModal(false)}>
          <div className={styles['reply-modal-content']} onClick={(e) => e.stopPropagation()}>
            <div className={styles['modal-header']}>
              <h3>답변 작성</h3>
              <button 
                className={styles['modal-close']}
                onClick={() => setShowReplyModal(false)}
              >
                ×
              </button>
            </div>
            
            <div className={styles['modal-body']}>
              <div className={styles['reply-form']}>
                <label>답변 내용</label>
                <textarea
                  className={styles['reply-textarea']}
                  value={replyContent}
                  onChange={(e) => setReplyContent(e.target.value)}
                  placeholder="답변 내용을 입력해주세요..."
                  rows={10}
                />
              </div>
            </div>

            <div className={styles['modal-footer']}>
              <button 
                className={styles['submit-btn']}
                onClick={handleReply}
                disabled={!replyContent.trim()}
              >
                답변 등록
              </button>
              <button 
                className={styles['cancel-btn']}
                onClick={() => setShowReplyModal(false)}
              >
                취소
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminInquiryList; 