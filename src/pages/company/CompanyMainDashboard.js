import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import styles from '../../styles/admin/CompanyMainDashboard.module.css';

const CompanyMainDashboard = () => {
  const navigate = useNavigate();
  const [facilityData, setFacilityData] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [dashboardStats, setDashboardStats] = useState({
    totalReservations: 12,
    todayReservations: 3,
    totalReviews: 45,
    averageRating: 4.5,
    newMessages: 2,
    pendingInquiries: 1
  });

  // 시설 기본 정보 조회
  const fetchFacilityData = async () => {
    setIsLoading(true);
    try {
      const response = await axios.get('/api/facility/my-info');
      if (response.data) {
        setFacilityData(response.data);
      }
    } catch (error) {
      console.error('시설 정보 조회 실패:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchFacilityData();
  }, []);

  // 각 기능으로 이동하는 함수들
  const handleFacilityManagement = () => {
    navigate('/company/facility');
  };

  const handleReservationManagement = () => {
    // 예약 관리 페이지로 이동 (추후 구현)
    alert('예약 관리 기능은 준비중입니다.');
  };

  const handleReviewManagement = () => {
    // 리뷰 관리 페이지로 이동 (추후 구현)
    alert('리뷰 관리 기능은 준비중입니다.');
  };

  const handleChatManagement = () => {
    navigate('/chatlist');
  };

  const handleStatistics = () => {
    // 통계 페이지로 이동 (추후 구현)
    alert('통계 분석 기능은 준비중입니다.');
  };

  const handleInquiryManagement = () => {
    // 문의 관리 페이지로 이동 (추후 구현)
    alert('문의 관리 기능은 준비중입니다.');
  };

  const handleNoticeManagement = () => {
    // 공지사항 관리 페이지로 이동 (추후 구현)
    alert('공지사항 관리 기능은 준비중입니다.');
  };

  const handlePhotosManagement = () => {
    // 사진 관리 페이지로 이동 (추후 구현)
    alert('사진 관리 기능은 준비중입니다.');
  };

  if (isLoading) {
    return <div className={styles.loading}>로딩 중...</div>;
  }

  return (
    <div className={styles.dashboardContainer}>
      {/* 헤더 */}
      <div className={styles.header}>
        <div className={styles.welcomeSection}>
          <h1 className={styles.title}>기업 대시보드</h1>
          <p className={styles.welcomeText}>
            안녕하세요, {facilityData?.facilityName || '시설'} 관리자님! 오늘도 좋은 하루 되세요.
          </p>
        </div>
        <div className={styles.userInfo}>
          <div className={styles.userAvatar}>Company</div>
          <div className={styles.userDetails}>
            <span className={styles.userName}>{facilityData?.facilityName || '시설명'}</span>
            <span className={styles.userRole}>{facilityData?.facilityType || '시설'}</span>
          </div>
        </div>
      </div>

      {/* 통계 카드들 */}
      <div className={styles.statsGrid}>
        <div className={styles.statCard}>
          <div className={styles.statIcon}>예약</div>
          <div className={styles.statContent}>
            <div className={styles.statNumber}>{dashboardStats.todayReservations}</div>
            <div className={styles.statLabel}>오늘 예약</div>
          </div>
        </div>
        <div className={styles.statCard}>
          <div className={styles.statIcon}>총계</div>
          <div className={styles.statContent}>
            <div className={styles.statNumber}>{dashboardStats.totalReservations}</div>
            <div className={styles.statLabel}>총 예약</div>
          </div>
        </div>
        <div className={styles.statCard}>
          <div className={styles.statIcon}>평점</div>
          <div className={styles.statContent}>
            <div className={styles.statNumber}>{dashboardStats.averageRating}</div>
            <div className={styles.statLabel}>평균 평점</div>
          </div>
        </div>
        <div className={styles.statCard}>
          <div className={styles.statIcon}>메시지</div>
          <div className={styles.statContent}>
            <div className={styles.statNumber}>{dashboardStats.newMessages}</div>
            <div className={styles.statLabel}>새 메시지</div>
          </div>
        </div>
      </div>

      {/* 메인 기능 카드들 */}
      <div className={styles.mainGrid}>
        {/* 시설 관리 */}
        <div className={styles.functionCard} onClick={handleFacilityManagement}>
          <div className={styles.cardIcon}>시설</div>
          <div className={styles.cardContent}>
            <h3 className={styles.cardTitle}>시설 관리</h3>
            <p className={styles.cardDescription}>
              시설 정보를 수정하고 사진, 서비스 등을 관리하세요.
            </p>
            <div className={styles.cardFooter}>
              <span className={styles.cardAction}>관리하기 →</span>
            </div>
          </div>
        </div>

        {/* 예약 관리 */}
        <div className={styles.functionCard} onClick={handleReservationManagement}>
          <div className={styles.cardIcon}>예약</div>
          <div className={styles.cardContent}>
            <h3 className={styles.cardTitle}>예약 관리</h3>
            <p className={styles.cardDescription}>
              신규 예약을 확인하고 예약 현황을 관리하세요.
            </p>
            <div className={styles.cardFooter}>
              <span className={styles.cardAction}>예약 보기 →</span>
            </div>
          </div>
        </div>

        {/* 리뷰 관리 */}
        <div className={styles.functionCard} onClick={handleReviewManagement}>
          <div className={styles.cardIcon}>리뷰</div>
          <div className={styles.cardContent}>
            <h3 className={styles.cardTitle}>리뷰 관리</h3>
            <p className={styles.cardDescription}>
              고객 리뷰를 확인하고 답변을 작성하세요.
            </p>
            <div className={styles.cardFooter}>
              <span className={styles.cardAction}>리뷰 보기 →</span>
            </div>
          </div>
        </div>

        {/* 메시지 관리 */}
        <div className={styles.functionCard} onClick={handleChatManagement}>
          <div className={styles.cardIcon}>메시지</div>
          <div className={styles.cardContent}>
            <h3 className={styles.cardTitle}>메시지</h3>
            <p className={styles.cardDescription}>
              고객과 요양사와의 메시지를 확인하고 답변하세요.
            </p>
            <div className={styles.cardFooter}>
              <span className={styles.cardAction}>메시지 보기 →</span>
            </div>
          </div>
        </div>

        {/* 통계 분석 */}
        <div className={styles.functionCard} onClick={handleStatistics}>
          <div className={styles.cardIcon}>통계</div>
          <div className={styles.cardContent}>
            <h3 className={styles.cardTitle}>통계 분석</h3>
            <p className={styles.cardDescription}>
              예약, 리뷰, 수익 등의 통계를 확인하세요.
            </p>
            <div className={styles.cardFooter}>
              <span className={styles.cardAction}>통계 보기 →</span>
            </div>
          </div>
        </div>

        {/* 문의 관리 */}
        <div className={styles.functionCard} onClick={handleInquiryManagement}>
          <div className={styles.cardIcon}>문의</div>
          <div className={styles.cardContent}>
            <h3 className={styles.cardTitle}>문의 관리</h3>
            <p className={styles.cardDescription}>
              고객 문의사항을 확인하고 답변을 작성하세요.
            </p>
            <div className={styles.cardFooter}>
              <span className={styles.cardAction}>문의 보기 →</span>
            </div>
          </div>
        </div>

        {/* 공지사항 관리 */}
        <div className={styles.functionCard} onClick={handleNoticeManagement}>
          <div className={styles.cardIcon}>공지</div>
          <div className={styles.cardContent}>
            <h3 className={styles.cardTitle}>공지사항</h3>
            <p className={styles.cardDescription}>
              시설 공지사항을 작성하고 관리하세요.
            </p>
            <div className={styles.cardFooter}>
              <span className={styles.cardAction}>공지 관리 →</span>
            </div>
          </div>
        </div>

        {/* 사진 관리 */}
        <div className={styles.functionCard} onClick={handlePhotosManagement}>
          <div className={styles.cardIcon}>사진</div>
          <div className={styles.cardContent}>
            <h3 className={styles.cardTitle}>사진 관리</h3>
            <p className={styles.cardDescription}>
              시설 사진을 업로드하고 관리하세요.
            </p>
            <div className={styles.cardFooter}>
              <span className={styles.cardAction}>사진 관리 →</span>
            </div>
          </div>
        </div>
      </div>

      {/* 최근 활동 */}
      <div className={styles.recentActivity}>
        <h3 className={styles.sectionTitle}>최근 활동</h3>
        <div className={styles.activityList}>
          <div className={styles.activityItem}>
            <div className={styles.activityIcon}>리뷰</div>
            <div className={styles.activityContent}>
              <span className={styles.activityTitle}>새로운 리뷰가 등록되었습니다</span>
              <span className={styles.activityTime}>2시간 전</span>
            </div>
          </div>
          <div className={styles.activityItem}>
            <div className={styles.activityIcon}>예약</div>
            <div className={styles.activityContent}>
              <span className={styles.activityTitle}>새로운 예약이 접수되었습니다</span>
              <span className={styles.activityTime}>4시간 전</span>
            </div>
          </div>
          <div className={styles.activityItem}>
            <div className={styles.activityIcon}>메시지</div>
            <div className={styles.activityContent}>
              <span className={styles.activityTitle}>새로운 메시지가 도착했습니다</span>
              <span className={styles.activityTime}>1일 전</span>
            </div>
          </div>
        </div>
      </div>

      {/* 빠른 액션 버튼들 */}
      <div className={styles.quickActions}>
        <h3 className={styles.sectionTitle}>빠른 액션</h3>
        <div className={styles.actionButtons}>
          <button className={styles.actionBtn} onClick={handleChatManagement}>
            새 메시지
          </button>
          <button className={styles.actionBtn} onClick={handleNoticeManagement}>
            공지 작성
          </button>
          <button className={styles.actionBtn} onClick={handlePhotosManagement}>
            사진 업로드
          </button>
        </div>
      </div>
    </div>
  );
};

export default CompanyMainDashboard; 