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
    prodPrice: 150000,
    prodDetail: "10년 경력의 전문 요양사입니다. 치매 어르신 전문 케어 가능합니다."
  },
  {
    prodId: 2,
    prodName: "해든요양원",
    prodTypeName: "요양원",
    prodPrice: 1200000,
    prodDetail: "24시간 전문 의료진이 상주하는 프리미엄 요양원입니다. 개별 맞춤 케어 제공합니다."
  },
  {
    prodId: 3,
    prodName: "청담실버타운",
    prodTypeName: "실버타운",
    prodPrice: 2500000,
    prodDetail: "강남 청담동에 위치한 고급 실버타운으로 다양한 문화시설과 의료시설을 갖추고 있습니다."
  },
  {
    prodId: 4,
    prodName: "박철수 요양사",
    prodTypeName: "요양사",
    prodPrice: 180000,
    prodDetail: "물리치료 전문 요양사로 거동불편 어르신 전문 케어가 가능합니다."
  },
  {
    prodId: 5,
    prodName: "사랑가득요양원",
    prodTypeName: "요양원",
    prodPrice: 950000,
    prodDetail: "가족같은 분위기의 소규모 요양원입니다. 개인별 맞춤 식단과 활동 프로그램을 제공합니다."
  },
  {
    prodId: 6,
    prodName: "강남힐스실버타운",
    prodTypeName: "실버타운",
    prodPrice: 3200000,
    prodDetail: "강남 중심가에 위치한 최고급 실버타운으로 골프장, 수영장, 도서관 등 다양한 시설을 보유하고 있습니다."
  },
  {
    prodId: 7,
    prodName: "이순자 요양사",
    prodTypeName: "요양사",
    prodPrice: 160000,
    prodDetail: "15년 경력의 베테랑 요양사입니다. 인지능력 향상 프로그램 전문가입니다."
  },
  {
    prodId: 8,
    prodName: "효도의집요양원",
    prodTypeName: "요양원",
    prodPrice: 1100000,
    prodDetail: "한방 치료와 서양 의학을 접목한 통합 케어 서비스를 제공하는 요양원입니다."
  },
  {
    prodId: 9,
    prodName: "자연휴양실버타운",
    prodTypeName: "실버타운",
    prodPrice: 1800000,
    prodDetail: "자연 속에서 여유로운 노후를 보낼 수 있는 전원형 실버타운입니다. 유기농 농장과 산책로를 보유하고 있습니다."
  },
  {
    prodId: 10,
    prodName: "정미영 요양사",
    prodTypeName: "요양사",
    prodPrice: 170000,
    prodDetail: "간병과 요리를 함께 할 수 있는 올라운드 요양사입니다. 당뇨 환자 전문 케어 가능합니다."
  }
];

const AdminProductList = () => {
  const [products, setProducts] = useState([]); // 빈 배열로 초기화
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(0);
  const [size, setSize] = useState(10);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isServerConnected, setIsServerConnected] = useState(true);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [formData, setFormData] = useState({
    prodName: '',
    prodTypeName: '',
    prodPrice: '',
    prodDetail: ''
  });
  const [editFormData, setEditFormData] = useState({
    prodName: '',
    prodTypeName: '',
    prodPrice: '',
    prodDetail: ''
  });

  // 더미 데이터 필터링 함수
  const filterDummyData = (searchTerm = '') => {
    if (!searchTerm.trim()) {
      return dummyProducts;
    }
    
    return dummyProducts.filter(product => 
      product.prodName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.prodTypeName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.prodDetail.toLowerCase().includes(searchTerm.toLowerCase())
    );
  };

  // 상품 목록 조회 요청
  const fetchProducts = async () => {
    try {
      setIsLoading(true);
      
      // 먼저 실제 API 호출 시도
      const response = await axios.get('/api/admin/products', {
        params: {
          page,
          size,
          search: search.trim()
        },
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
          'Content-Type': 'application/json'
        },
        timeout: 5000 // 5초 타임아웃 설정
      });
      
      // 서버 연결 성공
      setIsServerConnected(true);
      setProducts(response.data.content || []);  // content 배열을 설정
      console.log('서버에서 데이터를 성공적으로 조회했습니다.');
      console.log('조회된 데이터:', response.data.content);
      
    } catch (error) {
      console.warn('서버 연결 실패, 더미 데이터를 사용합니다:', error.message);
      
      // 서버 연결 실패 시 더미 데이터 사용
      setIsServerConnected(false);
      const filteredData = filterDummyData(search);
      setProducts(filteredData);
      
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
    fetchProducts();
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
    
    if (!formData.prodName || !formData.prodTypeName || !formData.prodPrice) {
      alert('필수 항목을 모두 입력해주세요.');
      return;
    }

    try {
      setIsLoading(true);
      
      // 서버로 전송할 데이터 준비
      const submitData = {
        prodName: formData.prodName.trim(),
        prodTypeName: formData.prodTypeName,
        prodPrice: parseInt(formData.prodPrice),
        prodDetail: formData.prodDetail.trim()
      };

      // 실제 axios POST 요청
      const response = await axios.post('/api/admin/products', submitData, {
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
          prodPrice: '',
          prodDetail: ''
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
          prodDetail: editFormData.prodDetail
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
      prodPrice: '',
      prodDetail: ''
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
      prodPrice: '',
      prodDetail: ''
    });
  };

  // 수정 모드 활성화
  const handleEditClick = () => {
    setEditFormData({
      prodName: selectedProduct.prodName,
      prodTypeName: selectedProduct.prodTypeName,
      prodPrice: selectedProduct.prodPrice.toString(),
      prodDetail: selectedProduct.prodDetail
    });
    setIsEditMode(true);
  };

  // 수정 취소
  const handleEditCancel = () => {
    setIsEditMode(false);
    setEditFormData({
      prodName: '',
      prodTypeName: '',
      prodPrice: '',
      prodDetail: ''
    });
  };

  // 초기 및 조건 변경 시 자동 호출
  useEffect(() => {
    fetchProducts();
  }, [page, size]); // search는 제거하고 수동 검색으로 변경

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
            onClick={() => setIsModalOpen(true)}
          >
            ➕ 상품 등록
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
              fetchProducts();
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
              <th>상품 ID</th>
              <th>상품명</th>
              <th>유형</th>
              <th>가격</th>
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
                  <td>{p.prodPrice.toLocaleString()}원</td>
                  <td className="detail-cell">{p.prodDetail}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="5" className="no-data">
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
                      <label>가격</label>
                      <div className="field-value price">
                        {selectedProduct.prodPrice.toLocaleString()}원
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

export default AdminProductList;
