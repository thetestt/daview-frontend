// 📁 src/pages/admin/AdminProductList.js
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import '../../../styles/admin/AdminProductList.css';

// 더미 데이터
const dummyProducts = [
  {
    prodId: 1,
    prodName: "김영희 요양사",
    prodTypeName: "요양사",
    hope_work_amount: 250,
    introduction: "10년 경력의 전문 요양사입니다. 치매 어르신 전문 케어 가능합니다.",
    hope_work_area_location: "서울특별시",
    hope_work_area_city: "강남구",
    hope_work_place: "강남구, 서초구",
    hope_work_type: "입주",
    hope_employment_type: "전일제",
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
    prodName: "해든요양원",
    prodTypeName: "요양원",
    hope_work_amount: 300,
    introduction: "24시간 전문 의료진이 상주하는 프리미엄 요양원입니다. 개별 맞춤 케어 제공합니다.",
    hope_work_area_location: "경기도",
    hope_work_area_city: "성남시",
    hope_work_place: "성남시 분당구",
    hope_work_type: "통원",
    hope_employment_type: "시설운영",
    education_level: "대학원 졸업",
    prodDetail: "가족같은 따뜻한 돌봄을 제공하는 요양원입니다.",
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
    prodName: "청담실버타운",
    prodTypeName: "실버타운",
    hope_work_amount: 400,
    introduction: "강남 청담동에 위치한 고급 실버타운으로 다양한 문화시설과 의료시설을 갖추고 있습니다.",
    hope_work_area_location: "서울특별시",
    hope_work_area_city: "강남구",
    hope_work_place: "강남구 청담동",
    hope_work_type: "시설거주",
    hope_employment_type: "시설관리",
    education_level: "대학교 졸업",
    prodDetail: "프리미엄 실버타운으로 최고급 서비스를 제공합니다.",
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
    hope_work_amount: 200,
    introduction: "물리치료 전문 요양사로 거동불편 어르신 전문 케어가 가능합니다.",
    hope_work_area_location: "부산광역시",
    hope_work_area_city: "해운대구",
    hope_work_place: "해운대구, 수영구",
    hope_work_type: "방문",
    hope_employment_type: "파트타임",
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
    prodName: "사랑가득요양원",
    prodTypeName: "요양원",
    hope_work_amount: 280,
    introduction: "가족같은 분위기의 소규모 요양원입니다. 개인별 맞춤 식단과 활동 프로그램을 제공합니다.",
    hope_work_area_location: "대구광역시",
    hope_work_area_city: "수성구",
    hope_work_place: "수성구",
    hope_work_type: "통원",
    hope_employment_type: "전일제",
    education_level: "대학교 졸업",
    prodDetail: "소규모 맞춤형 케어로 가족같은 따뜻함을 제공합니다.",
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
    prodName: "강남힐스실버타운",
    prodTypeName: "실버타운",
    hope_work_amount: 500,
    introduction: "강남 중심가에 위치한 최고급 실버타운으로 골프장, 수영장, 도서관 등 다양한 시설을 보유하고 있습니다.",
    hope_work_area_location: "서울특별시",
    hope_work_area_city: "강남구",
    hope_work_place: "강남구",
    hope_work_type: "시설거주",
    hope_employment_type: "시설관리",
    education_level: "대학원 졸업",
    prodDetail: "최고급 실버타운으로 프리미엄 라이프스타일을 제공합니다.",
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
    hope_work_amount: 220,
    introduction: "15년 경력의 베테랑 요양사입니다. 인지능력 향상 프로그램 전문가입니다.",
    hope_work_area_location: "인천광역시",
    hope_work_area_city: "연수구",
    hope_work_place: "연수구, 남동구",
    hope_work_type: "입주",
    hope_employment_type: "전일제",
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
    prodName: "효도의집요양원",
    prodTypeName: "요양원",
    hope_work_amount: 290,
    introduction: "한방 치료와 서양 의학을 접목한 통합 케어 서비스를 제공하는 요양원입니다.",
    hope_work_area_location: "광주광역시",
    hope_work_area_city: "서구",
    hope_work_place: "서구, 남구",
    hope_work_type: "통원",
    hope_employment_type: "전일제",
    education_level: "대학교 졸업",
    prodDetail: "한방과 양방의 장점을 결합한 통합 의료 서비스를 제공합니다.",
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
    prodName: "자연휴양실버타운",
    prodTypeName: "실버타운",
    hope_work_amount: 350,
    introduction: "자연 속에서 여유로운 노후를 보낼 수 있는 전원형 실버타운입니다. 유기농 농장과 산책로를 보유하고 있습니다.",
    hope_work_area_location: "강원도",
    hope_work_area_city: "춘천시",
    hope_work_place: "춘천시",
    hope_work_type: "시설거주",
    hope_employment_type: "시설관리",
    education_level: "대학교 졸업",
    prodDetail: "자연친화적인 환경에서 건강한 노후생활을 지원합니다.",
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
    hope_work_amount: 180,
    introduction: "간병과 요리를 함께 할 수 있는 올라운드 요양사입니다. 당뇨 환자 전문 케어 가능합니다.",
    hope_work_area_location: "울산광역시",
    hope_work_area_city: "남구",
    hope_work_place: "남구, 중구",
    hope_work_type: "방문",
    hope_employment_type: "파트타임",
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
  const [formData, setFormData] = useState({
    prodName: '',
    prodTypeName: '',
    member_id: '', // 회원 ID 추가
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
  const [editFormData, setEditFormData] = useState({
    prodName: '',
    prodTypeName: '',
    member_id: '', // 회원 ID 추가
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

  // 더미 데이터 필터링 함수
  const filterDummyData = (searchTerm = '', typeFilter = '') => {
    let filteredData = dummyProducts;
    
    // 유형별 필터링
    if (typeFilter && typeFilter !== '') {
      if (typeFilter === '요양원/실버타운') {
        // 요양원과 실버타운을 모두 포함
        filteredData = filteredData.filter(product => 
          product.prodTypeName === '요양원' || product.prodTypeName === '실버타운'
        );
      } else {
        filteredData = filteredData.filter(product => 
          product.prodTypeName === typeFilter
        );
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
      // 더미 데이터에서 상품 수정
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
          certifications: editFormData.certifications,
          createdDate: editFormData.createdDate,
          modifiedDate: editFormData.modifiedDate,
          deletedDate: editFormData.deletedDate
        };
        
        dummyProducts[index] = updatedProduct;
        setSelectedProduct(updatedProduct);
      }
      
      /* 실제 API 사용 시 아래 코드 사용
      await axios.put(`/api/admin/products/${selectedProduct.prodId}`, {
        ...editFormData,
        prodPrice: parseInt(editFormData.prodPrice)
      });
      */
      
      alert('상품이 성공적으로 수정되었습니다.');
      setIsEditMode(false);
      fetchProducts(); // 목록 새로고침
    } catch (error) {
      console.error('상품 수정 실패:', error);
      alert('상품 수정에 실패했습니다.');
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
      prodName: '',
      prodTypeName: '',
      member_id: '',
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
  };

  // 수정 모드 활성화
  const handleEditClick = () => {
    setEditFormData({
      prodName: selectedProduct.prodName,
      prodTypeName: selectedProduct.prodTypeName,
      hope_work_amount: selectedProduct.hope_work_amount.toString(),
      introduction: selectedProduct.introduction,
      hope_work_area_location: selectedProduct.hope_work_area_location,
      hope_work_area_city: selectedProduct.hope_work_area_city,
      hope_work_place: selectedProduct.hope_work_place,
      hope_work_type: selectedProduct.hope_work_type,
      hope_employment_type: selectedProduct.hope_employment_type,
      education_level: selectedProduct.education_level,
      prodDetail: selectedProduct.prodDetail,
      company_name: selectedProduct.company_name,
      start_date: selectedProduct.start_date,
      end_date: selectedProduct.end_date,
      certificate_name: selectedProduct.certificate_name,
      caregiver_created_at: selectedProduct.caregiver_created_at,
      caregiver_update_at: selectedProduct.caregiver_update_at,
      caregiver_deleted_at: selectedProduct.caregiver_deleted_at
    });
    setIsEditMode(true);
  };

  // 수정 취소
  const handleEditCancel = () => {
    setIsEditMode(false);
    setEditFormData({
      prodName: '',
      prodTypeName: '',
      member_id: '',
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
      <div className="admin-header">
        <h2>📦 상품 목록</h2>
        <div className="header-info">
          {!isServerConnected && (
            <span className="server-status offline">🔴 오프라인 모드 (더미 데이터)</span>
          )}
          {isServerConnected && (
            <span className="server-status online">🟢 서버 연결됨</span>
          )}
          <button 
            className="register-btn"
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
      <div className="filter-section">
        <div className="filter-row">
          <div className="filter-group">
            <label>상품 유형</label>
            <select 
              value={selectedType} 
              onChange={handleTypeChange}
              className="type-filter"
            >
              <option value="">▼ 전체 보기</option>
              <option value="요양사">👩‍⚕️ 요양사</option>
              <option value="요양원/실버타운">🏥 요양원/실버타운</option>
            </select>
          </div>
          
          <div className="filter-group">
            <label>검색</label>
            <div className="search-container">
              <input
                type="text"
                placeholder="상품명, 유형, 지역으로 검색"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                onKeyPress={handleSearchKeyPress}
                className="search-input"
              />
              <button 
                onClick={handleSearch} 
                className="search-btn"
                disabled={isLoading}
              >
                {isLoading ? '🔄' : '🔍'} {isLoading ? '검색 중...' : '검색'}
              </button>
            </div>
          </div>
        </div>
        
        {(search || selectedType) && (
          <div className="active-filters">
            <span className="filter-label">활성 필터:</span>
            {selectedType && (
              <span className="filter-tag">
                유형: {selectedType} 
                <button onClick={() => setSelectedType('')} className="remove-filter">✖</button>
              </span>
            )}
            {search && (
              <span className="filter-tag">
                검색: "{search}"
                <button onClick={() => setSearch('')} className="remove-filter">✖</button>
              </span>
            )}
            <button onClick={handleResetFilters} className="reset-filters-btn">
              🔄 전체 초기화
            </button>
          </div>
        )}
      </div>

      {/* 결과 요약 */}
      <div className="results-summary">
        <span className="results-count">
          {selectedType ? `${selectedType} ` : '전체 '}
          총 <strong>{products.length}</strong>개 상품
        </span>
        {selectedType && (
          <span className="type-indicator">
            <span className={`type-badge ${selectedType.replace('/', '-')}`}>
              {selectedType === '요양사' && '👩‍⚕️ '}
              {selectedType === '요양원/실버타운' && '🏥🏢 '}
              {selectedType}
            </span>
          </span>
        )}
      </div>

      {isLoading && (
        <div className="loading-indicator">
          <div className="spinner"></div>
          <span>데이터를 불러오는 중...</span>
        </div>
      )}

      <div className="table-container">
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
            </tr>
          </thead>
          <tbody>
            {products.length > 0 ? (
              products.map((p) => (
                <tr key={p.prodId}>
                  <td>{p.prodId}</td>
                  <td>
                    <span 
                      className="product-name-link" 
                      onClick={() => handleProductClick(p)}
                    >
                      {p.prodName}
                    </span>
                  </td>
                  <td>{p.prodTypeName}</td>
                  <td>{p.prodPrice || p.price || 0}만원</td>
                  <td className="detail-cell">{p.prodDetail || p.description || '-'}</td>
                  <td>{p.location ? p.location.split(' ')[0] : '-'}</td>
                  <td>{p.location ? p.location.split(' ')[1] : '-'}</td>
                  <td className="detail-cell">{p.workPlace || '-'}</td>
                  <td>{p.workType || '-'}</td>
                  <td>{p.employmentType || '-'}</td>
                  <td>{p.education || '-'}</td>

                  <td className="detail-cell">{p.careerString || '-'}</td>
                  <td>{p.startDateString || '-'}</td>
                  <td>{p.endDateString || '-'}</td>
                  <td className="detail-cell">{p.certificatesString || '-'}</td>
                  <td>{p.createdAt || '-'}</td>
                  <td>{p.updatedAt || '-'}</td>
                  <td style={{color: p.deletedAt ? '#dc3545' : '#28a745'}}>
                    {p.deletedAt ? p.deletedAt : '활성'}
                  </td>
                  <td className="detail-cell">{p.prodDetail}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="18" className="no-data">
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
        <div className="modal-overlay" onClick={handleCloseModal}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>🛍️ 새 상품 등록</h3>
              <button className="close-btn" onClick={handleCloseModal}>✖</button>
            </div>
            
            <form onSubmit={handleSubmit} className="register-form">
              <div className="form-row">
                <div className="form-group">
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

                <div className="form-group">
                  <label>상품 유형 *</label>
                  <select
                    name="prodTypeName"
                    value={formData.prodTypeName}
                    onChange={handleInputChange}
                    required
                  >
                    <option value="">유형을 선택하세요</option>
                    <option value="요양사">요양사</option>
                    <option value="요양원">요양원</option>
                    <option value="실버타운">실버타운</option>
                  </select>
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
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

              <div className="form-row">
                <div className="form-group">
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

              <div className="form-row">
                <div className="form-group">
                  <label>희망근무지역(도/광역시)</label>
                  <select
                    name="hope_work_area_location"
                    value={formData.hope_work_area_location}
                    onChange={handleInputChange}
                  >
                    <option value="">선택하세요</option>
                    <option value="서울특별시">서울특별시</option>
                    <option value="부산광역시">부산광역시</option>
                    <option value="대구광역시">대구광역시</option>
                    <option value="인천광역시">인천광역시</option>
                    <option value="광주광역시">광주광역시</option>
                    <option value="대전광역시">대전광역시</option>
                    <option value="울산광역시">울산광역시</option>
                    <option value="세종특별자치시">세종특별자치시</option>
                    <option value="경기도">경기도</option>
                    <option value="강원도">강원도</option>
                    <option value="충청북도">충청북도</option>
                    <option value="충청남도">충청남도</option>
                    <option value="전라북도">전라북도</option>
                    <option value="전라남도">전라남도</option>
                    <option value="경상북도">경상북도</option>
                    <option value="경상남도">경상남도</option>
                    <option value="제주특별자치도">제주특별자치도</option>
                  </select>
                </div>

                <div className="form-group">
                  <label>희망근무지역(시/군/구)</label>
                  <input
                    type="text"
                    name="hope_work_area_city"
                    value={formData.hope_work_area_city}
                    onChange={handleInputChange}
                    placeholder="시/군/구를 입력하세요"
                  />
                </div>
              </div>

              <div className="form-group">
                <label>희망근무장소</label>
                <input
                  type="text"
                  name="hope_work_place"
                  value={formData.hope_work_place}
                  onChange={handleInputChange}
                  placeholder="희망하는 근무장소를 입력하세요"
                />
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>희망근무형태</label>
                  <select
                    name="hope_work_type"
                    value={formData.hope_work_type}
                    onChange={handleInputChange}
                  >
                    <option value="">선택하세요</option>
                    <option value="입주">입주</option>
                    <option value="통원">통원</option>
                    <option value="방문">방문</option>
                    <option value="시설거주">시설거주</option>
                  </select>
                </div>

                <div className="form-group">
                  <label>희망고용형태</label>
                  <select
                    name="hope_employment_type"
                    value={formData.hope_employment_type}
                    onChange={handleInputChange}
                  >
                    <option value="">선택하세요</option>
                    <option value="전일제">전일제</option>
                    <option value="파트타임">파트타임</option>
                    <option value="시설운영">시설운영</option>
                    <option value="시설관리">시설관리</option>
                  </select>
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
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

                <div className="form-group">
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

              <div className="form-row">
                <div className="form-group">
                  <label>입사일</label>
                  <input
                    type="date"
                    name="start_date"
                    value={formData.start_date}
                    onChange={handleInputChange}
                  />
                </div>

                <div className="form-group">
                  <label>퇴사일</label>
                  <input
                    type="date"
                    name="end_date"
                    value={formData.end_date}
                    onChange={handleInputChange}
                  />
                </div>
              </div>

              <div className="form-group">
                <label>자격증</label>
                <textarea
                  name="certificate_name"
                  value={formData.certificate_name}
                  onChange={handleInputChange}
                  placeholder="보유하신 자격증을 입력하세요"
                  rows="2"
                />
              </div>

              <div className="form-group">
                <label>소개</label>
                <textarea
                  name="introduction"
                  value={formData.introduction}
                  onChange={handleInputChange}
                  placeholder="자기소개를 입력하세요"
                  rows="3"
                />
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>추가된 날짜</label>
                  <input
                    type="date"
                    name="caregiver_created_at"
                    value={formData.caregiver_created_at}
                    onChange={handleInputChange}
                  />
                </div>

                <div className="form-group">
                  <label>수정된 날짜</label>
                  <input
                    type="date"
                    name="caregiver_update_at"
                    value={formData.caregiver_update_at}
                    onChange={handleInputChange}
                  />
                </div>
              </div>

              <div className="form-group">
                <label>삭제된 날짜</label>
                <input
                  type="date"
                  name="caregiver_deleted_at"
                  value={formData.caregiver_deleted_at}
                  onChange={handleInputChange}
                  placeholder="삭제된 경우에만 입력"
                />
              </div>

              <div className="form-group">
                <label>상세 설명</label>
                <textarea
                  name="prodDetail"
                  value={formData.prodDetail}
                  onChange={handleInputChange}
                  placeholder="상품에 대한 상세 설명을 입력하세요"
                  rows="4"
                />
              </div>

              <div className="form-buttons">
                <button type="button" onClick={handleCloseModal} className="cancel-btn" disabled={isLoading}>
                  취소
                </button>
                <button type="submit" className="submit-btn" disabled={isLoading}>
                  {isLoading ? '등록 중...' : '등록하기'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* 상세 정보 모달 */}
      {isDetailModalOpen && selectedProduct && (
        <div className="modal-overlay" onClick={handleCloseDetailModal}>
          <div className="detail-modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>{isEditMode ? '✏️ 상품 수정' : '📋 상품 상세 정보'}</h3>
              <button className="close-btn" onClick={handleCloseDetailModal}>✖</button>
            </div>
            
            {!isEditMode ? (
              // 상세 정보 보기 모드
              <>
                <div className="detail-content">
                  <div className="detail-section">
                    <div className="detail-field">
                      <label>상품 ID</label>
                      <div className="field-value">{selectedProduct.prodId}</div>
                    </div>
                    
                    <div className="detail-field">
                      <label>상품명</label>
                      <div className="field-value product-title">{selectedProduct.prodName}</div>
                    </div>
                    
                    <div className="detail-field">
                      <label>상품 유형</label>
                      <div className="field-value">
                        <span className={`type-badge ${selectedProduct.prodTypeName}`}>
                          {selectedProduct.prodTypeName}
                        </span>
                      </div>
                    </div>
                    
                    <div className="detail-field">
                      <label>희망급여</label>
                      <div className="field-value price">
                        {selectedProduct.hope_work_amount}만원
                      </div>
                    </div>
                    
                    <div className="detail-field">
                      <label>경력근무지</label>
                      <div className="field-value">
                        {selectedProduct.company_name || '-'}
                      </div>
                    </div>
                    
                    <div className="detail-field">
                      <label>입사일</label>
                      <div className="field-value">
                        {selectedProduct.start_date || '-'}
                      </div>
                    </div>
                    
                    <div className="detail-field">
                      <label>퇴사일</label>
                      <div className="field-value">
                        {selectedProduct.end_date || '-'}
                      </div>
                    </div>
                    
                    <div className="detail-field">
                      <label>자격증</label>
                      <div className="field-value">
                        {selectedProduct.certificate_name || '-'}
                      </div>
                    </div>
                    
                    <div className="detail-field">
                      <label>추가된 날짜</label>
                      <div className="field-value">
                        {selectedProduct.caregiver_created_at || '-'}
                      </div>
                    </div>
                    
                    <div className="detail-field">
                      <label>수정된 날짜</label>
                      <div className="field-value">
                        {selectedProduct.caregiver_update_at || '-'}
                      </div>
                    </div>
                    
                    <div className="detail-field">
                      <label>삭제된 날짜</label>
                      <div className="field-value" style={{color: selectedProduct.caregiver_deleted_at ? '#dc3545' : '#28a745'}}>
                        {selectedProduct.caregiver_deleted_at ? selectedProduct.caregiver_deleted_at : '활성'}
                      </div>
                    </div>
                    
                    <div className="detail-field">
                      <label>상세 설명</label>
                      <div className="field-value description">
                        {selectedProduct.prodDetail}
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="detail-footer">
                  <button className="edit-btn" onClick={handleEditClick}>
                    ✏️ 수정
                  </button>
                  <button className="close-detail-btn" onClick={handleCloseDetailModal}>
                    닫기
                  </button>
                </div>
              </>
            ) : (
              // 수정 모드
              <form onSubmit={handleEditSubmit} className="register-form">
                <div className="form-group">
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

                <div className="form-group">
                  <label>상품 유형 *</label>
                  <select
                    name="prodTypeName"
                    value={editFormData.prodTypeName}
                    onChange={handleEditInputChange}
                    required
                  >
                    <option value="">유형을 선택하세요</option>
                    <option value="요양사">요양사</option>
                    <option value="요양원">요양원</option>
                    <option value="실버타운">실버타운</option>
                  </select>
                </div>

                <div className="form-group">
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

                <div className="form-group">
                  <label>상세 설명</label>
                  <textarea
                    name="prodDetail"
                    value={editFormData.prodDetail}
                    onChange={handleEditInputChange}
                    placeholder="상품에 대한 상세 설명을 입력하세요"
                    rows="4"
                  />
                </div>

                <div className="form-group">
                  <label>희망근무지역(도/광역시) *</label>
                  <input
                    type="text"
                    name="hope_work_area_location"
                    value={editFormData.hope_work_area_location}
                    onChange={handleEditInputChange}
                    placeholder="지역을 입력하세요"
                    required
                  />
                </div>

                <div className="form-group">
                  <label>희망근무지역(시/군/구) *</label>
                  <input
                    type="text"
                    name="hope_work_area_city"
                    value={editFormData.hope_work_area_city}
                    onChange={handleEditInputChange}
                    placeholder="도시를 입력하세요"
                    required
                  />
                </div>

                <div className="form-group">
                  <label>희망근무장소 *</label>
                  <input
                    type="text"
                    name="hope_work_place"
                    value={editFormData.hope_work_place}
                    onChange={handleEditInputChange}
                    placeholder="희망근무장소를 입력하세요"
                    required
                  />
                </div>

                <div className="form-group">
                  <label>희망근무형태 *</label>
                  <input
                    type="text"
                    name="hope_work_type"
                    value={editFormData.hope_work_type}
                    onChange={handleEditInputChange}
                    placeholder="희망근무형태를 입력하세요"
                    required
                  />
                </div>

                <div className="form-group">
                  <label>희망고용형태 *</label>
                  <input
                    type="text"
                    name="hope_employment_type"
                    value={editFormData.hope_employment_type}
                    onChange={handleEditInputChange}
                    placeholder="희망고용형태를 입력하세요"
                    required
                  />
                </div>

                <div className="form-group">
                  <label>학력수준 *</label>
                  <input
                    type="text"
                    name="education_level"
                    value={editFormData.education_level}
                    onChange={handleEditInputChange}
                    placeholder="학력수준을 입력하세요"
                    required
                  />
                </div>

                <div className="form-group">
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



                <div className="form-group">
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

                <div className="form-group">
                  <label>근무 시작일 *</label>
                  <input
                    type="text"
                    name="startDate"
                    value={editFormData.startDate}
                    onChange={handleEditInputChange}
                    placeholder="근무 시작일을 입력하세요"
                    required
                  />
                </div>

                <div className="form-group">
                  <label>근무 종료일 *</label>
                  <input
                    type="text"
                    name="endDate"
                    value={editFormData.endDate}
                    onChange={handleEditInputChange}
                    placeholder="근무 종료일을 입력하세요"
                    required
                  />
                </div>

                <div className="form-group">
                  <label>자격증 *</label>
                  <input
                    type="text"
                    name="certifications"
                    value={editFormData.certifications}
                    onChange={handleEditInputChange}
                    placeholder="자격증을 입력하세요"
                    required
                  />
                </div>

                <div className="form-group">
                  <label>추가된 날짜</label>
                  <input
                    type="date"
                    name="createdDate"
                    value={editFormData.createdDate}
                    onChange={handleEditInputChange}
                  />
                </div>

                <div className="form-group">
                  <label>수정된 날짜</label>
                  <input
                    type="date"
                    name="modifiedDate"
                    value={editFormData.modifiedDate}
                    onChange={handleEditInputChange}
                  />
                </div>

                <div className="form-group">
                  <label>삭제된 날짜</label>
                  <input
                    type="date"
                    name="deletedDate"
                    value={editFormData.deletedDate}
                    onChange={handleEditInputChange}
                    placeholder="삭제된 경우에만 입력"
                  />
                </div>

                <div className="form-buttons">
                  <button type="button" onClick={handleEditCancel} className="cancel-btn">
                    취소
                  </button>
                  <button type="submit" className="edit-submit-btn">
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
