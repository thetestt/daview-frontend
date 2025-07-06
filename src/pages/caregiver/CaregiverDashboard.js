import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from '../../api/axiosInstance';
import { getRegions, getCitiesByRegion, getCaregiverFilterOptions } from '../../api/filterOption';
import styles from '../../styles/admin/CaregiverDashboard.module.css';

const CaregiverDashboard = () => {
  const navigate = useNavigate();
  const [caregiverData, setCaregiverData] = useState(null);
  const [isEditMode, setIsEditMode] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [regions, setRegions] = useState([]);
  const [cities, setCities] = useState([]);
  const [editFormData, setEditFormData] = useState({
    username: '',
    userGender: '',
    hopeWorkAreaLocation: '',
    hopeWorkAreaCity: '',
    hopeWorkPlace: '',
    hopeWorkType: '',
    hopeEmploymentType: '',
    educationLevel: '',
    introduction: '',
    hopeWorkAmount: '',
    certificates: [],
    career: []
  });

  // 정적 지역 데이터
  const staticRegions = [
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

  // 정적 시/군/구 데이터
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

  // 본인 요양사 정보 조회
  const fetchCaregiverData = async () => {
    setIsLoading(true);
    try {
      // JWT 토큰에서 memberId를 가져와서 본인 정보만 조회
      const response = await axios.get('/api/caregiver/my-profile');
      if (response.data) {
        setCaregiverData(response.data);
        setEditFormData({
          username: response.data.username || '',
          userGender: response.data.userGender || '',
          hopeWorkAreaLocation: response.data.hopeWorkAreaLocation || '',
          hopeWorkAreaCity: response.data.hopeWorkAreaCity || '',
          hopeWorkPlace: response.data.hopeWorkPlace || '',
          hopeWorkType: response.data.hopeWorkType || '',
          hopeEmploymentType: response.data.hopeEmploymentType || '',
          educationLevel: response.data.educationLevel || '',
          introduction: response.data.introduction || '',
          hopeWorkAmount: response.data.hopeWorkAmount || '',
          certificates: response.data.certificates || [],
          career: response.data.career || []
        });

        // 지역이 선택되어 있으면 해당 시/군/구 목록 설정
        if (response.data.hopeWorkAreaLocation) {
          const regionObj = staticRegions.find(r => r.name === response.data.hopeWorkAreaLocation);
          if (regionObj && cityData[regionObj.id]) {
            const cityList = cityData[regionObj.id].map((cityName, index) => ({
              id: index + 1,
              name: cityName
            }));
            setCities(cityList);
          }
        }
      }
    } catch (error) {
      console.error('요양사 정보 조회 실패:', error);
      alert('요양사 정보를 불러오는데 실패했습니다.');
    } finally {
      setIsLoading(false);
    }
  };

  // 요양사 정보 수정
  const handleEditSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      await axios.put('/api/caregiver/my-profile', editFormData);
      alert('프로필이 성공적으로 수정되었습니다.');
      setIsEditMode(false);
      fetchCaregiverData(); // 수정 후 데이터 새로고침
    } catch (error) {
      console.error('프로필 수정 실패:', error);
      alert('프로필 수정에 실패했습니다.');
    } finally {
      setIsLoading(false);
    }
  };

  // 입력값 변경 처리
  const handleEditInputChange = (e) => {
    const { name, value } = e.target;
    setEditFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // 지역 변경 처리
  const handleEditRegionChange = (e) => {
    const selectedRegion = e.target.value;
    
    setEditFormData(prev => ({
      ...prev,
      hopeWorkAreaLocation: selectedRegion,
      hopeWorkAreaCity: '' // 지역 변경 시 시/군/구 초기화
    }));

    // 선택된 지역에 해당하는 시/군/구 목록 설정
    const regionObj = staticRegions.find(r => r.name === selectedRegion);
    console.log('선택된 지역 객체:', regionObj);
    
    if (regionObj && cityData[regionObj.id]) {
      const cityList = cityData[regionObj.id].map((cityName, index) => ({
        id: index + 1,
        name: cityName
      }));
      console.log('생성된 시/군/구 목록:', cityList);
      setCities(cityList);
    } else {
      console.log('시/군/구 목록을 찾을 수 없음');
      setCities([]);
    }
  };

  // 시/군/구 변경 처리
  const handleEditCityChange = (e) => {
    const cityName = e.target.value;
    console.log('선택된 시/군/구:', cityName);
    setEditFormData(prev => ({
      ...prev,
      hopeWorkAreaCity: cityName
    }));
  };

  // 자격증 추가
  const addCertificate = () => {
    setEditFormData(prev => ({
      ...prev,
      certificates: [...prev.certificates, '']
    }));
  };

  // 자격증 제거
  const removeCertificate = (index) => {
    setEditFormData(prev => ({
      ...prev,
      certificates: prev.certificates.filter((_, i) => i !== index)
    }));
  };

  // 자격증 변경
  const handleCertificateChange = (index, value) => {
    setEditFormData(prev => ({
      ...prev,
      certificates: prev.certificates.map((cert, i) => i === index ? value : cert)
    }));
  };

  // 경력 추가
  const addCareer = () => {
    setEditFormData(prev => ({
      ...prev,
      career: [...prev.career, { companyName: '', startDate: '', endDate: '' }]
    }));
  };

  // 경력 제거
  const removeCareer = (index) => {
    setEditFormData(prev => ({
      ...prev,
      career: prev.career.filter((_, i) => i !== index)
    }));
  };

  // 경력 변경
  const handleCareerChange = (index, field, value) => {
    setEditFormData(prev => ({
      ...prev,
      career: prev.career.map((career, i) => 
        i === index ? { ...career, [field]: value } : career
      )
    }));
  };

  useEffect(() => {
    setRegions(staticRegions);
    fetchCaregiverData();
  }, []);

  if (isLoading) {
    return (
      <div className={styles.loadingContainer}>
        <div className={styles.spinner}></div>
        <p>로딩 중...</p>
      </div>
    );
  }

  if (!caregiverData) {
    return (
      <div className={styles.noDataContainer}>
        <h2>요양사 프로필 정보가 없습니다.</h2>
        <p>요양사 등록을 먼저 진행해주세요.</p>
      </div>
    );
  }

  return (
    <div className={styles.dashboardContainer}>
      <div className={styles.header}>
        <h1>프로필 관리</h1>
        <button onClick={() => navigate('/caregiver/main')} className={styles.backBtn}>
          뒤로가기
        </button>
      </div>

      <div className={styles['caregiver-dashboard-container']}>
        {/* 로딩 스피너 */}
        {isLoading && (
          <div className={styles['loading-spinner']}>
            <div className={styles['spinner']}></div>
            <p>로딩 중...</p>
          </div>
        )}

        {/* 프로필 수정/취소 버튼들 */}
        <div className={styles.headerButtons}>
          {!isEditMode && (
            <button 
              onClick={() => setIsEditMode(true)}
              className={styles.editButton}
            >
              프로필 수정
            </button>
          )}
          {isEditMode && (
            <>
              <button 
                onClick={() => setIsEditMode(false)}
                className={styles.cancelButton}
              >
                취소
              </button>
              <button 
                onClick={handleEditSubmit}
                className={styles.saveButton}
                disabled={isLoading}
              >
                {isLoading ? '저장 중...' : '저장'}
              </button>
            </>
          )}
        </div>

        <div className={styles.profileCard}>
          {!isEditMode ? (
            // 프로필 보기 모드
            <div className={styles.profileView}>
              <div className={styles.profileSection}>
                <h3>기본 정보</h3>
                <div className={styles.infoGrid}>
                  <div className={styles.infoItem}>
                    <label>이름:</label>
                    <span>{caregiverData.username}</span>
                  </div>
                  <div className={styles.infoItem}>
                    <label>성별:</label>
                    <span>{caregiverData.userGender}</span>
                  </div>
                  <div className={styles.infoItem}>
                    <label>희망 근무 지역:</label>
                    <span>{caregiverData.hopeWorkAreaLocation} {caregiverData.hopeWorkAreaCity}</span>
                  </div>
                  <div className={styles.infoItem}>
                    <label>희망 근무 장소:</label>
                    <span>{caregiverData.hopeWorkPlace}</span>
                  </div>
                  <div className={styles.infoItem}>
                    <label>희망 근무 형태:</label>
                    <span>{caregiverData.hopeWorkType}</span>
                  </div>
                  <div className={styles.infoItem}>
                    <label>희망 고용 형태:</label>
                    <span>{caregiverData.hopeEmploymentType}</span>
                  </div>
                  <div className={styles.infoItem}>
                    <label>학력:</label>
                    <span>{caregiverData.educationLevel}</span>
                  </div>
                  <div className={styles.infoItem}>
                    <label>희망 급여:</label>
                    <span>{caregiverData.hopeWorkAmount ? `${caregiverData.hopeWorkAmount}만원` : '-'}</span>
                  </div>
                </div>
              </div>

              <div className={styles.profileSection}>
                <h3>소개</h3>
                <p className={styles.introduction}>
                  {caregiverData.introduction || '소개글이 없습니다.'}
                </p>
              </div>

              <div className={styles.profileSection}>
                <h3>보유 자격증</h3>
                <div className={styles.certificatesList}>
                  {caregiverData.certificates && caregiverData.certificates.length > 0 ? (
                    caregiverData.certificates.map((cert, index) => (
                      <span key={index} className={styles.certificateTag}>
                        {cert}
                      </span>
                    ))
                  ) : (
                    <span className={styles.noCertificates}>등록된 자격증이 없습니다.</span>
                  )}
                </div>
              </div>

              <div className={styles.profileSection}>
                <h3>경력 사항</h3>
                <div className={styles.careerList}>
                  {caregiverData.career && caregiverData.career.length > 0 ? (
                    caregiverData.career.map((career, index) => (
                      <div key={index} className={styles.careerItem}>
                        <h4>{career.companyName}</h4>
                        <p>{career.startDate} ~ {career.endDate}</p>
                      </div>
                    ))
                  ) : (
                    <span className={styles.noCareer}>등록된 경력이 없습니다.</span>
                  )}
                </div>
              </div>
            </div>
          ) : (
            // 프로필 수정 모드
            <form onSubmit={handleEditSubmit} className={styles.editForm}>
              <div className={styles.formSection}>
                <h3>기본 정보 수정</h3>
                <div className={styles.formGrid}>
                  <div className={styles.formGroup}>
                    <label>이름</label>
                    <input
                      type="text"
                      name="username"
                      value={editFormData.username}
                      onChange={handleEditInputChange}
                      required
                    />
                  </div>

                  <div className={styles.formGroup}>
                    <label>성별</label>
                    <select
                      name="userGender"
                      value={editFormData.userGender}
                      onChange={handleEditInputChange}
                      required
                    >
                      <option value="">선택해주세요</option>
                      <option value="남성">남성</option>
                      <option value="여성">여성</option>
                    </select>
                  </div>

                  <div className={styles.formGroup}>
                    <label>희망 근무 지역</label>
                    <select
                      name="hopeWorkAreaLocation"
                      value={editFormData.hopeWorkAreaLocation}
                      onChange={handleEditRegionChange}
                      required
                    >
                      <option value="">지역을 선택해주세요</option>
                      {regions.map(region => (
                        <option key={region.id} value={region.name}>
                          {region.name}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className={styles.formGroup}>
                    <label>희망 근무 시/군/구</label>
                    <select
                      name="hopeWorkAreaCity"
                      value={editFormData.hopeWorkAreaCity}
                      onChange={handleEditCityChange}
                      required
                      disabled={!editFormData.hopeWorkAreaLocation}
                    >
                      <option value="">시/군/구를 선택해주세요</option>
                      {cities.map(city => (
                        <option key={city.id} value={city.name}>
                          {city.name}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className={styles.formGroup}>
                    <label>희망 근무 장소</label>
                    <select
                      name="hopeWorkPlace"
                      value={editFormData.hopeWorkPlace}
                      onChange={handleEditInputChange}
                      required
                    >
                      <option value="">선택해주세요</option>
                      <option value="가정방문">가정방문</option>
                      <option value="요양원">요양원</option>
                      <option value="실버타운">실버타운</option>
                      <option value="데이케어센터">데이케어센터</option>
                    </select>
                  </div>

                  <div className={styles.formGroup}>
                    <label>희망 근무 형태</label>
                    <select
                      name="hopeWorkType"
                      value={editFormData.hopeWorkType}
                      onChange={handleEditInputChange}
                      required
                    >
                      <option value="">선택해주세요</option>
                      <option value="요양사">요양사</option>
                      <option value="간병인">간병인</option>
                      <option value="생활도우미">생활도우미</option>
                    </select>
                  </div>

                  <div className={styles.formGroup}>
                    <label>희망 고용 형태</label>
                    <select
                      name="hopeEmploymentType"
                      value={editFormData.hopeEmploymentType}
                      onChange={handleEditInputChange}
                      required
                    >
                      <option value="">선택해주세요</option>
                      <option value="정규직">정규직</option>
                      <option value="계약직">계약직</option>
                      <option value="시간제">시간제</option>
                    </select>
                  </div>

                  <div className={styles.formGroup}>
                    <label>학력</label>
                    <select
                      name="educationLevel"
                      value={editFormData.educationLevel}
                      onChange={handleEditInputChange}
                      required
                    >
                      <option value="">선택해주세요</option>
                      <option value="고등학교 졸업">고등학교 졸업</option>
                      <option value="전문대학 졸업">전문대학 졸업</option>
                      <option value="대학교 졸업">대학교 졸업</option>
                      <option value="대학원 졸업">대학원 졸업</option>
                    </select>
                  </div>

                  <div className={styles.formGroup}>
                    <label>희망 급여 (만원)</label>
                    <input
                      type="number"
                      name="hopeWorkAmount"
                      value={editFormData.hopeWorkAmount}
                      onChange={handleEditInputChange}
                      placeholder="예: 250"
                    />
                  </div>
                </div>
              </div>

              <div className={styles.formSection}>
                <h3>소개글</h3>
                <textarea
                  name="introduction"
                  value={editFormData.introduction}
                  onChange={handleEditInputChange}
                  rows="4"
                  placeholder="자신을 소개해주세요..."
                  className={styles.introductionTextarea}
                />
              </div>

              <div className={styles.formSection}>
                <div className={styles.sectionHeader}>
                  <h3>보유 자격증</h3>
                  <button type="button" onClick={addCertificate} className={styles.addButton}>
                    자격증 추가
                  </button>
                </div>
                {editFormData.certificates.map((cert, index) => (
                  <div key={index} className={styles.arrayItem}>
                    <input
                      type="text"
                      value={cert}
                      onChange={(e) => handleCertificateChange(index, e.target.value)}
                      placeholder="자격증명을 입력하세요"
                    />
                    <button 
                      type="button" 
                      onClick={() => removeCertificate(index)}
                      className={styles.removeButton}
                    >
                      삭제
                    </button>
                  </div>
                ))}
              </div>

              <div className={styles.formSection}>
                <div className={styles.sectionHeader}>
                  <h3>경력 사항</h3>
                  <button type="button" onClick={addCareer} className={styles.addButton}>
                    경력 추가
                  </button>
                </div>
                {editFormData.career.map((career, index) => (
                  <div key={index} className={styles.careerFormItem}>
                    <div className={styles.careerInputs}>
                      <input
                        type="text"
                        value={career.companyName}
                        onChange={(e) => handleCareerChange(index, 'companyName', e.target.value)}
                        placeholder="회사명"
                      />
                      <input
                        type="date"
                        value={career.startDate}
                        onChange={(e) => handleCareerChange(index, 'startDate', e.target.value)}
                      />
                      <input
                        type="date"
                        value={career.endDate}
                        onChange={(e) => handleCareerChange(index, 'endDate', e.target.value)}
                      />
                    </div>
                    <button 
                      type="button" 
                      onClick={() => removeCareer(index)}
                      className={styles.removeButton}
                    >
                      삭제
                    </button>
                  </div>
                ))}
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};

export default CaregiverDashboard;

