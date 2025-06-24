// 📁 src/pages/admin/AdminProductList.js
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import styles from '../../../styles/admin/AdminProductList.module.css';

// 정적 지역 데이터 (하드코딩)
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

// 정적 시/군/구 데이터 (하드코딩)
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

// 더미 데이터
const dummyProducts = [
  {
    prodId: 1,
    prodName: "김영희 요양사",
    prodTypeName: "요양사",
    userGender: "여자", // 성별 추가
    hope_work_amount: 250,
    introduction: "10년 경력의 전문 요양사입니다. 치매 어르신 전문 케어 가능합니다.",
    hope_work_area_location: "서울특별시",
    hope_work_area_city: "강남구",
    hope_work_place: "강남구, 서초구",
    hope_work_type: "입주",
    hope_employment_type: "정규직", // 필터에 맞게 수정
    education_level: "대학교 졸업",
    prodDetail: "성실하고 책임감 있는 요양사입니다. 어르신들께 최선을 다하겠습니다.",
    company_name: "삼성요양원",
    start_date: "2020-03-01",
    end_date: "2024-02-28",
    certificate_name: "요양보호사 1급, 치매전문교육 수료",
    caregiver_created_at: "2024-01-15",
    caregiver_update_at: "2024-01-20",
    caregiver_deleted_at: null
  },
  {
    prodId: 2,
    prodName: "해든요양원", // facility_name
    prodTypeName: "요양원/실버타운", // facility_type
    facility_name: "해든요양원",
    facility_charge: 300, // 월별이용료
    facility_type: "요양원",
    facility_theme: "프리미엄 의료케어", // 테마
    hope_work_area_location: "경기도", // facility_address_location
    hope_work_area_city: "성남시", // facility_address_city
    facility_detail_address: "성남시 분당구 정자일로 95 (정자동)", // 상세주소
    facility_phone: "031-123-4567", // 연락처
    facility_homepage: "https://haeden-nursing.co.kr", // 홈페이지URL
    default_message: "24시간 전문 케어 서비스를 제공합니다.",
    // facility_notice 테이블 관련
    notice_title: "입소 안내",
    notice_content: "신규 입소자 모집 중입니다. 24시간 전문 의료진이 상주하여 최상의 케어를 제공합니다.",
    // facility_photo 테이블 관련
    photo_url: "/images/haeden-nursing.jpg",
    is_thumbnail: true,
    // facility_tag 테이블 관련
    category: "프리미엄",
    facility_tag: "24시간케어,전문의료진,개별맞춤",
    prodDetail: "24시간 전문 의료진이 상주하는 프리미엄 요양원입니다. 가족같은 따뜻한 돌봄을 제공합니다.",
    // 기존 필드들 (호환성 유지)
    hope_work_amount: 300,
    introduction: "24시간 전문 의료진이 상주하는 프리미엄 요양원입니다. 개별 맞춤 케어 제공합니다.",
    hope_work_place: "성남시 분당구",
    hope_work_type: "통원",
    hope_employment_type: "시설운영",
    education_level: "대학원 졸업",
    company_name: "분당요양원",
    start_date: "2018-01-01",
    end_date: "현재",
    certificate_name: "요양원 운영자격증, 사회복지사 1급",
    caregiver_created_at: "2024-01-10",
    caregiver_update_at: "2024-01-25",
    caregiver_deleted_at: null
  },
  {
    prodId: 3,
    prodName: "청담실버타운", // facility_name
    prodTypeName: "요양원/실버타운", // facility_type
    facility_name: "청담실버타운",
    facility_charge: 400, // 월별이용료
    facility_type: "실버타운",
    facility_theme: "고급 문화주거", // 테마
    hope_work_area_location: "서울특별시", // facility_address_location
    hope_work_area_city: "강남구", // facility_address_city
    facility_detail_address: "서울 강남구 청담동 123-45", // 상세주소
    facility_phone: "02-567-8901", // 연락처
    facility_homepage: "https://cheongdam-silvertown.com", // 홈페이지URL
    default_message: "품격 있는 실버라이프를 제공합니다.",
    // facility_notice 테이블 관련
    notice_title: "프리미엄 서비스 안내",
    notice_content: "청담동 최고급 실버타운에서 품격 있는 노후를 보내세요. 다양한 문화시설과 최고급 서비스를 제공합니다.",
    // facility_photo 테이블 관련
    photo_url: "/images/cheongdam-silvertown.jpg",
    is_thumbnail: true,
    // facility_tag 테이블 관련
    category: "프리미엄",
    facility_tag: "고급주거,문화시설,의료시설,청담동",
    prodDetail: "강남 청담동에 위치한 고급 실버타운으로 다양한 문화시설과 의료시설을 갖추고 있습니다. 프리미엄 실버타운으로 최고급 서비스를 제공합니다.",
    // 기존 필드들 (호환성 유지)
    hope_work_amount: 400,
    introduction: "강남 청담동에 위치한 고급 실버타운으로 다양한 문화시설과 의료시설을 갖추고 있습니다.",
    hope_work_place: "강남구 청담동",
    hope_work_type: "시설거주",
    hope_employment_type: "시설관리",
    education_level: "대학교 졸업",
    company_name: "강남힐스타운",
    start_date: "2015-05-01",
    end_date: "현재",
    certificate_name: "시설관리사, 노인복지시설 운영자격증",
    caregiver_created_at: "2024-01-05",
    caregiver_update_at: "2024-01-30",
    caregiver_deleted_at: null
  },
  {
    prodId: 4,
    prodName: "박철수 요양사",
    prodTypeName: "요양사",
    userGender: "남자", // 성별 추가
    hope_work_amount: 200,
    introduction: "물리치료 전문 요양사로 거동불편 어르신 전문 케어가 가능합니다.",
    hope_work_area_location: "부산광역시",
    hope_work_area_city: "해운대구",
    hope_work_place: "해운대구, 수영구",
    hope_work_type: "출퇴근", // 필터에 맞게 수정
    hope_employment_type: "계약직", // 필터에 맞게 수정
    education_level: "전문대학 졸업",
    prodDetail: "물리치료 전문성을 바탕으로 재활케어에 특화되어 있습니다.",
    company_name: "부산재활요양원",
    start_date: "2019-06-01",
    end_date: "2023-12-31",
    certificate_name: "물리치료사, 요양보호사 1급",
    caregiver_created_at: "2023-12-01",
    caregiver_update_at: "2024-01-12",
    caregiver_deleted_at: "2024-01-31"
  },
  {
    prodId: 5,
    prodName: "사랑가득요양원", // facility_name
    prodTypeName: "요양원/실버타운", // facility_type
    facility_name: "사랑가득요양원",
    facility_charge: 280, // 월별이용료
    facility_type: "요양원",
    facility_theme: "가족형 소규모", // 테마
    hope_work_area_location: "대구광역시", // facility_address_location
    hope_work_area_city: "수성구", // facility_address_city
    facility_detail_address: "대구 수성구 동대구로 123", // 상세주소
    facility_phone: "053-789-0123", // 연락처
    facility_homepage: "https://love-nursing.daegu.kr", // 홈페이지URL
    default_message: "가족같은 따뜻한 케어를 제공합니다.",
    // facility_notice 테이블 관련
    notice_title: "가족형 케어 안내", notice_content: "소규모 맞춤형 케어로 가족같은 따뜻함을 제공하는 요양원입니다.",
    // facility_photo 테이블 관련
    photo_url: "/images/love-nursing.jpg", is_thumbnail: true,
    // facility_tag 테이블 관련
    category: "소규모", facility_tag: "가족형,맞춤케어,소규모",
    prodDetail: "가족같은 분위기의 소규모 요양원입니다. 개인별 맞춤 식단과 활동 프로그램을 제공합니다. 소규모 맞춤형 케어로 가족같은 따뜻함을 제공합니다.",
    // 기존 필드들 (호환성 유지)
    hope_work_amount: 280,
    introduction: "가족같은 분위기의 소규모 요양원입니다. 개인별 맞춤 식단과 활동 프로그램을 제공합니다.",
    hope_work_place: "수성구",
    hope_work_type: "통원",
    hope_employment_type: "전일제",
    education_level: "대학교 졸업",
    company_name: "대구사랑요양원",
    start_date: "2017-03-01",
    end_date: "현재",
    certificate_name: "사회복지사 2급, 요양원 관리책임자",
    caregiver_created_at: "2024-01-08",
    caregiver_update_at: "2024-01-28",
    caregiver_deleted_at: null
  },
  {
    prodId: 6,
    prodName: "강남힐스실버타운", // facility_name
    prodTypeName: "요양원/실버타운", // facility_type
    facility_name: "강남힐스실버타운",
    facility_charge: 500, // 월별이용료
    facility_type: "실버타운",
    facility_theme: "프리미엄 레저", // 테마
    hope_work_area_location: "서울특별시", // facility_address_location
    hope_work_area_city: "강남구", // facility_address_city
    facility_detail_address: "서울 강남구 테헤란로 789", // 상세주소
    facility_phone: "02-345-6789", // 연락처
    facility_homepage: "https://gangnam-hills.com", // 홈페이지URL
    default_message: "최고급 프리미엄 실버타운 서비스를 제공합니다.",
    prodDetail: "강남 중심가에 위치한 최고급 실버타운으로 골프장, 수영장, 도서관 등 다양한 시설을 보유하고 있습니다. 최고급 실버타운으로 프리미엄 라이프스타일을 제공합니다.",
    // 기존 필드들 (호환성 유지)
    hope_work_amount: 500,
    introduction: "강남 중심가에 위치한 최고급 실버타운으로 골프장, 수영장, 도서관 등 다양한 시설을 보유하고 있습니다.",
    hope_work_place: "강남구",
    hope_work_type: "시설거주",
    hope_employment_type: "시설관리",
    education_level: "대학원 졸업",
    company_name: "롯데타워실버타운",
    start_date: "2010-01-01",
    end_date: "현재",
    certificate_name: "시설관리사 1급, 노인복지시설장 자격증",
    caregiver_created_at: "2024-01-03",
    caregiver_update_at: "2024-02-01",
    caregiver_deleted_at: null
  },
  {
    prodId: 7,
    prodName: "이순자 요양사",
    prodTypeName: "요양사",
    userGender: "여자", // 성별 추가
    hope_work_amount: 220,
    introduction: "15년 경력의 베테랑 요양사입니다. 인지능력 향상 프로그램 전문가입니다.",
    hope_work_area_location: "인천광역시",
    hope_work_area_city: "연수구",
    hope_work_place: "연수구, 남동구",
    hope_work_type: "입주",
    hope_employment_type: "장기", // 필터에 맞게 수정
    education_level: "고등학교 졸업",
    prodDetail: "15년 경력으로 어르신 케어에 대한 전문성과 경험이 풍부합니다.",
    company_name: "인천사랑요양원, 연수요양원",
    start_date: "2009-01-01",
    end_date: "현재",
    certificate_name: "요양보호사 1급, 치매전문교육, 인지능력향상프로그램 수료",
    caregiver_created_at: "2024-01-12",
    caregiver_update_at: "2024-01-22",
    caregiver_deleted_at: null
  },
  {
    prodId: 8,
    prodName: "효도의집요양원", // facility_name
    prodTypeName: "요양원/실버타운", // facility_type
    facility_charge: 290, // 월별이용료
    facility_theme: "한방통합케어", // 테마
    hope_work_area_location: "광주광역시", // facility_address_location
    hope_work_area_city: "서구", // facility_address_city
    facility_detail_address: "광주 서구 상무대로 456", // 상세주소
    facility_phone: "062-456-7890", // 연락처
    facility_homepage: "https://hyodo-nursing.gwangju.kr", // 홈페이지URL
    prodDetail: "한방 치료와 서양 의학을 접목한 통합 케어 서비스를 제공하는 요양원입니다. 한방과 양방의 장점을 결합한 통합 의료 서비스를 제공합니다.",
    // 기존 필드들 (호환성 유지)
    hope_work_amount: 290,
    introduction: "한방 치료와 서양 의학을 접목한 통합 케어 서비스를 제공하는 요양원입니다.",
    hope_work_place: "서구, 남구",
    hope_work_type: "통원",
    hope_employment_type: "전일제",
    education_level: "대학교 졸업",
    company_name: "광주한방요양원",
    start_date: "2016-09-01",
    end_date: "현재",
    certificate_name: "한의사, 요양원 운영자격증",
    caregiver_created_at: "2024-01-07",
    caregiver_update_at: "2024-01-27",
    caregiver_deleted_at: null
  },
  {
    prodId: 9,
    prodName: "자연휴양실버타운", // facility_name
    prodTypeName: "요양원/실버타운", // facility_type
    facility_charge: 350, // 월별이용료
    facility_theme: "자연친화 전원", // 테마
    hope_work_area_location: "강원도", // facility_address_location
    hope_work_area_city: "춘천시", // facility_address_city
    facility_detail_address: "강원 춘천시 동면 자연로 123", // 상세주소
    facility_phone: "033-234-5678", // 연락처
    facility_homepage: "https://nature-silvertown.chuncheon.kr", // 홈페이지URL
    prodDetail: "자연 속에서 여유로운 노후를 보낼 수 있는 전원형 실버타운입니다. 유기농 농장과 산책로를 보유하고 있습니다. 자연친화적인 환경에서 건강한 노후생활을 지원합니다.",
    // 기존 필드들 (호환성 유지)
    hope_work_amount: 350,
    introduction: "자연 속에서 여유로운 노후를 보낼 수 있는 전원형 실버타운입니다. 유기농 농장과 산책로를 보유하고 있습니다.",
    hope_work_place: "춘천시",
    hope_work_type: "시설거주",
    hope_employment_type: "시설관리",
    education_level: "대학교 졸업",
    company_name: "춘천힐링타운",
    start_date: "2019-04-01",
    end_date: "현재",
    certificate_name: "환경관리사, 농업기술사, 시설관리사",
    caregiver_created_at: "2024-01-14",
    caregiver_update_at: "2024-01-29",
    caregiver_deleted_at: null
  },
  {
    prodId: 10,
    prodName: "정미영 요양사",
    prodTypeName: "요양사",
    userGender: "여자", // 성별 추가
    hope_work_amount: 180,
    introduction: "간병과 요리를 함께 할 수 있는 올라운드 요양사입니다. 당뇨 환자 전문 케어 가능합니다.",
    hope_work_area_location: "울산광역시",
    hope_work_area_city: "남구",
    hope_work_place: "남구, 중구",
    hope_work_type: "출퇴근", // 필터에 맞게 수정
    hope_employment_type: "임시", // 필터에 맞게 수정
    education_level: "전문대학 졸업",
    prodDetail: "당뇨 환자 케어에 특화된 전문 요양사로 영양관리도 함께 제공합니다.",
    company_name: "울산당뇨케어센터",
    start_date: "2021-01-01",
    end_date: "현재",
    certificate_name: "요양보호사 1급, 영양사, 당뇨교육사",
    caregiver_created_at: "2024-01-18",
    caregiver_update_at: "2024-01-26",
    caregiver_deleted_at: null
  }
];

const AdminProductList = () => {
  const [products, setProducts] = useState([]); // 빈 배열로 초기화
  const [search, setSearch] = useState('');
  const [selectedType, setSelectedType] = useState(''); // 선택된 상품 유형
  const [page, setPage] = useState(0);
  const [size, setSize] = useState(10);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isServerConnected, setIsServerConnected] = useState(false); // 기본적으로 오프라인 모드로 시작
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [users, setUsers] = useState([]); // 회원 목록
  const [selectedRegionId, setSelectedRegionId] = useState(''); // 선택된 지역 ID
  const [cities, setCities] = useState([]); // 시/군/구 목록
  const [editSelectedRegionId, setEditSelectedRegionId] = useState(''); // 수정 시 선택된 지역 ID
  const [editCities, setEditCities] = useState([]); // 수정 시 시/군/구 목록
  
  // 요양사 검색 필터 상태들
  const [filterGender, setFilterGender] = useState('');
  const [filterCertificate, setFilterCertificate] = useState('');
  const [filterWorkType, setFilterWorkType] = useState('');
  const [filterEmploymentType, setFilterEmploymentType] = useState('');

  // 정적 지역 데이터 (하드코딩) - AdminCaregiverList.js와 동일
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

  // 정적 시/군/구 데이터 (하드코딩)
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
    17: [ // 제주특별자치도
      '서귀포시', '제주시'
    ]
    // 나머지 지역들도 필요시 추가
  };
  const [formData, setFormData] = useState({
    // 공통 필드
    prodName: '', // facility_name으로 매핑
    prodTypeName: '', // facility_type으로 매핑
    member_id: '',
    
    // 요양사 전용 필드
    userGender: '', // 성별 추가
    hope_work_amount: '',
    introduction: '',
    hope_work_area_location: '',
    hope_work_area_city: '',
    hope_work_place: '',
    hope_work_type: '',
    hope_employment_type: '',
    education_level: '',
    company_name: '',
    certificate_name: '',
    
    // 요양원/실버타운 전용 필드 (실제 DB 구조)
    facility_name: '', // 시설명
    facility_charge: '', // 월별이용료
    facility_type: '', // 시설 유형 (요양원/실버타운)
    facility_theme: '', // 테마
    facility_detail_address: '', // 상세주소
    facility_homepage: '', // 홈페이지URL
    facility_phone: '', // 연락처
    default_message: '', // 기본 메시지
    
    // facility_notice 테이블 관련
    notice_title: '', // 공지사항 제목
    notice_content: '', // 공지사항 내용
    
    // facility_photo 테이블 관련
    photo_url: '', // 사진 등록
    is_thumbnail: false, // 썸네일 여부
    
    // facility_tag 테이블 관련
    category: '', // 카테고리
    facility_tag: '', // 태그
    
    // 공통 필드
    prodDetail: ''
  });
  const [editFormData, setEditFormData] = useState({
    // 공통 필드
    prodName: '',
    prodTypeName: '',
    member_id: '',
    
    // 요양사 전용 필드
    userGender: '', // 성별 추가
    hope_work_amount: '',
    introduction: '',
    hope_work_area_location: '',
    hope_work_area_city: '',
    hope_work_place: '',
    hope_work_type: '',
    hope_employment_type: '',
    education_level: '',
    company_name: '',
    certificate_name: '',
    
    // 요양원/실버타운 전용 필드
    facility_name: '',
    facility_charge: '',
    facility_type: '',
    facility_theme: '',
    facility_detail_address: '',
    facility_homepage: '',
    facility_phone: '',
    default_message: '',
    
    // facility_notice 테이블 관련
    notice_title: '',
    notice_content: '',
    
    // facility_photo 테이블 관련
    photo_url: '',
    is_thumbnail: false,
    
    // facility_tag 테이블 관련
    category: '',
    facility_tag: '',
    
    // 공통 필드
    prodDetail: ''
  });

  // 더미 데이터 필터링 함수
  const filterDummyData = (searchTerm = '', typeFilter = '') => {
    let filteredData = dummyProducts;
    
    // 유형별 필터링
    if (typeFilter && typeFilter !== '') {
      if (typeFilter === '요양원/실버타운') {
        // 요양원/실버타운 타입만 포함, 요양사 제외
        filteredData = filteredData.filter(product => 
          product.prodTypeName === '요양원/실버타운'
        );
      } else {
        filteredData = filteredData.filter(product => 
          product.prodTypeName === typeFilter
        );
      }
    }
    
    // 요양사 전용 필터링 (요양사가 선택된 경우에만)
    if (typeFilter === '요양사') {
      // 성별 필터링
      if (filterGender && filterGender !== '') {
        filteredData = filteredData.filter(product => {
          if (filterGender === '무관') return true;
          return product.userGender === filterGender || product.gender === filterGender;
        });
      }
      
      // 자격증 필터링
      if (filterCertificate && filterCertificate !== '') {
        const selectedCerts = filterCertificate.split(',').filter(c => c);
        filteredData = filteredData.filter(product => {
          const productCerts = product.certificatesString || product.certificate_name || product.certificates || '';
          return selectedCerts.some(cert => 
            productCerts.toLowerCase().includes(cert.toLowerCase())
          );
        });
      }
      
      // 근무형태 필터링
      if (filterWorkType && filterWorkType !== '') {
        const selectedWorkTypes = filterWorkType.split(',').filter(w => w);
        filteredData = filteredData.filter(product => {
          const productWorkType = product.hope_work_type || product.workType || '';
          return selectedWorkTypes.some(workType => {
            if (workType === '출퇴근') return productWorkType.includes('출퇴근') || productWorkType.includes('방문');
            if (workType === '입주') return productWorkType.includes('입주');
            return productWorkType.includes(workType);
          });
        });
      }
      
      // 고용형태 필터링
      if (filterEmploymentType && filterEmploymentType !== '') {
        const selectedEmpTypes = filterEmploymentType.split(',').filter(e => e);
        filteredData = filteredData.filter(product => {
          const productEmpType = product.hope_employment_type || product.employmentType || '';
          return selectedEmpTypes.some(empType => 
            productEmpType.includes(empType)
          );
        });
      }
    }
    
    // 검색어 필터링
    if (searchTerm.trim()) {
      filteredData = filteredData.filter(product => 
        product.prodName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.prodTypeName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.prodDetail.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (product.province && product.province.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (product.city && product.city.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (product.preferredWorkLocation && product.preferredWorkLocation.toLowerCase().includes(searchTerm.toLowerCase()))
      );
    }
    
    return filteredData;
  };

  // 상품 목록 조회 요청
  const fetchProducts = async () => {
    try {
      setIsLoading(true);
      setIsServerConnected(true);
      
      console.log('DB 데이터 조회 시작...');
      console.log('요청 파라미터:', { page, size, search: search.trim(), type: selectedType });
      
      // 실제 API 호출 (백엔드 서버 주소로 변경)
      const response = await axios.get('http://localhost:8080/api/admin/products', {
        params: {
          page,
          size,
          search: search.trim(),
          type: selectedType
        },
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
          'Content-Type': 'application/json'
        },
        timeout: 10000 // 10초 타임아웃
      });
      
             console.log('DB 응답 성공!');
       console.log('응답 전체:', response);
       console.log('응답 데이터:', response.data);
       console.log('데이터 타입:', typeof response.data);
       console.log('content 필드:', response.data.content);
       console.log('content 길이:', response.data.content ? response.data.content.length : 'content 없음');
       
       const products = response.data.content || response.data || [];
       console.log('최종 설정될 products:', products);
       
       // 🔍 디버깅: 첫 번째 요양사 데이터 상세 확인
       if (products.length > 0) {
         console.log('🔍 첫 번째 요양사 전체 데이터:', products[0]);
         console.log('🔍 certificatesString:', products[0].certificatesString);
         console.log('🔍 careerString:', products[0].careerString);
         console.log('🔍 startDateString:', products[0].startDateString);
         console.log('🔍 endDateString:', products[0].endDateString);
         console.log('🔍 username:', products[0].username);
         console.log('🔍 userGender:', products[0].userGender);
       }
       
       setProducts(products);
      
    } catch (error) {
      console.error('DB 연결 실패:', error);
      setIsServerConnected(false);
      setProducts([]);
      
      // 상세한 에러 정보 출력
      if (error.response) {
        console.error('서버 응답 에러:', error.response.status, error.response.data);
        alert(`서버 오류: ${error.response.status} - ${error.response.data?.message || '알 수 없는 오류'}`);
      } else if (error.request) {
        console.error('네트워크 오류:', error.request);
        alert('서버에 연결할 수 없습니다. 네트워크 상태를 확인해주세요.');
      } else {
        console.error('요청 설정 오류:', error.message);
        alert(`요청 오류: ${error.message}`);
      }
    } finally {
      setIsLoading(false);
    }
  };

  // 검색 버튼 클릭 핸들러
  const handleSearch = () => {
    console.log('검색 실행:', search, '유형:', selectedType);
    fetchProducts();
  };

  // Enter 키 검색 핸들러
  const handleSearchKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  // 유형 필터 변경 핸들러
  const handleTypeChange = (e) => {
    setSelectedType(e.target.value);
  };

  // 필터 초기화 핸들러
  const handleResetFilters = () => {
    setSearch('');
    setSelectedType('');
    setFilterGender('');
    setFilterCertificate('');
    setFilterWorkType('');
    setFilterEmploymentType('');
    setSelectedRegionId('');
    setCities([]);
  };

  // 회원 목록 조회 (임시: 로컬 데이터)
  const fetchUsers = async () => {
    try {
      // 실제 서버에서 DB 데이터 조회
      const response = await axios.get('http://localhost:8080/api/admin/products/get-users', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
          'Content-Type': 'application/json'
        },
        timeout: 10000
      });
      
      if (response.data.success) {
        setUsers(response.data.users);
        console.log('실제 DB 회원 데이터 로드 완료:', response.data.users.length, '명');
      } else {
        console.error('회원 목록 조회 실패:', response.data.message);
        // 실패 시 빈 배열로 설정
        setUsers([]);
      }
    } catch (error) {
      console.error('회원 목록 조회 오류:', error);
      // 오류 발생 시 빈 배열로 설정
      setUsers([]);
    }
  };

  // 상품 등록 요청
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.prodName || !formData.prodTypeName || !formData.member_id || !formData.hope_work_amount) {
      alert('필수 항목을 모두 입력해주세요. (상품명, 상품유형, 회원선택, 희망급여)');
      return;
    }

    try {
      setIsLoading(true);
      
      // 서버로 전송할 데이터 준비
      const submitData = {
        prodName: formData.prodName.trim(),
        prodTypeName: formData.prodTypeName,
        member_id: parseInt(formData.member_id), // 회원 ID 추가
        hope_work_amount: parseInt(formData.hope_work_amount),
        introduction: formData.introduction.trim(),
        hope_work_area_location: formData.hope_work_area_location,
        hope_work_area_city: formData.hope_work_area_city,
        hope_work_place: formData.hope_work_place,
        hope_work_type: formData.hope_work_type,
        hope_employment_type: formData.hope_employment_type,
        education_level: formData.education_level,
        prodDetail: formData.prodDetail.trim(),
        company_name: formData.company_name,
        start_date: formData.start_date,
        end_date: formData.end_date,
        certificate_name: formData.certificate_name,
        caregiver_created_at: formData.caregiver_created_at,
        caregiver_update_at: formData.caregiver_update_at,
        caregiver_deleted_at: formData.caregiver_deleted_at
      };

      // 실제 axios POST 요청
      const response = await axios.post('http://localhost:8080/api/admin/products', submitData, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
          'Content-Type': 'application/json'
        }
      });

      // 성공 응답 처리
      if (response.status === 200 || response.status === 201) {
        alert('상품이 성공적으로 등록되었습니다.');
        
        // 폼 초기화
        setFormData({
          prodName: '',
          prodTypeName: '',
          hope_work_amount: '',
          introduction: '',
          hope_work_area_location: '',
          hope_work_area_city: '',
          hope_work_place: '',
          hope_work_type: '',
          hope_employment_type: '',
          education_level: '',
          prodDetail: '',
          company_name: '',
          start_date: '',
          end_date: '',
          certificate_name: '',
          caregiver_created_at: '',
          caregiver_update_at: '',
          caregiver_deleted_at: ''
        });
        
        // 모달 닫기
        setIsModalOpen(false);
        
        // 목록 새로고침
        fetchProducts();
      }

      /* 개발/테스트용 더미 데이터 추가 (실제 서버 연동 전까지 사용)
      const newProduct = {
        prodId: Math.max(...dummyProducts.map(p => p.prodId)) + 1,
        prodName: submitData.prodName,
        prodTypeName: submitData.prodTypeName,
        prodPrice: submitData.prodPrice,
        prodDetail: submitData.prodDetail
      };
      
      dummyProducts.push(newProduct);
      */
      
    } catch (error) {
      console.error('상품 등록 실패:', error);
      
      // 에러 타입별 메시지 처리
      if (error.response) {
        // 서버 응답 에러
        const status = error.response.status;
        const message = error.response.data?.message || '서버 오류가 발생했습니다.';
        
        if (status === 401) {
          alert('로그인이 필요합니다. 다시 로그인해주세요.');
          // 로그인 페이지로 리다이렉트
          window.location.href = '/login';
        } else if (status === 403) {
          alert('권한이 없습니다. 관리자에게 문의하세요.');
        } else if (status === 400) {
          alert(`입력 정보를 확인해주세요: ${message}`);
        } else if (status === 409) {
          alert('이미 존재하는 상품명입니다. 다른 이름을 사용해주세요.');
        } else {
          alert(`상품 등록에 실패했습니다: ${message}`);
        }
      } else if (error.request) {
        // 네트워크 에러
        alert('네트워크 연결을 확인해주세요.');
      } else {
        // 기타 에러
        alert('상품 등록 중 오류가 발생했습니다.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  // 상품 수정 요청
  const handleEditSubmit = async (e) => {
    e.preventDefault();
    
    if (!editFormData.prodName || !editFormData.prodTypeName || !editFormData.prodPrice) {
      alert('필수 항목을 모두 입력해주세요.');
      return;
    }

    try {
      setIsLoading(true);
      
      // 서버로 전송할 데이터 준비
      const submitData = {
        prodName: editFormData.prodName.trim(),
        prodTypeName: editFormData.prodTypeName,
        prodPrice: parseInt(editFormData.prodPrice),
        prodDetail: editFormData.prodDetail ? editFormData.prodDetail.trim() : '',
        province: editFormData.province || '',
        city: editFormData.city || '',
        preferredWorkLocation: editFormData.preferredWorkLocation || '',
        preferredWorkMethod: editFormData.preferredWorkMethod || '',
        preferredWorkType: editFormData.preferredWorkType || '',
        education: editFormData.education || '',
        introduction: editFormData.introduction ? editFormData.introduction.trim() : '',
        careerWorkplace: editFormData.careerWorkplace || '',
        startDate: editFormData.startDate || '',
        endDate: editFormData.endDate || '',
        certifications: editFormData.certifications || '',
        member_id: selectedProduct.member_id
      };

      // 실제 axios PUT 요청
      const response = await axios.put(`/admin/products/${selectedProduct.prodId}`, submitData, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
          'Content-Type': 'application/json'
        }
      });

      // 성공 응답 처리
      if (response.status === 200 || response.status === 201) {
        alert('상품이 성공적으로 수정되었습니다.');
        setIsEditMode(false);
        setIsDetailModalOpen(false);
        fetchProducts(); // 목록 새로고침
      }

    } catch (error) {
      console.error('상품 수정 실패:', error);
      
      // 에러 타입별 메시지 처리
      if (error.response) {
        // 서버 응답 에러
        const status = error.response.status;
        const message = error.response.data?.message || '서버 오류가 발생했습니다.';
        
        if (status === 401) {
          alert('로그인이 필요합니다. 다시 로그인해주세요.');
          // 로그인 페이지로 리다이렉트
          window.location.href = '/login';
        } else if (status === 403) {
          alert('권한이 없습니다. 관리자에게 문의하세요.');
        } else if (status === 400) {
          alert(`입력 정보를 확인해주세요: ${message}`);
        } else if (status === 404) {
          alert('수정하려는 상품을 찾을 수 없습니다.');
        } else {
          alert(`상품 수정에 실패했습니다: ${message}`);
        }
      } else if (error.request) {
        // 네트워크 에러 - 더미 데이터로 폴백
        console.warn('서버 연결 실패, 더미 데이터로 수정합니다:', error.message);
        
        const index = dummyProducts.findIndex(p => p.prodId === selectedProduct.prodId);
        if (index !== -1) {
          const updatedProduct = {
            ...selectedProduct,
            prodName: editFormData.prodName,
            prodTypeName: editFormData.prodTypeName,
            prodPrice: parseInt(editFormData.prodPrice),
            prodDetail: editFormData.prodDetail,
            province: editFormData.province,
            city: editFormData.city,
            preferredWorkLocation: editFormData.preferredWorkLocation,
            preferredWorkMethod: editFormData.preferredWorkMethod,
            preferredWorkType: editFormData.preferredWorkType,
            education: editFormData.education,
            introduction: editFormData.introduction,
            careerWorkplace: editFormData.careerWorkplace,
            startDate: editFormData.startDate,
            endDate: editFormData.endDate,
            certifications: editFormData.certifications
          };
          
          dummyProducts[index] = updatedProduct;
          setSelectedProduct(updatedProduct);
        }
        
        alert('네트워크 연결을 확인해주세요. 임시로 로컬 데이터가 수정되었습니다.');
        setIsEditMode(false);
        fetchProducts();
      } else {
        // 기타 에러
        alert('상품 수정 중 오류가 발생했습니다.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  // 폼 입력 핸들러
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    
    // 회원 선택 시 추천 상품명 자동 설정
    if (name === 'member_id' && value) {
      const selectedUser = users.find(user => user.member_id == value);
      if (selectedUser && selectedUser.suggested_product_name) {
        setFormData(prev => ({
          ...prev,
          [name]: value,
          prodName: selectedUser.suggested_product_name // 추천 상품명 자동 입력
        }));
        return;
      }
    }
    
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // 수정 폼 입력 핸들러
  const handleEditInputChange = (e) => {
    const { name, value } = e.target;
    setEditFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // 등록 모달 닫기
  const handleCloseModal = () => {
    setIsModalOpen(false);
    setFormData({
      // 공통 필드
      prodName: '',
      prodTypeName: '',
      member_id: '', 
      
      // 요양사 전용 필드
      userGender: '',
      hope_work_amount: '',
      introduction: '',
      hope_work_area_location: '',
      hope_work_area_city: '',
      hope_work_place: '',
      hope_work_type: '',
      hope_employment_type: '',
      education_level: '',
      company_name: '',
      certificate_name: '',
      
      // 요양원/실버타운 전용 필드
      facility_name: '',
      facility_charge: '',
      facility_type: '',
      facility_theme: '',
      facility_detail_address: '',
      facility_homepage: '',
      facility_phone: '',
      default_message: '',
      
      // facility_notice 테이블 관련
      notice_title: '',
      notice_content: '',
      
      // facility_photo 테이블 관련
      photo_url: '',
      is_thumbnail: false,
      
      // facility_tag 테이블 관련
      category: '',
      facility_tag: '',
      
      // 공통 필드
      prodDetail: ''
    });
    setSelectedRegionId('');
    setCities([]);
  };

  // 상세 모달 열기
  const handleProductClick = (product) => {
    setSelectedProduct(product);
    setIsDetailModalOpen(true);
    setIsEditMode(false);
  };

  // 상세 모달 닫기
  const handleCloseDetailModal = () => {
    setIsDetailModalOpen(false);
    setSelectedProduct(null);
    setIsEditMode(false);
    setEditFormData({
      prodName: '',
      prodTypeName: '',
      member_id: '',
      userGender: '',
      hope_work_amount: '',
      introduction: '',
      hope_work_area_location: '',
      hope_work_area_city: '',
      hope_work_place: '',
      hope_work_type: '',
      hope_employment_type: '',
      education_level: '',
      prodDetail: '',
      company_name: '',
      certificate_name: ''
    });
  };

  // 수정 모드 활성화
  const handleEditClick = () => {
    // 기존 지역 데이터로부터 지역 ID 찾기
    const currentLocation = selectedProduct.hope_work_area_location || '';
    const currentRegion = regions.find(r => r.name === currentLocation);
    const regionId = currentRegion ? currentRegion.id.toString() : '';
    
    // 지역 ID 설정
    setEditSelectedRegionId(regionId);
    
    // 해당 지역의 시/군/구 목록 설정
    if (regionId && cityData[regionId]) {
      const cityList = cityData[regionId].map((cityName, index) => ({
        id: index + 1,
        name: cityName
      }));
      setEditCities(cityList);
    } else {
      setEditCities([]);
    }

    setEditFormData({
      // 공통 필드
      prodName: selectedProduct.prodName,
      prodTypeName: selectedProduct.prodTypeName,
      member_id: selectedProduct.member_id || '',
      
      // 요양사 전용 필드
      userGender: selectedProduct.userGender || '',
      hope_work_amount: selectedProduct.hope_work_amount?.toString() || '',
      introduction: selectedProduct.introduction || '',
      hope_work_area_location: selectedProduct.hope_work_area_location || '',
      hope_work_area_city: selectedProduct.hope_work_area_city || '',
      hope_work_place: selectedProduct.hope_work_place || '',
      hope_work_type: selectedProduct.hope_work_type || '',
      hope_employment_type: selectedProduct.hope_employment_type || '',
      education_level: selectedProduct.education_level || '',
      company_name: selectedProduct.careerString || selectedProduct.company_name || '',
      certificate_name: selectedProduct.certificatesString || selectedProduct.certificate_name || '',
      
      // 요양원/실버타운 전용 필드
      facility_name: selectedProduct.facility_name || '',
      facility_charge: selectedProduct.facility_charge?.toString() || '',
      facility_type: selectedProduct.facility_type || '',
      facility_theme: selectedProduct.facility_theme || '',
      facility_detail_address: selectedProduct.facility_detail_address || '',
      facility_homepage: selectedProduct.facility_homepage || '',
      facility_phone: selectedProduct.facility_phone || '',
      default_message: selectedProduct.default_message || '',
      
      // facility_notice 테이블 관련
      notice_title: selectedProduct.notice_title || '',
      notice_content: selectedProduct.notice_content || '',
      
      // facility_photo 테이블 관련
      photo_url: selectedProduct.photo_url || '',
      is_thumbnail: selectedProduct.is_thumbnail || false,
      
      // facility_tag 테이블 관련
      category: selectedProduct.category || '',
      facility_tag: selectedProduct.facility_tag || '',
      
      // 공통 필드
      prodDetail: selectedProduct.prodDetail || ''
    });
    setIsEditMode(true);
  };

  // 수정 취소
  const handleEditCancel = () => {
    setIsEditMode(false);
    // 지역 관련 상태 초기화
    setEditSelectedRegionId('');
    setEditCities([]);
    setEditFormData({
      prodName: '',
      prodTypeName: '',
      member_id: '',
      userGender: '',
      hope_work_amount: '',
      introduction: '',
      hope_work_area_location: '',
      hope_work_area_city: '',
      hope_work_place: '',
      hope_work_type: '',
      hope_employment_type: '',
      education_level: '',
      prodDetail: '',
      company_name: '',
      certificate_name: ''
    });
  };

  // 상품 삭제 (소프트 삭제)
  const handleDeleteProduct = async (productId, productName) => {
    const confirmDelete = window.confirm(
      `"${productName}" 상품을 삭제하시겠습니까?\n\n삭제된 상품은 목록에서 제거되지만 데이터는 보관됩니다.`
    );

    if (!confirmDelete) {
      return;
    }

    try {
      setIsLoading(true);
      
      // 실제 API 호출 시도 - 요양사의 경우 caregiver API 사용
      const token = localStorage.getItem('token');
      console.log('🔑 Token for delete request:', token);
      console.log('🎯 Delete URL:', `/admin/caregivers/${productId}`);
      
      const response = await axios.delete(`/admin/caregivers/${productId}`, {
        headers: {
          'Content-Type': 'application/json'
        }
      });

      if (response.status === 200) {
        alert('상품이 성공적으로 삭제되었습니다.');
        // 목록 새로고침
        fetchProducts();
      }

    } catch (error) {
      console.error('상품 삭제 실패:', error);
      
      // 더미 데이터에서 삭제 (서버 연결 실패 시)
      if (!isServerConnected) {
        const updatedProducts = dummyProducts.filter(p => p.prodId !== productId);
        setProducts(updatedProducts);
        alert('상품이 삭제되었습니다. (더미 데이터)');
        return;
      }
      
      // 에러 타입별 메시지 처리
      if (error.response) {
        const status = error.response.status;
        const message = error.response.data?.message || '서버 오류가 발생했습니다.';
        
        if (status === 401) {
          alert('로그인이 필요합니다. 다시 로그인해주세요.');
          window.location.href = '/login';
        } else if (status === 403) {
          alert('삭제 권한이 없습니다. 관리자에게 문의하세요.');
        } else if (status === 404) {
          alert('삭제하려는 상품을 찾을 수 없습니다.');
        } else {
          alert(`상품 삭제에 실패했습니다: ${message}`);
        }
      } else if (error.request) {
        alert('네트워크 연결을 확인해주세요.');
      } else {
        alert('상품 삭제 중 오류가 발생했습니다.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  // 지역 선택 시 시/군/구 목록 로드 (등록 모달용)
  const handleRegionChange = (e) => {
    const regionId = e.target.value;
    console.log('🔥 AdminProductList - 선택된 지역 ID:', regionId);
    setSelectedRegionId(regionId);
    
    // 폼 데이터의 지역 설정
    const selectedRegion = regions.find(r => r.id.toString() === regionId);
    console.log('🌍 선택된 지역 객체:', selectedRegion);
    setFormData(prev => ({
      ...prev,
      hope_work_area_location: selectedRegion ? selectedRegion.name : '',
      hope_work_area_city: '' // 시/군/구 초기화
    }));

    // 하드코딩된 시/군/구 데이터에서 해당 지역의 시/군/구 목록 설정
    console.log('🏙️ cityData[regionId]:', cityData[regionId]);
    if (regionId && cityData[regionId]) {
      const cityList = cityData[regionId].map((cityName, index) => ({
        id: index + 1,
        name: cityName
      }));
      console.log('🏘️ 생성된 시/군/구 목록:', cityList);
      setCities(cityList);
    } else {
      console.log('❌ 시/군/구 목록을 찾을 수 없음');
      setCities([]);
    }
  };

  // 시/군/구 선택 시 (등록 모달용)
  const handleCityChange = (e) => {
    const cityName = e.target.value;
    setFormData(prev => ({
      ...prev,
      hope_work_area_city: cityName
    }));
  };

  // 지역 선택 시 시/군/구 목록 로드 (수정 모달용)
  const handleEditRegionChange = (e) => {
    const regionId = e.target.value;
    setEditSelectedRegionId(regionId);
    
    // 수정 폼 데이터의 지역 설정
    const selectedRegion = regions.find(r => r.id.toString() === regionId);
    setEditFormData(prev => ({
      ...prev,
      hope_work_area_location: selectedRegion ? selectedRegion.name : '',
      hope_work_area_city: '' // 시/군/구 초기화
    }));

    // 하드코딩된 시/군/구 데이터에서 해당 지역의 시/군/구 목록 설정
    if (regionId && cityData[regionId]) {
      const cityList = cityData[regionId].map((cityName, index) => ({
        id: index + 1,
        name: cityName
      }));
      setEditCities(cityList);
    } else {
      setEditCities([]);
    }
  };

  // 시/군/구 선택 시 (수정 모달용)
  const handleEditCityChange = (e) => {
    const cityName = e.target.value;
    setEditFormData(prev => ({
      ...prev,
      hope_work_area_city: cityName
    }));
  };

  // 초기 및 조건 변경 시 자동 호출
  useEffect(() => {
    fetchProducts();
  }, [page, size, selectedType]); // selectedType 추가

  // 필터 초기화 시 데이터 다시 로드
  useEffect(() => {
    if (search === '' && selectedType === '') {
      fetchProducts();
    }
  }, [search, selectedType]);

  return (
    <div style={{ padding: '1rem' }}>
      <div className={styles["admin-header"]}>
        <h2>📦 상품 목록</h2>
        <div className={styles["header-info"]}>
          {!isServerConnected && (
            <span className={`${styles["server-status"]} ${styles["offline"]}`}>🔴 오프라인 모드 (더미 데이터)</span>
          )}
          {isServerConnected && (
            <span className={`${styles["server-status"]} ${styles["online"]}`}>🟢 서버 연결됨</span>
          )}
          <button 
            className={styles["register-btn"]}
            onClick={() => {
              setIsModalOpen(true);
              fetchUsers(); // 모달 열 때 회원 목록 로드
            }}
          >
            ➕ 상품 등록
          </button>
        </div>
      </div>

      {/* 필터 영역 */}
      <div className={styles["filter-section"]}>
        <div className={styles["filter-row"]}>
          <div className={styles["filter-group"]}>
            <label>상품 유형</label>
            <select 
              value={selectedType} 
              onChange={handleTypeChange}
              className={styles["type-filter"]}
            >
              <option value="">▼ 전체 보기</option>
              <option value="요양사">👩‍⚕️ 요양사</option>
              <option value="요양원/실버타운">🏥 요양원/실버타운</option>
            </select>
          </div>
          
          <div className={styles["filter-group"]}>
            <label>검색</label>
            <div className={styles["search-container"]}>
              <input
                type="text"
                placeholder="상품명, 유형, 지역으로 검색"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                onKeyPress={handleSearchKeyPress}
                className={styles["search-input"]}
              />
              <button 
                onClick={handleSearch} 
                className={styles["search-btn"]}
                disabled={isLoading}
              >
                {isLoading ? '🔄' : '🔍'} {isLoading ? '검색 중...' : '검색'}
              </button>
            </div>
          </div>
        </div>

        {/* 요양사 전용 상세 필터 */}
        {selectedType === '요양사' && (
          <div className={styles["caregiver-filters"]}>
            <h3>🔍 요양사 검색</h3>
            
            <div className={styles["filter-row"]}>
              <div className={styles["filter-group"]}>
                <label>지역</label>
                <select 
                  value={selectedRegionId} 
                  onChange={handleRegionChange}
                  className={styles["region-filter"]}
                >
                  <option value="">선택</option>
                  {regions.map(region => (
                    <option key={region.id} value={region.id}>
                      {region.name}
                    </option>
                  ))}
                </select>
              </div>
              
              <div className={styles["filter-group"]}>
                <label>시/군/구</label>
                <select 
                  value={formData.hope_work_area_city || ''} 
                  onChange={handleCityChange}
                  disabled={!selectedRegionId}
                  className={styles["city-filter"]}
                >
                  <option value="">선택</option>
                  {cities.map(city => (
                    <option key={city.id} value={city.name}>
                      {city.name}
                    </option>
                  ))}
                </select>
              </div>

              <div className={styles["filter-group"]}>
                <label>성별</label>
                <select 
                  value={filterGender} 
                  onChange={(e) => setFilterGender(e.target.value)}
                  className={styles["gender-filter"]}
                >
                  <option value="">선택</option>
                  <option value="여자">여자</option>
                  <option value="남자">남자</option>
                  <option value="무관">무관</option>
                </select>
              </div>
            </div>

            <div className={styles["filter-row"]}>
              <div className={styles["filter-group"]}>
                <label>자격증</label>
                <div className={styles["checkbox-group"]}>
                  {['요양보호사', '사회복지사', '간호조무사', '일반'].map(cert => (
                    <label key={cert} className={styles["checkbox-label"]}>
                      <input
                        type="checkbox"
                        checked={filterCertificate.includes(cert)}
                        onChange={(e) => {
                          if (e.target.checked) {
                            setFilterCertificate(prev => prev ? `${prev},${cert}` : cert);
                          } else {
                            setFilterCertificate(prev => 
                              prev.split(',').filter(c => c !== cert).join(',')
                            );
                          }
                        }}
                      />
                      {cert}
                    </label>
                  ))}
                </div>
              </div>
            </div>

            <div className={styles["filter-row"]}>
              <div className={styles["filter-group"]}>
                <label>근무형태</label>
                <div className={styles["checkbox-group"]}>
                  {['출퇴근', '입주'].map(workType => (
                    <label key={workType} className={styles["checkbox-label"]}>
                      <input
                        type="checkbox"
                        checked={filterWorkType.includes(workType)}
                        onChange={(e) => {
                          if (e.target.checked) {
                            setFilterWorkType(prev => prev ? `${prev},${workType}` : workType);
                          } else {
                            setFilterWorkType(prev => 
                              prev.split(',').filter(w => w !== workType).join(',')
                            );
                          }
                        }}
                      />
                      {workType}
                    </label>
                  ))}
                </div>
              </div>

              <div className={styles["filter-group"]}>
                <label>고용형태</label>
                <div className={styles["checkbox-group"]}>
                  {['정규직', '계약직', '단기', '장기', '임시'].map(empType => (
                    <label key={empType} className={styles["checkbox-label"]}>
                      <input
                        type="checkbox"
                        checked={filterEmploymentType.includes(empType)}
                        onChange={(e) => {
                          if (e.target.checked) {
                            setFilterEmploymentType(prev => prev ? `${prev},${empType}` : empType);
                          } else {
                            setFilterEmploymentType(prev => 
                              prev.split(',').filter(e => e !== empType).join(',')
                            );
                          }
                        }}
                      />
                      {empType}
                    </label>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}
        
        {(search || selectedType || filterGender || filterCertificate || filterWorkType || filterEmploymentType) && (
          <div className={styles["active-filters"]}>
            <span className={styles["filter-label"]}>활성 필터:</span>
            {selectedType && (
              <span className={styles["filter-tag"]}>
                유형: {selectedType} 
                <button onClick={() => setSelectedType('')} className={styles["remove-filter"]}>✖</button>
              </span>
            )}
            {search && (
              <span className={styles["filter-tag"]}>
                검색: "{search}"
                <button onClick={() => setSearch('')} className={styles["remove-filter"]}>✖</button>
              </span>
            )}
            {filterGender && (
              <span className={styles["filter-tag"]}>
                성별: {filterGender}
                <button onClick={() => setFilterGender('')} className={styles["remove-filter"]}>✖</button>
              </span>
            )}
            {filterCertificate && (
              <span className={styles["filter-tag"]}>
                자격증: {filterCertificate}
                <button onClick={() => setFilterCertificate('')} className={styles["remove-filter"]}>✖</button>
              </span>
            )}
            {filterWorkType && (
              <span className={styles["filter-tag"]}>
                근무형태: {filterWorkType}
                <button onClick={() => setFilterWorkType('')} className={styles["remove-filter"]}>✖</button>
              </span>
            )}
            {filterEmploymentType && (
              <span className={styles["filter-tag"]}>
                고용형태: {filterEmploymentType}
                <button onClick={() => setFilterEmploymentType('')} className={styles["remove-filter"]}>✖</button>
              </span>
            )}
            <button onClick={handleResetFilters} className={styles["reset-filters-btn"]}>
              🔄 전체 초기화
            </button>
          </div>
        )}
      </div>

      {/* 결과 요약 */}
      <div className={styles["results-summary"]}>
        <span className={styles["results-count"]}>
          {selectedType ? `${selectedType} ` : '전체 '}
          총 <strong>{products.length}</strong>개 상품
        </span>
        {selectedType && (
          <span className={styles["type-indicator"]}>
            <span className={`type-badge ${selectedType.replace('/', '-')}`}>
              {selectedType === '요양사' && '👩‍⚕️ '}
              {selectedType === '요양원/실버타운' && '🏥🏢 '}
              {selectedType}
            </span>
          </span>
        )}
      </div>

      {isLoading && (
        <div className={styles["loading-indicator"]}>
          <div className={styles["spinner"]}></div>
          <span>데이터를 불러오는 중...</span>
        </div>
      )}

      <div className={styles["table-container"]}>
        <table border="1" cellPadding="8" width="100%">
          <thead>
            <tr>
              <th>상품 ID</th>
              <th>상품명</th>
              <th>유형</th>
              <th>희망급여(만원)</th>
              <th>소개</th>
              <th>희망근무지역(도/광역시)</th>
              <th>희망근무지역(시/군/구)</th>
              <th>희망근무장소</th>
              <th>희망근무형태</th>
              <th>희망고용형태</th>
              <th>학력수준</th>
              <th>경력근무지</th>
              <th>입사일</th>
              <th>퇴사일</th>
              <th>자격증</th>
              <th>추가된 날짜</th>
              <th>수정된 날짜</th>
              <th>삭제된 날짜</th>
              <th>상세 설명</th>
              <th>관리</th>
            </tr>
          </thead>
          <tbody>
            {products.length > 0 ? (
              products.map((p) => (
                <tr key={p.prodId}>
                  <td>{p.prodId}</td>
                  <td>
                    <span 
                      className={styles["product-name-link"]} 
                      onClick={() => handleProductClick(p)}
                    >
                      {p.prodName}
                    </span>
                  </td>
                  <td>{p.prodTypeName}</td>
                  <td>{p.prodPrice || p.price || 0}만원</td>
                  <td className={styles["detail-cell"]}>{p.prodDetail || p.description || '-'}</td>
                  <td>{p.location ? p.location.split(' ')[0] : '-'}</td>
                  <td>{p.location ? p.location.split(' ')[1] : '-'}</td>
                  <td className={styles["detail-cell"]}>{p.workPlace || '-'}</td>
                  <td>{p.workType || '-'}</td>
                  <td>{p.employmentType || '-'}</td>
                  <td>{p.education || '-'}</td>

                  <td className={styles["detail-cell"]}>{p.careerString || '-'}</td>
                  <td>{p.startDateString || '-'}</td>
                  <td>{p.endDateString || '-'}</td>
                  <td className={styles["detail-cell"]}>{p.certificatesString || '-'}</td>
                  <td>{p.createdAt || '-'}</td>
                  <td>{p.updatedAt || '-'}</td>
                  <td style={{color: p.deletedAt ? '#dc3545' : '#28a745'}}>
                    {p.deletedAt ? p.deletedAt : '활성'}
                  </td>
                  <td className={styles["detail-cell"]}>{p.prodDetail}</td>
                  <td>
                    <button 
                      onClick={() => handleDeleteProduct(p.prodId, p.prodName)}
                      style={{
                        background: 'linear-gradient(135deg, #dc3545, #c82333)',
                        color: 'white',
                        border: 'none',
                        padding: '6px 12px',
                        borderRadius: '4px',
                        fontSize: '12px',
                        cursor: 'pointer',
                        transition: 'all 0.2s ease'
                      }}
                      onMouseOver={(e) => {
                        e.target.style.background = 'linear-gradient(135deg, #c82333, #bd2130)';
                        e.target.style.transform = 'translateY(-1px)';
                      }}
                      onMouseOut={(e) => {
                        e.target.style.background = 'linear-gradient(135deg, #dc3545, #c82333)';
                        e.target.style.transform = 'translateY(0)';
                      }}
                      disabled={isLoading}
                    >
                      🗑️ 삭제
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="19" className={styles["no-data"]}>
                  {isLoading ? '데이터를 불러오는 중...' : '등록된 상품이 없습니다.'}
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <div style={{ marginTop: '1rem' }}>
        <button onClick={() => setPage((prev) => Math.max(prev - 1, 0))}>◀ 이전</button>
        <span style={{ margin: '0 1rem' }}>페이지: {page + 1}</span>
        <button onClick={() => setPage((prev) => prev + 1)}>다음 ▶</button>
      </div>

      {/* 등록 모달 */}
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
                    <option value="요양원/실버타운">🏥 요양원/실버타운</option>
                  </select>
                </div>
              </div>

              <div className={styles["form-row"]}>
                <div className={styles["form-group"]}>
                  <label>회원 선택 *</label>
                  <select
                    name="member_id"
                    value={formData.member_id}
                    onChange={handleInputChange}
                    required
                  >
                    <option value="">회원을 선택하세요</option>
                    {users.map(user => (
                      <option key={user.member_id} value={user.member_id}>
                        {user.name} ({user.username}) - {user.email}
                        {user.suggested_product_name && ` → "${user.suggested_product_name}"`}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* 요양사일 때만 표시되는 필드들 */}
              {formData.prodTypeName === '요양사' && (
                <div className={styles["form-row"]}>
                  <div className={styles["form-group"]}>
                    <label>희망급여(만원) *</label>
                    <input
                      type="number"
                      name="hope_work_amount"
                      value={formData.hope_work_amount}
                      onChange={handleInputChange}
                      placeholder="희망급여를 입력하세요"
                      min="0"
                      required
                    />
                  </div>
                </div>
              )}



              {/* 지역 선택 - 모든 유형에 공통 (요양사는 희망근무지역, 시설은 위치) */}
              <div className={styles["form-row"]}>
                <div className={styles["form-group"]}>
                  <label>
                    {formData.prodTypeName === '요양사' ? '희망근무지역(도/광역시)' : '시설위치(도/광역시)'}
                    {formData.prodTypeName === '요양사' && ' *'}
                  </label>
                  <select
                    value={selectedRegionId}
                    onChange={(e) => {
                      console.log('🔥 AdminProductList 드롭다운 onChange 이벤트 발생!', e.target.value);
                      handleRegionChange(e);
                    }}
                    required={formData.prodTypeName === '요양사'}
                  >
                    <option value="">선택하세요</option>
                    {regions.map(region => (
                      <option key={region.id} value={region.id}>
                        {region.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div className={styles["form-group"]}>
                  <label>
                    {formData.prodTypeName === '요양사' ? '희망근무지역(시/군/구)' : '시설위치(시/군/구)'}
                    {formData.prodTypeName === '요양사' && ' *'}
                  </label>
                  <select
                    name="hope_work_area_city"
                    value={formData.hope_work_area_city}
                    onChange={handleCityChange}
                    disabled={!selectedRegionId}
                    required={formData.prodTypeName === '요양사'}
                  >
                    <option value="">시/군/구를 선택하세요</option>
                    {cities.map(city => (
                      <option key={city.id} value={city.name}>
                        {city.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* 요양사 전용 필드들 */}
              {formData.prodTypeName === '요양사' && (
                <>
                  <div className={styles["form-row"]}>
                    <div className={styles["form-group"]}>
                      <label>성별 *</label>
                      <select
                        name="userGender"
                        value={formData.userGender}
                        onChange={handleInputChange}
                        required
                      >
                        <option value="">성별을 선택하세요</option>
                        <option value="여자">여자</option>
                        <option value="남자">남자</option>
                        <option value="무관">무관</option>
                      </select>
                    </div>

                    <div className={styles["form-group"]}>
                      <label>희망근무장소</label>
                      <div className={styles["checkbox-group"]}>
                        {['가정방문', '방문요양센터', '요양병원'].map(workPlace => (
                          <label key={workPlace} className={styles["checkbox-label"]}>
                            <input
                              type="checkbox"
                              checked={(formData.hope_work_place || '').includes(workPlace)}
                              onChange={(e) => {
                                if (e.target.checked) {
                                  setFormData(prev => ({
                                    ...prev,
                                    hope_work_place: prev.hope_work_place ? `${prev.hope_work_place},${workPlace}` : workPlace
                                  }));
                                } else {
                                  setFormData(prev => ({
                                    ...prev,
                                    hope_work_place: (prev.hope_work_place || '').split(',').filter(w => w !== workPlace).join(',')
                                  }));
                                }
                              }}
                            />
                            <span>{workPlace}</span>
                          </label>
                        ))}
                      </div>
                    </div>
                  </div>

                  <div className={styles["form-row"]}>
                    <div className={styles["form-group"]}>
                      <label>희망근무형태 *</label>
                      <div className={styles["checkbox-group"]}>
                        {['출퇴근', '입주'].map(workType => (
                          <label key={workType} className={styles["checkbox-label"]}>
                            <input
                              type="checkbox"
                              checked={(formData.hope_work_type || '').includes(workType)}
                              onChange={(e) => {
                                if (e.target.checked) {
                                  setFormData(prev => ({
                                    ...prev,
                                    hope_work_type: prev.hope_work_type ? `${prev.hope_work_type},${workType}` : workType
                                  }));
                                } else {
                                  setFormData(prev => ({
                                    ...prev,
                                    hope_work_type: (prev.hope_work_type || '').split(',').filter(w => w !== workType).join(',')
                                  }));
                                }
                              }}
                            />
                            <span>{workType}</span>
                          </label>
                        ))}
                      </div>
                    </div>
                  </div>

                  <div className={styles["form-row"]}>
                    <div className={styles["form-group"]}>
                      <label>희망고용형태 *</label>
                      <div className={styles["checkbox-group"]}>
                        {['정규직', '계약직', '단기', '장기', '임시'].map(empType => (
                          <label key={empType} className={styles["checkbox-label"]}>
                            <input
                              type="checkbox"
                              checked={(formData.hope_employment_type || '').includes(empType)}
                              onChange={(e) => {
                                if (e.target.checked) {
                                  setFormData(prev => ({
                                    ...prev,
                                    hope_employment_type: prev.hope_employment_type ? `${prev.hope_employment_type},${empType}` : empType
                                  }));
                                } else {
                                  setFormData(prev => ({
                                    ...prev,
                                    hope_employment_type: (prev.hope_employment_type || '').split(',').filter(e => e !== empType).join(',')
                                  }));
                                }
                              }}
                            />
                            <span>{empType}</span>
                          </label>
                        ))}
                      </div>
                    </div>
                  </div>

                  <div className={styles["form-row"]}>
                    <div className={styles["form-group"]}>
                      <label>자격증</label>
                      <div className={styles["checkbox-group"]}>
                        {['요양보호사', '사회복지사', '간호조무사', '일반'].map(cert => (
                          <label key={cert} className={styles["checkbox-label"]}>
                            <input
                              type="checkbox"
                              checked={(formData.certificate_name || '').includes(cert)}
                              onChange={(e) => {
                                if (e.target.checked) {
                                  setFormData(prev => ({
                                    ...prev,
                                    certificate_name: prev.certificate_name ? `${prev.certificate_name},${cert}` : cert
                                  }));
                                } else {
                                  setFormData(prev => ({
                                    ...prev,
                                    certificate_name: (prev.certificate_name || '').split(',').filter(c => c !== cert).join(',')
                                  }));
                                }
                              }}
                            />
                            <span>{cert}</span>
                          </label>
                        ))}
                      </div>
                    </div>
                  </div>

                  <div className={styles["form-row"]}>
                    <div className={styles["form-group"]}>
                      <label>학력수준</label>
                      <select
                        name="education_level"
                        value={formData.education_level}
                        onChange={handleInputChange}
                      >
                        <option value="">선택하세요</option>
                        <option value="고등학교 졸업">고등학교 졸업</option>
                        <option value="전문대학 졸업">전문대학 졸업</option>
                        <option value="대학교 졸업">대학교 졸업</option>
                        <option value="대학원 졸업">대학원 졸업</option>
                      </select>
                    </div>

                    <div className={styles["form-group"]}>
                      <label>경력근무지</label>
                      <input
                        type="text"
                        name="company_name"
                        value={formData.company_name}
                        onChange={handleInputChange}
                        placeholder="이전 근무지를 입력하세요"
                      />
                    </div>
                  </div>
                </>
              )}

              {/* 요양원/실버타운 전용 필드들 (실제 DB 구조에 맞춤) */}
              {formData.prodTypeName === '요양원/실버타운' && (
                <>
                  <div className={styles["form-row"]}>
                    <div className={styles["form-group"]}>
                      <label>시설명 *</label>
                      <input
                        type="text"
                        name="facility_name"
                        value={formData.facility_name}
                        onChange={handleInputChange}
                        placeholder="요양원/실버타운 이름을 입력하세요"
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

                  <div className={styles["form-row"]}>
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

                    <div className={styles["form-group"]}>
                      <label>테마</label>
                      <input
                        type="text"
                        name="facility_theme"
                        value={formData.facility_theme}
                        onChange={handleInputChange}
                        placeholder="시설 테마 (예: 치매전문, 재활전문, 호텔형)"
                      />
                    </div>
                  </div>

                  <div className={styles["form-row"]}>
                    <div className={styles["form-group"]}>
                      <label>상세주소</label>
                      <input
                        type="text"
                        name="facility_detail_address"
                        value={formData.facility_detail_address}
                        onChange={handleInputChange}
                        placeholder="상세주소를 입력하세요"
                      />
                    </div>

                    <div className={styles["form-group"]}>
                      <label>전화번호</label>
                      <input
                        type="tel"
                        name="facility_phone"
                        value={formData.facility_phone}
                        onChange={handleInputChange}
                        placeholder="전화번호를 입력하세요 (예: 02-1234-5678)"
                      />
                    </div>
                  </div>

                  <div className={styles["form-row"]}>
                    <div className={styles["form-group"]}>
                      <label>홈페이지</label>
                      <input
                        type="url"
                        name="facility_homepage"
                        value={formData.facility_homepage}
                        onChange={handleInputChange}
                        placeholder="홈페이지 URL을 입력하세요 (예: https://example.com)"
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

                  <div className={styles["form-row"]}>
                    <div className={styles["form-group"]}>
                      <label>희망 근무 지역 *</label>
                      <select
                        value={selectedRegionId}
                        onChange={handleRegionChange}
                        required
                      >
                        <option value="">시/도를 선택하세요</option>
                        {regions.map(region => (
                          <option key={region.id} value={region.id}>
                            {region.name}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div className={styles["form-group"]}>
                      <label>희망 근무 시/군/구 *</label>
                      <select
                        name="hope_work_area_city"
                        value={formData.hope_work_area_city}
                        onChange={handleCityChange}
                        required
                        disabled={!selectedRegionId}
                      >
                        <option value="">시/군/구를 선택하세요</option>
                        {cities.map(city => (
                          <option key={city.id} value={city.name}>
                            {city.name}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>

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

                  <div className={styles["form-row"]}>
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
                   </div>

                   <div className={styles["form-row"]}>
                     <div className={styles["form-group"]}>
                       <label>공지사항 제목</label>
                       <input
                         type="text"
                         name="notice_title"
                         value={formData.notice_title}
                         onChange={handleInputChange}
                         placeholder="공지사항 제목"
                       />
                     </div>

                     <div className={styles["form-group"]}>
                       <label>카테고리</label>
                       <input
                         type="text"
                         name="category"
                         value={formData.category}
                         onChange={handleInputChange}
                         placeholder="시설 카테고리 (예: 프리미엄, 일반)"
                       />
                     </div>
                   </div>

                   <div className={styles["form-group"]}>
                     <label>공지사항 내용</label>
                     <textarea
                       name="notice_content"
                       value={formData.notice_content}
                       onChange={handleInputChange}
                       placeholder="공지사항 내용을 입력하세요"
                       rows="3"
                     />
                   </div>

                   <div className={styles["form-row"]}>
                     <div className={styles["form-group"]}>
                       <label>사진 URL</label>
                       <input
                         type="text"
                         name="photo_url"
                         value={formData.photo_url}
                         onChange={handleInputChange}
                         placeholder="시설 사진 URL"
                       />
                     </div>

                     <div className={styles["form-group"]}>
                       <label>썸네일 여부</label>
                       <select
                         name="is_thumbnail"
                         value={formData.is_thumbnail}
                         onChange={handleInputChange}
                       >
                         <option value={false}>일반 사진</option>
                         <option value={true}>썸네일</option>
                       </select>
                     </div>
                   </div>

                   <div className={styles["form-group"]}>
                     <label>시설 태그</label>
                     <input
                       type="text"
                       name="facility_tag"
                       value={formData.facility_tag}
                       onChange={handleInputChange}
                       placeholder="태그를 쉼표로 구분하여 입력 (예: 24시간케어,전문의료진,개별맞춤)"
                     />
                   </div>
                </>
              )}

              <div className={styles["form-row"]}>
                <div className={styles["form-group"]}>
                  <label>입사일</label>
                  <input
                    type="date"
                    name="start_date"
                    value={formData.start_date}
                    onChange={handleInputChange}
                  />
                </div>

                <div className={styles["form-group"]}>
                  <label>퇴사일</label>
                  <input
                    type="date"
                    name="end_date"
                    value={formData.end_date}
                    onChange={handleInputChange}
                  />
                </div>
              </div>

              <div className={styles["form-group"]}>
                <label>자격증</label>
                <textarea
                  name="certificate_name"
                  value={formData.certificate_name}
                  onChange={handleInputChange}
                  placeholder="보유하신 자격증을 입력하세요"
                  rows="2"
                />
              </div>

              <div className={styles["form-group"]}>
                <label>소개</label>
                <textarea
                  name="introduction"
                  value={formData.introduction}
                  onChange={handleInputChange}
                  placeholder="자기소개를 입력하세요"
                  rows="3"
                />
              </div>

              <div className={styles["form-row"]}>
                <div className={styles["form-group"]}>
                  <label>추가된 날짜</label>
                  <input
                    type="date"
                    name="caregiver_created_at"
                    value={formData.caregiver_created_at}
                    onChange={handleInputChange}
                  />
                </div>

                <div className={styles["form-group"]}>
                  <label>수정된 날짜</label>
                  <input
                    type="date"
                    name="caregiver_update_at"
                    value={formData.caregiver_update_at}
                    onChange={handleInputChange}
                  />
                </div>
              </div>

              <div className={styles["form-group"]}>
                <label>삭제된 날짜</label>
                <input
                  type="date"
                  name="caregiver_deleted_at"
                  value={formData.caregiver_deleted_at}
                  onChange={handleInputChange}
                  placeholder="삭제된 경우에만 입력"
                />
              </div>

              <div className={styles["form-group"]}>
                <label>상세 설명</label>
                <textarea
                  name="prodDetail"
                  value={formData.prodDetail}
                  onChange={handleInputChange}
                  placeholder="상품에 대한 상세 설명을 입력하세요"
                  rows="4"
                />
              </div>

              <div className={styles["form-buttons"]}>
                <button type="button" onClick={handleCloseModal} className={styles["cancel-btn"]} disabled={isLoading}>
                  취소
                </button>
                <button type="submit" className={styles["submit-btn"]} disabled={isLoading}>
                  {isLoading ? '등록 중...' : '등록하기'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* 상세 정보 모달 */}
      {isDetailModalOpen && selectedProduct && (
        <div className={styles["modal-overlay"]} onClick={handleCloseDetailModal}>
          <div className={styles["detail-modal-content"]} onClick={(e) => e.stopPropagation()}>
            <div className={styles["modal-header"]}>
              <h3>{isEditMode ? '✏️ 상품 수정' : '📋 상품 상세 정보'}</h3>
              <button className={styles["close-btn"]} onClick={handleCloseDetailModal}>✖</button>
            </div>
            
            {!isEditMode ? (
              // 상세 정보 보기 모드
              <>
                <div className={styles["detail-content"]}>
                  <div className={styles["detail-section"]}>
                    <div className={styles["detail-field"]}>
                      <label>상품 ID</label>
                      <div className={styles["field-value"]}>{selectedProduct.prodId}</div>
                    </div>
                    
                    <div className={styles["detail-field"]}>
                      <label>상품명</label>
                                             <div className={`${styles["field-value"]} ${styles["product-title"]}`}>{selectedProduct.prodName}</div>
                    </div>
                    
                    <div className={styles["detail-field"]}>
                      <label>상품 유형</label>
                      <div className={styles["field-value"]}>
                        <span className={`type-badge ${selectedProduct.prodTypeName}`}>
                          {selectedProduct.prodTypeName}
                        </span>
                      </div>
                    </div>
                    
                    {/* 요양사와 요양원/실버타운 공통 필드 */}
                    <div className={styles["detail-field"]}>
                      <label>{selectedProduct.prodTypeName === '요양원/실버타운' ? '월별이용료' : '희망급여'}</label>
                                             <div className={`${styles["field-value"]} ${styles["price"]}`}>
                        {selectedProduct.prodTypeName === '요양원/실버타운' ? 
                          `${selectedProduct.facility_charge || selectedProduct.hope_work_amount}만원` :
                          `${selectedProduct.hope_work_amount}만원`
                        }
                      </div>
                    </div>

                    {/* 요양원/실버타운 전용 필드들 */}
                    {selectedProduct.prodTypeName === '요양원/실버타운' && (
                      <>
                        <div className={styles["detail-field"]}>
                          <label>테마</label>
                          <div className={styles["field-value"]}>
                            {selectedProduct.facility_theme || '-'}
                          </div>
                        </div>
                        
                        <div className={styles["detail-field"]}>
                          <label>상세주소</label>
                          <div className={styles["field-value"]}>
                            {selectedProduct.facility_detail_address || '-'}
                          </div>
                        </div>
                        
                        <div className={styles["detail-field"]}>
                          <label>연락처</label>
                          <div className={styles["field-value"]}>
                            {selectedProduct.facility_phone || '-'}
                          </div>
                        </div>
                        
                                                 <div className={styles["detail-field"]}>
                           <label>홈페이지URL</label>
                           <div className={styles["field-value"]}>
                             {selectedProduct.facility_homepage ? (
                               <a href={selectedProduct.facility_homepage} target="_blank" rel="noopener noreferrer">
                                 {selectedProduct.facility_homepage}
                               </a>
                             ) : '-'}
                           </div>
                         </div>
                         
                         <div className={styles["detail-field"]}>
                           <label>카테고리</label>
                           <div className={styles["field-value"]}>
                             {selectedProduct.category || '-'}
                           </div>
                         </div>
                         
                         <div className={styles["detail-field"]}>
                           <label>시설 태그</label>
                           <div className={styles["field-value"]}>
                             {selectedProduct.facility_tag || '-'}
                           </div>
                         </div>
                         
                         <div className={styles["detail-field"]}>
                           <label>공지사항 제목</label>
                           <div className={styles["field-value"]}>
                             {selectedProduct.notice_title || '-'}
                           </div>
                         </div>
                         
                         <div className={styles["detail-field"]}>
                           <label>공지사항 내용</label>
                           <div className={`${styles["field-value"]} ${styles["description"]}`}>
                             {selectedProduct.notice_content || '-'}
                           </div>
                         </div>
                         
                         <div className={styles["detail-field"]}>
                           <label>사진 URL</label>
                           <div className={styles["field-value"]}>
                             {selectedProduct.photo_url ? (
                               <a href={selectedProduct.photo_url} target="_blank" rel="noopener noreferrer">
                                 {selectedProduct.photo_url}
                               </a>
                             ) : '-'}
                           </div>
                         </div>
                         
                         <div className={styles["detail-field"]}>
                           <label>썸네일 여부</label>
                           <div className={styles["field-value"]}>
                             {selectedProduct.is_thumbnail ? '썸네일' : '일반 사진'}
                           </div>
                         </div>
                       </>
                     )}

                    {/* 요양사 전용 필드들 */}
                    {selectedProduct.prodTypeName === '요양사' && (
                      <>
                        <div className={styles["detail-field"]}>
                          <label>경력근무지</label>
                          <div className={styles["field-value"]}>
                            {(selectedProduct.careerString && selectedProduct.careerString !== '경력 정보 없음') 
                              ? selectedProduct.careerString 
                              : (selectedProduct.company_name || '-')}
                          </div>
                        </div>
                        
                        <div className={styles["detail-field"]}>
                          <label>근무기간</label>
                          <div className={styles["field-value"]}>
                            {(selectedProduct.startDateString && selectedProduct.endDateString) 
                              ? `${selectedProduct.startDateString} ~ ${selectedProduct.endDateString}`
                              : (selectedProduct.start_date && selectedProduct.end_date)
                                ? `${selectedProduct.start_date} ~ ${selectedProduct.end_date}`
                                : '-'}
                          </div>
                        </div>
                        
                        <div className={styles["detail-field"]}>
                          <label>자격증</label>
                          <div className={styles["field-value"]}>
                            {(selectedProduct.certificatesString && selectedProduct.certificatesString !== '자격증 정보 없음') 
                              ? selectedProduct.certificatesString 
                              : (selectedProduct.certificate_name || '-')}
                          </div>
                        </div>
                      </>
                    )}
                    
                    <div className={styles["detail-field"]}>
                      <label>추가된 날짜</label>
                      <div className={styles["field-value"]}>
                        {selectedProduct.caregiver_created_at || '-'}
                      </div>
                    </div>
                    
                    <div className={styles["detail-field"]}>
                      <label>수정된 날짜</label>
                      <div className={styles["field-value"]}>
                        {selectedProduct.caregiver_update_at || '-'}
                      </div>
                    </div>
                    
                    <div className={styles["detail-field"]}>
                      <label>삭제된 날짜</label>
                      <div className={styles["field-value"]} style={{color: selectedProduct.caregiver_deleted_at ? '#dc3545' : '#28a745'}}>
                        {selectedProduct.caregiver_deleted_at ? selectedProduct.caregiver_deleted_at : '활성'}
                      </div>
                    </div>
                    
                    <div className={styles["detail-field"]}>
                      <label>상세 설명</label>
                                             <div className={`${styles["field-value"]} ${styles["description"]}`}>
                        {selectedProduct.prodDetail}
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className={styles["detail-footer"]}>
                  <button className={styles["edit-btn"]} onClick={handleEditClick}>
                    ✏️ 수정
                  </button>
                  <button className={styles["close-detail-btn"]} onClick={handleCloseDetailModal}>
                    닫기
                  </button>
                </div>
              </>
            ) : (
              // 수정 모드
              <form onSubmit={handleEditSubmit} className={styles["register-form"]}>
                <div className={styles["form-group"]}>
                  <label>상품명 *</label>
                  <input
                    type="text"
                    name="prodName"
                    value={editFormData.prodName}
                    onChange={handleEditInputChange}
                    placeholder="상품명을 입력하세요"
                    required
                  />
                </div>

                <div className={styles["form-group"]}>
                  <label>상품 유형 *</label>
                  <select
                    name="prodTypeName"
                    value={editFormData.prodTypeName}
                    onChange={handleEditInputChange}
                    required
                  >
                    <option value="">유형을 선택하세요</option>
                    <option value="요양사">👨‍⚕️ 요양사</option>
                    <option value="요양원/실버타운">🏥 요양원/실버타운</option>
                  </select>
                </div>

                <div className={styles["form-group"]}>
                  <label>희망급여(만원) *</label>
                  <input
                    type="number"
                    name="hope_work_amount"
                    value={editFormData.hope_work_amount}
                    onChange={handleEditInputChange}
                    placeholder="희망급여를 입력하세요"
                    min="0"
                    required
                  />
                </div>

                <div className={styles["form-group"]}>
                  <label>성별 *</label>
                  <select
                    name="userGender"
                    value={editFormData.userGender}
                    onChange={handleEditInputChange}
                    required
                  >
                    <option value="">성별을 선택하세요</option>
                    <option value="여자">여자</option>
                    <option value="남자">남자</option>
                    <option value="무관">무관</option>
                  </select>
                </div>

                <div className={styles["form-group"]}>
                  <label>상세 설명</label>
                  <textarea
                    name="prodDetail"
                    value={editFormData.prodDetail}
                    onChange={handleEditInputChange}
                    placeholder="상품에 대한 상세 설명을 입력하세요"
                    rows="4"
                  />
                </div>

                <div className={styles["form-group"]}>
                  <label>희망근무지역(도/광역시) *</label>
                  <select
                    value={editSelectedRegionId}
                    onChange={handleEditRegionChange}
                    className={styles["region-select"]}
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
                  <label>희망근무지역(시/군/구) *</label>
                  <select
                    value={editFormData.hope_work_area_city || ''}
                    onChange={handleEditCityChange}
                    disabled={!editSelectedRegionId}
                    className={styles["city-select"]}
                    required
                  >
                    <option value="">시/군/구를 선택하세요</option>
                    {editCities.map(city => (
                      <option key={city.id} value={city.name}>
                        {city.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div className={styles["form-group"]}>
                  <label>희망근무장소 *</label>
                  <div className={styles["checkbox-group"]}>
                    {['가정방문', '방문요양센터', '요양병원'].map(workPlace => (
                      <label key={workPlace} className={styles["checkbox-label"]}>
                        <input
                          type="checkbox"
                          checked={(editFormData.hope_work_place || '').includes(workPlace)}
                          onChange={(e) => {
                            if (e.target.checked) {
                              setEditFormData(prev => ({
                                ...prev,
                                hope_work_place: prev.hope_work_place ? `${prev.hope_work_place},${workPlace}` : workPlace
                              }));
                            } else {
                              setEditFormData(prev => ({
                                ...prev,
                                hope_work_place: (prev.hope_work_place || '').split(',').filter(w => w !== workPlace).join(',')
                              }));
                            }
                          }}
                        />
                        <span>{workPlace}</span>
                      </label>
                    ))}
                  </div>
                </div>

                <div className={styles["form-group"]}>
                  <label>희망근무형태 *</label>
                  <div className={styles["checkbox-group"]}>
                    {['출퇴근', '입주'].map(workType => (
                      <label key={workType} className={styles["checkbox-label"]}>
                        <input
                          type="checkbox"
                          checked={(editFormData.hope_work_type || '').includes(workType)}
                          onChange={(e) => {
                            if (e.target.checked) {
                              setEditFormData(prev => ({
                                ...prev,
                                hope_work_type: prev.hope_work_type ? `${prev.hope_work_type},${workType}` : workType
                              }));
                            } else {
                              setEditFormData(prev => ({
                                ...prev,
                                hope_work_type: (prev.hope_work_type || '').split(',').filter(w => w !== workType).join(',')
                              }));
                            }
                          }}
                        />
                        <span>{workType}</span>
                      </label>
                    ))}
                  </div>
                </div>

                <div className={styles["form-group"]}>
                  <label>희망고용형태 *</label>
                  <div className={styles["checkbox-group"]}>
                    {['정규직', '계약직', '단기', '장기', '임시'].map(empType => (
                      <label key={empType} className={styles["checkbox-label"]}>
                        <input
                          type="checkbox"
                          checked={(editFormData.hope_employment_type || '').includes(empType)}
                          onChange={(e) => {
                            if (e.target.checked) {
                              setEditFormData(prev => ({
                                ...prev,
                                hope_employment_type: prev.hope_employment_type ? `${prev.hope_employment_type},${empType}` : empType
                              }));
                            } else {
                              setEditFormData(prev => ({
                                ...prev,
                                hope_employment_type: (prev.hope_employment_type || '').split(',').filter(e => e !== empType).join(',')
                              }));
                            }
                          }}
                        />
                        <span>{empType}</span>
                      </label>
                    ))}
                  </div>
                </div>

                <div className={styles["form-group"]}>
                  <label>학력수준</label>
                  <select
                    name="education_level"
                    value={editFormData.education_level}
                    onChange={handleEditInputChange}
                  >
                    <option value="">선택하세요</option>
                    <option value="고등학교 졸업">고등학교 졸업</option>
                    <option value="전문대학 졸업">전문대학 졸업</option>
                    <option value="대학교 졸업">대학교 졸업</option>
                    <option value="대학원 졸업">대학원 졸업</option>
                  </select>
                </div>

                <div className={styles["form-group"]}>
                  <label>소개 *</label>
                  <textarea
                    name="introduction"
                    value={editFormData.introduction}
                    onChange={handleEditInputChange}
                    placeholder="소개를 입력하세요"
                    rows="4"
                    required
                  />
                </div>



                <div className={styles["form-group"]}>
                  <label>경력 근무 장소 *</label>
                  <input
                    type="text"
                    name="company_name"
                    value={editFormData.company_name}
                    onChange={handleEditInputChange}
                    placeholder="경력 근무 장소를 입력하세요"
                    required
                  />
                </div>



                <div className={styles["form-group"]}>
                  <label>자격증</label>
                  <div className={styles["checkbox-group"]}>
                                            {['요양보호사', '사회복지사', '간호조무사', '일반'].map(cert => (
                          <label key={cert} className={styles["checkbox-label"]}>
                            <input
                              type="checkbox"
                              checked={(editFormData.certificate_name || '').includes(cert)}
                              onChange={(e) => {
                                if (e.target.checked) {
                                  setEditFormData(prev => ({
                                    ...prev,
                                    certificate_name: prev.certificate_name ? `${prev.certificate_name},${cert}` : cert
                                  }));
                                } else {
                                  setEditFormData(prev => ({
                                    ...prev,
                                    certificate_name: (prev.certificate_name || '').split(',').filter(c => c !== cert).join(',')
                                  }));
                                }
                              }}
                            />
                            <span>{cert}</span>
                          </label>
                        ))}
                  </div>
                </div>



                <div className={styles["form-buttons"]}>
                  <button type="button" onClick={handleEditCancel} className={styles["cancel-btn"]}>
                    취소
                  </button>
                  <button type="submit" className={styles["edit-submit-btn"]}>
                    수정 완료
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminProductList;
