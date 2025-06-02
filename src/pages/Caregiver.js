import React, { useState, useEffect } from "react";
import "../styles/pages/Caregiver.css";
import { Link } from "react-router-dom";
import CaregiverList from "../components/CaregiverList";
import "../styles/layouts/layout.css";
import FloatingNavButtons from "../components/FloatingNavButtons";
import CaregiverSearchResult from "../components/CaregiverSearchResult";
import { getFilterOptions } from "../api/filterOption"; // 필터 옵션 API

function Caregiver() {
  const [isSearch, setIsSearch] = useState(false);

  // 필터 상태
  const [locationOptions, setLocationOptions] = useState([]);
  const [cityOptions, setCityOptions] = useState([]);
  const [genderOptions, setGenderOptions] = useState([]);
  const [certOptions, setCertOptions] = useState([]);
  const [workTypeOptions, setWorkTypeOptions] = useState([]);
  const [employmentTypeOptions, setEmploymentTypeOptions] = useState([]);

  useEffect(() => {
    const fetchOptions = async () => {
      const loc = await getFilterOptions("요양사", "지역");
      const city = await getFilterOptions("요양사", "시군구");
      const gender = await getFilterOptions("요양사", "성별");
      const cert = await getFilterOptions("요양사", "자격증");
      const workType = await getFilterOptions("요양사", "근무형태");
      const empType = await getFilterOptions("요양사", "고용형태");

      setLocationOptions(loc);
      setCityOptions(city);
      setGenderOptions(gender);
      setCertOptions(cert);
      setWorkTypeOptions(workType);
      setEmploymentTypeOptions(empType);
    };

    fetchOptions();
  }, []);

  const handleSearchClick = () => {
    setIsSearch(true);
  };

  return (
    <>
      <FloatingNavButtons backTo="/" />
      <div className="layout-container">
        <div className="caregiver-main">
          {/* 상단 탭 */}
          <div className="tab-menu">
            <button className="active">요양사</button>
            <Link to="/nursinghome" className="tab-link">
              <button>요양원</button>
            </Link>
            <Link to="/silvertown" className="tab-link">
              <button>실버타운</button>
            </Link>
          </div>

          {/* 필터 박스 */}
          <div className="filter-box">
            <h2>요양보호사</h2>
            <div className="filter-row">
              <label>지역</label>
              <select>
                <option>선택</option>
                {locationOptions.map((opt) => (
                  <option key={opt.optionId} value={opt.value}>
                    {opt.value}
                  </option>
                ))}
              </select>

              <label>시/군/구</label>
              <select>
                <option>선택</option>
                {cityOptions.map((opt) => (
                  <option key={opt.optionId} value={opt.value}>
                    {opt.value}
                  </option>
                ))}
              </select>

              <label>성별</label>
              <select>
                <option>선택</option>
                {genderOptions.map((opt) => (
                  <option key={opt.optionId} value={opt.value}>
                    {opt.value}
                  </option>
                ))}
              </select>
            </div>

            <div className="filter-category">
              <div>
                <strong>자격증</strong>
                {certOptions.map((opt) => (
                  <label key={opt.optionId}>
                    <input type="checkbox" value={opt.value} /> {opt.value}
                  </label>
                ))}
              </div>

              <div>
                <strong>근무형태</strong>
                {workTypeOptions.map((opt) => (
                  <label key={opt.optionId}>
                    <input type="checkbox" value={opt.value} /> {opt.value}
                  </label>
                ))}
              </div>

              <div>
                <strong>고용형태</strong>
                {employmentTypeOptions.map((opt) => (
                  <label key={opt.optionId}>
                    <input type="checkbox" value={opt.value} /> {opt.value}
                  </label>
                ))}
              </div>
            </div>

            <button className="search-button" onClick={handleSearchClick}>
              검색
            </button>
          </div>

          {/* 검색 결과 영역 */}
          {isSearch ? <CaregiverSearchResult /> : <CaregiverList />}
        </div>
      </div>
    </>
  );
}

export default Caregiver;
