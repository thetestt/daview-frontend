import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from '../../api/axiosInstance';
import styles from '../../styles/admin/CaregiverMainDashboard.module.css';

const CaregiverMainDashboard = () => {
  const navigate = useNavigate();
  const [caregiverData, setCaregiverData] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [dashboardStats, setDashboardStats] = useState({
    todaySchedule: 3,
    weekSchedule: 12,
    patients: 5,
    messages: 2
  });

  // 최근 활동 데이터 (실제 환경에서는 API로 가져올 수 있음)
  const [recentActivities, setRecentActivities] = useState([
    {
      id: 1,
      icon: '📋',
      title: '일일 보고서 작성 완료',
      time: '30분 전',
      type: 'report'
    },
    {
      id: 2,
      icon: '💬',
      title: '김○○ 어르신 가족과 상담',
      time: '1시간 전',
      type: 'message'
    },
    {
      id: 3,
      icon: '🩺',
      title: '혈압 측정 및 기록',
      time: '2시간 전',
      type: 'medical'
    },
    {
      id: 4,
      icon: '🍽️',
      title: '식사 도움 완료',
      time: '3시간 전',
      type: 'care'
    },
    {
      id: 5,
      icon: '📅',
      title: '내일 일정 확인',
      time: '4시간 전',
      type: 'schedule'
    }
  ]);

  // 케어기버 기본 정보 조회
  const fetchCaregiverData = async () => {
    setIsLoading(true);
    try {
      const response = await axios.get('/api/caregiver/my-profile');
      if (response.data) {
        setCaregiverData(response.data);
      }
    } catch (error) {
      console.error('요양사 정보 조회 실패:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchCaregiverData();
  }, []);

  // 각 기능으로 이동하는 함수들
  const handleProfileManagement = () => {
    navigate('/caregiver/profile');
  };

  const handleScheduleManagement = () => {
    navigate('/caregiver/tasks');
  };

  const handlePatientManagement = () => {
    navigate('/caregiver/patients');
  };

  const handleChatManagement = () => {
    navigate('/chatlist');
  };

  const handleReportsManagement = () => {
    navigate('/caregiver/reports');
  };

  const handleNotifications = () => {
    navigate('/caregiver/notifications');
  };

  const handleCarePulseTracker = () => {
    navigate('/caregiver/care-pulse-tracker');
  };

  if (isLoading) {
    return <div className={styles.loading}>로딩 중...</div>;
  }

  return (
    <div className={styles.dashboardContainer}>
      {/* 헤더 */}
      <div className={styles.header}>
        <div className={styles.welcomeSection}>
          <h1 className={styles.title}>요양사 대시보드</h1>
          <p className={styles.welcomeText}>
            안녕하세요, {caregiverData?.username || '요양사'}님! 오늘도 좋은 하루 되세요.
          </p>
        </div>
        <div className={styles.userInfo}>
          <div className={styles.userAvatar}>Care</div>
          <div className={styles.userDetails}>
            <span className={styles.userName}>{caregiverData?.username || '요양사'}</span>
            <span className={styles.userRole}>케어기버</span>
          </div>
        </div>
      </div>

      {/* 통계 카드들 */}
      <div className={styles.statsGrid}>
        <div className={styles.statCard}>
          <div className={styles.statIcon}>일정</div>
          <div className={styles.statContent}>
            <div className={styles.statNumber}>{dashboardStats.todaySchedule}</div>
            <div className={styles.statLabel}>오늘 일정</div>
          </div>
        </div>
        <div className={styles.statCard}>
          <div className={styles.statIcon}>업무</div>
          <div className={styles.statContent}>
            <div className={styles.statNumber}>{dashboardStats.weekSchedule}</div>
            <div className={styles.statLabel}>이번 주 업무</div>
          </div>
        </div>
        <div className={styles.statCard}>
          <div className={styles.statIcon}>환자</div>
          <div className={styles.statContent}>
            <div className={styles.statNumber}>{dashboardStats.patients}</div>
            <div className={styles.statLabel}>담당 입소자</div>
          </div>
        </div>
        <div className={styles.statCard}>
          <div className={styles.statIcon}>메시지</div>
          <div className={styles.statContent}>
            <div className={styles.statNumber}>{dashboardStats.messages}</div>
            <div className={styles.statLabel}>새 메시지</div>
          </div>
        </div>
      </div>

      {/* 메인 기능 카드들 */}
      <div className={styles.mainGrid}>
        {/* 프로필 관리 */}
        <div className={styles.functionCard} onClick={handleProfileManagement}>
          <div className={styles.cardIcon}>프로필</div>
          <div className={styles.cardContent}>
            <h3 className={styles.cardTitle}>프로필 관리</h3>
            <p className={styles.cardDescription}>
              내 프로필 정보를 수정하고 경력사항을 관리하세요.
            </p>
            <div className={styles.cardFooter}>
              <span className={styles.cardAction}>관리하기 →</span>
            </div>
          </div>
        </div>

        {/* 일정 관리 */}
        <div className={styles.functionCard} onClick={handleScheduleManagement}>
          <div className={styles.cardIcon}>일정</div>
          <div className={styles.cardContent}>
            <h3 className={styles.cardTitle}>일정 관리</h3>
            <p className={styles.cardDescription}>
              오늘의 업무 일정과 향후 스케줄을 확인하고 관리하세요.
            </p>
            <div className={styles.cardFooter}>
              <span className={styles.cardAction}>일정 보기 →</span>
            </div>
          </div>
        </div>

        {/* 환자 관리 */}
        <div className={styles.functionCard} onClick={handlePatientManagement}>
          <div className={styles.cardIcon}>입소자</div>
          <div className={styles.cardContent}>
            <h3 className={styles.cardTitle}>입소자 관리</h3>
            <p className={styles.cardDescription}>
              담당하고 있는 입소자들의 정보와 케어 내역을 관리하세요.
            </p>
            <div className={styles.cardFooter}>
              <span className={styles.cardAction}>환자 보기 →</span>
            </div>
          </div>
        </div>

        {/* 채팅 관리 */}
        <div className={styles.functionCard} onClick={handleChatManagement}>
          <div className={styles.cardIcon}>메시지</div>
          <div className={styles.cardContent}>
            <h3 className={styles.cardTitle}>메시지</h3>
            <p className={styles.cardDescription}>
              가족들과 시설 관리자와의 메시지를 확인하고 답변하세요.
            </p>
            <div className={styles.cardFooter}>
              <span className={styles.cardAction}>메시지 보기 →</span>
            </div>
          </div>
        </div>

        {/* 업무 보고서 */}
        <div className={styles.functionCard} onClick={handleReportsManagement}>
          <div className={styles.cardIcon}>보고서</div>
          <div className={styles.cardContent}>
            <h3 className={styles.cardTitle}>업무 보고서</h3>
            <p className={styles.cardDescription}>
              일일 업무 보고서를 작성하고 과거 기록을 확인하세요.
            </p>
            <div className={styles.cardFooter}>
              <span className={styles.cardAction}>보고서 작성 →</span>
            </div>
          </div>
        </div>

        {/* 알림 및 공지 */}
        <div className={styles.functionCard} onClick={handleNotifications}>
          <div className={styles.cardIcon}>알림</div>
          <div className={styles.cardContent}>
            <h3 className={styles.cardTitle}>알림 관리</h3>
            <p className={styles.cardDescription}>
              시설 공지사항과 알림을 확인하고 관리하세요.
            </p>
            <div className={styles.cardFooter}>
              <span className={styles.cardAction}>알림 보기 →</span>
            </div>
          </div>
        </div>

        {/* Care Pulse Tracker */}
        <div className={styles.functionCard} onClick={handleCarePulseTracker}>
          <div className={styles.cardIcon}>💓</div>
          <div className={styles.cardContent}>
            <h3 className={styles.cardTitle}>Care Pulse Tracker</h3>
            <p className={styles.cardDescription}>
              AI 기반 실시간 생체신호 모니터링 및 예측 분석 시스템
            </p>
            <div className={styles.cardFooter}>
              <span className={styles.cardAction}>PoC 시작 →</span>
            </div>
          </div>
        </div>
      </div>

      {/* 최근 활동 */}
      <div className={styles.recentActivity}>
        <h2 className={styles.sectionTitle}>최근 활동</h2>
        <div className={styles.activityList}>
          {recentActivities.length > 0 ? (
            recentActivities.map(activity => (
              <div key={activity.id} className={styles.activityItem} data-type={activity.type}>
                <div className={styles.activityIcon}>
                  {activity.icon}
                </div>
                <div className={styles.activityContent}>
                  <div className={styles.activityTitle}>{activity.title}</div>
                  <div className={styles.activityTime}>{activity.time}</div>
                </div>
              </div>
            ))
          ) : (
            <div className={styles.emptyActivity}>
              최근 활동이 없습니다.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CaregiverMainDashboard; 