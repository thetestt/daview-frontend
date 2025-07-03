import React, { useState, useEffect } from "react";
import styles from "../styles/pages/EachMainPage.module.css";
import { Link } from "react-router-dom";
import SilvertownList from "../components/SilvertownList";
//import "../styles/layouts/layout.css";
import FloatingNavButtons from "../components/FloatingNavButtons";
import SilvertownSearchResult from "../components/SilvertownSearchResult";
import { getFilterOptions } from "../api/filterOption";
import { useForceRefresh } from "../utils/forceRefresh";
import { getRegionList, getCityListByRegion } from "../api/SearchResults";
import heroImage from "../assets/silvertownUp.png"; // 업로드한 상단 이미지
import { motion } from "framer-motion";

function Silvertown() {
  const [isSearch, setIsSearch] = useState(false);
  const [appliedFilters, setAppliedFilters] = useState(null);

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

  const refresh = useForceRefresh();

  // 필터 옵션 불러오기
  useEffect(() => {
    const fetchOptions = async () => {
      const theme = await getFilterOptions("실버타운", "테마");
      const resi = await getFilterOptions("실버타운", "주거형태");
      const fac = await getFilterOptions("실버타운", "시설");
      const env = await getFilterOptions("실버타운", "주변환경");
      const etc = await getFilterOptions("실버타운", "기타");

      setThemeOptions(theme);
      setResidenceOptions(resi);
      setFacilityOptions(fac);
      setEnvOptions(env);
      setEtcOptions(etc);
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

  // 검색 결과 넘겨주기
  const handleSearchClick = () => {
    const filters = {
      location: selectedLocation,
      city: selectedCity,
      theme: selectedTheme,
      residence: selectedResidence,
      facility: selectedFacility,
      environment: selectedEnvironment,
      etc: selectedEtc,
    };

    setAppliedFilters(filters);
    setIsSearch(true);
  };

  return (
    <div className={styles["page-background"]}>
      <FloatingNavButtons />

      <div className={styles["silvertown-main"]}>
        {/* 상단 히어로 영역 (없다면 공백 이미지라도 사용) */}
        <motion.div
          className={styles["hero-section"]}
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
        >
          <div className={styles["hero-image"]}>
            <img src={heroImage} alt="행복한 실버타운" />
          </div>
        </motion.div>

        <div className={styles["layout-container"]}>
          {/* 상단 탭 */}
          <div className={styles["tab-menu"]}>
            <Link to="/caregiver">
              <button>요양사</button>
            </Link>
            <Link to="/nursinghome">
              <button>요양원</button>
            </Link>
            <button onClick={refresh} className={styles["active"]}>
              실버타운
            </button>
          </div>

          {/* 필터 영역 */}
          <div className={styles["filter-box"]}>
            {/* 선택 영역: 흰 배경 박스 */}
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
                    alt="시군구"
                    style={{ width: "20px", marginRight: "-10px" }}
                  />
                  <label>시/군/구</label>
                  <select onChange={(e) => setSelectedCity(e.target.value)}>
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
                    alt="테마"
                    style={{ width: "20px", marginRight: "-3px" }}
                  />
                  <label>테마</label>
                  <select onChange={(e) => setSelectedTheme(e.target.value)}>
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

            {/* 체크박스 필터: 배경 없음 */}
            <div className={styles["filter-category"]}>
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
                    />
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
                          selectedEnvironment,
                          setSelectedEnvironment
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

            {/* 검색 버튼: 오른쪽 정렬 */}
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
            <SilvertownSearchResult filters={appliedFilters} />
          ) : (
            <SilvertownList />
          )}
        </div>
      </div>
    </div>
  );
}

export default Silvertown;
