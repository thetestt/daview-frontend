import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from '../../styles/pages/CompanyReviewManagement.module.css';

const CompanyReviewManagement = () => {
  const navigate = useNavigate();
  const [reviews, setReviews] = useState([]);
  const [filter, setFilter] = useState('all'); // all, answered, unanswered, rating
  const [ratingFilter, setRatingFilter] = useState('all'); // 1-5 stars
  const [selectedReview, setSelectedReview] = useState(null);
  const [showReplyModal, setShowReplyModal] = useState(false);
  const [replyText, setReplyText] = useState('');

  // 더미 리뷰 데이터
  const dummyReviews = [
    {
      id: 1,
      customerName: '김영희',
      rating: 5,
      title: '정말 만족스러운 서비스였습니다',
      content: '어머니를 모시고 왔는데 시설도 깔끔하고 직원분들도 친절하셨습니다. 특히 요양사분이 세심하게 돌봐주셔서 정말 감사했습니다. 식사도 맛있고 프로그램도 다양해서 어머니가 즐거워하셨어요.',
      date: '2025-01-20T14:30:00',
      serviceType: '요양원',
      isAnswered: true,
      reply: {
        content: '소중한 리뷰 감사합니다. 어르신께서 만족해하신다니 저희도 기쁩니다. 앞으로도 더 나은 서비스를 제공하도록 노력하겠습니다.',
        date: '2025-01-21T09:15:00',
        author: '시설 관리자'
      },
      photos: ['facility1.jpg', 'room1.jpg']
    },
    {
      id: 2,
      customerName: '박철수',
      rating: 4,
      title: '전반적으로 좋았습니다',
      content: '아버지 요양을 위해 이용했는데 시설이 깨끗하고 관리가 잘 되어 있었습니다. 다만 주차 공간이 조금 부족한 것 같아요. 직원분들은 모두 친절하시고 전문적이었습니다.',
      date: '2025-01-18T16:45:00',
      serviceType: '데이케어',
      isAnswered: false,
      reply: null,
      photos: []
    },
    {
      id: 3,
      customerName: '최미영',
      rating: 3,
      title: '보통 수준이에요',
      content: '가격 대비 괜찮은 편이지만 특별히 인상적이지는 않았습니다. 시설은 노후된 느낌이 있고, 프로그램도 좀 더 다양했으면 좋겠어요. 직원분들은 친절하긴 한데 전문성이 조금 아쉬웠습니다.',
      date: '2025-01-15T11:20:00',
      serviceType: '실버타운',
      isAnswered: true,
      reply: {
        content: '귀중한 의견 감사합니다. 시설 개선과 프로그램 다양화에 대해 검토해보겠습니다. 직원 교육도 강화하여 더 나은 서비스를 제공하도록 하겠습니다.',
        date: '2025-01-16T10:30:00',
        author: '시설 관리자'
      },
      photos: []
    },
    {
      id: 4,
      customerName: '한정수',
      rating: 2,
      title: '많이 아쉽습니다',
      content: '기대했던 것에 비해 많이 실망스러웠습니다. 청소 상태도 별로고 음식도 맛이 없었어요. 직원분들도 바쁘셔서 그런지 신경을 많이 못 써주시는 것 같았습니다. 개선이 필요할 것 같아요.',
      date: '2025-01-12T13:15:00',
      serviceType: '요양원',
      isAnswered: false,
      reply: null,
      photos: []
    },
    {
      id: 5,
      customerName: '이순자',
      rating: 5,
      title: '최고의 시설입니다',
      content: '10년 넘게 여러 시설을 이용해봤지만 이곳이 최고입니다. 시설도 최신이고 직원분들도 정말 전문적이에요. 특히 물리치료 프로그램이 훌륭합니다. 가족 같은 따뜻함을 느낄 수 있어서 안심됩니다.',
      date: '2025-01-10T10:00:00',
      serviceType: '실버타운',
      isAnswered: true,
      reply: {
        content: '정말 감사한 리뷰입니다. 이런 리뷰가 저희에게 큰 힘이 됩니다. 앞으로도 가족 같은 마음으로 모시겠습니다.',
        date: '2025-01-11T08:45:00',
        author: '시설 관리자'
      },
      photos: ['therapy1.jpg']
    },
    {
      id: 6,
      customerName: '윤미라',
      rating: 1,
      title: '정말 실망스럽습니다',
      content: '최악의 경험이었습니다. 시설은 노후되어 있고 위생 상태도 좋지 않았어요. 직원분들도 불친절하고 전문성도 의문스럽습니다. 다른 곳을 알아보시는 것을 추천합니다. 돈이 아까워요.',
      date: '2025-01-08T15:30:00',
      serviceType: '요양원',
      isAnswered: false,
      reply: null,
      photos: []
    }
  ];

  useEffect(() => {
    setReviews(dummyReviews);
  }, []);

  const getFilteredReviews = () => {
    let filtered = reviews;

    // 답변 상태별 필터링
    if (filter === 'answered') {
      filtered = filtered.filter(review => review.isAnswered);
    } else if (filter === 'unanswered') {
      filtered = filtered.filter(review => !review.isAnswered);
    }

    // 평점별 필터링
    if (ratingFilter !== 'all') {
      filtered = filtered.filter(review => review.rating === parseInt(ratingFilter));
    }

    return filtered.sort((a, b) => new Date(b.date) - new Date(a.date));
  };

  const handleReplySubmit = () => {
    if (!replyText.trim()) return;

    const updatedReviews = reviews.map(review =>
      review.id === selectedReview.id
        ? {
            ...review,
            isAnswered: true,
            reply: {
              content: replyText,
              date: new Date().toISOString(),
              author: '시설 관리자'
            }
          }
        : review
    );

    setReviews(updatedReviews);
    setShowReplyModal(false);
    setReplyText('');
    setSelectedReview(null);
    alert('답변이 등록되었습니다.');
  };

  const getStarRating = (rating) => {
    return '★'.repeat(rating) + '☆'.repeat(5 - rating);
  };

  const getRatingColor = (rating) => {
    if (rating >= 4) return '#28a745';
    if (rating >= 3) return '#ffc107';
    if (rating >= 2) return '#fd7e14';
    return '#dc3545';
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('ko-KR') + ' ' + 
           new Date(dateString).toLocaleTimeString('ko-KR', { hour: '2-digit', minute: '2-digit' });
  };

  const getReviewStats = () => {
    const total = reviews.length;
    const answered = reviews.filter(r => r.isAnswered).length;
    const unanswered = total - answered;
    const avgRating = reviews.reduce((sum, r) => sum + r.rating, 0) / total;
    
    const ratingCounts = [1, 2, 3, 4, 5].map(rating => 
      reviews.filter(r => r.rating === rating).length
    );

    return { total, answered, unanswered, avgRating: avgRating.toFixed(1), ratingCounts };
  };

  const stats = getReviewStats();

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <div className={styles.headerLeft}>
          <h1>리뷰 관리</h1>
          <div className={styles.stats}>
            <span className={styles.statItem}>전체: {stats.total}개</span>
            <span className={styles.statItem}>평균 평점: {stats.avgRating}점</span>
            <span className={styles.statItem}>답변완료: {stats.answered}개</span>
            <span className={styles.statItem}>미답변: {stats.unanswered}개</span>
          </div>
        </div>
        <button onClick={() => navigate('/company/main')} className={styles.backBtn}>
          뒤로가기
        </button>
      </div>

      <div className={styles.filterSection}>
        <div className={styles.filterRow}>
          <div className={styles.filterGroup}>
            <label>답변 상태</label>
            <div className={styles.filterButtons}>
              <button
                className={`${styles.filterBtn} ${filter === 'all' ? styles.active : ''}`}
                onClick={() => setFilter('all')}
              >
                전체
              </button>
              <button
                className={`${styles.filterBtn} ${filter === 'unanswered' ? styles.active : ''}`}
                onClick={() => setFilter('unanswered')}
              >
                미답변 ({stats.unanswered})
              </button>
              <button
                className={`${styles.filterBtn} ${filter === 'answered' ? styles.active : ''}`}
                onClick={() => setFilter('answered')}
              >
                답변완료 ({stats.answered})
              </button>
            </div>
          </div>
          
          <div className={styles.filterGroup}>
            <label>평점</label>
            <select 
              value={ratingFilter} 
              onChange={(e) => setRatingFilter(e.target.value)}
              className={styles.filterSelect}
            >
              <option value="all">전체 평점</option>
              <option value="5">⭐⭐⭐⭐⭐ (5점)</option>
              <option value="4">⭐⭐⭐⭐☆ (4점)</option>
              <option value="3">⭐⭐⭐☆☆ (3점)</option>
              <option value="2">⭐⭐☆☆☆ (2점)</option>
              <option value="1">⭐☆☆☆☆ (1점)</option>
            </select>
          </div>
        </div>

        <div className={styles.ratingDistribution}>
          <h4>평점 분포</h4>
          <div className={styles.ratingBars}>
            {[5, 4, 3, 2, 1].map(rating => (
              <div key={rating} className={styles.ratingBar}>
                <span className={styles.ratingLabel}>{rating}점</span>
                <div className={styles.barContainer}>
                  <div 
                    className={styles.bar}
                    style={{ 
                      width: `${(stats.ratingCounts[rating - 1] / stats.total) * 100}%`,
                      backgroundColor: getRatingColor(rating)
                    }}
                  ></div>
                </div>
                <span className={styles.ratingCount}>{stats.ratingCounts[rating - 1]}개</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className={styles.reviewGrid}>
        {getFilteredReviews().map(review => (
          <div key={review.id} className={styles.reviewCard}>
            <div className={styles.reviewHeader}>
              <div className={styles.customerInfo}>
                <h3>{review.customerName}</h3>
                <span className={styles.serviceType}>{review.serviceType}</span>
              </div>
              <div className={styles.rating}>
                <span 
                  className={styles.stars}
                  style={{ color: getRatingColor(review.rating) }}
                >
                  {getStarRating(review.rating)}
                </span>
                <span className={styles.ratingNumber}>({review.rating}/5)</span>
              </div>
            </div>

            <div className={styles.reviewContent}>
              <h4>{review.title}</h4>
              <p>{review.content}</p>
              <div className={styles.reviewDate}>
                {formatDate(review.date)}
              </div>
            </div>

            {review.isAnswered && review.reply && (
              <div className={styles.replySection}>
                <div className={styles.replyHeader}>
                  <span className={styles.replyAuthor}>{review.reply.author}</span>
                  <span className={styles.replyDate}>{formatDate(review.reply.date)}</span>
                </div>
                <p className={styles.replyContent}>{review.reply.content}</p>
              </div>
            )}

            <div className={styles.reviewActions}>
              {!review.isAnswered ? (
                <button
                  onClick={() => {
                    setSelectedReview(review);
                    setShowReplyModal(true);
                  }}
                  className={styles.replyBtn}
                >
                  답변하기
                </button>
              ) : (
                <button
                  onClick={() => {
                    setSelectedReview(review);
                    setReplyText(review.reply.content);
                    setShowReplyModal(true);
                  }}
                  className={styles.editReplyBtn}
                >
                  답변 수정
                </button>
              )}
            </div>
          </div>
        ))}

        {getFilteredReviews().length === 0 && (
          <div className={styles.emptyState}>
            <span className={styles.emptyIcon}>📝</span>
            <p>해당하는 리뷰가 없습니다.</p>
          </div>
        )}
      </div>

      {/* 답변 작성/수정 모달 */}
      {showReplyModal && selectedReview && (
        <div className={styles.modalOverlay}>
          <div className={styles.modal}>
            <div className={styles.modalHeader}>
              <h2>{selectedReview.isAnswered ? '답변 수정' : '답변 작성'}</h2>
              <button 
                onClick={() => {
                  setShowReplyModal(false);
                  setReplyText('');
                  setSelectedReview(null);
                }}
                className={styles.closeBtn}
              >
                ×
              </button>
            </div>
            
            <div className={styles.modalBody}>
              <div className={styles.originalReview}>
                <h4>원본 리뷰</h4>
                <div className={styles.reviewSummary}>
                  <div className={styles.reviewInfo}>
                    <span className={styles.customerName}>{selectedReview.customerName}</span>
                    <span 
                      className={styles.rating}
                      style={{ color: getRatingColor(selectedReview.rating) }}
                    >
                      {getStarRating(selectedReview.rating)}
                    </span>
                  </div>
                  <h5>{selectedReview.title}</h5>
                  <p>{selectedReview.content}</p>
                </div>
              </div>
              
              <div className={styles.replyForm}>
                <h4>답변 내용</h4>
                <textarea
                  value={replyText}
                  onChange={(e) => setReplyText(e.target.value)}
                  placeholder="고객에게 전달할 답변을 작성해주세요..."
                  rows="6"
                  className={styles.replyTextarea}
                />
              </div>
            </div>

            <div className={styles.modalFooter}>
              <button
                onClick={handleReplySubmit}
                className={styles.submitBtn}
                disabled={!replyText.trim()}
              >
                {selectedReview.isAnswered ? '답변 수정' : '답변 등록'}
              </button>
              <button
                onClick={() => {
                  setShowReplyModal(false);
                  setReplyText('');
                  setSelectedReview(null);
                }}
                className={styles.cancelBtn}
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

export default CompanyReviewManagement; 