import React, { useEffect, useState, useCallback } from 'react';
import axios from 'axios';
import styles from '../../../styles/admin/AdminReservationList.module.css';

const AdminReservationList = () => {
  const [reservations, setReservations] = useState([]);
  const [search, setSearch] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [selectedReservation, setSelectedReservation] = useState(null);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  
  // 페이지네이션 상태
  const [currentPage, setCurrentPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [totalElements, setTotalElements] = useState(0);
  const [pageSize, setPageSize] = useState(10);

  // 예약 목록 가져오기
  const fetchReservations = useCallback(async () => {
    try {
      setIsLoading(true);
      console.log('=== fetchReservations 시작 ===');
      
      let url = 'http://localhost:8080/api/admin/reservations';
      const params = new URLSearchParams();
      
      // 페이지네이션 파라미터 추가
      params.append('page', currentPage.toString());
      params.append('size', pageSize.toString());
      
      if (search.trim()) {
        params.append('search', search.trim());
      }
      
      if (selectedStatus) {
        params.append('status', selectedStatus);
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
        const reservationData = response.data.data;
        setReservations(reservationData.reservations || []);
        setTotalPages(reservationData.totalPages || 0);
        setTotalElements(reservationData.totalElements || 0);
        console.log('예약 목록 조회 완료:', reservationData.reservations?.length || 0, '건');
        console.log('전체 예약 수:', reservationData.totalElements);
        console.log('총 페이지 수:', reservationData.totalPages);
        console.log('현재 페이지:', currentPage + 1);
      } else {
        console.error('예약 목록 조회 실패:', response.data.message);
        setReservations([]);
        setTotalPages(0);
        setTotalElements(0);
      }
      
    } catch (error) {
      console.error('=== fetchReservations 오류 ===');
      console.error('오류 메시지:', error.message);
      setReservations([]);
      
      if (error.response?.status === 401) {
        alert('로그인이 필요합니다. 다시 로그인해주세요.');
        window.location.href = '/login';
      }
    } finally {
      setIsLoading(false);
    }
  }, [search, selectedStatus, currentPage, pageSize]);

  // 검색 핸들러
  const handleSearch = () => {
    console.log('예약 검색 실행:', search, '상태:', selectedStatus);
    setCurrentPage(0); // 검색 시 첫 페이지로
  };

  // Enter 키 검색 핸들러
  const handleSearchKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  // 상태 필터 변경 핸들러
  const handleStatusChange = (e) => {
    setSelectedStatus(e.target.value);
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

  // 예약 상세 보기
  const handleReservationClick = (reservation) => {
    setSelectedReservation(reservation);
    setIsDetailModalOpen(true);
  };

  // 상세 모달 닫기
  const handleCloseDetailModal = () => {
    setIsDetailModalOpen(false);
    setSelectedReservation(null);
  };

  // 예약 상태 변경
  const handleUpdateReservationStatus = async (reservationId, newStatus) => {
    const statusLabels = {
      'PENDING': '대기중',
      'APPROVED': '승인됨',
      'REJECTED': '거절됨',
      'CANCELLED': '취소됨',
      'COMPLETED': '완료됨'
    };
    
    const confirmChange = window.confirm(
      `예약 상태를 "${statusLabels[newStatus]}"로 변경하시겠습니까?`
    );

    if (!confirmChange) {
      return;
    }

    try {
      setIsLoading(true);
      
      const response = await axios.patch(`http://localhost:8080/api/admin/reservations/${reservationId}/status`, {
        status: newStatus
      }, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
          'Content-Type': 'application/json'
        }
      });

      if (response.status === 200) {
        alert(`예약 상태가 성공적으로 "${statusLabels[newStatus]}"로 변경되었습니다.`);
        fetchReservations(); // 목록 새로고침
        handleCloseDetailModal(); // 모달 닫기
      }

    } catch (error) {
      console.error('예약 상태 변경 실패:', error);
      alert(`예약 상태 변경에 실패했습니다: ${error.response?.data?.message || error.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  // 날짜 포매팅 함수
  const formatDate = (dateString) => {
    if (!dateString) return '-';
    const date = new Date(dateString);
    return date.toLocaleDateString('ko-KR', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  // 가격 포매팅 함수
  const formatPrice = (price) => {
    if (!price) return '-';
    return new Intl.NumberFormat('ko-KR').format(price) + '원';
  };

  // 상태별 스타일 클래스 반환
  const getStatusClass = (status) => {
    switch (status) {
      case 'PENDING': return 'pending';
      case 'APPROVED': return 'approved';
      case 'REJECTED': return 'rejected';
      case 'CANCELLED': return 'cancelled';
      case 'COMPLETED': return 'completed';
      default: return 'pending';
    }
  };

  // 상태별 한글 라벨 반환
  const getStatusLabel = (status) => {
    switch (status) {
      case 'PENDING': return '대기중';
      case 'APPROVED': return '승인됨';
      case 'REJECTED': return '거절됨';
      case 'CANCELLED': return '취소됨';
      case 'COMPLETED': return '완료됨';
      default: return status;
    }
  };

  // 컴포넌트 마운트 시 데이터 로드
  useEffect(() => {
    fetchReservations();
  }, [fetchReservations]);

  // 페이지 번호 배열 생성
  const getPageNumbers = () => {
    const pages = [];
    const maxVisible = 5;
    let start = Math.max(0, currentPage - Math.floor(maxVisible / 2));
    let end = Math.min(totalPages - 1, start + maxVisible - 1);
    
    if (end - start + 1 < maxVisible) {
      start = Math.max(0, end - maxVisible + 1);
    }
    
    for (let i = start; i <= end; i++) {
      pages.push(i);
    }
    return pages;
  };

  return (
    <div className={styles["reservation-list-container"]}>
      <div className={styles["admin-header"]}>
        <h2>📋 예약 관리</h2>
        <div className={styles["header-info"]}>
          <span className={`${styles["server-status"]} ${styles["online"]}`}>
            🟢 실시간 데이터 - 총 {totalElements}건 (페이지 {currentPage + 1}/{totalPages})
          </span>
        </div>
      </div>

      {/* 필터 영역 */}
      <div className={styles["filter-section"]}>
        <div className={styles["filter-row"]}>
          <div className={styles["filter-group"]}>
            <label>예약 상태</label>
            <select
              className={styles["status-filter"]}
              value={selectedStatus}
              onChange={handleStatusChange}
            >
              <option value="">▼ 전체 보기</option>
              <option value="PENDING">대기중</option>
              <option value="APPROVED">승인됨</option>
              <option value="REJECTED">거절됨</option>
              <option value="CANCELLED">취소됨</option>
              <option value="COMPLETED">완료됨</option>
            </select>
          </div>

          <div className={styles["filter-group"]}>
            <label>검색</label>
            <div className={styles["search-container"]}>
              <input
                type="text"
                className={styles["search-input"]}
                placeholder="예약자명, 상품명 검색..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                onKeyPress={handleSearchKeyPress}
              />
              <button
                className={styles["search-btn"]}
                onClick={handleSearch}
                disabled={isLoading}
              >
                {isLoading ? '🔄' : '🔍'} {isLoading ? '검색 중...' : '검색'}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* 테이블 */}
      <div className={styles["table-container"]}>
        {isLoading ? (
          <div className={styles["loading-message"]}>
            <div className={styles["loading-spinner"]}></div>
            <p>예약 목록을 불러오는 중...</p>
          </div>
        ) : reservations.length === 0 ? (
          <div className={styles["empty-message"]}>
            <p>📝 조회된 예약이 없습니다.</p>
          </div>
        ) : (
          <table className={styles["reservation-table"]}>
            <thead>
              <tr>
                <th>예약번호</th>
                <th>예약자</th>
                <th>상품명</th>
                <th>상품타입</th>
                <th>예약일시</th>
                <th>수량</th>
                <th>금액</th>
                <th>상태</th>
                <th>등록일</th>
                <th>관리</th>
              </tr>
            </thead>
            <tbody>
              {reservations.map((reservation) => (
                <tr key={`reservation-${reservation.rsvId}`} onClick={() => handleReservationClick(reservation)}>
                  <td>{reservation.rsvId}</td>
                  <td>{reservation.memberName || reservation.memberId}</td>
                  <td className={styles["product-name"]}>{reservation.prodNm}</td>
                  <td>
                    <span className={styles["type-badge"]}>
                      {reservation.prodType}
                    </span>
                  </td>
                  <td>{formatDate(reservation.rsvDate)}</td>
                  <td>{reservation.rsvCnt}개</td>
                  <td className={styles["price"]}>{formatPrice(reservation.prodPrice)}</td>
                  <td>
                    <span className={`${styles["status-badge"]} ${styles[getStatusClass(reservation.status)]}`}>
                      {getStatusLabel(reservation.status)}
                    </span>
                  </td>
                  <td>{formatDate(reservation.createdAt)}</td>
                  <td>
                    <button
                      className={styles["detail-btn"]}
                      onClick={(e) => {
                        e.stopPropagation();
                        handleReservationClick(reservation);
                      }}
                    >
                      상세
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* 페이지네이션 */}
      {!isLoading && reservations.length > 0 && (
        <div className={styles["pagination-wrapper"]}>
          <div className={styles["pagination-info"]}>
            <span className={styles["showing-text"]}>
              {totalElements}건 중 {currentPage * pageSize + 1}-{Math.min((currentPage + 1) * pageSize, totalElements)}건 표시
            </span>
          </div>
          
          <div className={styles["pagination-center"]}>
            <button
              className={`${styles["pagination-btn"]} ${styles["nav-btn"]}`}
              onClick={handlePreviousPage}
              disabled={currentPage === 0}
            >
              ◀ 이전
            </button>

            <div className={styles["page-numbers"]}>
              {getPageNumbers().map((pageNum) => (
                <button
                  key={`page-${pageNum}`}
                  className={`${styles["page-btn"]} ${currentPage === pageNum ? styles["active"] : ""}`}
                  onClick={() => handlePageClick(pageNum)}
                >
                  {pageNum + 1}
                </button>
              ))}
            </div>

            <button
              className={`${styles["pagination-btn"]} ${styles["nav-btn"]}`}
              onClick={handleNextPage}
              disabled={currentPage >= totalPages - 1}
            >
              다음 ▶
            </button>
          </div>

          <div className={styles["pagination-controls"]}>
            <label className={styles["control-label"]}>페이지당 표시:</label>
            <select
              className={styles["page-size-select"]}
              value={pageSize}
              onChange={handlePageSizeChange}
            >
              <option value={5}>5개</option>
              <option value={10}>10개</option>
              <option value={20}>20개</option>
              <option value={50}>50개</option>
            </select>
          </div>
        </div>
      )}

      {/* 상세 모달 */}
      {isDetailModalOpen && selectedReservation && (
        <div className={styles["modal-backdrop"]} onClick={handleCloseDetailModal}>
          <div className={styles["modal-content"]} onClick={(e) => e.stopPropagation()}>
            <div className={styles["modal-header"]}>
              <h3>📋 예약 상세 정보</h3>
              <button className={styles["close-btn"]} onClick={handleCloseDetailModal}>
                ✕
              </button>
            </div>
            <div className={styles["modal-body"]}>
              <div className={styles["detail-grid"]}>
                <div className={styles["detail-item"]}>
                  <strong>예약번호:</strong>
                  <span>{selectedReservation.rsvId}</span>
                </div>
                <div className={styles["detail-item"]}>
                  <strong>예약자:</strong>
                  <span>{selectedReservation.memberName || selectedReservation.memberId}</span>
                </div>
                <div className={styles["detail-item"]}>
                  <strong>상품명:</strong>
                  <span>{selectedReservation.prodNm}</span>
                </div>
                <div className={styles["detail-item"]}>
                  <strong>상품타입:</strong>
                  <span>{selectedReservation.prodType}</span>
                </div>
                <div className={styles["detail-item"]}>
                  <strong>예약일시:</strong>
                  <span>{formatDate(selectedReservation.rsvDate)}</span>
                </div>
                <div className={styles["detail-item"]}>
                  <strong>수량:</strong>
                  <span>{selectedReservation.rsvCnt}개</span>
                </div>
                <div className={styles["detail-item"]}>
                  <strong>금액:</strong>
                  <span>{formatPrice(selectedReservation.prodPrice)}</span>
                </div>
                <div className={styles["detail-item"]}>
                  <strong>현재 상태:</strong>
                  <span className={`${styles["status-badge"]} ${styles[getStatusClass(selectedReservation.status)]}`}>
                    {getStatusLabel(selectedReservation.status)}
                  </span>
                </div>
                <div className={styles["detail-item"]}>
                  <strong>등록일:</strong>
                  <span>{formatDate(selectedReservation.createdAt)}</span>
                </div>
                {selectedReservation.prodDetail && (
                  <div className={styles["detail-item"]}>
                    <strong>상세정보:</strong>
                    <span>{selectedReservation.prodDetail}</span>
                  </div>
                )}
                {selectedReservation.requestMessage && (
                  <div className={styles["detail-item"]}>
                    <strong>요청사항:</strong>
                    <span>{selectedReservation.requestMessage}</span>
                  </div>
                )}
              </div>

              {/* 상태 변경 버튼들 */}
              <div className={styles["status-actions"]}>
                <h4>상태 변경</h4>
                <div className={styles["status-buttons"]}>
                  {selectedReservation.status !== 'APPROVED' && (
                    <button
                      className={`${styles["status-btn"]} ${styles["approve"]}`}
                      onClick={() => handleUpdateReservationStatus(selectedReservation.rsvId, 'APPROVED')}
                      disabled={isLoading}
                    >
                      ✅ 승인
                    </button>
                  )}
                  {selectedReservation.status !== 'REJECTED' && (
                    <button
                      className={`${styles["status-btn"]} ${styles["reject"]}`}
                      onClick={() => handleUpdateReservationStatus(selectedReservation.rsvId, 'REJECTED')}
                      disabled={isLoading}
                    >
                      ❌ 거절
                    </button>
                  )}
                  {selectedReservation.status !== 'CANCELLED' && (
                    <button
                      className={`${styles["status-btn"]} ${styles["cancel"]}`}
                      onClick={() => handleUpdateReservationStatus(selectedReservation.rsvId, 'CANCELLED')}
                      disabled={isLoading}
                    >
                      🚫 취소
                    </button>
                  )}
                  {selectedReservation.status !== 'COMPLETED' && (
                    <button
                      className={`${styles["status-btn"]} ${styles["complete"]}`}
                      onClick={() => handleUpdateReservationStatus(selectedReservation.rsvId, 'COMPLETED')}
                      disabled={isLoading}
                    >
                      ✅ 완료
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminReservationList; 