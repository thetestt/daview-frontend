import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/pages/RegisterPage.css";

function RegisterPage() {
  const [selectedType, setSelectedType] = useState("");
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    location: "",
    phone: "",
    email: "",
    website: "",
    price: "",
    capacity: "",
    facilities: "",
    images: []
  });

  const navigate = useNavigate();

  const serviceTypes = [
    { value: "caregiver", label: "요양사", description: "전문 요양 서비스를 제공하는 요양사 등록" },
    { value: "nursinghome", label: "요양원", description: "요양원 시설 및 서비스 등록" },
    { value: "silvertown", label: "실버타운", description: "실버타운 시설 및 서비스 등록" }
  ];

  const handleTypeSelect = (type) => {
    setSelectedType(type);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleImageUpload = (e) => {
    const files = Array.from(e.target.files);
    setFormData(prev => ({
      ...prev,
      images: files
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!selectedType) {
      alert("서비스 유형을 선택해주세요.");
      return;
    }

    // 여기에 실제 등록 API 호출 로직 추가
    console.log("등록 데이터:", { type: selectedType, ...formData });
    alert("등록이 완료되었습니다!");
    navigate("/");
  };

  const renderForm = () => {
    if (!selectedType) return null;

    return (
      <div className="register-form-container">
        <h3>{serviceTypes.find(type => type.value === selectedType)?.label} 등록</h3>
        <form onSubmit={handleSubmit} className="register-form">
          <div className="form-group">
            <label>이름/시설명 *</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              required
              placeholder="이름 또는 시설명을 입력하세요"
            />
          </div>

          <div className="form-group">
            <label>설명 *</label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleInputChange}
              required
              placeholder="상세 설명을 입력하세요"
              rows="4"
            />
          </div>

          <div className="form-group">
            <label>위치 *</label>
            <input
              type="text"
              name="location"
              value={formData.location}
              onChange={handleInputChange}
              required
              placeholder="주소를 입력하세요"
            />
          </div>

          <div className="form-group">
            <label>연락처 *</label>
            <input
              type="tel"
              name="phone"
              value={formData.phone}
              onChange={handleInputChange}
              required
              placeholder="연락처를 입력하세요"
            />
          </div>

          <div className="form-group">
            <label>이메일</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              placeholder="이메일 주소를 입력하세요"
            />
          </div>

          {selectedType !== "caregiver" && (
            <>
              <div className="form-group">
                <label>홈페이지</label>
                <input
                  type="url"
                  name="website"
                  value={formData.website}
                  onChange={handleInputChange}
                  placeholder="홈페이지 URL을 입력하세요"
                />
              </div>

              <div className="form-group">
                <label>가격 정보</label>
                <input
                  type="text"
                  name="price"
                  value={formData.price}
                  onChange={handleInputChange}
                  placeholder="가격 정보를 입력하세요"
                />
              </div>

              <div className="form-group">
                <label>수용 인원</label>
                <input
                  type="number"
                  name="capacity"
                  value={formData.capacity}
                  onChange={handleInputChange}
                  placeholder="수용 가능한 인원을 입력하세요"
                />
              </div>

              <div className="form-group">
                <label>시설 정보</label>
                <textarea
                  name="facilities"
                  value={formData.facilities}
                  onChange={handleInputChange}
                  placeholder="제공되는 시설 및 서비스를 입력하세요"
                  rows="3"
                />
              </div>
            </>
          )}

          <div className="form-group">
            <label>이미지 업로드</label>
            <input
              type="file"
              multiple
              accept="image/*"
              onChange={handleImageUpload}
              className="file-input"
            />
            <small>최대 5개의 이미지를 업로드할 수 있습니다.</small>
          </div>

          <div className="form-buttons">
            <button type="button" onClick={() => setSelectedType("")} className="btn-cancel">
              뒤로가기
            </button>
            <button type="submit" className="btn-submit">
              등록하기
            </button>
          </div>
        </form>
      </div>
    );
  };

  return (
    <div className="register-page">
      <div className="register-container">
        <h2>서비스 등록</h2>
        
        {!selectedType ? (
          <div className="service-type-selection">
            <p>등록하실 서비스 유형을 선택해주세요.</p>
            <div className="service-cards">
              {serviceTypes.map((type) => (
                <div
                  key={type.value}
                  className="service-card"
                  onClick={() => handleTypeSelect(type.value)}
                >
                  <h3>{type.label}</h3>
                  <p>{type.description}</p>
                  <button className="select-btn">선택하기</button>
                </div>
              ))}
            </div>
          </div>
        ) : (
          renderForm()
        )}
      </div>
    </div>
  );
}

export default RegisterPage; 