import React, { useState, useEffect } from "react";
import axios from "axios";
import styles from "../../styles/admin/AdminDashboard.module.css";

// 정적 지역 데이터 (AdminProductList.js와 동일)
const regions = [
  { id: 1, name: '서울특별시' },
  { id: 2, name: '부산광역시' },
  { id: 3, name: '대구광역시' },
  { id: 4, name: '인천광역시' },
  { id: 5, name: '광주광역시' },
  { id: 6, name: '대전광역시' },
  { id: 7, name: '울산광역시' },
  { id: 8, name: '세종특별자치시' },
  { id: 9, name: '경기도' },
  { id: 10, name: '강원도' },
  { id: 11, name: '충청북도' },
  { id: 12, name: '충청남도' },
  { id: 13, name: '전라북도' },
  { id: 14, name: '전라남도' },
  { id: 15, name: '경상북도' },
  { id: 16, name: '경상남도' },
  { id: 17, name: '제주특별자치도' }
];

// 정적 시/군/구 데이터 (AdminProductList.js와 동일)
const cityData = {
  1: [ // 서울특별시
    '강남구', '강동구', '강북구', '강서구', '관악구', '광진구', '구로구', '금천구',
    '노원구', '도봉구', '동대문구', '동작구', '마포구', '서대문구', '서초구', '성동구',
    '성북구', '송파구', '양천구', '영등포구', '용산구', '은평구', '종로구', '중구', '중랑구'
  ],
  2: [ // 부산광역시
    '강서구', '금정구', '기장군', '남구', '동구', '동래구', '부산진구', '북구',
    '사상구', '사하구', '서구', '수영구', '연제구', '영도구', '중구', '해운대구'
  ],
  3: [ // 대구광역시
    '남구', '달서구', '달성군', '동구', '북구', '서구', '수성구', '중구'
  ],
  4: [ // 인천광역시
    '강화군', '계양구', '남동구', '동구', '미추홀구', '부평구', '서구', '연수구', '옹진군', '중구'
  ],
  5: [ // 광주광역시
    '광산구', '남구', '동구', '북구', '서구'
  ],
  6: [ // 대전광역시
    '대덕구', '동구', '서구', '유성구', '중구'
  ],
  7: [ // 울산광역시
    '남구', '동구', '북구', '울주군', '중구'
  ],
  8: [ // 세종특별자치시
    '세종시'
  ],
  9: [ // 경기도
    '가평군', '고양시', '과천시', '광명시', '광주시', '구리시', '군포시', '김포시',
    '남양주시', '동두천시', '부천시', '성남시', '수원시', '시흥시', '안산시', '안성시',
    '안양시', '양주시', '양평군', '여주시', '연천군', '오산시', '용인시', '의왕시',
    '의정부시', '이천시', '파주시', '평택시', '포천시', '하남시', '화성시'
  ],
  10: [ // 강원도
    '강릉시', '고성군', '동해시', '삼척시', '속초시', '양구군', '양양군', '영월군',
    '원주시', '인제군', '정선군', '철원군', '춘천시', '태백시', '평창군', '홍천군', '화천군', '횡성군'
  ],
  11: [ // 충청북도
    '괴산군', '단양군', '보은군', '영동군', '옥천군', '음성군', '제천시', '진천군', '청주시', '충주시', '증평군'
  ],
  12: [ // 충청남도
    '계룡시', '공주시', '금산군', '논산시', '당진시', '보령시', '부여군', '서산시',
    '서천군', '아산시', '예산군', '천안시', '청양군', '태안군', '홍성군'
  ],
  13: [ // 전라북도
    '고창군', '군산시', '김제시', '남원시', '무주군', '부안군', '순창군', '완주군',
    '익산시', '임실군', '장수군', '전주시', '정읍시', '진안군'
  ],
  14: [ // 전라남도
    '강진군', '고흥군', '곡성군', '광양시', '구례군', '나주시', '담양군', '목포시',
    '무안군', '보성군', '순천시', '신안군', '여수시', '영광군', '영암군', '완도군',
    '장성군', '장흥군', '진도군', '함평군', '해남군', '화순군'
  ],
  15: [ // 경상북도
    '경산시', '경주시', '고령군', '구미시', '군위군', '김천시', '문경시', '봉화군',
    '상주시', '성주군', '안동시', '영덕군', '영양군', '영주시', '영천시', '예천군',
    '울릉군', '울진군', '의성군', '청도군', '청송군', '칠곡군', '포항시'
  ],
  16: [ // 경상남도
    '거제시', '거창군', '고성군', '김해시', '남해군', '밀양시', '사천시', '산청군',
    '양산시', '의령군', '진주시', '창녕군', '창원시', '통영시', '하동군', '함안군',
    '함양군', '합천군'
  ],
  17: [ // 제주특별자치도
    '서귀포시', '제주시'
  ]
};

function AdminDashboard() {
  const [dashboardData, setDashboardData] = useState({
    totalUsers: 0,
    activeUsers: 0,
    newUsersToday: 0,
    newUsersThisWeek: 0,
    newUsersThisMonth: 0,
    roleStatistics: [],
    statusStatistics: [],
    monthlySignupStats: []
  });
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  // 대시보드 데이터 로드
  const loadDashboardData = async () => {
    try {
      setIsLoading(true);
      setError(null);

      // 병렬로 API 호출
      const [statsResponse, signupResponse] = await Promise.all([
        axios.get('http://localhost:8080/api/admin/users/statistics', {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`,
            'Content-Type': 'application/json'
          }
        }),
        axios.get('http://localhost:8080/api/admin/users/statistics/signup', {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`,
            'Content-Type': 'application/json'
          }
        })
      ]);

      if (statsResponse.data.success && signupResponse.data.success) {
        const stats = statsResponse.data.data;
        const signupStats = signupResponse.data.data;

        // 임시로 월별 데이터에서 신규 가입자 수 계산
        const thisMonthSignup = signupStats[0]?.count || 0;
        const thisWeekSignup = Math.floor(thisMonthSignup / 4); // 대략적인 주간 계산
        const todaySignup = Math.floor(thisMonthSignup / 30); // 대략적인 일일 계산

        setDashboardData({
          totalUsers: stats.totalUsers || 0,
          activeUsers: stats.activeUsers || 0,
          newUsersToday: todaySignup,
          newUsersThisWeek: thisWeekSignup,
          newUsersThisMonth: thisMonthSignup,
          roleStatistics: stats.roleStatistics || [],
          statusStatistics: stats.statusStatistics || [],
          monthlySignupStats: signupStats || []
        });
      }

    } catch (error) {
      console.error('대시보드 데이터 로드 실패:', error);
      
      // 부분적으로라도 데이터를 로드할 수 있는지 시도
      try {
        const basicStatsResponse = await axios.get('http://localhost:8080/api/admin/users/statistics', {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`,
            'Content-Type': 'application/json'
          }
        });
        
        if (basicStatsResponse.data.success) {
          const stats = basicStatsResponse.data.data;
          setDashboardData({
            totalUsers: stats.totalUsers || 0,
            activeUsers: stats.activeUsers || 0,
            newUsersToday: 0,
            newUsersThisWeek: 0,
            newUsersThisMonth: 0,
            roleStatistics: stats.roleStatistics || [],
            statusStatistics: stats.statusStatistics || [],
            monthlySignupStats: []
          });
          setError('일부 데이터를 불러오는데 실패했습니다. (기본 통계만 표시)');
        } else {
          setError('대시보드 데이터를 불러오는데 실패했습니다.');
        }
      } catch (fallbackError) {
        setError('대시보드 데이터를 불러오는데 실패했습니다.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadDashboardData();
  }, []);

  // 로딩 상태
  if (isLoading) {
    return (
      <div className={styles["dashboard-container"]}>
        <div className={styles["loading"]}>
          <div className={styles["loading-spinner"]}></div>
          <p>대시보드 데이터를 불러오는 중...</p>
        </div>
      </div>
    );
  }

  // 에러 상태
  if (error) {
    return (
      <div className={styles["dashboard-container"]}>
        <div className={styles["error"]}>
          <h3>⚠️ 오류 발생</h3>
          <p>{error}</p>
          <button onClick={loadDashboardData} className={styles["retry-btn"]}>
            다시 시도
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className={styles["dashboard-container"]}>
      <div className={styles["dashboard-header"]}>
        <h2>📊 관리자 대시보드</h2>
        <button 
          onClick={loadDashboardData} 
          className={styles["refresh-btn"]}
          disabled={isLoading}
        >
          🔄 새로고침
        </button>
      </div>

      {/* 주요 통계 카드 */}
      <div className={styles["stats-grid"]}>
        <div className={styles["stat-card"]}>
          <div className={styles["stat-icon"]}>👥</div>
          <div className={styles["stat-content"]}>
            <h3>전체 회원수</h3>
            <div className={styles["stat-number"]}>{dashboardData.totalUsers.toLocaleString()}</div>
            <p className={styles["stat-description"]}>등록된 전체 회원</p>
          </div>
        </div>

        <div className={styles["stat-card"]}>
          <div className={styles["stat-icon"]}>✅</div>
          <div className={styles["stat-content"]}>
            <h3>활성 사용자</h3>
            <div className={styles["stat-number"]}>{dashboardData.activeUsers.toLocaleString()}</div>
            <p className={styles["stat-description"]}>현재 활성 상태</p>
          </div>
        </div>

        <div className={styles["stat-card"]}>
          <div className={styles["stat-icon"]}>📅</div>
          <div className={styles["stat-content"]}>
            <h3>이번 달 신규</h3>
            <div className={styles["stat-number"]}>{dashboardData.newUsersThisMonth.toLocaleString()}</div>
            <p className={styles["stat-description"]}>이번 달 가입자</p>
          </div>
        </div>

        <div className={styles["stat-card"]}>
          <div className={styles["stat-icon"]}>🌟</div>
          <div className={styles["stat-content"]}>
            <h3>오늘 신규</h3>
            <div className={styles["stat-number"]}>{dashboardData.newUsersToday.toLocaleString()}</div>
            <p className={styles["stat-description"]}>오늘 가입자</p>
          </div>
        </div>
      </div>

      {/* 차트 섹션 */}
      <div className={styles["charts-grid"]}>
        {/* 역할별 분포 */}
        <div className={styles["chart-card"]}>
          <h3>👨‍💼 역할별 회원 분포</h3>
          <div className={styles["role-chart"]}>
            {dashboardData.roleStatistics.map((role, index) => (
              <div key={index} className={styles["role-item"]}>
                <div className={styles["role-info"]}>
                  <span className={styles["role-name"]}>
                    {role.role === 'USER' ? '👤 일반 사용자' : 
                     role.role === 'ADMIN' ? '👑 관리자' : 
                     role.role === 'CAREGIVER' ? '🏥 요양사' : 
                     role.role === 'COMPANY' ? '🏢 기업' : role.role}
                  </span>
                  <span className={styles["role-count"]}>{role.count}명</span>
                </div>
                <div className={styles["role-bar"]}>
                  <div 
                    className={styles["role-bar-fill"]} 
                    style={{ 
                      width: `${(role.count / dashboardData.totalUsers) * 100}%`,
                      backgroundColor: 
                        role.role === 'USER' ? '#4CAF50' :
                        role.role === 'ADMIN' ? '#FF9800' :
                        role.role === 'CAREGIVER' ? '#2196F3' :
                        role.role === 'COMPANY' ? '#9C27B0' : '#757575'
                    }}
                  ></div>
                </div>
                <span className={styles["role-percentage"]}>
                  {((role.count / dashboardData.totalUsers) * 100).toFixed(1)}%
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* 가입 통계 */}
        <div className={styles["chart-card"]}>
          <h3>📈 월별 가입 추이</h3>
          <div className={styles["signup-chart"]}>
            {dashboardData.monthlySignupStats.slice(0, 6).map((month, index) => (
              <div key={index} className={styles["month-item"]}>
                <div className={styles["month-bar"]}>
                  <div 
                    className={styles["month-bar-fill"]} 
                    style={{ 
                      height: `${(month.count / Math.max(...dashboardData.monthlySignupStats.map(m => m.count))) * 100}%`
                    }}
                  ></div>
                </div>
                <div className={styles["month-info"]}>
                  <div className={styles["month-name"]}>{month.month}</div>
                  <div className={styles["month-count"]}>{month.count}명</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* 상태별 통계 */}
      <div className={styles["status-section"]}>
        <h3>📊 회원 상태 현황</h3>
        <div className={styles["status-cards"]}>
          {dashboardData.statusStatistics.map((status, index) => (
            <div key={index} className={styles["status-card"]}>
              <div className={`${styles["status-icon"]} ${styles[status.status?.toLowerCase()]}`}>
                {status.status === 'ACTIVE' ? '🟢' : '🔴'}
              </div>
              <div className={styles["status-content"]}>
                <h4>{status.status === 'ACTIVE' ? '활성 회원' : '비활성 회원'}</h4>
                <div className={styles["status-number"]}>{status.count.toLocaleString()}</div>
                <div className={styles["status-percentage"]}>
                  {((status.count / dashboardData.totalUsers) * 100).toFixed(1)}%
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 활동 로그 섹션 (추후 구현) */}
      <div className={styles["activity-section"]}>
        <h3>📋 최근 활동</h3>
        <div className={styles["activity-placeholder"]}>
          <p>🚧 활동 로그 기능은 곧 추가될 예정입니다.</p>
          <p>최근 로그인, 주요 활동 내역 등을 확인할 수 있습니다.</p>
        </div>
      </div>
    </div>
  );
}

export default AdminDashboard;