import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from '../../styles/pages/CompanyStatistics.module.css';

const CompanyStatistics = () => {
  const navigate = useNavigate();
  const [selectedPeriod, setSelectedPeriod] = useState('month'); // month, quarter, year
  const [selectedYear, setSelectedYear] = useState(2025);
  const [statistics, setStatistics] = useState({});

  // 더미 통계 데이터
  const dummyStatistics = {
    2025: {
      month: {
        reservations: {
          labels: ['1월', '2월', '3월', '4월', '5월', '6월', '7월', '8월', '9월', '10월', '11월', '12월'],
          data: [45, 52, 48, 63, 58, 72, 69, 75, 81, 77, 83, 89],
          statusBreakdown: {
            confirmed: [38, 45, 41, 55, 50, 63, 60, 65, 70, 67, 72, 78],
            pending: [5, 4, 6, 5, 6, 7, 6, 7, 8, 7, 8, 8],
            cancelled: [2, 3, 1, 3, 2, 2, 3, 3, 3, 3, 3, 3]
          }
        },
        revenue: {
          labels: ['1월', '2월', '3월', '4월', '5월', '6월', '7월', '8월', '9월', '10월', '11월', '12월'],
          data: [2250000, 2600000, 2400000, 3150000, 2900000, 3600000, 3450000, 3750000, 4050000, 3850000, 4150000, 4450000],
          serviceBreakdown: {
            nursingHome: [1350000, 1560000, 1440000, 1890000, 1740000, 2160000, 2070000, 2250000, 2430000, 2310000, 2490000, 2670000],
            silvertown: [675000, 780000, 720000, 945000, 870000, 1080000, 1035000, 1125000, 1215000, 1155000, 1245000, 1335000],
            daycare: [225000, 260000, 240000, 315000, 290000, 360000, 345000, 375000, 405000, 385000, 415000, 445000]
          }
        },
        reviews: {
          count: [12, 15, 18, 22, 19, 25, 28, 31, 34, 30, 37, 42],
          averageRating: [4.2, 4.1, 4.3, 4.5, 4.2, 4.6, 4.4, 4.7, 4.8, 4.6, 4.9, 4.8],
          ratingDistribution: {
            5: [6, 7, 9, 12, 9, 14, 15, 18, 20, 17, 22, 25],
            4: [4, 5, 6, 7, 6, 8, 9, 9, 10, 9, 11, 12],
            3: [2, 2, 2, 2, 3, 2, 3, 3, 3, 3, 3, 4],
            2: [0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
            1: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
          }
        }
      }
    }
  };

  useEffect(() => {
    setStatistics(dummyStatistics);
  }, []);

  const getCurrentData = () => {
    return statistics[selectedYear]?.[selectedPeriod] || {};
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('ko-KR', {
      style: 'currency',
      currency: 'KRW',
      minimumFractionDigits: 0
    }).format(amount);
  };

  const getPercentage = (value, total) => {
    return total > 0 ? ((value / total) * 100).toFixed(1) : 0;
  };

  const getTotalReservations = () => {
    const data = getCurrentData();
    return data.reservations?.data?.reduce((sum, val) => sum + val, 0) || 0;
  };

  const getTotalRevenue = () => {
    const data = getCurrentData();
    return data.revenue?.data?.reduce((sum, val) => sum + val, 0) || 0;
  };

  const getTotalReviews = () => {
    const data = getCurrentData();
    return data.reviews?.count?.reduce((sum, val) => sum + val, 0) || 0;
  };

  const getAverageRating = () => {
    const data = getCurrentData();
    if (!data.reviews?.averageRating) return 0;
    const sum = data.reviews.averageRating.reduce((sum, val) => sum + val, 0);
    return (sum / data.reviews.averageRating.length).toFixed(1);
  };

  const getMaxValue = (dataArray) => {
    return Math.max(...dataArray);
  };

  const getBarHeight = (value, maxValue) => {
    return (value / maxValue) * 100;
  };

  const getGrowthRate = (current, previous) => {
    if (previous === 0) return 0;
    return (((current - previous) / previous) * 100).toFixed(1);
  };

  const data = getCurrentData();

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <div className={styles.headerLeft}>
          <h1>통계 분석</h1>
          <div className={styles.controls}>
            <div className={styles.controlGroup}>
              <label>기간</label>
              <select 
                value={selectedPeriod} 
                onChange={(e) => setSelectedPeriod(e.target.value)}
                className={styles.select}
              >
                <option value="month">월별</option>
                <option value="quarter">분기별</option>
                <option value="year">연도별</option>
              </select>
            </div>
            <div className={styles.controlGroup}>
              <label>년도</label>
              <select 
                value={selectedYear} 
                onChange={(e) => setSelectedYear(parseInt(e.target.value))}
                className={styles.select}
              >
                <option value={2025}>2025년</option>
                <option value={2024}>2024년</option>
                <option value={2023}>2023년</option>
              </select>
            </div>
          </div>
        </div>
        <button onClick={() => navigate('/company/main')} className={styles.backBtn}>
          뒤로가기
        </button>
      </div>

      {/* 주요 지표 카드 */}
      <div className={styles.summaryCards}>
        <div className={styles.summaryCard}>
          <div className={styles.cardIcon}>📊</div>
          <div className={styles.cardContent}>
            <h3>총 예약 수</h3>
            <p className={styles.mainValue}>{getTotalReservations()}건</p>
            <span className={styles.subValue}>
              전월 대비 {getGrowthRate(data.reservations?.data?.[data.reservations?.data?.length - 1], data.reservations?.data?.[data.reservations?.data?.length - 2])}%
            </span>
          </div>
        </div>

        <div className={styles.summaryCard}>
          <div className={styles.cardIcon}>💰</div>
          <div className={styles.cardContent}>
            <h3>총 매출</h3>
            <p className={styles.mainValue}>{formatCurrency(getTotalRevenue())}</p>
            <span className={styles.subValue}>
              전월 대비 {getGrowthRate(data.revenue?.data?.[data.revenue?.data?.length - 1], data.revenue?.data?.[data.revenue?.data?.length - 2])}%
            </span>
          </div>
        </div>

        <div className={styles.summaryCard}>
          <div className={styles.cardIcon}>⭐</div>
          <div className={styles.cardContent}>
            <h3>평균 평점</h3>
            <p className={styles.mainValue}>{getAverageRating()}/5.0</p>
            <span className={styles.subValue}>총 {getTotalReviews()}개 리뷰</span>
          </div>
        </div>

        <div className={styles.summaryCard}>
          <div className={styles.cardIcon}>👥</div>
          <div className={styles.cardContent}>
            <h3>고객 만족도</h3>
            <p className={styles.mainValue}>
              {data.reviews?.ratingDistribution ? 
                getPercentage(
                  (data.reviews.ratingDistribution[5]?.reduce((sum, val) => sum + val, 0) || 0) + 
                  (data.reviews.ratingDistribution[4]?.reduce((sum, val) => sum + val, 0) || 0),
                  getTotalReviews()
                ) : 0}%
            </p>
            <span className={styles.subValue}>4점 이상 평점 비율</span>
          </div>
        </div>
      </div>

      {/* 차트 섹션 */}
      <div className={styles.chartsGrid}>
        {/* 예약 통계 차트 */}
        <div className={styles.chartCard}>
          <h3>예약 통계</h3>
          <div className={styles.chartContainer}>
            <div className={styles.barChart}>
              {data.reservations?.labels?.map((label, index) => (
                <div key={index} className={styles.barGroup}>
                  <div className={styles.barContainer}>
                    <div 
                      className={`${styles.bar} ${styles.confirmed}`}
                      style={{ 
                        height: `${getBarHeight(data.reservations.statusBreakdown.confirmed[index], getMaxValue(data.reservations.data))}%` 
                      }}
                      title={`확정: ${data.reservations.statusBreakdown.confirmed[index]}건`}
                    ></div>
                    <div 
                      className={`${styles.bar} ${styles.pending}`}
                      style={{ 
                        height: `${getBarHeight(data.reservations.statusBreakdown.pending[index], getMaxValue(data.reservations.data))}%` 
                      }}
                      title={`대기: ${data.reservations.statusBreakdown.pending[index]}건`}
                    ></div>
                    <div 
                      className={`${styles.bar} ${styles.cancelled}`}
                      style={{ 
                        height: `${getBarHeight(data.reservations.statusBreakdown.cancelled[index], getMaxValue(data.reservations.data))}%` 
                      }}
                      title={`취소: ${data.reservations.statusBreakdown.cancelled[index]}건`}
                    ></div>
                  </div>
                  <span className={styles.barLabel}>{label}</span>
                </div>
              ))}
            </div>
            <div className={styles.legend}>
              <div className={styles.legendItem}>
                <div className={`${styles.legendColor} ${styles.confirmed}`}></div>
                <span>확정</span>
              </div>
              <div className={styles.legendItem}>
                <div className={`${styles.legendColor} ${styles.pending}`}></div>
                <span>대기</span>
              </div>
              <div className={styles.legendItem}>
                <div className={`${styles.legendColor} ${styles.cancelled}`}></div>
                <span>취소</span>
              </div>
            </div>
          </div>
        </div>

        {/* 매출 통계 차트 */}
        <div className={styles.chartCard}>
          <h3>매출 통계</h3>
          <div className={styles.chartContainer}>
            <div className={styles.lineChart}>
              {data.revenue?.labels?.map((label, index) => (
                <div key={index} className={styles.linePoint}>
                  <div 
                    className={styles.point}
                    style={{ 
                      bottom: `${getBarHeight(data.revenue.data[index], getMaxValue(data.revenue.data))}%` 
                    }}
                    title={`${label}: ${formatCurrency(data.revenue.data[index])}`}
                  ></div>
                  <span className={styles.lineLabel}>{label}</span>
                </div>
              ))}
            </div>
            <div className={styles.revenueBreakdown}>
              <h4>서비스별 매출 비율</h4>
              <div className={styles.pieChart}>
                <div className={styles.pieItem}>
                  <div className={styles.pieColor} style={{ background: '#4CAF50' }}></div>
                  <span>요양원 (60%)</span>
                </div>
                <div className={styles.pieItem}>
                  <div className={styles.pieColor} style={{ background: '#2196F3' }}></div>
                  <span>실버타운 (30%)</span>
                </div>
                <div className={styles.pieItem}>
                  <div className={styles.pieColor} style={{ background: '#FF9800' }}></div>
                  <span>데이케어 (10%)</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* 리뷰 통계 차트 */}
        <div className={styles.chartCard}>
          <h3>리뷰 통계</h3>
          <div className={styles.chartContainer}>
            <div className={styles.ratingChart}>
              {[5, 4, 3, 2, 1].map(rating => (
                <div key={rating} className={styles.ratingRow}>
                  <span className={styles.ratingLabel}>{rating}점</span>
                  <div className={styles.ratingBar}>
                    <div 
                      className={styles.ratingBarFill}
                      style={{ 
                        width: `${getPercentage(
                          data.reviews?.ratingDistribution?.[rating]?.reduce((sum, val) => sum + val, 0) || 0,
                          getTotalReviews()
                        )}%`,
                        backgroundColor: rating >= 4 ? '#4CAF50' : rating >= 3 ? '#FF9800' : '#F44336'
                      }}
                    ></div>
                  </div>
                  <span className={styles.ratingCount}>
                    {data.reviews?.ratingDistribution?.[rating]?.reduce((sum, val) => sum + val, 0) || 0}개
                  </span>
                </div>
              ))}
            </div>
            <div className={styles.reviewTrend}>
              <h4>월별 리뷰 평점 추이</h4>
              <div className={styles.trendChart}>
                {data.reviews?.averageRating?.map((rating, index) => (
                  <div key={index} className={styles.trendPoint}>
                    <div 
                      className={styles.trendBar}
                      style={{ 
                        height: `${(rating / 5) * 100}%`,
                        backgroundColor: rating >= 4.5 ? '#4CAF50' : rating >= 4 ? '#8BC34A' : '#FF9800'
                      }}
                      title={`${data.reviews.labels?.[index]}: ${rating}/5.0`}
                    ></div>
                    <span className={styles.trendLabel}>{data.reviews?.labels?.[index]}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* 고객 분석 */}
        <div className={styles.chartCard}>
          <h3>고객 분석</h3>
          <div className={styles.analysisContainer}>
            <div className={styles.analysisGrid}>
              <div className={styles.analysisItem}>
                <h4>신규 고객</h4>
                <div className={styles.analysisValue}>
                  <span className={styles.bigNumber}>156</span>
                  <span className={styles.unit}>명</span>
                </div>
                <div className={styles.analysisChange}>
                  <span className={styles.positive}>+12.3%</span>
                </div>
              </div>
              
              <div className={styles.analysisItem}>
                <h4>재방문 고객</h4>
                <div className={styles.analysisValue}>
                  <span className={styles.bigNumber}>89</span>
                  <span className={styles.unit}>명</span>
                </div>
                <div className={styles.analysisChange}>
                  <span className={styles.positive}>+8.7%</span>
                </div>
              </div>
              
              <div className={styles.analysisItem}>
                <h4>고객 유지율</h4>
                <div className={styles.analysisValue}>
                  <span className={styles.bigNumber}>78.5</span>
                  <span className={styles.unit}>%</span>
                </div>
                <div className={styles.analysisChange}>
                  <span className={styles.positive}>+3.2%</span>
                </div>
              </div>
              
              <div className={styles.analysisItem}>
                <h4>평균 이용기간</h4>
                <div className={styles.analysisValue}>
                  <span className={styles.bigNumber}>4.2</span>
                  <span className={styles.unit}>개월</span>
                </div>
                <div className={styles.analysisChange}>
                  <span className={styles.positive}>+0.8</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CompanyStatistics; 