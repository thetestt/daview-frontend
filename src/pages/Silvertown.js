import React, { useState, useEffect } from "react";
import "../styles/pages/Silvertown.css";
import { Link } from "react-router-dom";
import SilvertownList from "../components/SilvertownList";
import "../styles/layouts/layout.css";
import FloatingNavButtons from "../components/FloatingNavButtons";
import SilvertownSearchResult from "../components/SilvertownSearchResult";
import { getSilvertownFilterOptions } from "../api/silvertown";

function Silvertown() {
  const [isSearch, setIsSearch] = useState(false);

  // 필터 옵션 상태 선언
  const [locationOptions, setLocationOptions] = useState([]);
  const [cityOptions, setCityOptions] = useState([]);
  const [themeOptions, setThemeOptions] = useState([]);
  const [residenceOptions, setResidenceOptions] = useState([]);
  const [facilityOptions, setFacilityOptions] = useState([]);
  const [envOptions, setEnvOptions] = useState([]);
  const [etcOptions, setEtcOptions] = useState([]);

  useEffect(() => {
    const fetchOptions = async () => {
      const loc = await getSilvertownFilterOptions("지역");
      const city = await getSilvertownFilterOptions("시군구");
      const theme = await getSilvertownFilterOptions("테마");
      const resi = await getSilvertownFilterOptions("주거형태");
      const fac = await getSilvertownFilterOptions("시설");
      const env = await getSilvertownFilterOptions("주변환경");
      const etc = await getSilvertownFilterOptions("기타");

      setLocationOptions(loc);
      setCityOptions(city);
      setThemeOptions(theme);
      setResidenceOptions(resi);
      setFacilityOptions(fac);
      setEnvOptions(env);
      setEtcOptions(etc);
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
        <div className="silvertown-main">
          {/* 상단 탭 */}
          <div className="tab-menu">
            <Link to="/caregiver">
              <button>요양사</button>
            </Link>
            <Link to="/nursinghome">
              <button>요양원</button>
            </Link>
            <button className="active">실버타운</button>
          </div>

          {/* 필터 영역 */}
          <div className="filter-box">
            <h2>실버타운</h2>
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
                <strong>주거형태</strong>
                {residenceOptions.map((opt) => (
                  <label key={opt.optionId}>
                    <input type="checkbox" value={opt.value} /> {opt.value}
                  </label>
                ))}
              </div>

              <div>
                <strong>시설</strong>
                {facilityOptions.map((opt) => (
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

          {/* 리스트 or 검색 결과 */}
          {isSearch ? <SilvertownSearchResult /> : <SilvertownList />}
        </div>
      </div>
    </>
  );
}

export default Silvertown;
