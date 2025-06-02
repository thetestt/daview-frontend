import React, { useState, useEffect } from "react";
import "../styles/pages/NursingHome.css";
import { Link } from "react-router-dom";
import NursingHomeList from "../components/NursingHomeList";
import FloatingNavButtons from "../components/FloatingNavButtons";
import NursingHomeSearchResult from "../components/NursingHomeSearchResult";
import { getFilterOptions } from "../api/filterOption";

function NursingHome() {
  const [isSearch, setIsSearch] = useState(false);

  // 필터 상태
  const [locationOptions, setLocationOptions] = useState([]);
  const [cityOptions, setCityOptions] = useState([]);
  const [typeOptions, setTypeOptions] = useState([]);
  const [etcOptions, setEtcOptions] = useState([]);
  const [envOptions, setEnvOptions] = useState([]);
  const [themeOptions, setThemeOptions] = useState([]);
  const [businessTypeOptions, setBusinessTypeOptions] = useState([]); // 업종

  useEffect(() => {
    const fetchOptions = async () => {
      const loc = await getFilterOptions("요양원", "지역");
      const city = await getFilterOptions("요양원", "시군구");
      const theme = await getFilterOptions("요양원", "테마"); // 요양원 기준으로 수정
      const program = await getFilterOptions("요양원", "프로그램");
      const env = await getFilterOptions("요양원", "주변환경");
      const etc = await getFilterOptions("요양원", "기타");
      const biz = await getFilterOptions("요양원", "업종");

      setLocationOptions(loc);
      setCityOptions(city);
      setThemeOptions(theme);
      setTypeOptions(program);
      setEnvOptions(env);
      setEtcOptions(etc);
      setBusinessTypeOptions(biz);
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
        <div className="nursinghome-main">
          {/* 상단 탭 */}
          <div className="tab-menu">
            <Link to="/caregiver">
              <button>요양사</button>
            </Link>
            <button className="active">요양원</button>
            <Link to="/silvertown">
              <button>실버타운</button>
            </Link>
          </div>

          {/* 필터 박스 */}
          <div className="filter-box">
            <h2>요양원</h2>
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

              <label>테마</label>
              <select>
                <option>선택</option>
                {themeOptions.map((opt) => (
                  <option key={opt.optionId} value={opt.value}>
                    {opt.value}
                  </option>
                ))}
              </select>
            </div>

            <div className="filter-category">
              <div>
                <strong>업종</strong>
                {businessTypeOptions.map((opt) => (
                  <label key={opt.optionId}>
                    <input type="checkbox" value={opt.value} /> {opt.value}
                  </label>
                ))}
              </div>

              <div>
                <strong>프로그램</strong>
                {typeOptions.map((opt) => (
                  <label key={opt.optionId}>
                    <input type="checkbox" value={opt.value} /> {opt.value}
                  </label>
                ))}
              </div>

              <div>
                <strong>주변환경</strong>
                {envOptions.map((opt) => (
                  <label key={opt.optionId}>
                    <input type="checkbox" value={opt.value} /> {opt.value}
                  </label>
                ))}
              </div>

              <div>
                <strong>기타</strong>
                {etcOptions.map((opt) => (
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

          {/* 결과 */}
          {isSearch ? <NursingHomeSearchResult /> : <NursingHomeList />}
        </div>
      </div>
    </>
  );
}

export default NursingHome;
