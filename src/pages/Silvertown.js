import React, { useState, useEffect } from "react";
import "../styles/pages/Silvertown.css";
import { Link } from "react-router-dom";
import SilvertownList from "../components/SilvertownList";
import "../styles/layouts/layout.css";
import FloatingNavButtons from "../components/FloatingNavButtons";
import SilvertownSearchResult from "../components/SilvertownSearchResult";
import { getFilterOptions } from "../api/filterOption";
import { useForceRefresh } from "../utils/forceRefresh"; //새로고침 으로 변동

function Silvertown() {
  const [isSearch, setIsSearch] = useState(false);
  const [appliedFilters, setAppliedFilters] = useState(null); // ✔✔ 검색 시점의 필터 값

  // 선택한 필터 값들
  const [selectedLocation, setSelectedLocation] = useState("");
  const [selectedCity, setSelectedCity] = useState("");
  const [selectedTheme, setSelectedTheme] = useState("");
  const [selectedResidence, setSelectedResidence] = useState([]);
  const [selectedFacility, setSelectedFacility] = useState([]);
  const [selectedEnvironment, setSelectedEnvironment] = useState([]);
  const [selectedEtc, setSelectedEtc] = useState([]);

  // 옵션 리스트 상태
  const [locationOptions, setLocationOptions] = useState([]);
  const [cityOptions, setCityOptions] = useState([]);
  const [themeOptions, setThemeOptions] = useState([]);
  const [residenceOptions, setResidenceOptions] = useState([]);
  const [facilityOptions, setFacilityOptions] = useState([]);
  const [envOptions, setEnvOptions] = useState([]);
  const [etcOptions, setEtcOptions] = useState([]);

  const refresh = useForceRefresh(); //새로고침 함수

  useEffect(() => {
    const fetchOptions = async () => {
      const loc = await getFilterOptions("실버타운", "지역");
      const city = await getFilterOptions("실버타운", "시군구");
      const theme = await getFilterOptions("실버타운", "테마");
      const resi = await getFilterOptions("실버타운", "주거형태");
      const fac = await getFilterOptions("실버타운", "시설");
      const env = await getFilterOptions("실버타운", "주변환경");
      const etc = await getFilterOptions("실버타운", "기타");

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

  // 체크박스 처리 함수
  const handleCheckboxChange = (value, selectedList, setSelectedList) => {
    if (selectedList.includes(value)) {
      setSelectedList(selectedList.filter((v) => v !== value));
    } else {
      setSelectedList([...selectedList, value]);
    }
  };

  // 검색 버튼 클릭 시
  const handleSearchClick = () => {
    setAppliedFilters({
      location: selectedLocation,
      city: selectedCity,
      theme: selectedTheme,
      residence: selectedResidence,
      facility: selectedFacility,
      environment: selectedEnvironment,
      etc: selectedEtc,
    });
    setIsSearch(true);
  };

  return (
    <>
      <FloatingNavButtons />
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
            <button onClick={refresh} className="active">
              실버타운
            </button>
          </div>

          {/* 필터 영역 */}
          <div className="filter-box">
            <h2>실버타운</h2>
            <div className="filter-row">
              <label>지역</label>
              <select onChange={(e) => setSelectedLocation(e.target.value)}>
                <option>선택</option>
                {locationOptions.map((opt) => (
                  <option key={opt.optionId} value={opt.value}>
                    {opt.value}
                  </option>
                ))}
              </select>

              <label>시/군/구</label>
              <select onChange={(e) => setSelectedCity(e.target.value)}>
                <option>선택</option>
                {cityOptions.map((opt) => (
                  <option key={opt.optionId} value={opt.value}>
                    {opt.value}
                  </option>
                ))}
              </select>

              <label>테마</label>
              <select onChange={(e) => setSelectedTheme(e.target.value)}>
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
                    <input
                      type="checkbox"
                      value={opt.value}
                      onChange={() =>
                        handleCheckboxChange(
                          opt.value,
                          selectedResidence,
                          setSelectedResidence
                        )
                      }
                    />{" "}
                    {opt.value}
                  </label>
                ))}
              </div>

              <div>
                <strong>시설</strong>
                {facilityOptions.map((opt) => (
                  <label key={opt.optionId}>
                    <input
                      type="checkbox"
                      value={opt.value}
                      onChange={() =>
                        handleCheckboxChange(
                          opt.value,
                          selectedFacility,
                          setSelectedFacility
                        )
                      }
                    />{" "}
                    {opt.value}
                  </label>
                ))}
              </div>

              <div>
                <strong>주변환경</strong>
                {envOptions.map((opt) => (
                  <label key={opt.optionId}>
                    <input
                      type="checkbox"
                      value={opt.value}
                      onChange={() =>
                        handleCheckboxChange(
                          opt.value,
                          selectedEnvironment,
                          setSelectedEnvironment
                        )
                      }
                    />{" "}
                    {opt.value}
                  </label>
                ))}
              </div>

              <div>
                <strong>기타</strong>
                {etcOptions.map((opt) => (
                  <label key={opt.optionId}>
                    <input
                      type="checkbox"
                      value={opt.value}
                      onChange={() =>
                        handleCheckboxChange(
                          opt.value,
                          selectedEtc,
                          setSelectedEtc
                        )
                      }
                    />{" "}
                    {opt.value}
                  </label>
                ))}
              </div>
            </div>

            <button className="search-button" onClick={handleSearchClick}>
              검색
            </button>
          </div>

          {/* 검색 결과 */}
          {isSearch && appliedFilters ? (
            <SilvertownSearchResult filters={appliedFilters} />
          ) : (
            <SilvertownList />
          )}
        </div>
      </div>
    </>
  );
}

export default Silvertown;
