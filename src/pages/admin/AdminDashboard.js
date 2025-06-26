import React, { useState } from "react";
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
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedRegionId, setSelectedRegionId] = useState('');
  const [cities, setCities] = useState([]);
  const [formData, setFormData] = useState({
    prodName: '',
    prodTypeName: '',
    member_id: '',
    // 기업 전용 필드
    facility_type: '',
    facility_name: '',
    facility_charge: '',
    facility_theme: '',
    hope_work_area_location: '',
    hope_work_area_city: '',
    facility_detail_address: '',
    facility_phone: '',
    facility_homepage: '',
    default_message: '',
    prodDetail: ''
  });

  const handleOpenModal = () => {
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setFormData({
      prodName: '',
      prodTypeName: '',
      member_id: '',
      facility_type: '',
      facility_name: '',
      facility_charge: '',
      facility_theme: '',
      hope_work_area_location: '',
      hope_work_area_city: '',
      facility_detail_address: '',
      facility_phone: '',
      facility_homepage: '',
      default_message: '',
      prodDetail: ''
    });
    setSelectedRegionId('');
    setCities([]);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    console.log('🔍 Input changed:', { name, value });
    setFormData(prev => {
      const newData = {
        ...prev,
        [name]: value
      };
      console.log('🔍 Updated formData:', newData);
      return newData;
    });
  };

  const handleRegionChange = (e) => {
    const regionId = e.target.value;
    setSelectedRegionId(regionId);
    
    if (regionId) {
      const regionData = regions.find(region => region.id === parseInt(regionId));
      setCities(cityData[regionId] || []);
      setFormData(prev => ({
        ...prev,
        hope_work_area_location: regionData ? regionData.name : '',
        hope_work_area_city: ''
      }));
    } else {
      setCities([]);
      setFormData(prev => ({
        ...prev,
        hope_work_area_location: '',
        hope_work_area_city: ''
      }));
    }
  };

  const handleCityChange = (e) => {
    const { value } = e.target;
    setFormData(prev => ({
      ...prev,
      hope_work_area_city: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Form submitted:', formData);
    // 실제 제출 로직 구현
    alert('상품이 등록되었습니다.');
    handleCloseModal();
  };

  return (
    <div className={styles["admindashboard-container"]}>
      <h2>관리자 대시보드</h2>
      <button 
        onClick={handleOpenModal}
        className={styles["register-btn"]}
      >
        상품 등록
      </button>

      {/* 상품 등록 모달 */}
      {isModalOpen && (
        <div className={styles["modal-overlay"]} onClick={handleCloseModal}>
          <div className={styles["modal-content"]} onClick={(e) => e.stopPropagation()}>
            <div className={styles["modal-header"]}>
              <h3>🛍️ 새 상품 등록</h3>
              <button className={styles["close-btn"]} onClick={handleCloseModal}>✖</button>
            </div>
            
            <form onSubmit={handleSubmit} className={styles["register-form"]}>
              <div className={styles["form-row"]}>
                <div className={styles["form-group"]}>
                  <label>상품명 *</label>
                  <input
                    type="text"
                    name="prodName"
                    value={formData.prodName}
                    onChange={handleInputChange}
                    placeholder="상품명을 입력하세요"
                    required
                  />
                </div>

                <div className={styles["form-group"]}>
                  <label>상품 유형 *</label>
                  <select
                    name="prodTypeName"
                    value={formData.prodTypeName}
                    onChange={handleInputChange}
                    required
                  >
                    <option value="">유형을 선택하세요</option>
                    <option value="요양사">👨‍⚕️ 요양사</option>
                    <option value="기업">🏢 기업</option>
                  </select>
                </div>
              </div>

              {/* 기업 전용 필드들 */}
              {formData.prodTypeName === '기업' && (
                <>
                  <div className={styles["form-group"]}>
                    <label>시설 유형 *</label>
                    <select
                      name="facility_type"
                      value={formData.facility_type}
                      onChange={handleInputChange}
                      required
                    >
                      <option value="">시설 유형을 선택하세요</option>
                      <option value="요양원">요양원</option>
                      <option value="실버타운">실버타운</option>
                    </select>
                  </div>

                  {/* 요양원 또는 실버타운 선택시 지역 드롭다운 표시 */}
                  {console.log('🔍 Checking facility_type condition:', { 
                    facility_type: formData.facility_type, 
                    condition: (formData.facility_type === '요양원' || formData.facility_type === '실버타운')
                  })}
                  {(formData.facility_type === '요양원' || formData.facility_type === '실버타운') && (
                    <div className={styles["form-row"]}>
                      <div className={styles["form-group"]}>
                        <label>지역(도/광역시) *</label>
                        <select
                          value={selectedRegionId}
                          onChange={handleRegionChange}
                          required
                        >
                          <option value="">지역을 선택하세요</option>
                          {regions.map(region => (
                            <option key={region.id} value={region.id}>
                              {region.name}
                            </option>
                          ))}
                        </select>
                      </div>

                      <div className={styles["form-group"]}>
                        <label>시/군/구 *</label>
                        <select
                          name="hope_work_area_city"
                          value={formData.hope_work_area_city}
                          onChange={handleCityChange}
                          disabled={!selectedRegionId}
                          required
                        >
                          <option value="">시/군/구를 선택하세요</option>
                          {cities.map((city, index) => (
                            <option key={index} value={city}>
                              {city}
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>
                  )}

                  <div className={styles["form-row"]}>
                    <div className={styles["form-group"]}>
                      <label>시설명 *</label>
                      <input
                        type="text"
                        name="facility_name"
                        value={formData.facility_name}
                        onChange={handleInputChange}
                        placeholder="시설명을 입력하세요"
                        required
                      />
                    </div>

                    <div className={styles["form-group"]}>
                      <label>월별이용료 * (만원)</label>
                      <input
                        type="number"
                        name="facility_charge"
                        value={formData.facility_charge}
                        onChange={handleInputChange}
                        placeholder="월별 이용료를 입력하세요"
                        min="0"
                        required
                      />
                    </div>
                  </div>

                  <div className={styles["form-group"]}>
                    <label>테마</label>
                    <select
                      name="facility_theme"
                      value={formData.facility_theme}
                      onChange={handleInputChange}
                    >
                      <option value="">테마를 선택하세요</option>
                      <option value="자연친화">자연친화</option>
                      <option value="의료특화">의료특화</option>
                      <option value="문화생활">문화생활</option>
                    </select>
                  </div>

                  <div className={styles["form-row"]}>
                    <div className={styles["form-group"]}>
                      <label>상세주소 *</label>
                      <input
                        type="text"
                        name="facility_detail_address"
                        value={formData.facility_detail_address}
                        onChange={handleInputChange}
                        placeholder="상세주소를 입력하세요"
                        required
                      />
                    </div>

                    <div className={styles["form-group"]}>
                      <label>연락처 *</label>
                      <input
                        type="tel"
                        name="facility_phone"
                        value={formData.facility_phone}
                        onChange={handleInputChange}
                        placeholder="시설 연락처"
                        required
                      />
                    </div>
                  </div>

                  <div className={styles["form-row"]}>
                    <div className={styles["form-group"]}>
                      <label>홈페이지URL</label>
                      <input
                        type="url"
                        name="facility_homepage"
                        value={formData.facility_homepage}
                        onChange={handleInputChange}
                        placeholder="시설 홈페이지 URL"
                      />
                    </div>

                    <div className={styles["form-group"]}>
                      <label>기본 메시지</label>
                      <input
                        type="text"
                        name="default_message"
                        value={formData.default_message}
                        onChange={handleInputChange}
                        placeholder="기본 안내 메시지를 입력하세요"
                      />
                    </div>
                  </div>
                </>
              )}

              <div className={styles["form-group"]}>
                <label>상세설명</label>
                <textarea
                  name="prodDetail"
                  value={formData.prodDetail}
                  onChange={handleInputChange}
                  placeholder="상세설명을 입력하세요"
                  rows="3"
                />
              </div>

              <div className={styles["form-actions"]}>
                <button type="button" onClick={handleCloseModal} className={styles["cancel-btn"]}>
                  취소
                </button>
                <button type="submit" className={styles["submit-btn"]}>
                  등록
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default AdminDashboard;