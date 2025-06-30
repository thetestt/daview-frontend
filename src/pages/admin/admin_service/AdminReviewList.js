import React, { useEffect, useState, useCallback } from 'react';
import axios from 'axios';
import styles from '../../../styles/admin/AdminReviewList.module.css';

const AdminReviewList = () => {
  const [reviews, setReviews] = useState([]);
  const [search, setSearch] = useState('');
  const [selectedStars, setSelectedStars] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [selectedReview, setSelectedReview] = useState(null);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  
  // 페이지네이션 상태 추가
  const [currentPage, setCurrentPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [totalElements, setTotalElements] = useState(0);
  const [pageSize, setPageSize] = useState(10);

  // 후기 목록 가져오기
  const fetchReviews = useCallback(async () => {
    try {
      setIsLoading(true);
      console.log('=== fetchReviews 시작 ===');
      
      let url = 'http://localhost:8080/api/admin/reviews';
      const params = new URLSearchParams();
      
      // 페이지네이션 파라미터 추가
      params.append('page', currentPage.toString());
      params.append('size', pageSize.toString());
      
      if (search.trim()) {
        params.append('search', search.trim());
      }
      
      if (selectedStars) {
        params.append('stars', selectedStars);
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
        const reviewData = response.data.data;
        setReviews(reviewData.reviews || []);
        setTotalPages(reviewData.totalPages || 0);
        setTotalElements(reviewData.totalElements || 0);
        console.log('후기 목록 조회 완료:', reviewData.reviews?.length || 0, '개');
        console.log('전체 후기 수:', reviewData.totalElements);
        console.log('총 페이지 수:', reviewData.totalPages);
        console.log('현재 페이지:', currentPage + 1);
      } else {
        console.error('후기 목록 조회 실패:', response.data.message);
        setReviews([]);
        setTotalPages(0);
        setTotalElements(0);
      }
      
    } catch (error) {
      console.error('=== fetchReviews 오류 ===');
      console.error('오류 메시지:', error.message);
      setReviews([]);
      
      if (error.response?.status === 401) {
        alert('로그인이 필요합니다. 다시 로그인해주세요.');
        window.location.href = '/login';
      }
    } finally {
      setIsLoading(false);
    }
  }, [search, selectedStars, currentPage, pageSize]);

  // 검색 핸들러
  const handleSearch = () => {
    console.log('후기 검색 실행:', search, '평점:', selectedStars);
    setCurrentPage(0); // 검색 시 첫 페이지로
  };

  // Enter 키 검색 핸들러
  const handleSearchKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  // 평점 필터 변경 핸들러
  const handleStarsChange = (e) => {
    setSelectedStars(e.target.value);
    setCurrentPage(0); // 필터 변경 시 첫 페이지로
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

  // 후기 상세 보기
  const handleReviewClick = (review) => {
    setSelectedReview(review);
    setIsDetailModalOpen(true);
  };

  // 상세 모달 닫기
  const handleCloseDetailModal = () => {
    setIsDetailModalOpen(false);
    setSelectedReview(null);
  };

  // 후기 삭제 처리
  const handleDeleteReview = async (reviewId) => {
    const confirmDelete = window.confirm(
      `이 후기를 정말 삭제하시겠습니까?\n\n삭제된 후기는 복구할 수 없습니다.`
    );

    if (!confirmDelete) {
      return;
    }

    try {
      setIsLoading(true);
      
      const response = await axios.delete(`http://localhost:8080/api/admin/reviews/${reviewId}`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
          'Content-Type': 'application/json'
        }
      });

      if (response.status === 200) {
        alert('후기가 성공적으로 삭제되었습니다.');
        fetchReviews(); // 목록 새로고침
      }

    } catch (error) {
      console.error('후기 삭제 실패:', error);
      alert(`후기 삭제에 실패했습니다: ${error.response?.data?.message || error.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  // 평점 별표 표시 함수
  const renderStars = (stars) => {
    return '★'.repeat(stars) + '☆'.repeat(5 - stars);
  };

  // 컴포넌트 마운트 시 데이터 로드
  useEffect(() => {
    fetchReviews();
  }, [fetchReviews]);

  return (
    <div className={styles["review-list-container"]}>
      <div className={styles["admin-header"]}>
        <h2>⭐ 후기 관리</h2>
        <div className={styles["header-info"]}>
          <span className={`${styles["server-status"]} ${styles["online"]}`}>
            🟢 실시간 데이터 - 총 {totalElements}개 (페이지 {currentPage + 1}/{totalPages})
          </span>
        </div>
      </div>

      {/* 필터 영역 */}
      <div className={styles["filter-section"]}>
        <div className={styles["filter-row"]}>
          <div className={styles["filter-group"]}>
            <label>평점</label>
            <select 
              value={selectedStars} 
              onChange={handleStarsChange}
              className={styles["stars-filter"]}
            >
              <option value="">▼ 전체 보기</option>
              <option value="5">⭐⭐⭐⭐⭐ 5점</option>
              <option value="4">⭐⭐⭐⭐☆ 4점</option>
              <option value="3">⭐⭐⭐☆☆ 3점</option>
              <option value="2">⭐⭐☆☆☆ 2점</option>
              <option value="1">⭐☆☆☆☆ 1점</option>
            </select>
          </div>
          
          <div className={styles["filter-group"]}>
            <label>검색</label>
            <div className={styles["search-container"]}>
              <input
                type="text"
                placeholder="작성자명, 상품명, 제목으로 검색"
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
        </div>
      </div>

      {/* 후기 목록 테이블 */}
      <div className={styles["table-container"]}>
        <table className={styles["review-table"]}>
          <thead>
            <tr>
              <th>후기ID</th>
              <th>작성자</th>
              <th>상품명</th>
              <th>제목</th>
              <th>평점</th>
              <th>조회수</th>
              <th>작성일</th>
              <th>관리</th>
            </tr>
          </thead>
          <tbody>
            {reviews.length > 0 ? (
              reviews.map((review, index) => (
                <tr key={`review-${review.revId || index}`} onClick={() => handleReviewClick(review)} style={{ cursor: 'pointer' }}>
                  <td>{review.revId}</td>
                  <td>{review.memberName || review.memberUsername || '탈퇴회원'}</td>
                  <td>{review.prodNm || '상품 정보 없음'}</td>
                  <td className={styles["title-cell"]}>
                    {review.revTtl?.length > 20 ? review.revTtl.substring(0, 20) + '...' : review.revTtl}
                  </td>
                  <td>
                    <span className={styles["stars-display"]}>
                      {renderStars(review.revStars)} ({review.revStars})
                    </span>
                  </td>
                  <td>{review.revViews || 0}</td>
                  <td>{review.revRegDate ? new Date(review.revRegDate).toLocaleDateString() : '미상'}</td>
                  <td>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDeleteReview(review.revId);
                      }}
                      className={`${styles["action-btn"]} ${styles["delete"]}`}
                      disabled={isLoading}
                    >
                      삭제
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="8" style={{ textAlign: 'center', padding: '2rem', color: '#666' }}>
                  {isLoading ? '로딩 중...' : '후기가 없습니다.'}
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
                    key={`page-${pageNum}`}
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

      {/* 후기 상세 모달 */}
      {isDetailModalOpen && selectedReview && (
        <div className={styles["modal-backdrop"]} onClick={handleCloseDetailModal}>
          <div className={styles["modal-content"]} onClick={(e) => e.stopPropagation()}>
            <div className={styles["modal-header"]}>
              <h3>⭐ 후기 상세 정보</h3>
              <button onClick={handleCloseDetailModal} className={styles["close-btn"]}>✕</button>
            </div>
            
            <div className={styles["modal-body"]}>
              <div className={styles["detail-grid"]}>
                <div className={styles["detail-item"]}>
                  <strong>후기 ID:</strong> {selectedReview.revId}
                </div>
                <div className={styles["detail-item"]}>
                  <strong>작성자:</strong> {selectedReview.memberName || selectedReview.memberUsername || '탈퇴회원'}
                </div>
                <div className={styles["detail-item"]}>
                  <strong>상품명:</strong> {selectedReview.prodNm || '상품 정보 없음'}
                </div>
                <div className={styles["detail-item"]}>
                  <strong>제목:</strong> {selectedReview.revTtl}
                </div>
                <div className={styles["detail-item"]}>
                  <strong>평점:</strong>
                  <span className={styles["stars-display"]}>
                    {renderStars(selectedReview.revStars)} ({selectedReview.revStars}점)
                  </span>
                </div>
                <div className={styles["detail-item"]}>
                  <strong>조회수:</strong> {selectedReview.revViews || 0}회
                </div>
                <div className={styles["detail-item"]}>
                  <strong>작성일:</strong> {selectedReview.revRegDate ? new Date(selectedReview.revRegDate).toLocaleString() : '미상'}
                </div>
                <div className={styles["detail-item"]} style={{ gridColumn: '1 / -1' }}>
                  <strong>내용:</strong>
                  <div className={styles["review-content"]}>
                    {selectedReview.revCont || '내용이 없습니다.'}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminReviewList; 