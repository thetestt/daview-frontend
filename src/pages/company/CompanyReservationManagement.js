import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from '../../styles/pages/CompanyReservationManagement.module.css';

const CompanyReservationManagement = () => {
  const navigate = useNavigate();
  const [reservations, setReservations] = useState([]);
  const [filter, setFilter] = useState('all'); // all, pending, confirmed, cancelled
  const [selectedReservation, setSelectedReservation] = useState(null);
  const [showDetailModal, setShowDetailModal] = useState(false);

  // 더미 예약 데이터
  const dummyReservations = [
    {
      id: 1,
      customerName: '김철수',
      customerPhone: '010-1234-5678',
      customerEmail: 'kim@email.com',
      serviceType: '요양원',
      roomType: '1인실',
      checkInDate: '2025-02-01',
      checkOutDate: '2025-02-28',
      guestCount: 1,
      totalAmount: 2500000,
      depositAmount: 500000,
      status: 'pending',
      reservationDate: '2025-01-23T10:30:00',
      specialRequests: '휠체어 접근 가능한 방 요청',
      emergencyContact: '김영희 (딸) - 010-9876-5432',
      medicalInfo: '당뇨, 고혈압',
      notes: '매일 혈압 체크 필요'
    },
    {
      id: 2,
      customerName: '박영희',
      customerPhone: '010-2345-6789',
      customerEmail: 'park@email.com',
      serviceType: '데이케어',
      roomType: '공동이용',
      checkInDate: '2025-01-25',
      checkOutDate: '2025-03-25',
      guestCount: 1,
      totalAmount: 1800000,
      depositAmount: 360000,
      status: 'confirmed',
      reservationDate: '2025-01-22T14:15:00',
      specialRequests: '식사 제한 (당뇨식)',
      emergencyContact: '박민수 (아들) - 010-5555-7777',
      medicalInfo: '당뇨, 치매 초기',
      notes: '인슐린 투약 필요'
    },
    {
      id: 3,
      customerName: '이정수',
      customerPhone: '010-3456-7890',
      customerEmail: 'lee@email.com',
      serviceType: '실버타운',
      roomType: '2인실',
      checkInDate: '2025-01-30',
      checkOutDate: '2025-06-30',
      guestCount: 2,
      totalAmount: 4500000,
      depositAmount: 900000,
      status: 'confirmed',
      reservationDate: '2025-01-21T16:45:00',
      specialRequests: '부부 입소',
      emergencyContact: '이미영 (딸) - 010-8888-9999',
      medicalInfo: '관절염, 고혈압',
      notes: '물리치료 정기 실시'
    },
    {
      id: 4,
      customerName: '최순자',
      customerPhone: '010-4567-8901',
      customerEmail: 'choi@email.com',
      serviceType: '요양원',
      roomType: '1인실',
      checkInDate: '2025-02-05',
      checkOutDate: '2025-05-05',
      guestCount: 1,
      totalAmount: 3200000,
      depositAmount: 640000,
      status: 'cancelled',
      reservationDate: '2025-01-20T11:20:00',
      specialRequests: '개인간병인 동반',
      emergencyContact: '최민호 (아들) - 010-7777-8888',
      medicalInfo: '파킨슨병',
      notes: '취소 사유: 다른 시설 선택'
    },
    {
      id: 5,
      customerName: '한영수',
      customerPhone: '010-5678-9012',
      customerEmail: 'han@email.com',
      serviceType: '요양원',
      roomType: '2인실',
      checkInDate: '2025-02-10',
      checkOutDate: '2025-08-10',
      guestCount: 1,
      totalAmount: 3600000,
      depositAmount: 720000,
      status: 'pending',
      reservationDate: '2025-01-23T09:15:00',
      specialRequests: '창가 방 선호',
      emergencyContact: '한미라 (딸) - 010-6666-7777',
      medicalInfo: '알츠하이머',
      notes: '24시간 관찰 필요'
    }
  ];

  useEffect(() => {
    setReservations(dummyReservations);
  }, []);

  const getFilteredReservations = () => {
    return reservations.filter(reservation => {
      if (filter === 'all') return true;
      return reservation.status === filter;
    });
  };

  const handleStatusChange = (reservationId, newStatus) => {
    setReservations(prev =>
      prev.map(r =>
        r.id === reservationId ? { ...r, status: newStatus } : r
      )
    );
    alert(`예약 상태가 ${getStatusText(newStatus)}로 변경되었습니다.`);
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'pending': return '#ffc107';
      case 'confirmed': return '#28a745';
      case 'cancelled': return '#dc3545';
      case 'completed': return '#6c757d';
      default: return '#6c757d';
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case 'pending': return '대기중';
      case 'confirmed': return '확정';
      case 'cancelled': return '취소';
      case 'completed': return '완료';
      default: return '알 수 없음';
    }
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('ko-KR').format(amount) + '원';
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('ko-KR');
  };

  const formatDateTime = (dateString) => {
    return new Date(dateString).toLocaleString('ko-KR');
  };

  const calculateStayDuration = (checkIn, checkOut) => {
    const start = new Date(checkIn);
    const end = new Date(checkOut);
    const diffTime = Math.abs(end - start);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  const getTotalStats = () => {
    const total = reservations.length;
    const pending = reservations.filter(r => r.status === 'pending').length;
    const confirmed = reservations.filter(r => r.status === 'confirmed').length;
    const cancelled = reservations.filter(r => r.status === 'cancelled').length;
    
    return { total, pending, confirmed, cancelled };
  };

  const stats = getTotalStats();

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <div className={styles.headerLeft}>
          <h1>예약 관리</h1>
          <div className={styles.stats}>
            <span className={styles.statItem}>전체: {stats.total}</span>
            <span className={styles.statItem}>대기: {stats.pending}</span>
            <span className={styles.statItem}>확정: {stats.confirmed}</span>
            <span className={styles.statItem}>취소: {stats.cancelled}</span>
          </div>
        </div>
        <button onClick={() => navigate('/company/main')} className={styles.backBtn}>
          뒤로가기
        </button>
      </div>

      <div className={styles.filterSection}>
        <div className={styles.filterButtons}>
          <button
            className={`${styles.filterBtn} ${filter === 'all' ? styles.active : ''}`}
            onClick={() => setFilter('all')}
          >
            전체 ({reservations.length})
          </button>
          <button
            className={`${styles.filterBtn} ${filter === 'pending' ? styles.active : ''}`}
            onClick={() => setFilter('pending')}
          >
            대기중 ({stats.pending})
          </button>
          <button
            className={`${styles.filterBtn} ${filter === 'confirmed' ? styles.active : ''}`}
            onClick={() => setFilter('confirmed')}
          >
            확정 ({stats.confirmed})
          </button>
          <button
            className={`${styles.filterBtn} ${filter === 'cancelled' ? styles.active : ''}`}
            onClick={() => setFilter('cancelled')}
          >
            취소 ({stats.cancelled})
          </button>
        </div>
      </div>

      <div className={styles.reservationGrid}>
        {getFilteredReservations().map(reservation => (
          <div key={reservation.id} className={styles.reservationCard}>
            <div className={styles.cardHeader}>
              <div className={styles.customerInfo}>
                <h3>{reservation.customerName}</h3>
                <span className={styles.phone}>{reservation.customerPhone}</span>
              </div>
              <span 
                className={styles.statusBadge}
                style={{ backgroundColor: getStatusColor(reservation.status) }}
              >
                {getStatusText(reservation.status)}
              </span>
            </div>

            <div className={styles.cardContent}>
              <div className={styles.serviceInfo}>
                <div className={styles.infoRow}>
                  <span className={styles.label}>서비스:</span>
                  <span>{reservation.serviceType} - {reservation.roomType}</span>
                </div>
                <div className={styles.infoRow}>
                  <span className={styles.label}>기간:</span>
                  <span>{formatDate(reservation.checkInDate)} ~ {formatDate(reservation.checkOutDate)}</span>
                </div>
                <div className={styles.infoRow}>
                  <span className={styles.label}>기간:</span>
                  <span>{calculateStayDuration(reservation.checkInDate, reservation.checkOutDate)}일</span>
                </div>
                <div className={styles.infoRow}>
                  <span className={styles.label}>금액:</span>
                  <span className={styles.amount}>{formatCurrency(reservation.totalAmount)}</span>
                </div>
              </div>
            </div>

            <div className={styles.cardActions}>
              <button
                onClick={() => {
                  setSelectedReservation(reservation);
                  setShowDetailModal(true);
                }}
                className={styles.detailBtn}
              >
                상세보기
              </button>
              {reservation.status === 'pending' && (
                <>
                  <button
                    onClick={() => handleStatusChange(reservation.id, 'confirmed')}
                    className={styles.confirmBtn}
                  >
                    승인
                  </button>
                  <button
                    onClick={() => handleStatusChange(reservation.id, 'cancelled')}
                    className={styles.cancelBtn}
                  >
                    취소
                  </button>
                </>
              )}
            </div>
          </div>
        ))}

        {getFilteredReservations().length === 0 && (
          <div className={styles.emptyState}>
            <span className={styles.emptyIcon}>📋</span>
            <p>해당하는 예약이 없습니다.</p>
          </div>
        )}
      </div>

      {/* 상세보기 모달 */}
      {showDetailModal && selectedReservation && (
        <div className={styles.modalOverlay}>
          <div className={styles.modal}>
            <div className={styles.modalHeader}>
              <h2>예약 상세 정보</h2>
              <button 
                onClick={() => setShowDetailModal(false)}
                className={styles.closeBtn}
              >
                ×
              </button>
            </div>
            
            <div className={styles.modalBody}>
              <div className={styles.detailSection}>
                <h3>고객 정보</h3>
                <div className={styles.detailGrid}>
                  <div className={styles.detailItem}>
                    <label>이름</label>
                    <span>{selectedReservation.customerName}</span>
                  </div>
                  <div className={styles.detailItem}>
                    <label>전화번호</label>
                    <span>{selectedReservation.customerPhone}</span>
                  </div>
                  <div className={styles.detailItem}>
                    <label>이메일</label>
                    <span>{selectedReservation.customerEmail}</span>
                  </div>
                  <div className={styles.detailItem}>
                    <label>응급연락처</label>
                    <span>{selectedReservation.emergencyContact}</span>
                  </div>
                </div>
              </div>

              <div className={styles.detailSection}>
                <h3>예약 정보</h3>
                <div className={styles.detailGrid}>
                  <div className={styles.detailItem}>
                    <label>서비스 유형</label>
                    <span>{selectedReservation.serviceType}</span>
                  </div>
                  <div className={styles.detailItem}>
                    <label>방 유형</label>
                    <span>{selectedReservation.roomType}</span>
                  </div>
                  <div className={styles.detailItem}>
                    <label>입소일</label>
                    <span>{formatDate(selectedReservation.checkInDate)}</span>
                  </div>
                  <div className={styles.detailItem}>
                    <label>퇴소일</label>
                    <span>{formatDate(selectedReservation.checkOutDate)}</span>
                  </div>
                  <div className={styles.detailItem}>
                    <label>숙박일수</label>
                    <span>{calculateStayDuration(selectedReservation.checkInDate, selectedReservation.checkOutDate)}일</span>
                  </div>
                  <div className={styles.detailItem}>
                    <label>예약일시</label>
                    <span>{formatDateTime(selectedReservation.reservationDate)}</span>
                  </div>
                </div>
              </div>

              <div className={styles.detailSection}>
                <h3>의료 정보</h3>
                <div className={styles.detailGrid}>
                  <div className={styles.detailItem}>
                    <label>의료 정보</label>
                    <span>{selectedReservation.medicalInfo}</span>
                  </div>
                  <div className={styles.detailItem}>
                    <label>특별 요청사항</label>
                    <span>{selectedReservation.specialRequests}</span>
                  </div>
                  <div className={styles.detailItem}>
                    <label>메모</label>
                    <span>{selectedReservation.notes}</span>
                  </div>
                </div>
              </div>

              <div className={styles.detailSection}>
                <h3>결제 정보</h3>
                <div className={styles.detailGrid}>
                  <div className={styles.detailItem}>
                    <label>총 금액</label>
                    <span className={styles.amount}>{formatCurrency(selectedReservation.totalAmount)}</span>
                  </div>
                  <div className={styles.detailItem}>
                    <label>계약금</label>
                    <span className={styles.amount}>{formatCurrency(selectedReservation.depositAmount)}</span>
                  </div>
                  <div className={styles.detailItem}>
                    <label>잔금</label>
                    <span className={styles.amount}>{formatCurrency(selectedReservation.totalAmount - selectedReservation.depositAmount)}</span>
                  </div>
                  <div className={styles.detailItem}>
                    <label>상태</label>
                    <span 
                      className={styles.statusBadge}
                      style={{ backgroundColor: getStatusColor(selectedReservation.status) }}
                    >
                      {getStatusText(selectedReservation.status)}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            <div className={styles.modalFooter}>
              {selectedReservation.status === 'pending' && (
                <>
                  <button
                    onClick={() => {
                      handleStatusChange(selectedReservation.id, 'confirmed');
                      setShowDetailModal(false);
                    }}
                    className={styles.confirmBtn}
                  >
                    승인
                  </button>
                  <button
                    onClick={() => {
                      handleStatusChange(selectedReservation.id, 'cancelled');
                      setShowDetailModal(false);
                    }}
                    className={styles.cancelBtn}
                  >
                    취소
                  </button>
                </>
              )}
              <button
                onClick={() => setShowDetailModal(false)}
                className={styles.closeModalBtn}
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

export default CompanyReservationManagement; 