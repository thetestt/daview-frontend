import React, { useState, useEffect } from "react";
import "../styles/pages/NursingHome.css";
import { Link } from "react-router-dom";
import NursingHomeList from "../components/NursingHomeList";
import FloatingNavButtons from "../components/FloatingNavButtons";
import NursingHomeSearchResult from "../components/NursingHomeSearchResult";
import { getFilterOptions } from "../api/filterOption";
import { getRegionList, getCityListByRegion } from "../api/SearchResults";

function NursingHome() {
  const [isSearch, setIsSearch] = useState(false);
  const [appliedFilters, setAppliedFilters] = useState(null);

  // 선택값
  const [selectedLocation, setSelectedLocation] = useState("");
  const [selectedCity, setSelectedCity] = useState("");
  const [selectedTheme, setSelectedTheme] = useState("");
  const [selectedProgram, setSelectedProgram] = useState([]);
  const [selectedEnv, setSelectedEnv] = useState([]);
  const [selectedEtc, setSelectedEtc] = useState([]);
  const [selectedBusiness, setSelectedBusiness] = useState([]);

  // 옵션 리스트
  const [locationOptions, setLocationOptions] = useState([]);
  const [cityOptions, setCityOptions] = useState([]);
  const [themeOptions, setThemeOptions] = useState([]);
  const [programOptions, setProgramOptions] = useState([]);
  const [envOptions, setEnvOptions] = useState([]);
  const [etcOptions, setEtcOptions] = useState([]);
  const [businessTypeOptions, setBusinessTypeOptions] = useState([]);

  useEffect(() => {
    const fetchOptions = async () => {
      const theme = await getFilterOptions("요양원", "테마");
      const program = await getFilterOptions("요양원", "프로그램");
      const env = await getFilterOptions("요양원", "주변환경");
      const etc = await getFilterOptions("요양원", "기타");
      const biz = await getFilterOptions("요양원", "업종");
      setThemeOptions(theme);
      setProgramOptions(program);
      setEnvOptions(env);
      setEtcOptions(etc);
      setBusinessTypeOptions(biz);
    };

    const fetchRegions = async () => {
      const regions = await getRegionList();
      setLocationOptions(regions);
    };

    fetchOptions();
    fetchRegions();
  }, []);

  // 지역 변경 시 시군구 가져오기
  const handleRegionChange = async (e) => {
    const regionId = e.target.value;
    setSelectedLocation(regionId);
    const cities = await getCityListByRegion(regionId);
    setCityOptions(cities);
    setSelectedCity(""); // 초기화
  };

  const handleCheckboxChange = (value, selectedList, setSelectedList) => {
    if (selectedList.includes(value)) {
      setSelectedList(selectedList.filter((v) => v !== value));
    } else {
      setSelectedList([...selectedList, value]);
    }
  };

  const handleSearchClick = () => {
    setAppliedFilters({
      location: selectedLocation,
      city: selectedCity,
      theme: selectedTheme,
      program: selectedProgram,
      environment: selectedEnv,
      etc: selectedEtc,
      businessType: selectedBusiness,
    });
    setIsSearch(true);
  };

  return (
    <>
      <FloatingNavButtons />
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
              <select onChange={handleRegionChange} value={selectedLocation}>
                <option value="">선택</option>
                {locationOptions.map((region) => (
                  <option key={region.id} value={region.id}>
                    {region.name}
                  </option>
                ))}
              </select>

              <label>시/군/구</label>
              <select
                onChange={(e) => setSelectedCity(e.target.value)}
                value={selectedCity}
              >
                <option value="">선택</option>
                {cityOptions.map((city) => (
                  <option key={city.id} value={city.name}>
                    {city.name}
                  </option>
                ))}
              </select>

              <label>테마</label>
              <select
                onChange={(e) => setSelectedTheme(e.target.value)}
                value={selectedTheme}
              >
                <option value="">선택</option>
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
                    <input
                      type="checkbox"
                      value={opt.value}
                      onChange={() =>
                        handleCheckboxChange(
                          opt.value,
                          selectedBusiness,
                          setSelectedBusiness
                        )
                      }
                    />
                    {opt.value}
                  </label>
                ))}
              </div>

              <div>
                <strong>프로그램</strong>
                {programOptions.map((opt) => (
                  <label key={opt.optionId}>
                    <input
                      type="checkbox"
                      value={opt.value}
                      onChange={() =>
                        handleCheckboxChange(
                          opt.value,
                          selectedProgram,
                          setSelectedProgram
                        )
                      }
                    />
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
                          selectedEnv,
                          setSelectedEnv
                        )
                      }
                    />
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
                    />
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
            <NursingHomeSearchResult filters={appliedFilters} />
          ) : (
            <NursingHomeList />
          )}
        </div>
      </div>
    </>
  );
}

export default NursingHome;
