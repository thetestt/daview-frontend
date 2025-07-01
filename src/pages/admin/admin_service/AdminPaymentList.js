import React, { useState, useEffect } from 'react';
import styles from '../../../styles/admin/AdminPaymentList.module.css';

const AdminPaymentList = () => {
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(false);
  const [totalElements, setTotalElements] = useState(0);
  const [currentPage, setCurrentPage] = useState(0);
  const [pageSize, setPageSize] = useState(20);
  const [searchKeyword, setSearchKeyword] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [paymentMethods, setPaymentMethods] = useState([]);
  const [selectedPayment, setSelectedPayment] = useState(null);
  const [showDetailModal, setShowDetailModal] = useState(false);

  // 결제 상태 옵션 (실제 DB 값)
  const statusOptions = [
    { value: 'all', label: '전체 상태' },
    { value: 1, label: '결제 완료' },
    { value: 2, label: '결제 대기' },
    { value: 3, label: '결제 실패' },
    { value: 4, label: '결제 취소' },
    { value: 5, label: '환불 완료' }
  ];

  // 결제 상태 이름 매핑
  const getStatusName = (status) => {
    const statusMap = {
      1: '결제 완료',
      2: '결제 대기',
      3: '결제 실패',
      4: '결제 취소',
      5: '환불 완료'
    };
    return statusMap[status] || '알수없음';
  };

  // 결제 방법 목록 로드
  const loadPaymentMethods = async () => {
    try {
      const response = await fetch('/api/admin/payments/methods');
      const data = await response.json();
      setPaymentMethods(data || []);
    } catch (error) {
      console.error('결제 방법 목록 로드 실패:', error);
    }
  };

  // 데이터 로드
  const loadPayments = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({
        page: currentPage,
        size: pageSize,
        search: searchKeyword,
        status: statusFilter === 'all' ? '' : statusFilter
      });

      const response = await fetch(`/api/admin/payments?${params}`);
      const data = await response.json();
      
      setPayments(data.content || []);
      setTotalElements(data.totalElements || 0);
    } catch (error) {
      console.error('결제 목록 로드 실패:', error);
      setPayments([]);
    } finally {
      setLoading(false);
    }
  };

  // 검색 실행
  const handleSearch = () => {
    setCurrentPage(0);
    loadPayments();
  };



  // 결제 상태 변경
  const handleStatusChange = async (paymentId, newStatus) => {
    try {
      const response = await fetch(`/api/admin/payments/${paymentId}/status`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: parseInt(newStatus) })
      });

      if (response.ok) {
        loadPayments();
        setShowDetailModal(false);
        alert('결제 상태가 변경되었습니다.');
      } else {
        alert('상태 변경에 실패했습니다.');
      }
    } catch (error) {
      console.error('상태 변경 실패:', error);
      alert('상태 변경 중 오류가 발생했습니다.');
    }
  };

  // 상세 보기
  const handleViewDetail = async (payment) => {
    try {
      const response = await fetch(`/api/admin/payments/${payment.paymentId}`);
      const data = await response.json();
      setSelectedPayment(data.payment);
      setShowDetailModal(true);
    } catch (error) {
      console.error('상세 정보 로드 실패:', error);
      alert('상세 정보를 불러올 수 없습니다.');
    }
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
      1: { class: 'completed', text: '결제 완료' },
      2: { class: 'pending', text: '결제 대기' },
      3: { class: 'failed', text: '결제 실패' },
      4: { class: 'cancelled', text: '결제 취소' },
      5: { class: 'refunded', text: '환불 완료' }
    };
    
    const config = statusConfig[status] || { class: 'pending', text: '알수없음' };
    return <span className={`${styles['status-badge']} ${styles[config.class]}`}>{config.text}</span>;
  };

  // 날짜 포맷
  const formatDate = (dateString) => {
    if (!dateString) return '-';
    return new Date(dateString).toLocaleString('ko-KR');
  };

  // 금액 포맷
  const formatAmount = (amount) => {
    if (!amount) return '0원';
    return new Intl.NumberFormat('ko-KR').format(amount) + '원';
  };

  // 결제방법 포맷
  const formatPaymentMethod = (method) => {
    if (!method) return '-';
    
    // 결제방법 매핑
    const methodMap = {
      'card': '신용카드',
      '카드': '신용카드', 
      'PG2': 'PG결제',
      'bank': '계좌이체',
      'virtual': '가상계좌',
      'phone': '휴대폰',
      'samsung': '삼성페이',
      'kpay': '케이페이',
      'payco': '페이코',
      'lpay': '엘페이',
      'ssgpay': 'SSG페이',
      'tosspay': '토스페이',
      'cultureland': '문화상품권',
      'smartculture': '스마트문상',
      'happymoney': '해피머니'
    };
    
    return methodMap[method] || method;
  };

  // 페이지네이션 계산
  const totalPages = Math.ceil(totalElements / pageSize);
  const startPage = Math.floor(currentPage / 10) * 10;
  const endPage = Math.min(startPage + 9, totalPages - 1);

  useEffect(() => {
    loadPayments();
    loadPaymentMethods();
  }, [currentPage, pageSize]);

  return (
    <div className={styles['payment-list-container']}>
      {/* 헤더 */}
      <div className={styles['admin-header']}>
        <h2>💳 결제 관리</h2>
        <div className={styles['header-info']}>
          <div className={styles['total-count']}>
            총 {totalElements}건의 결제 내역
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
                placeholder="고객명, 결제ID, 상품명으로 검색"
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
        <table className={styles['payment-table']}>
          <thead>
            <tr>
              <th>결제ID</th>
              <th>PG결제ID</th>
              <th>주문번호</th>
              <th>회원ID</th>
              <th>고객명</th>
              <th>회원번호</th>
              <th>회원명</th>
              <th>상품명</th>
              <th>결제금액</th>
              <th>결제방법</th>
              <th>상태</th>
              <th>결제일시</th>
              <th>관리</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan="13" className={styles['loading-cell']}>
                  <div className={styles['loading-spinner']}>데이터를 불러오는 중...</div>
                </td>
              </tr>
            ) : payments.length === 0 ? (
              <tr>
                <td colSpan="13" className={styles['empty-cell']}>
                  결제 내역이 없습니다.
                </td>
              </tr>
            ) : (
              payments.map((payment, index) => (
                <tr key={`payment-${payment.paymentId || payment.pymId || index}`}>
                  <td className={styles['payment-id']}>
                    {payment.pymId || payment.paymentId}
                  </td>
                  <td>{payment.impUid || '-'}</td>
                  <td>{payment.merchantUid || '-'}</td>
                  <td>{payment.memberId || '-'}</td>
                  <td>{payment.customerName || payment.custNm || '-'}</td>
                  <td>{payment.customerPhone || payment.custTel || '-'}</td>
                  <td>{payment.memberName || '-'}</td>
                  <td>{payment.productName || '직접 결제'}</td>
                  <td className={styles['amount']}>
                    {formatAmount(payment.amount || payment.pymPrice)}
                  </td>
                  <td>{formatPaymentMethod(payment.paymentMethodName || payment.paymentMethod)}</td>
                  <td>
                    {getStatusBadge(payment.status || payment.pymStatus)}
                  </td>
                  <td>{formatDate(payment.paymentDate || payment.pymDate)}</td>
                  <td>
                    <button
                      className={styles['view-btn']}
                      onClick={() => handleViewDetail(payment)}
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
              테이블 총 {currentPage * pageSize + 1}-{Math.min((currentPage + 1) * pageSize, totalElements)}개 표시
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
                    key={`payment-page-${pageNum}`}
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
      {showDetailModal && selectedPayment && (
        <div className={styles['modal-backdrop']} onClick={() => setShowDetailModal(false)}>
          <div className={styles['modal-content']} onClick={(e) => e.stopPropagation()}>
            <div className={styles['modal-header']}>
              <h3>결제 상세 정보</h3>
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
                    <label>결제 ID:</label>
                    <span>{selectedPayment.pymId || selectedPayment.paymentId}</span>
                  </div>
                  <div className={styles['detail-item']}>
                    <label>아임포트 UID:</label>
                    <span>{selectedPayment.impUid || '-'}</span>
                  </div>
                  <div className={styles['detail-item']}>
                    <label>상점 주문번호:</label>
                    <span>{selectedPayment.merchantUid || '-'}</span>
                  </div>
                  <div className={styles['detail-item']}>
                    <label>결제 상태:</label>
                    <span>{getStatusBadge(selectedPayment.status || selectedPayment.pymStatus)}</span>
                  </div>
                </div>
              </div>

              <div className={styles['detail-section']}>
                <h4>고객 정보</h4>
                <div className={styles['detail-grid']}>
                  <div className={styles['detail-item']}>
                    <label>고객명:</label>
                    <span>{selectedPayment.customerName || selectedPayment.custNm || '-'}</span>
                  </div>
                  <div className={styles['detail-item']}>
                    <label>연락처:</label>
                    <span>{selectedPayment.customerPhone || selectedPayment.custTel || '-'}</span>
                  </div>
                  <div className={styles['detail-item']}>
                    <label>이메일:</label>
                    <span>{selectedPayment.customerEmail || selectedPayment.custEmTel || '-'}</span>
                  </div>
                  <div className={styles['detail-item']}>
                    <label>회원명:</label>
                    <span>{selectedPayment.memberName || '-'}</span>
                  </div>
                </div>
              </div>

              <div className={styles['detail-section']}>
                <h4>결제 정보</h4>
                <div className={styles['detail-grid']}>
                  <div className={styles['detail-item']}>
                    <label>결제 금액:</label>
                    <span>{formatAmount(selectedPayment.amount || selectedPayment.pymPrice)}</span>
                  </div>
                  <div className={styles['detail-item']}>
                    <label>결제 방법:</label>
                    <span>{formatPaymentMethod(selectedPayment.paymentMethodName || selectedPayment.paymentMethod)}</span>
                  </div>
                  <div className={styles['detail-item']}>
                    <label>결제일시:</label>
                    <span>{formatDate(selectedPayment.paymentDate || selectedPayment.pymDate)}</span>
                  </div>
                  <div className={styles['detail-item']}>
                    <label>상품명:</label>
                    <span>{selectedPayment.productName || '직접 결제'}</span>
                  </div>
                </div>
              </div>
              
              {selectedPayment.customerMemo || selectedPayment.custMemo ? (
                <div className={styles['detail-section']}>
                  <h4>메모</h4>
                  <p>{selectedPayment.customerMemo || selectedPayment.custMemo}</p>
                </div>
              ) : null}
            </div>

            <div className={styles['modal-footer']}>
              <div className={styles['status-change-section']}>
                <label>상태 변경:</label>
                <select 
                  className={styles['status-select']}
                  defaultValue={selectedPayment.status || selectedPayment.pymStatus}
                  onChange={(e) => handleStatusChange(selectedPayment.pymId || selectedPayment.paymentId, e.target.value)}
                >
                  {statusOptions.filter(option => option.value !== 'all').map(option => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </div>
              <button 
                className={styles['close-btn']}
                onClick={() => setShowDetailModal(false)}
              >
                닫기
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminPaymentList; 