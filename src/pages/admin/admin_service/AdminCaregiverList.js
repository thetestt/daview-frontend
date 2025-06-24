// 📁 src/pages/admin/AdminCaregiverList.js
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import '../../../styles/admin/AdminProductList.css';

// 요양사 더미 데이터 (실제 DB 구조에 맞춤)
const dummyCaregivers = [
  {
    caregiverId: "51162d67-30a3-11f0-9b93-0242ac120002",
    memberId: 4,
    username: "김영희",
    userGender: "여성",
    hopeWorkAreaLocation: "서울특별시",
    hopeWorkAreaCity: "강남구",
    hopeWorkPlace: "가정방문",
    hopeWorkType: "요양사",
    hopeEmploymentType: "정규직",
    educationLevel: "대학교 졸업",
    introduction: "10년 경력의 전문 요양사입니다. 치매 어르신 전문 케어가 가능합니다.",
    hopeWorkAmount: 250,
    certificates: ["요양보호사 1급", "간호조무사"],
    career: [
      {
        caregiverCareerId: 1,
        caregiverId: "51162d67-30a3-11f0-9b93-0242ac120002",
        companyName: "동작 요양원",
        startDate: "2020-01-01",
        endDate: "2022-12-31"
      }
    ],
    caregiverCreatedAt: "2025-05-15 03:48:23",
    caregiverUpdateAt: "2025-05-15 03:48:23"
  },
  {
    caregiverId: "51163152-30a3-11f0-9b93-0242ac120002",
    memberId: 5,
    username: "박철수",
    userGender: "남성",
    hopeWorkAreaLocation: "경기도",
    hopeWorkAreaCity: "성남시",
    hopeWorkPlace: "요양원",
    hopeWorkType: "요양사",
    hopeEmploymentType: "계약직",
    educationLevel: "고등학교 졸업",
    introduction: "물리치료 전문 요양사로 거동불편 어르신 전문 케어가 가능합니다.",
    hopeWorkAmount: 220,
    certificates: ["간호조무사"],
    career: [
      {
        caregiverCareerId: 2,
        caregiverId: "51163152-30a3-11f0-9b93-0242ac120002",
        companyName: "라온요양병원",
        startDate: "2019-05-01",
        endDate: "2021-08-30"
      }
    ],
    caregiverCreatedAt: "2025-05-15 03:48:23",
    caregiverUpdateAt: "2025-05-15 03:48:23"
  },
  {
    caregiverId: "51163315-30a3-11f0-9b93-0242ac120002",
    memberId: 6,
    username: "이순자",
    userGender: "여성",
    hopeWorkAreaLocation: "부산광역시",
    hopeWorkAreaCity: "해운대구",
    hopeWorkPlace: "실버타운",
    hopeWorkType: "요양사",
    hopeEmploymentType: "정규직",
    educationLevel: "대학교 졸업",
    introduction: "15년 경력의 베테랑 요양사입니다. 인지능력 향상 프로그램 전문가입니다.",
    hopeWorkAmount: 270,
    certificates: ["요양보호사 1급", "사회복지사 2급"],
    career: [
      {
        caregiverCareerId: 3,
        caregiverId: "51163315-30a3-11f0-9b93-0242ac120002",
        companyName: "바다실버타운",
        startDate: "2021-03-15",
        endDate: "2023-04-10"
      }
    ],
    caregiverCreatedAt: "2025-05-15 03:48:23",
    caregiverUpdateAt: "2025-05-15 03:48:23"
  }
];

const AdminCaregiverList = () => {
  // 슬라이드 애니메이션을 위한 CSS를 동적으로 추가
  React.useEffect(() => {
    const style = document.createElement('style');
    style.textContent = `
      @keyframes slideDown {
        from {
          opacity: 0;
          transform: translateY(-10px);
          max-height: 0;
        }
        to {
          opacity: 1;
          transform: translateY(0);
          max-height: 500px;
        }
      }
      
      .expand-button:hover {
        background-color: #f8f9fa !important;
        box-shadow: 0 2px 4px rgba(0,0,0,0.1) !important;
      }
      
      .caregiver-expand-row {
        overflow: hidden;
      }
    `;
    document.head.appendChild(style);
    
    return () => {
      document.head.removeChild(style);
    };
  }, []);

  const [caregivers, setCaregivers] = useState([]); // 빈 배열로 초기화
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(0);
  const [size, setSize] = useState(10);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isServerConnected, setIsServerConnected] = useState(true);
  const [selectedCaregiver, setSelectedCaregiver] = useState(null);
  const [expandedRows, setExpandedRows] = useState(new Set()); // 확장된 행들을 관리하는 상태
  const [formData, setFormData] = useState({
    username: '',
    userGender: '',
    hopeWorkAreaLocation: '',
    hopeWorkAreaCity: '',
    hopeWorkPlace: '',
    hopeWorkType: '',
    hopeEmploymentType: '',
    educationLevel: '',
    introduction: '',
    hopeWorkAmount: ''
  });
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
    hopeWorkAmount: ''
  });

  // 행 확장/축소 토글 함수
  const toggleRowExpansion = (caregiverId) => {
    setExpandedRows(prev => {
      const newSet = new Set(prev);
      if (newSet.has(caregiverId)) {
        newSet.delete(caregiverId);
      } else {
        newSet.add(caregiverId);
      }
      return newSet;
    });
  };

  // 더미 데이터 필터링 함수
  const filterDummyData = (searchTerm = '') => {
    if (!searchTerm.trim()) {
      return dummyCaregivers;
    }
    
    return dummyCaregivers.filter(caregiver => 
      caregiver.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
      caregiver.hopeWorkAreaLocation.toLowerCase().includes(searchTerm.toLowerCase()) ||
      caregiver.hopeWorkType.toLowerCase().includes(searchTerm.toLowerCase()) ||
      caregiver.introduction.toLowerCase().includes(searchTerm.toLowerCase())
    );
  };

  // 요양사 목록 조회 요청
  const fetchCaregivers = async () => {
    try {
      setIsLoading(true);
      
      // 먼저 실제 API 호출 시도 (임시로 인증 헤더 제거)
      const response = await axios.get('/admin/caregivers', {
        params: {
          page,
          size,
          search: search.trim()
        },
        headers: {
          'Content-Type': 'application/json'
        },
        timeout: 5000 // 5초 타임아웃 설정
      });
      
      // 서버 연결 성공
      setIsServerConnected(true);
      setCaregivers(response.data || []);  // 응답 데이터를 설정
      console.log('서버에서 데이터를 성공적으로 조회했습니다.');
      console.log('조회된 데이터:', response.data);
      
    } catch (error) {
      console.warn('서버 연결 실패, 더미 데이터를 사용합니다:', error.message);
      
      // 서버 연결 실패 시 더미 데이터 사용
      setIsServerConnected(false);
      const filteredData = filterDummyData(search);
      setCaregivers(filteredData);
      
      // 에러 타입별 로그 처리
      if (error.code === 'ECONNREFUSED' || error.code === 'ENOTFOUND') {
        console.log('서버에 연결할 수 없습니다. 더미 데이터를 표시합니다.');
      } else if (error.code === 'ECONNABORTED') {
        console.log('서버 응답 시간이 초과되었습니다. 더미 데이터를 표시합니다.');
      } else if (error.response) {
        // 서버 응답은 있지만 에러 상태
        const status = error.response.status;
        if (status === 401) {
          console.log('인증이 필요합니다. 더미 데이터를 표시합니다.');
        } else if (status === 403) {
          console.log('접근 권한이 없습니다. 더미 데이터를 표시합니다.');
        } else if (status >= 500) {
          console.log('서버 내부 오류입니다. 더미 데이터를 표시합니다.');
        }
      }
    } finally {
      setIsLoading(false);
    }
  };

  // 검색 버튼 클릭 핸들러
  const handleSearch = () => {
    console.log('검색 실행:', search);
    fetchCaregivers();
  };

  // Enter 키 검색 핸들러
  const handleSearchKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  // 상품 등록 요청
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.username || !formData.userGender || !formData.hopeWorkAreaLocation || !formData.hopeWorkAreaCity || !formData.hopeWorkPlace || !formData.hopeWorkType || !formData.hopeEmploymentType || !formData.educationLevel || !formData.introduction || !formData.hopeWorkAmount) {
      alert('필수 항목을 모두 입력해주세요.');
      return;
    }

    try {
      setIsLoading(true);
      
      // 서버로 전송할 데이터 준비
      const submitData = {
        username: formData.username.trim(),
        userGender: formData.userGender,
        hopeWorkAreaLocation: formData.hopeWorkAreaLocation,
        hopeWorkAreaCity: formData.hopeWorkAreaCity,
        hopeWorkPlace: formData.hopeWorkPlace,
        hopeWorkType: formData.hopeWorkType,
        hopeEmploymentType: formData.hopeEmploymentType,
        educationLevel: formData.educationLevel,
        introduction: formData.introduction.trim(),
        hopeWorkAmount: parseInt(formData.hopeWorkAmount)
      };

      // 실제 axios POST 요청
      const response = await axios.post('/admin/caregivers', submitData, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
          'Content-Type': 'application/json'
        }
      });

      // 성공 응답 처리
      if (response.status === 200 || response.status === 201) {
        alert('요양사가 성공적으로 등록되었습니다.');
        
        // 폼 초기화
        setFormData({
          username: '',
          userGender: '',
          hopeWorkAreaLocation: '',
          hopeWorkAreaCity: '',
          hopeWorkPlace: '',
          hopeWorkType: '',
          hopeEmploymentType: '',
          educationLevel: '',
          introduction: '',
          hopeWorkAmount: ''
        });
        
        // 모달 닫기
        setIsModalOpen(false);
        
        // 목록 새로고침
        fetchCaregivers();
      }

    } catch (error) {
      console.error('요양사 등록 실패:', error);
      
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
          alert('이미 존재하는 요양사입니다. 다른 이름을 사용해주세요.');
        } else {
          alert(`요양사 등록에 실패했습니다: ${message}`);
        }
      } else if (error.request) {
        // 네트워크 에러
        alert('네트워크 연결을 확인해주세요.');
      } else {
        // 기타 에러
        alert('요양사 등록 중 오류가 발생했습니다.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  // 상품 수정 요청
  const handleEditSubmit = async (e) => {
    e.preventDefault();
    
    if (!editFormData.username || !editFormData.userGender || !editFormData.hopeWorkAreaLocation || !editFormData.hopeWorkAreaCity || !editFormData.hopeWorkPlace || !editFormData.hopeWorkType || !editFormData.hopeEmploymentType || !editFormData.educationLevel || !editFormData.introduction || !editFormData.hopeWorkAmount) {
      alert('필수 항목을 모두 입력해주세요.');
      return;
    }

    try {
      // 더미 데이터에서 상품 수정
      const index = dummyCaregivers.findIndex(c => c.caregiverId === selectedCaregiver.caregiverId);
      if (index !== -1) {
        const updatedCaregiver = {
          ...selectedCaregiver,
          username: editFormData.username,
          userGender: editFormData.userGender,
          hopeWorkAreaLocation: editFormData.hopeWorkAreaLocation,
          hopeWorkAreaCity: editFormData.hopeWorkAreaCity,
          hopeWorkPlace: editFormData.hopeWorkPlace,
          hopeWorkType: editFormData.hopeWorkType,
          hopeEmploymentType: editFormData.hopeEmploymentType,
          educationLevel: editFormData.educationLevel,
          introduction: editFormData.introduction,
          hopeWorkAmount: parseInt(editFormData.hopeWorkAmount)
        };
        
        dummyCaregivers[index] = updatedCaregiver;
        setSelectedCaregiver(updatedCaregiver);
      }
      
      /* 실제 API 사용 시 아래 코드 사용
      await axios.put(`/admin/caregivers/${selectedCaregiver.caregiverId}`, {
        ...editFormData,
        hopeWorkAmount: parseInt(editFormData.hopeWorkAmount)
      });
      */
      
      alert('요양사가 성공적으로 수정되었습니다.');
      setIsEditMode(false);
      fetchCaregivers(); // 목록 새로고침
    } catch (error) {
      console.error('요양사 수정 실패:', error);
      alert('요양사 수정에 실패했습니다.');
    }
  };

  // 폼 입력 핸들러
  const handleInputChange = (e) => {
    const { name, value } = e.target;
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
      username: '',
      userGender: '',
      hopeWorkAreaLocation: '',
      hopeWorkAreaCity: '',
      hopeWorkPlace: '',
      hopeWorkType: '',
      hopeEmploymentType: '',
      educationLevel: '',
      introduction: '',
      hopeWorkAmount: ''
    });
  };

  // 상세 모달 열기
  const handleCaregiverClick = (caregiver) => {
    setSelectedCaregiver(caregiver);
    setIsDetailModalOpen(true);
    setIsEditMode(false);
  };

  // 상세 모달 닫기
  const handleCloseDetailModal = () => {
    setIsDetailModalOpen(false);
    setSelectedCaregiver(null);
    setIsEditMode(false);
    setEditFormData({
      username: '',
      userGender: '',
      hopeWorkAreaLocation: '',
      hopeWorkAreaCity: '',
      hopeWorkPlace: '',
      hopeWorkType: '',
      hopeEmploymentType: '',
      educationLevel: '',
      introduction: '',
      hopeWorkAmount: ''
    });
  };

  // 수정 모드 활성화
  const handleEditClick = () => {
    setEditFormData({
      username: selectedCaregiver.username,
      userGender: selectedCaregiver.userGender,
      hopeWorkAreaLocation: selectedCaregiver.hopeWorkAreaLocation,
      hopeWorkAreaCity: selectedCaregiver.hopeWorkAreaCity,
      hopeWorkPlace: selectedCaregiver.hopeWorkPlace,
      hopeWorkType: selectedCaregiver.hopeWorkType,
      hopeEmploymentType: selectedCaregiver.hopeEmploymentType,
      educationLevel: selectedCaregiver.educationLevel,
      introduction: selectedCaregiver.introduction,
      hopeWorkAmount: selectedCaregiver.hopeWorkAmount.toString()
    });
    setIsEditMode(true);
  };

  // 수정 취소
  const handleEditCancel = () => {
    setIsEditMode(false);
    setEditFormData({
      username: '',
      userGender: '',
      hopeWorkAreaLocation: '',
      hopeWorkAreaCity: '',
      hopeWorkPlace: '',
      hopeWorkType: '',
      hopeEmploymentType: '',
      educationLevel: '',
      introduction: '',
      hopeWorkAmount: ''
    });
  };

  // 요양사 삭제 (소프트 삭제)
  const handleDeleteCaregiver = async (caregiverId, caregiverName) => {
    const confirmDelete = window.confirm(
      `"${caregiverName}" 요양사를 삭제하시겠습니까?\n\n삭제된 요양사는 목록에서 제거되지만 데이터는 보관됩니다.`
    );

    if (!confirmDelete) {
      return;
    }

    try {
      setIsLoading(true);
      
      // 실제 API 호출 시도
      const response = await axios.delete(`/admin/caregivers/${caregiverId}`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
          'Content-Type': 'application/json'
        }
      });

      if (response.status === 200) {
        alert('요양사가 성공적으로 삭제되었습니다.');
        // 목록 새로고침
        fetchCaregivers();
      }

    } catch (error) {
      console.error('요양사 삭제 실패:', error);
      
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
          alert('삭제하려는 요양사를 찾을 수 없습니다.');
        } else {
          alert(`요양사 삭제에 실패했습니다: ${message}`);
        }
      } else if (error.request) {
        alert('네트워크 연결을 확인해주세요.');
      } else {
        alert('요양사 삭제 중 오류가 발생했습니다.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  // 초기 및 조건 변경 시 자동 호출
  useEffect(() => {
    fetchCaregivers();
  }, [page, size]); // search는 제거하고 수동 검색으로 변경

  return (
    <div style={{ padding: '1rem' }}>
      <div className="admin-header">
        <h2>📦 요양사 목록</h2>
        <div className="header-info">
          {!isServerConnected && (
            <span className="server-status offline">🔴 오프라인 모드 (더미 데이터)</span>
          )}
          {isServerConnected && (
            <span className="server-status online">🟢 서버 연결됨</span>
          )}
          <button 
            className="register-btn"
            onClick={() => setIsModalOpen(true)}
          >
            ➕ 요양사 등록
          </button>
        </div>
      </div>

      <div className="search-container">
        <input
          type="text"
          placeholder="상품명, 유형, 설명으로 검색"
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
        {search && (
          <button 
            onClick={() => {
              setSearch('');
              fetchCaregivers();
            }} 
            className="clear-btn"
          >
            ✖ 초기화
          </button>
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
              <th>요양사 ID</th>
              <th>이름</th>
              <th>성별</th>
              <th>희망 근무지</th>
              <th>근무 유형</th>
              <th>희망 급여</th>
              <th>관리</th>
            </tr>
          </thead>
          <tbody>
            {caregivers.length > 0 ? (
              caregivers.map((c) => (
                <React.Fragment key={c.caregiverId}>
                  <tr>
                    <td>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <button
                          className="expand-button"
                          onClick={() => toggleRowExpansion(c.caregiverId)}
                          style={{
                            background: 'none',
                            border: 'none',
                            cursor: 'pointer',
                            fontSize: '14px',
                            padding: '2px 4px',
                            borderRadius: '3px',
                            transition: 'all 0.2s ease',
                            transform: expandedRows.has(c.caregiverId) ? 'rotate(180deg)' : 'rotate(0deg)'
                          }}
                          title={expandedRows.has(c.caregiverId) ? '축소' : '확장'}
                        >
                          ▼
                        </button>
                        <span style={{ fontSize: '12px' }}>{c.caregiverId.substring(0, 8)}...</span>
                      </div>
                    </td>
                    <td>
                      <span 
                        className="caregiver-name-link" 
                        onClick={() => handleCaregiverClick(c)}
                        style={{ cursor: 'pointer', color: '#007bff', textDecoration: 'underline' }}
                      >
                        {c.username}
                      </span>
                    </td>
                    <td>{c.userGender}</td>
                    <td>{c.hopeWorkAreaLocation} {c.hopeWorkAreaCity}</td>
                    <td>{c.hopeWorkType}</td>
                    <td>{c.hopeWorkAmount.toLocaleString()}만원</td>
                    <td>
                      <button 
                        onClick={() => handleDeleteCaregiver(c.caregiverId, c.username)}
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
                                     {expandedRows.has(c.caregiverId) && (
                     <tr className="caregiver-expand-row">
                       <td colSpan="7" style={{ padding: '0', border: 'none' }}>
                         <div
                           style={{
                             backgroundColor: '#f8f9fa',
                             padding: '15px 20px',
                             borderLeft: '4px solid #007bff',
                             animation: 'slideDown 0.3s ease-out',
                             margin: '0 -1px'
                           }}
                         >
                          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '15px' }}>
                            <div>
                              <strong style={{ color: '#495057', fontSize: '12px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                                👤 요양사 정보
                              </strong>
                              <div style={{ marginTop: '5px', padding: '8px 12px', backgroundColor: '#fff', borderRadius: '4px', border: '1px solid #dee2e6' }}>
                                <div style={{ fontSize: '14px', color: '#6c757d' }}>회원ID</div>
                                <div style={{ fontSize: '16px', fontWeight: 'bold', color: '#212529' }}>{c.memberId}</div>
                                <div style={{ fontSize: '14px', color: '#6c757d', marginTop: '5px' }}>학력</div>
                                <div style={{ fontSize: '14px', color: '#212529' }}>{c.educationLevel}</div>
                              </div>
                            </div>
                            
                            <div>
                              <strong style={{ color: '#495057', fontSize: '12px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                                📍 근무 희망 지역
                              </strong>
                              <div style={{ marginTop: '5px', padding: '8px 12px', backgroundColor: '#fff', borderRadius: '4px', border: '1px solid #dee2e6' }}>
                                <div style={{ fontSize: '14px', color: '#6c757d' }}>지역</div>
                                <div style={{ fontSize: '16px', fontWeight: 'bold', color: '#28a745' }}>
                                  {c.hopeWorkAreaLocation}
                                </div>
                                <div style={{ fontSize: '14px', color: '#6c757d', marginTop: '5px' }}>시/구</div>
                                <div style={{ fontSize: '14px', color: '#212529' }}>{c.hopeWorkAreaCity}</div>
                              </div>
                            </div>
                            
                            <div>
                              <strong style={{ color: '#495057', fontSize: '12px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                                💼 근무 조건
                              </strong>
                              <div style={{ marginTop: '5px', padding: '8px 12px', backgroundColor: '#fff', borderRadius: '4px', border: '1px solid #dee2e6' }}>
                                <div style={{ fontSize: '14px', color: '#6c757d' }}>근무 장소</div>
                                <div style={{ fontSize: '16px', fontWeight: 'bold', color: '#6f42c1' }}>
                                  {c.hopeWorkPlace}
                                </div>
                                <div style={{ fontSize: '14px', color: '#6c757d', marginTop: '5px' }}>고용 형태</div>
                                <div style={{ fontSize: '14px', color: '#212529' }}>{c.hopeEmploymentType}</div>
                              </div>
                            </div>
                            
                            {c.certificates && c.certificates.length > 0 && (
                              <div>
                                <strong style={{ color: '#495057', fontSize: '12px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                                  🏆 자격증
                                </strong>
                                <div style={{ marginTop: '5px', padding: '8px 12px', backgroundColor: '#fff', borderRadius: '4px', border: '1px solid #dee2e6' }}>
                                  {c.certificates.map((cert, index) => (
                                    <span key={index} style={{ 
                                      display: 'inline-block', 
                                      backgroundColor: '#e7f3ff', 
                                      color: '#0066cc', 
                                      padding: '2px 6px', 
                                      borderRadius: '3px', 
                                      fontSize: '12px',
                                      margin: '2px'
                                    }}>
                                      {cert}
                                    </span>
                                  ))}
                                </div>
                              </div>
                            )}
                            
                            <div style={{ gridColumn: 'span 2' }}>
                              <strong style={{ color: '#495057', fontSize: '12px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                                📝 자기소개
                              </strong>
                              <div style={{ marginTop: '5px', padding: '12px', backgroundColor: '#fff', borderRadius: '4px', border: '1px solid #dee2e6', lineHeight: '1.5' }}>
                                {c.introduction || '자기소개가 없습니다.'}
                              </div>
                            </div>
                          </div>
                          
                          <div style={{ marginTop: '15px', padding: '10px', backgroundColor: '#e3f2fd', borderRadius: '4px', fontSize: '12px', color: '#1565c0' }}>
                            💡 <strong>참고:</strong> 요양사명을 클릭하면 수정 가능한 상세 모달이 열립니다.
                          </div>
                        </div>
                      </td>
                    </tr>
                  )}
                </React.Fragment>
              ))
            ) : (
              <tr>
                <td colSpan="7" className="no-data">
                  {isLoading ? '데이터를 불러오는 중...' : '등록된 요양사가 없습니다.'}
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

              <div className="form-group">
                <label>가격 *</label>
                <input
                  type="number"
                  name="prodPrice"
                  value={formData.prodPrice}
                  onChange={handleInputChange}
                  placeholder="가격을 입력하세요"
                  min="0"
                  required
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
      {isDetailModalOpen && selectedCaregiver && (
        <div className="modal-overlay" onClick={handleCloseDetailModal}>
          <div className="detail-modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>{isEditMode ? '✏️ 요양사 수정' : '📋 요양사 상세 정보'}</h3>
              <button className="close-btn" onClick={handleCloseDetailModal}>✖</button>
            </div>
            
            {!isEditMode ? (
              // 상세 정보 보기 모드
              <>
                <div className="detail-content">
                  <div className="detail-section">
                    <div className="detail-field">
                      <label>요양사 ID</label>
                      <div className="field-value">{selectedCaregiver.caregiverId}</div>
                    </div>
                    
                    <div className="detail-field">
                      <label>이름</label>
                      <div className="field-value product-title">{selectedCaregiver.username}</div>
                    </div>
                    
                    <div className="detail-field">
                      <label>성별</label>
                      <div className="field-value">
                        <span className={`type-badge ${selectedCaregiver.userGender}`}>
                          {selectedCaregiver.userGender}
                        </span>
                      </div>
                    </div>
                    
                    <div className="detail-field">
                      <label>희망 급여</label>
                      <div className="field-value price">
                        {selectedCaregiver.hopeWorkAmount.toLocaleString()}만원
                      </div>
                    </div>
                    
                    <div className="detail-field">
                      <label>자기소개</label>
                      <div className="field-value description">
                        {selectedCaregiver.introduction}
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="detail-footer">
                  <button className="edit-btn" onClick={handleEditClick}>
                    ✏️ 수정
                  </button>
                  <button 
                    className="delete-btn"
                    onClick={() => {
                      handleDeleteCaregiver(selectedCaregiver.caregiverId, selectedCaregiver.username);
                      handleCloseDetailModal();
                    }}
                    style={{
                      background: 'linear-gradient(135deg, #dc3545, #c82333)',
                      color: 'white',
                      border: 'none',
                      padding: '12px 24px',
                      borderRadius: '8px',
                      fontSize: '16px',
                      fontWeight: '500',
                      cursor: 'pointer',
                      transition: 'all 0.3s ease',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '8px'
                    }}
                    disabled={isLoading}
                  >
                    🗑️ 삭제
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
                  <label>가격 *</label>
                  <input
                    type="number"
                    name="prodPrice"
                    value={editFormData.prodPrice}
                    onChange={handleEditInputChange}
                    placeholder="가격을 입력하세요"
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

export default AdminCaregiverList;
