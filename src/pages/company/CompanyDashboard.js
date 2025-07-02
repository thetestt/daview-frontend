import React, { useEffect, useState } from 'react';
import axios from '../../api/axiosInstance';
import { fetchFacilityProfile } from '../../api/facilityApi';
import styles from '../../styles/admin/CompanyDashboard.module.css';

const CompanyDashboard = () => {
  const [facilityData, setFacilityData] = useState(null);
  const [isEditMode, setIsEditMode] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [regions, setRegions] = useState([]);
  const [cities, setCities] = useState([]);
  const [selectedRegionId, setSelectedRegionId] = useState('');
  
  const [editFormData, setEditFormData] = useState({
    facility_name: '',
    facility_type: '',
    facility_theme: '',
    facility_address_location: '',
    facility_address_city: '',
    facility_detail_address: '',
    facility_phone: '',
    facility_homepage: '',
    facility_charge: '',
    facility_tag: '',
    category: '',
    default_message: '',
    introduction: '',
    facility_email: '',
    facility_website: '',
    capacity: '',
    established_date: '',
    license_number: '',
    services: [],
    photo_url: '',
    is_thumbnail: false
  });

  // 파일 업로드 관련 상태
  const [selectedFile, setSelectedFile] = useState(null);
  const [uploadedPhotoUrl, setUploadedPhotoUrl] = useState('');
  const [isUploading, setIsUploading] = useState(false);

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
      '강화군', '계양구', '미추홀구', '남동구', '동구', '부평구', '서구', '연수구', '옹진군', '중구'
    ],
    5: [ // 광주광역시
      '광산구', '남구', '동구', '북구', '서구'
    ],
    6: [ // 대전광역시
      '대덕구', '동구', '서구', '유성구', '중구'
    ],
    7: [ // 울산광역시
      '남구', '동구', '북구', '중구', '울주군'
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
      '괴산군', '단양군', '보은군', '영동군', '옥천군', '음성군', '증평군', '진천군',
      '청주시', '충주시', '제천시'
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

  // 시설 유형 옵션
  const facilityTypeOptions = [
    { value: '요양원', label: '요양원' },
    { value: '실버타운', label: '실버타운' }
  ];

  // 테마 옵션
  const themeOptions = [
    { value: '자연친화', label: '자연친화' },
    { value: '의료특화', label: '의료특화' },
    { value: '문화생활', label: '문화생활' }
  ];

  // 서비스 항목 옵션
  const serviceOptions = [
    '24시간 간병서비스', '의료진 상주', '물리치료', '작업치료', '언어치료',
    '영양관리', '레크리에이션', '목욕서비스', '세탁서비스', '급식서비스',
    '응급의료체계', '치매전문케어', '재활프로그램', '문화활동', '종교활동'
  ];

  // 파일 업로드 관련 함수들
  const handleFileSelect = (e) => {
    const file = e.target.files[0];
    if (file) {
      // 파일 크기 체크 (10MB 제한)
      if (file.size > 10 * 1024 * 1024) {
        alert('파일 크기가 10MB를 초과합니다.');
        return;
      }

      // 파일 형식 체크
      const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/bmp', 'image/webp'];
      if (!allowedTypes.includes(file.type)) {
        alert('지원되는 이미지 형식: JPG, PNG, GIF, BMP, WEBP');
        return;
      }

      setSelectedFile(file);
    }
  };

  const uploadFile = async () => {
    if (!selectedFile) return null;

    const formData = new FormData();
    formData.append('file', selectedFile);

    try {
      setIsUploading(true);
      const response = await axios.post('/api/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      if (response.data && response.data.filePath) {
        const uploadedUrl = response.data.filePath;
        setUploadedPhotoUrl(uploadedUrl);
        setEditFormData(prev => ({
          ...prev,
          photo_url: uploadedUrl,
          is_thumbnail: true
        }));
        return uploadedUrl;
      }
    } catch (error) {
      console.error('파일 업로드 실패:', error);
      alert('파일 업로드에 실패했습니다.');
      return null;
    } finally {
      setIsUploading(false);
    }
  };

  const handleFileRemove = () => {
    setSelectedFile(null);
    setUploadedPhotoUrl('');
    setEditFormData(prev => ({
      ...prev,
      photo_url: '',
      is_thumbnail: false
    }));
  };

  // 본인 시설 정보 조회
  const fetchFacilityData = async () => {
    setIsLoading(true);
    try {
      // JWT 토큰에서 memberId를 가져와서 본인 정보만 조회
      const response = await fetchFacilityProfile();
      if (response.data) {
        setFacilityData(response.data);
        
        // 🔥 필드명을 snake_case로 매핑
        setEditFormData({
          facility_name: response.data.facilityName || response.data.facility_name || '',
          facility_type: response.data.facilityType || response.data.facility_type || '',
          facility_theme: response.data.facilityTheme || response.data.facility_theme || '',
          facility_address_location: response.data.facilityAddressLocation || response.data.facility_address_location || '',
          facility_address_city: response.data.facilityAddressCity || response.data.facility_address_city || '',
          facility_detail_address: response.data.facilityAddressDetail || response.data.facility_detail_address || '',
          facility_phone: response.data.facilityPhone || response.data.facility_phone || '',
          facility_homepage: response.data.facilityWebsite || response.data.facility_homepage || '',
          facility_charge: response.data.facilityCharge || response.data.facility_charge || '',
          facility_tag: response.data.facilityTag || response.data.facility_tag || '',
          category: response.data.category || '',
          default_message: response.data.defaultMessage || response.data.default_message || '',
          introduction: response.data.introduction || '',
          facility_email: response.data.facilityEmail || response.data.facility_email || '',
          facility_website: response.data.facilityWebsite || response.data.facility_website || '',
          capacity: response.data.capacity || '',
          established_date: response.data.establishedDate || response.data.established_date || '',
          license_number: response.data.licenseNumber || response.data.license_number || '',
          services: response.data.services || [],
          photo_url: response.data.photoUrl || response.data.photo_url || '',
          is_thumbnail: response.data.isThumbnail || response.data.is_thumbnail || false
        });

        // 지역이 선택되어 있으면 해당 시/군/구 목록 설정
        const locationName = response.data.facilityAddressLocation || response.data.facility_address_location;
        if (locationName) {
          const regionObj = staticRegions.find(r => r.name === locationName);
          if (regionObj && cityData[regionObj.id]) {
            setSelectedRegionId(regionObj.id);
            const cityList = cityData[regionObj.id].map((cityName, index) => ({
              id: index + 1,
              name: cityName
            }));
            setCities(cityList);
          }
        }
      }
    } catch (error) {
      console.error('시설 정보 조회 실패:', error);
      alert('시설 정보를 불러오는데 실패했습니다.');
    } finally {
      setIsLoading(false);
    }
  };

  // 시설 정보 수정
  const handleEditSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      await axios.put('/api/facilities/me', editFormData);
      alert('시설 정보가 성공적으로 수정되었습니다.');
      setIsEditMode(false);
      fetchFacilityData(); // 수정 후 데이터 새로고침
    } catch (error) {
      console.error('시설 정보 수정 실패:', error);
      alert('시설 정보 수정에 실패했습니다.');
    } finally {
      setIsLoading(false);
    }
  };

  // 입력값 변경 처리
  const handleEditInputChange = (e) => {
    const { name, value } = e.target;
    
    // 시설 유형이 변경되면 카테고리 초기화
    if (name === 'facility_type') {
      setEditFormData(prev => ({
        ...prev,
        [name]: value,
        category: '' // 시설 유형이 변경되면 카테고리 초기화
      }));
      return;
    }
    
    setEditFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // 서비스 선택 처리
  const handleServiceChange = (service) => {
    setEditFormData(prev => ({
      ...prev,
      services: prev.services.includes(service)
        ? prev.services.filter(s => s !== service)
        : [...prev.services, service]
    }));
  };

  // 지역 변경 처리
  const handleEditRegionChange = (e) => {
    const selectedRegion = e.target.value;
    
    setEditFormData(prev => ({
      ...prev,
      facility_address_location: selectedRegion,
      facility_address_city: '' // 지역 변경 시 시/군/구 초기화
    }));

    // 선택된 지역에 따라 시/군/구 목록 업데이트
    const regionObj = staticRegions.find(r => r.name === selectedRegion);
    if (regionObj && cityData[regionObj.id]) {
      setSelectedRegionId(regionObj.id);
      const cityList = cityData[regionObj.id].map((cityName, index) => ({
        id: index + 1,
        name: cityName
      }));
      setCities(cityList);
    } else {
      setCities([]);
    }
  };

  // 시/군/구 변경 처리
  const handleEditCityChange = (e) => {
    setEditFormData(prev => ({
      ...prev,
      facility_address_city: e.target.value
    }));
  };

  useEffect(() => {
    fetchFacilityData();
  }, []);

  if (isLoading) {
    return (
      <div className={styles['loading-container']}>
        <div className={styles['loading-spinner']}>로딩 중...</div>
      </div>
    );
  }

  return (
    <div className={styles['company-dashboard-container']}>
      {/* 헤더 */}
      <div className={styles['dashboard-header']}>
        <div className={styles['header-title']}>
          <h1>🏢 시설 관리 대시보드</h1>
          <p>시설 정보를 관리하고 업데이트하세요</p>
        </div>
        <div className={styles['header-actions']}>
          {!isEditMode ? (
            <button 
              className={styles['edit-btn']}
              onClick={() => setIsEditMode(true)}
            >
              ✏️ 정보 수정
            </button>
          ) : (
            <div className={styles['edit-actions']}>
              <button 
                className={styles['cancel-btn']}
                onClick={() => {
                  setIsEditMode(false);
                  setSelectedFile(null);
                  setUploadedPhotoUrl('');
                }}
              >
                취소
              </button>
              <button 
                className={styles['save-btn']}
                onClick={handleEditSubmit}
                disabled={isLoading}
              >
                {isLoading ? '저장중...' : '저장'}
              </button>
            </div>
          )}
        </div>
      </div>

      {/* 컨텐츠 영역 */}
      <div className={styles['dashboard-content']}>
        {!isEditMode ? (
          // 읽기 모드
          <div className={styles['view-mode']}>
            <div className={styles['info-card']}>
              <h3>🏢 기본 정보</h3>
              <div className={styles['info-grid']}>
                <div className={styles['info-item']}>
                  <label>시설명</label>
                  <span>{facilityData?.facility_name || '정보 없음'}</span>
                </div>
                <div className={styles['info-item']}>
                  <label>시설 유형</label>
                  <span>{facilityData?.facility_type || '정보 없음'}</span>
                </div>
                <div className={styles['info-item']}>
                  <label>수용 인원</label>
                  <span>{facilityData?.capacity ? `${facilityData.capacity}명` : '정보 없음'}</span>
                </div>
                <div className={styles['info-item']}>
                  <label>설립일</label>
                  <span>{facilityData?.established_date || '정보 없음'}</span>
                </div>
              </div>
            </div>

            <div className={styles['info-card']}>
              <h3>📍 위치 정보</h3>
              <div className={styles['info-grid']}>
                <div className={styles['info-item']}>
                  <label>지역</label>
                  <span>{facilityData?.facility_address_location || '정보 없음'}</span>
                </div>
                <div className={styles['info-item']}>
                  <label>시/군/구</label>
                  <span>{facilityData?.facility_address_city || '정보 없음'}</span>
                </div>
                <div className={styles['info-item']} style={{gridColumn: 'span 2'}}>
                  <label>상세 주소</label>
                  <span>{facilityData?.facility_detail_address || '정보 없음'}</span>
                </div>
              </div>
            </div>

            <div className={styles['info-card']}>
              <h3>📞 연락처 정보</h3>
              <div className={styles['info-grid']}>
                <div className={styles['info-item']}>
                  <label>전화번호</label>
                  <span>{facilityData?.facility_phone || '정보 없음'}</span>
                </div>
                <div className={styles['info-item']}>
                  <label>이메일</label>
                  <span>{facilityData?.facility_email || '정보 없음'}</span>
                </div>
                <div className={styles['info-item']} style={{gridColumn: 'span 2'}}>
                  <label>웹사이트</label>
                  <span>{facilityData?.facility_homepage || '정보 없음'}</span>
                </div>
              </div>
            </div>

            <div className={styles['info-card']}>
              <h3>🎯 운영 정보</h3>
              <div className={styles['info-grid']}>
                <div className={styles['info-item']}>
                  <label>테마</label>
                  <span>{facilityData?.facility_theme || '정보 없음'}</span>
                </div>
                <div className={styles['info-item']}>
                  <label>월별이용료</label>
                  <span>{facilityData?.facility_charge ? `${facilityData.facility_charge}만원` : '정보 없음'}</span>
                </div>
                <div className={styles['info-item']}>
                  <label>카테고리</label>
                  <span>{facilityData?.category || '정보 없음'}</span>
                </div>
                <div className={styles['info-item']}>
                  <label>기본 메시지</label>
                  <span>{facilityData?.default_message || '정보 없음'}</span>
                </div>
              </div>
            </div>

            <div className={styles['info-card']}>
              <h3>🏢 시설 특성</h3>
              <div className={styles['info-grid']}>
                <div className={styles['info-item']} style={{gridColumn: 'span 2'}}>
                  <label>시설 태그</label>
                  <div className={styles['tag-list']}>
                    {facilityData?.facility_tag ? (
                      facilityData.facility_tag.split(',').map((tag, index) => (
                        <span key={index} className={styles['facility-tag']}>
                          {tag.trim()}
                        </span>
                      ))
                    ) : (
                      <span className={styles['no-data']}>등록된 시설 특성이 없습니다</span>
                    )}
                  </div>
                </div>
              </div>
            </div>

            <div className={styles['info-card']}>
              <h3>🛡️ 제공 서비스</h3>
              <div className={styles['services-list']}>
                {facilityData?.services && facilityData.services.length > 0 ? (
                  facilityData.services.map((service, index) => (
                    <span key={index} className={styles['service-tag']}>
                      {service}
                    </span>
                  ))
                ) : (
                  <span className={styles['no-data']}>등록된 서비스가 없습니다</span>
                )}
              </div>
            </div>

            <div className={styles['info-card']}>
              <h3>📸 시설 사진</h3>
              <div className={styles['photo-info']}>
                {facilityData?.photo_url ? (
                  <div style={{textAlign: 'center'}}>
                    <img 
                      src={facilityData.photo_url} 
                      alt="시설 사진" 
                      style={{
                        maxWidth: '300px',
                        maxHeight: '200px',
                        borderRadius: '8px',
                        border: '1px solid #ddd'
                      }}
                    />
                    <p style={{marginTop: '10px', color: '#666', fontSize: '14px'}}>
                      {facilityData.is_thumbnail ? '📌 썸네일 사진' : '📷 일반 사진'}
                    </p>
                  </div>
                ) : (
                  <span className={styles['no-data']}>등록된 시설 사진이 없습니다</span>
                )}
              </div>
            </div>

            <div className={styles['info-card']}>
              <h3>📝 시설 소개</h3>
              <div className={styles['introduction']}>
                {facilityData?.introduction || '시설 소개가 등록되지 않았습니다.'}
              </div>
            </div>
          </div>
        ) : (
          // 편집 모드
          <form onSubmit={handleEditSubmit} className={styles['edit-mode']}>
            <div className={styles['form-card']}>
              <h3>🏢 기본 정보</h3>
              <div className={styles['form-grid']}>
                <div className={styles['form-group']}>
                  <label>시설명 *</label>
                  <input
                    type="text"
                    name="facility_name"
                    value={editFormData.facility_name}
                    onChange={handleEditInputChange}
                    required
                    placeholder="시설명을 입력하세요"
                  />
                </div>
                <div className={styles['form-group']}>
                  <label>시설 유형 *</label>
                  <select
                    name="facility_type"
                    value={editFormData.facility_type}
                    onChange={handleEditInputChange}
                    required
                  >
                    <option value="">시설 유형 선택</option>
                    {facilityTypeOptions.map(option => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                </div>
                <div className={styles['form-group']}>
                  <label>수용 인원</label>
                  <input
                    type="number"
                    name="capacity"
                    value={editFormData.capacity}
                    onChange={handleEditInputChange}
                    placeholder="수용 가능 인원"
                    min="1"
                  />
                </div>
                <div className={styles['form-group']}>
                  <label>설립일</label>
                  <input
                    type="date"
                    name="established_date"
                    value={editFormData.established_date}
                    onChange={handleEditInputChange}
                  />
                </div>
              </div>
            </div>

            <div className={styles['form-card']}>
              <h3>📍 위치 정보</h3>
              <div className={styles['form-grid']}>
                <div className={styles['form-group']}>
                  <label>지역 *</label>
                  <select
                    name="facility_address_location"
                    value={editFormData.facility_address_location}
                    onChange={handleEditRegionChange}
                    required
                  >
                    <option value="">지역 선택</option>
                    {staticRegions.map(region => (
                      <option key={region.id} value={region.name}>
                        {region.name}
                      </option>
                    ))}
                  </select>
                </div>
                <div className={styles['form-group']}>
                  <label>시/군/구 *</label>
                  <select
                    name="facility_address_city"
                    value={editFormData.facility_address_city}
                    onChange={handleEditCityChange}
                    required
                    disabled={!cities.length}
                  >
                    <option value="">시/군/구 선택</option>
                    {cities.map(city => (
                      <option key={city.id} value={city.name}>
                        {city.name}
                      </option>
                    ))}
                  </select>
                </div>
                <div className={styles['form-group']} style={{gridColumn: 'span 2'}}>
                  <label>상세 주소</label>
                  <input
                    type="text"
                    name="facility_detail_address"
                    value={editFormData.facility_detail_address}
                    onChange={handleEditInputChange}
                    placeholder="상세 주소를 입력하세요"
                  />
                </div>
              </div>
            </div>

            <div className={styles['form-card']}>
              <h3>📞 연락처 정보</h3>
              <div className={styles['form-grid']}>
                <div className={styles['form-group']}>
                  <label>전화번호 *</label>
                  <input
                    type="tel"
                    name="facility_phone"
                    value={editFormData.facility_phone}
                    onChange={handleEditInputChange}
                    required
                    placeholder="000-0000-0000"
                  />
                </div>
                <div className={styles['form-group']}>
                  <label>이메일</label>
                  <input
                    type="email"
                    name="facility_email"
                    value={editFormData.facility_email}
                    onChange={handleEditInputChange}
                    placeholder="contact@facility.com"
                  />
                </div>
                <div className={styles['form-group']} style={{gridColumn: 'span 2'}}>
                  <label>웹사이트</label>
                  <input
                    type="url"
                    name="facility_homepage"
                    value={editFormData.facility_homepage}
                    onChange={handleEditInputChange}
                    placeholder="https://www.facility.com"
                  />
                </div>
              </div>
            </div>

            <div className={styles['form-card']}>
              <h3>🎯 운영 정보</h3>
              <div className={styles['form-grid']}>
                <div className={styles['form-group']}>
                  <label>테마</label>
                  <select
                    name="facility_theme"
                    value={editFormData.facility_theme}
                    onChange={handleEditInputChange}
                  >
                    <option value="">테마를 선택하세요</option>
                    {themeOptions.map(option => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                </div>
                <div className={styles['form-group']}>
                  <label>월별이용료 (만원)</label>
                  <input
                    type="number"
                    name="facility_charge"
                    value={editFormData.facility_charge}
                    onChange={handleEditInputChange}
                    placeholder="월별 이용료를 입력하세요"
                    min="0"
                  />
                </div>
                <div className={styles['form-group']}>
                  <label>{editFormData.facility_type === '요양원' ? '업종' : editFormData.facility_type === '실버타운' ? '주거형태' : '카테고리'}</label>
                  <select
                    name="category"
                    value={editFormData.category}
                    onChange={handleEditInputChange}
                  >
                    <option value="">{editFormData.facility_type === '요양원' ? '업종을 선택하세요' : editFormData.facility_type === '실버타운' ? '주거형태를 선택하세요' : '카테고리를 선택하세요'}</option>
                    {editFormData.facility_type === '요양원' ? (
                      <>
                        <option value="요양원">요양원</option>
                        <option value="요양병원">요양병원</option>
                        <option value="방문요양센터">방문요양센터</option>
                        <option value="주야간보호센터">주야간보호센터</option>
                      </>
                    ) : editFormData.facility_type === '실버타운' ? (
                      <>
                        <option value="아파트형">아파트형</option>
                        <option value="호텔형">호텔형</option>
                        <option value="빌라형">빌라형</option>
                        <option value="주택형">주택형</option>
                        <option value="단독빌딩">단독빌딩</option>
                        <option value="일반빌딩">일반빌딩</option>
                      </>
                    ) : (
                      <>
                        <option value="요양원">요양원</option>
                        <option value="요양병원">요양병원</option>
                        <option value="방문요양센터">방문요양센터</option>
                        <option value="주야간보호센터">주야간보호센터</option>
                        <option value="아파트형">아파트형</option>
                        <option value="호텔형">호텔형</option>
                        <option value="빌라형">빌라형</option>
                        <option value="주택형">주택형</option>
                        <option value="단독빌딩">단독빌딩</option>
                        <option value="일반빌딩">일반빌딩</option>
                      </>
                    )}
                  </select>
                </div>
                <div className={styles['form-group']}>
                  <label>기본 메시지</label>
                  <input
                    type="text"
                    name="default_message"
                    value={editFormData.default_message}
                    onChange={handleEditInputChange}
                    placeholder="기본 안내 메시지를 입력하세요"
                  />
                </div>
              </div>
            </div>

            <div className={styles['form-card']}>
              <h3>🏢 시설 특성</h3>
              <div style={{marginBottom: '20px', padding: '15px', backgroundColor: '#f8f9fa', borderRadius: '8px', border: '1px solid #e9ecef'}}>
                <h4 style={{margin: '0 0 12px 0', fontSize: '15px', fontWeight: 'bold', color: '#495057'}}>⚕️ 시설관리</h4>
                
                {/* 서비스/프로그램 또는 시설 */}
                <div style={{marginBottom: '15px'}}>
                  <h5 style={{margin: '0 0 8px 0', fontSize: '13px', fontWeight: '600', color: '#6c757d'}}>
                    {editFormData.facility_type === '실버타운' ? '시설' : '서비스·프로그램'}
                  </h5>
                  <div className={styles["checkbox-group"]} style={{display: 'flex', flexWrap: 'wrap', gap: '10px'}}>
                    {editFormData.facility_type === '실버타운' ? 
                      ['수영장', '도서관', '영화관', '병원'].map(tag => (
                        <label key={tag} style={{display: 'flex', alignItems: 'center', marginRight: '15px', cursor: 'pointer'}}>
                          <input
                            type="checkbox"
                            checked={(editFormData.facility_tag || '').includes(tag)}
                            onChange={(e) => {
                              if (e.target.checked) {
                                setEditFormData(prev => ({
                                  ...prev,
                                  facility_tag: prev.facility_tag ? `${prev.facility_tag},${tag}` : tag
                                }));
                              } else {
                                setEditFormData(prev => ({
                                  ...prev,
                                  facility_tag: (prev.facility_tag || '').split(',').filter(t => t !== tag).join(',')
                                }));
                              }
                            }}
                            style={{marginRight: '5px'}}
                          />
                          <span>{tag}</span>
                        </label>
                      )) :
                      ['재활물리치료', '체육교실', '노래교실', '문화공연'].map(tag => (
                        <label key={tag} style={{display: 'flex', alignItems: 'center', marginRight: '15px', cursor: 'pointer'}}>
                          <input
                            type="checkbox"
                            checked={(editFormData.facility_tag || '').includes(tag)}
                            onChange={(e) => {
                              if (e.target.checked) {
                                setEditFormData(prev => ({
                                  ...prev,
                                  facility_tag: prev.facility_tag ? `${prev.facility_tag},${tag}` : tag
                                }));
                              } else {
                                setEditFormData(prev => ({
                                  ...prev,
                                  facility_tag: (prev.facility_tag || '').split(',').filter(t => t !== tag).join(',')
                                }));
                              }
                            }}
                            style={{marginRight: '5px'}}
                          />
                          <span>{tag}</span>
                        </label>
                      ))
                    }
                  </div>
                </div>

                {/* 주변환경 */}
                <div style={{marginBottom: '15px'}}>
                  <h5 style={{margin: '0 0 8px 0', fontSize: '13px', fontWeight: '600', color: '#6c757d'}}>주변환경</h5>
                  <div className={styles["checkbox-group"]} style={{display: 'flex', flexWrap: 'wrap', gap: '10px'}}>
                    {['산', '바다', '강/호수'].map(tag => (
                      <label key={tag} style={{display: 'flex', alignItems: 'center', marginRight: '15px', cursor: 'pointer'}}>
                        <input
                          type="checkbox"
                          checked={(editFormData.facility_tag || '').includes(tag)}
                          onChange={(e) => {
                            if (e.target.checked) {
                              setEditFormData(prev => ({
                                ...prev,
                                facility_tag: prev.facility_tag ? `${prev.facility_tag},${tag}` : tag
                              }));
                            } else {
                              setEditFormData(prev => ({
                                ...prev,
                                facility_tag: (prev.facility_tag || '').split(',').filter(t => t !== tag).join(',')
                              }));
                            }
                          }}
                          style={{marginRight: '5px'}}
                        />
                        <span>{tag}</span>
                      </label>
                    ))}
                  </div>
                </div>

                {/* 편의시설 */}
                <div style={{marginBottom: '0'}}>
                  <h5 style={{margin: '0 0 8px 0', fontSize: '13px', fontWeight: '600', color: '#6c757d'}}>편의시설</h5>
                  <div className={styles["checkbox-group"]} style={{display: 'flex', flexWrap: 'wrap', gap: '10px'}}>
                    {['자유면회', '주차가능'].map(tag => (
                      <label key={tag} style={{display: 'flex', alignItems: 'center', marginRight: '15px', cursor: 'pointer'}}>
                        <input
                          type="checkbox"
                          checked={(editFormData.facility_tag || '').includes(tag)}
                          onChange={(e) => {
                            if (e.target.checked) {
                              setEditFormData(prev => ({
                                ...prev,
                                facility_tag: prev.facility_tag ? `${prev.facility_tag},${tag}` : tag
                              }));
                            } else {
                              setEditFormData(prev => ({
                                ...prev,
                                facility_tag: (prev.facility_tag || '').split(',').filter(t => t !== tag).join(',')
                              }));
                            }
                          }}
                          style={{marginRight: '5px'}}
                        />
                        <span>{tag}</span>
                      </label>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            <div className={styles['form-card']}>
              <h3>🛡️ 제공 서비스</h3>
              <div className={styles['services-grid']}>
                {serviceOptions.map(service => (
                  <label key={service} className={styles['service-checkbox']}>
                    <input
                      type="checkbox"
                      checked={editFormData.services.includes(service)}
                      onChange={() => handleServiceChange(service)}
                    />
                    <span>{service}</span>
                  </label>
                ))}
              </div>
            </div>

            <div className={styles['form-card']}>
              <h3>📸 시설 사진</h3>
              <div className={styles['form-group']}>
                <label>시설 사진 업로드</label>
                <div style={{
                  border: '2px dashed #e9ecef',
                  borderRadius: '8px',
                  padding: '20px',
                  textAlign: 'center',
                  backgroundColor: '#f8f9fa',
                  marginTop: '8px'
                }}>
                  <input
                    type="file"
                    id="facility-photo-upload"
                    accept="image/*"
                    onChange={handleFileSelect}
                    style={{ display: 'none' }}
                  />
                  
                  {!selectedFile && !uploadedPhotoUrl && !editFormData.photo_url && (
                    <div>
                      <div style={{fontSize: '48px', marginBottom: '10px', opacity: 0.5}}>📷</div>
                      <p style={{margin: '0 0 15px 0', color: '#6c757d'}}>
                        시설 사진을 업로드하세요
                      </p>
                      <label 
                        htmlFor="facility-photo-upload" 
                        style={{
                          display: 'inline-block',
                          padding: '10px 20px',
                          backgroundColor: '#007bff',
                          color: 'white',
                          borderRadius: '5px',
                          cursor: 'pointer',
                          border: 'none',
                          fontSize: '14px'
                        }}
                      >
                        📁 사진 선택
                      </label>
                    </div>
                  )}

                  {editFormData.photo_url && !selectedFile && !uploadedPhotoUrl && (
                    <div style={{textAlign: 'center'}}>
                      <img 
                        src={editFormData.photo_url} 
                        alt="현재 시설 사진" 
                        style={{
                          maxWidth: '200px',
                          maxHeight: '150px',
                          borderRadius: '8px',
                          border: '1px solid #ddd',
                          marginBottom: '15px'
                        }}
                      />
                      <p style={{margin: '0 0 15px 0', color: '#6c757d'}}>
                        현재 등록된 사진 ({editFormData.is_thumbnail ? '썸네일' : '일반'})
                      </p>
                      <label 
                        htmlFor="facility-photo-upload" 
                        style={{
                          display: 'inline-block',
                          padding: '8px 16px',
                          backgroundColor: '#6c757d',
                          color: 'white',
                          borderRadius: '5px',
                          cursor: 'pointer',
                          border: 'none',
                          fontSize: '14px'
                        }}
                      >
                        🔄 사진 변경
                      </label>
                    </div>
                  )}
                  
                  {selectedFile && !uploadedPhotoUrl && (
                    <div style={{textAlign: 'left'}}>
                      <div style={{
                        display: 'flex', 
                        alignItems: 'center', 
                        justifyContent: 'space-between',
                        padding: '10px',
                        backgroundColor: '#e7f3ff',
                        borderRadius: '5px',
                        marginBottom: '15px'
                      }}>
                        <span>📎 선택된 파일: <strong>{selectedFile.name}</strong></span>
                        <button 
                          type="button" 
                          onClick={handleFileRemove}
                          style={{
                            backgroundColor: '#dc3545',
                            color: 'white',
                            border: 'none',
                            borderRadius: '3px',
                            padding: '5px 10px',
                            cursor: 'pointer'
                          }}
                        >
                          ❌ 제거
                        </button>
                      </div>
                      <button 
                        type="button" 
                        onClick={uploadFile}
                        style={{
                          width: '100%',
                          padding: '12px',
                          backgroundColor: '#28a745',
                          color: 'white',
                          border: 'none',
                          borderRadius: '5px',
                          fontSize: '16px',
                          cursor: isUploading ? 'not-allowed' : 'pointer',
                          opacity: isUploading ? 0.6 : 1
                        }}
                        disabled={isUploading}
                      >
                        {isUploading ? '📤 업로드 중...' : '📤 업로드 시작'}
                      </button>
                    </div>
                  )}
                  
                  {uploadedPhotoUrl && (
                    <div style={{textAlign: 'left'}}>
                      <div style={{
                        padding: '15px',
                        backgroundColor: '#d4edda',
                        borderRadius: '5px',
                        border: '1px solid #c3e6cb'
                      }}>
                        <div style={{marginBottom: '10px'}}>
                          <span style={{color: '#155724', fontWeight: 'bold'}}>✅ 업로드 완료!</span>
                        </div>
                        <img 
                          src={uploadedPhotoUrl} 
                          alt="업로드된 사진" 
                          style={{
                            maxWidth: '150px',
                            maxHeight: '100px',
                            borderRadius: '5px',
                            border: '1px solid #c3e6cb'
                          }}
                        />
                      </div>
                      <button 
                        type="button" 
                        onClick={() => {
                          setUploadedPhotoUrl('');
                          setSelectedFile(null);
                        }}
                        style={{
                          marginTop: '10px',
                          padding: '8px 16px',
                          backgroundColor: '#6c757d',
                          color: 'white',
                          border: 'none',
                          borderRadius: '5px',
                          cursor: 'pointer',
                          fontSize: '14px'
                        }}
                      >
                        🔄 다른 사진 선택
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>

            <div className={styles['form-card']}>
              <h3>📝 시설 소개</h3>
              <div className={styles['form-group']}>
                <textarea
                  name="introduction"
                  value={editFormData.introduction}
                  onChange={handleEditInputChange}
                  placeholder="시설에 대한 소개를 작성해주세요..."
                  rows="6"
                  className={styles['introduction-textarea']}
                />
              </div>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};

export default CompanyDashboard;
