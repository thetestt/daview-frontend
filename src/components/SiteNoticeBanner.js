import React, { useState, useEffect } from 'react';
import styles from '../styles/components/SiteNoticeBanner.module.css';

const SiteNoticeBanner = () => {
  const [notices, setNotices] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isVisible, setIsVisible] = useState(true);
  const [isSliding, setIsSliding] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const [sessionClosed, setSessionClosed] = useState(false);

  // 공지사항 데이터 로드
  useEffect(() => {
    // 오늘은 보지않기 체크
    const hideToday = localStorage.getItem('siteNoticeBannerHideToday');
    const today = new Date().toDateString();
    
    if (sessionClosed || (hideToday && hideToday === today)) {
      setIsVisible(false);
      return;
    }

    // 공지사항 데이터 가져오기
    fetchNotices();
  }, [sessionClosed]);

  // 자동 슬라이드
  useEffect(() => {
    if (notices.length > 1 && isVisible) {
      const interval = setInterval(() => {
        setIsSliding(true);
        setTimeout(() => {
          setCurrentIndex((prevIndex) => 
            prevIndex === notices.length - 1 ? 0 : prevIndex + 1
          );
          setIsSliding(false);
        }, 300);
      }, 4000); // 4초마다 슬라이드

      return () => clearInterval(interval);
    }
  }, [notices.length, isVisible]);

  const fetchNotices = async () => {
    try {
      const response = await fetch('/api/site-notices/latest?limit=5');
      const data = await response.json();
      
      if (data.notices && data.notices.length > 0) {
        setNotices(data.notices);
      } else {
        setIsVisible(false); // 공지사항이 없으면 배너 숨김
      }
    } catch (error) {
      console.error('공지사항 로드 실패:', error);
      setIsVisible(false);
    }
  };

  const handleClose = (e) => {
    e.stopPropagation(); // 배너 클릭 이벤트 방지
    setSessionClosed(true);
    setIsVisible(false);
  };

  const handleHideToday = (e) => {
    e.stopPropagation(); // 배너 클릭 이벤트 방지
    setIsVisible(false);
    // 오늘 날짜를 localStorage에 저장하여 24시간 동안 숨김
    const today = new Date().toDateString();
    localStorage.setItem('siteNoticeBannerHideToday', today);
  };

  const handleNoticeClick = () => {
    setIsExpanded(!isExpanded);
  };

  const goToPrevious = (e) => {
    e.stopPropagation(); // 배너 클릭 이벤트 방지
    setIsSliding(true);
    setTimeout(() => {
      setCurrentIndex(currentIndex === 0 ? notices.length - 1 : currentIndex - 1);
      setIsSliding(false);
    }, 300);
  };

  const goToNext = (e) => {
    e.stopPropagation(); // 배너 클릭 이벤트 방지
    setIsSliding(true);
    setTimeout(() => {
      setCurrentIndex(currentIndex === notices.length - 1 ? 0 : currentIndex + 1);
      setIsSliding(false);
    }, 300);
  };

  if (!isVisible || notices.length === 0) {
    return null;
  }

  const currentNotice = notices[currentIndex];

  return (
    <div className={styles['notice-banner']}>
      <div className={styles['banner-content']} onClick={handleNoticeClick}>
        {/* 공지사항 아이콘 */}
        <div className={styles['notice-icon']}>
          📢
        </div>

        {/* 슬라이드 컨테이너 */}
        <div className={styles['slide-container']}>
          <div 
            className={`${styles['notice-content']} ${isSliding ? styles['sliding'] : ''}`}
          >
            <span className={styles['notice-title']}>
              {currentNotice.title}
            </span>
            <span className={styles['notice-preview']}>
              {currentNotice.content.length > 50 
                ? currentNotice.content.substring(0, 50) + '...' 
                : currentNotice.content}
            </span>
            <span className={styles['expand-arrow']}>
              {isExpanded ? '▲' : '▼'}
            </span>
          </div>
        </div>

        {/* 네비게이션 버튼 */}
        {notices.length > 1 && (
          <div className={styles['nav-buttons']} onClick={(e) => e.stopPropagation()}>
            <button 
              className={styles['nav-btn']}
              onClick={goToPrevious}
              aria-label="이전 공지사항"
            >
              ◀
            </button>
            <span className={styles['page-indicator']}>
              {currentIndex + 1} / {notices.length}
            </span>
            <button 
              className={styles['nav-btn']}
              onClick={goToNext}
              aria-label="다음 공지사항"
            >
              ▶
            </button>
          </div>
        )}

        {/* 오늘은 보지않기 버튼 */}
        <button 
          className={styles['hide-today-btn']}
          onClick={handleHideToday}
          aria-label="오늘은 보지않기"
        >
          오늘은 보지않기
        </button>

        {/* 닫기 버튼 */}
        <button 
          className={styles['close-btn']}
          onClick={handleClose}
          aria-label="공지사항 배너 닫기"
        >
          ✕
        </button>
      </div>
      
      {/* 펼쳐지는 내용 영역 */}
      {isExpanded && (
        <div className={styles['expanded-content']} onClick={handleNoticeClick}>
          <div className={styles['expanded-inner']}>
            <h3 className={styles['expanded-title']}>{currentNotice.title}</h3>
            <p className={styles['expanded-text']}>{currentNotice.content}</p>
            <div className={styles['expanded-date']}>
              등록일: {new Date(currentNotice.createdAt).toLocaleDateString()}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SiteNoticeBanner; 