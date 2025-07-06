import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from '../../styles/pages/CaregiverNotifications.module.css';

const CaregiverNotifications = () => {
  const navigate = useNavigate();
  const [notifications, setNotifications] = useState([]);
  const [filter, setFilter] = useState('all'); // all, unread, read, urgent
  const [selectedNotification, setSelectedNotification] = useState(null);

  // 더미 알림 데이터
  const dummyNotifications = [
    {
      id: 1,
      title: '긴급: 김영희 환자 혈압 이상',
      content: '김영희 환자의 혈압이 180/100으로 측정되었습니다. 즉시 확인이 필요합니다.',
      type: 'urgent',
      category: 'medical',
      isRead: false,
      timestamp: '2025-01-23T14:30:00',
      sender: '시설 관리자',
      actions: ['확인', '의료진 호출']
    },
    {
      id: 2,
      title: '일정 변경 알림',
      content: '내일(1/24) 박정수 환자의 물리치료 시간이 오후 2시에서 오후 3시로 변경되었습니다.',
      type: 'info',
      category: 'schedule',
      isRead: false,
      timestamp: '2025-01-23T13:15:00',
      sender: '물리치료실',
      actions: ['확인']
    },
    {
      id: 3,
      title: '새로운 투약 지시',
      content: '이순자 환자에게 새로운 혈압약(암로디핀 5mg)이 처방되었습니다. 매일 오전 8시 복용해주세요.',
      type: 'warning',
      category: 'medication',
      isRead: true,
      timestamp: '2025-01-23T10:00:00',
      sender: '담당 의사',
      actions: ['확인', '투약 기록']
    },
    {
      id: 4,
      title: '가족 면회 예정',
      content: '김영희 환자의 가족이 오늘 오후 4시에 면회 예정입니다.',
      type: 'info',
      category: 'visit',
      isRead: true,
      timestamp: '2025-01-23T09:30:00',
      sender: '접수처',
      actions: ['확인']
    },
    {
      id: 5,
      title: '시설 공지사항',
      content: '다음 주 월요일(1/27) 오전 10시에 전 직원 회의가 있습니다. 참석해주세요.',
      type: 'notice',
      category: 'facility',
      isRead: false,
      timestamp: '2025-01-22T16:00:00',
      sender: '시설 관리자',
      actions: ['확인']
    },
    {
      id: 6,
      title: '교육 일정 안내',
      content: '응급처치 교육이 2/5(수) 오후 2시에 예정되어 있습니다. 필수 참석입니다.',
      type: 'info',
      category: 'education',
      isRead: true,
      timestamp: '2025-01-22T14:20:00',
      sender: '교육팀',
      actions: ['확인', '일정 추가']
    }
  ];

  useEffect(() => {
    setNotifications(dummyNotifications);
  }, []);

  const getFilteredNotifications = () => {
    return notifications.filter(notification => {
      switch (filter) {
        case 'unread':
          return !notification.isRead;
        case 'read':
          return notification.isRead;
        case 'urgent':
          return notification.type === 'urgent';
        default:
          return true;
      }
    });
  };

  const handleNotificationClick = (notification) => {
    setSelectedNotification(notification);
    // 읽음 처리
    if (!notification.isRead) {
      setNotifications(prev =>
        prev.map(n =>
          n.id === notification.id ? { ...n, isRead: true } : n
        )
      );
    }
  };

  const handleMarkAllAsRead = () => {
    setNotifications(prev =>
      prev.map(n => ({ ...n, isRead: true }))
    );
  };

  const handleAction = (action, notificationId) => {
    console.log(`Action: ${action} for notification ${notificationId}`);
    alert(`${action} 액션이 실행되었습니다.`);
  };

  const getNotificationTypeColor = (type) => {
    switch (type) {
      case 'urgent': return '#dc3545';
      case 'warning': return '#fd7e14';
      case 'info': return '#17a2b8';
      case 'notice': return '#6f42c1';
      default: return '#6c757d';
    }
  };

  const getNotificationIcon = (category) => {
    switch (category) {
      case 'medical': return '🏥';
      case 'schedule': return '📅';
      case 'medication': return '💊';
      case 'visit': return '👥';
      case 'facility': return '🏢';
      case 'education': return '📚';
      default: return '📢';
    }
  };

  const formatTimestamp = (timestamp) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffInHours = (now - date) / (1000 * 60 * 60);

    if (diffInHours < 1) {
      return `${Math.floor(diffInHours * 60)}분 전`;
    } else if (diffInHours < 24) {
      return `${Math.floor(diffInHours)}시간 전`;
    } else {
      return date.toLocaleDateString('ko-KR') + ' ' + date.toLocaleTimeString('ko-KR', { hour: '2-digit', minute: '2-digit' });
    }
  };

  const unreadCount = notifications.filter(n => !n.isRead).length;

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <div className={styles.headerLeft}>
          <h1>알림 관리</h1>
          <span className={styles.unreadBadge}>
            {unreadCount}개의 읽지 않은 알림
          </span>
        </div>
        <div className={styles.headerActions}>
          <button onClick={handleMarkAllAsRead} className={styles.markAllBtn}>
            모두 읽음 처리
          </button>
                            <button onClick={() => navigate('/caregiver/main')} className={styles.backBtn}>
            뒤로가기
          </button>
        </div>
      </div>

      <div className={styles.filterSection}>
        <div className={styles.filterButtons}>
          <button
            className={`${styles.filterBtn} ${filter === 'all' ? styles.active : ''}`}
            onClick={() => setFilter('all')}
          >
            전체 ({notifications.length})
          </button>
          <button
            className={`${styles.filterBtn} ${filter === 'unread' ? styles.active : ''}`}
            onClick={() => setFilter('unread')}
          >
            읽지 않음 ({notifications.filter(n => !n.isRead).length})
          </button>
          <button
            className={`${styles.filterBtn} ${filter === 'urgent' ? styles.active : ''}`}
            onClick={() => setFilter('urgent')}
          >
            긴급 ({notifications.filter(n => n.type === 'urgent').length})
          </button>
        </div>
      </div>

      <div className={styles.mainContent}>
        <div className={styles.notificationList}>
          {getFilteredNotifications().map(notification => (
            <div
              key={notification.id}
              className={`${styles.notificationCard} ${!notification.isRead ? styles.unread : ''}`}
              onClick={() => handleNotificationClick(notification)}
            >
              <div className={styles.notificationHeader}>
                <div className={styles.notificationMeta}>
                  <span className={styles.notificationIcon}>
                    {getNotificationIcon(notification.category)}
                  </span>
                  <span 
                    className={styles.notificationType}
                    style={{ backgroundColor: getNotificationTypeColor(notification.type) }}
                  >
                    {notification.type}
                  </span>
                  <span className={styles.notificationTime}>
                    {formatTimestamp(notification.timestamp)}
                  </span>
                </div>
                {!notification.isRead && <span className={styles.unreadDot}></span>}
              </div>
              <h3 className={styles.notificationTitle}>{notification.title}</h3>
              <p className={styles.notificationPreview}>
                {notification.content.length > 80 
                  ? notification.content.substring(0, 80) + '...'
                  : notification.content
                }
              </p>
              <div className={styles.notificationFooter}>
                <span className={styles.sender}>보낸이: {notification.sender}</span>
              </div>
            </div>
          ))}
          {getFilteredNotifications().length === 0 && (
            <div className={styles.emptyState}>
              <span className={styles.emptyIcon}>📭</span>
              <p>해당하는 알림이 없습니다.</p>
            </div>
          )}
        </div>

        {/* 알림 상세 정보 */}
        {selectedNotification && (
          <div className={styles.notificationDetail}>
            <div className={styles.detailHeader}>
              <div className={styles.detailMeta}>
                <span className={styles.detailIcon}>
                  {getNotificationIcon(selectedNotification.category)}
                </span>
                <span 
                  className={styles.detailType}
                  style={{ backgroundColor: getNotificationTypeColor(selectedNotification.type) }}
                >
                  {selectedNotification.type}
                </span>
              </div>
              <button 
                onClick={() => setSelectedNotification(null)}
                className={styles.closeDetailBtn}
              >
                ×
              </button>
            </div>
            
            <h2 className={styles.detailTitle}>{selectedNotification.title}</h2>
            
            <div className={styles.detailInfo}>
              <div className={styles.detailInfoItem}>
                <label>보낸이</label>
                <span>{selectedNotification.sender}</span>
              </div>
              <div className={styles.detailInfoItem}>
                <label>시간</label>
                <span>{formatTimestamp(selectedNotification.timestamp)}</span>
              </div>
              <div className={styles.detailInfoItem}>
                <label>카테고리</label>
                <span>{selectedNotification.category}</span>
              </div>
            </div>
            
            <div className={styles.detailContent}>
              <p>{selectedNotification.content}</p>
            </div>
            
            {selectedNotification.actions && (
              <div className={styles.detailActions}>
                {selectedNotification.actions.map((action, index) => (
                  <button
                    key={index}
                    onClick={() => handleAction(action, selectedNotification.id)}
                    className={styles.actionBtn}
                  >
                    {action}
                  </button>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default CaregiverNotifications; 