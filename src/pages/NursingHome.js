import React, { useState, useEffect } from "react";
import styles from "../styles/pages/EachMainPage.module.css";
//import "../styles/layouts/layout.css";
import { Link } from "react-router-dom";
import NursingHomeList from "../components/NursingHomeList";
import FloatingNavButtons from "../components/FloatingNavButtons";
import NursingHomeSearchResult from "../components/NursingHomeSearchResult";
import { getFilterOptions } from "../api/filterOption";
import { getRegionList, getCityListByRegion } from "../api/SearchResults";
import { motion } from "framer-motion";
import heroImage from "../assets/silvertownUp.png"; // 업로드한 상단 이미지
import backgroundShape from "../assets/mwhite.png"; // 포인트 PNG 배경

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

  // 필터 옵션 불러오기
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

    fetchOptions();
  }, []);

  // 지역 리스트 불러오기
  useEffect(() => {
    const fetchRegions = async () => {
      try {
        const regions = await getRegionList();
        setLocationOptions(regions);
      } catch (error) {
        console.error("지역 리스트 가져오기 실패:", error);
      }
    };

    fetchRegions();
  }, []);

  // 지역 선택 시 시군구 변경
  const handleRegionChange = async (e) => {
    const selectedRegionName = e.target.value;
    setSelectedLocation(selectedRegionName);

    const selectedRegion = locationOptions.find(
      (region) => region.name === selectedRegionName
    );

    if (!selectedRegion) return;

    try {
      const cities = await getCityListByRegion(selectedRegion.id);
      setCityOptions(cities);
      setSelectedCity("");
    } catch (error) {
      console.error("시군구 불러오기 실패:", error);
    }
  };

  // 체크박스 처리
  const handleCheckboxChange = (value, selectedList, setSelectedList) => {
    if (selectedList.includes(value)) {
      setSelectedList(selectedList.filter((v) => v !== value));
    } else {
      setSelectedList([...selectedList, value]);
    }
  };

  const handleSearchClick = () => {
    const filters = {
      location: selectedLocation,
      city: selectedCity,
      theme: selectedTheme,
      residence: selectedProgram,
      environment: selectedEnv,
      etc: selectedEtc,
      facility: selectedBusiness,
    };

    console.log("🟢 사용자가 선택한 필터 데이터:", filters);

    setAppliedFilters(filters);
    setIsSearch(true);
  };

  return (
    <>
      <FloatingNavButtons />

      <div className={styles["nursinghome-main"]}>
        {/* 상단 히어로 영역 */}
        <motion.div
          className={styles["hero-section"]}
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
        >
          <div className={styles["hero-image"]}>
            <img src={heroImage} alt="행복한 노년" />
          </div>
        </motion.div>
        <div className={styles["layout-container"]}>
          {/* 상단 탭 */}
          <div className={styles["tab-menu"]}>
            <Link to="/caregiver">
              <button>요양사</button>
            </Link>
            <button className={styles["active"]}>요양원</button>
            <Link to="/silvertown">
              <button>실버타운</button>
            </Link>
          </div>

          {/* 필터 박스 */}
          <div className={styles["filter-box"]}>
            {/* 선택 영역만 흰 배경 */}
            <div className={styles["selector-row"]}>
              <div className={styles["select-group"]}>
                <div className={styles["select-item"]}>
                  <img
                    src="/images/icon/pin.png"
                    alt="지역"
                    style={{ width: "20px", marginRight: "-10px" }}
                  />
                  <label>지역</label>
                  <select onChange={handleRegionChange}>
                    <option value="">선택</option>
                    {locationOptions.map((region) => (
                      <option key={region.id} value={region.name}>
                        {region.name}
                      </option>
                    ))}
                  </select>
                </div>
                <div className={styles["select-item"]}>
                  <img
                    src="/images/icon/pin.png"
                    alt="지역"
                    style={{ width: "20px", marginRight: "-10px" }}
                  />
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
                </div>

                <div className={styles["select-item"]}>
                  <img
                    src="/images/icon/layout.png"
                    alt="지역"
                    style={{ width: "20px", marginRight: "-3px" }}
                  />
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
              </div>
            </div>

            {/* 카테고리 필터 – 배경 없음 */}
            <div className={styles["filter-category"]}>
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
            {/* 검색 버튼 오른쪽 정렬 */}
            <div className={styles["search-button-wrapper"]}>
              <button
                className={styles["search-button"]}
                onClick={handleSearchClick}
              >
                검색
              </button>
            </div>
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
