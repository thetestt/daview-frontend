// src/page/Caregiver.js

import React, { useState, useEffect } from "react";
import styles from "../styles/pages/EachMainPage.module.css";
//import "../styles/layouts/layout.css";
import { Link } from "react-router-dom";
import FloatingNavButtons from "../components/FloatingNavButtons";
import CaregiverList from "../components/CaregiverList";
import CaregiverSearchResult from "../components/CaregiverSearchResult";
import { getFilterOptions } from "../api/filterOption";
import { getRegionList, getCityListByRegion } from "../api/SearchResults";

function Caregiver() {
  const [isSearch, setIsSearch] = useState(false);
  const [appliedFilters, setAppliedFilters] = useState(null);

  // 선택값
  const [selectedLocation, setSelectedLocation] = useState("");
  const [selectedCity, setSelectedCity] = useState("");
  const [selectedGender, setSelectedGender] = useState("");
  const [selectedCert, setSelectedCert] = useState([]);
  const [selectedWorkType, setSelectedWorkType] = useState([]);
  const [selectedEmployType, setSelectedEmployType] = useState([]);

  // 옵션 리스트
  const [locationOptions, setLocationOptions] = useState([]);
  const [cityOptions, setCityOptions] = useState([]);
  const [certOptions, setCertOptions] = useState([]);
  const [workTypeOptions, setWorkTypeOptions] = useState([]);
  const [employTypeOptions, setEmployTypeOptions] = useState([]);

  useEffect(() => {
    const fetchOptions = async () => {
      const cert = await getFilterOptions("요양사", "자격증");
      const work = await getFilterOptions("요양사", "근무형태");
      const employ = await getFilterOptions("요양사", "고용형태");

      setCertOptions(cert);
      setWorkTypeOptions(work);
      setEmployTypeOptions(employ);
    };

    fetchOptions();
  }, []);

  useEffect(() => {
    const fetchRegions = async () => {
      const regions = await getRegionList();
      setLocationOptions(regions);
    };
    fetchRegions();
  }, []);

  const handleRegionChange = async (e) => {
    const selected = e.target.value;
    setSelectedLocation(selected);
    const selectedRegion = locationOptions.find(
      (region) => region.name === selected
    );
    if (!selectedRegion) return;

    const cities = await getCityListByRegion(selectedRegion.id);
    setCityOptions(cities);
    setSelectedCity("");
  };

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
      gender: selectedGender,
      certificates: selectedCert,
      workType: selectedWorkType,
      employmentType: selectedEmployType,
    };

    console.log("🔍 요양사 필터 검색 조건:", filters);
    setAppliedFilters(filters);
    setIsSearch(true);
  };

  return (
    <>
      <FloatingNavButtons />
      <div className={styles["layout-container"]}>
        <div className={styles["each-main"]}>
          {/* 상단 탭 */}
          <div className={styles["tab-menu"]}>
            <button className={styles["active"]}>요양사</button>
            <Link to="/nursinghome">
              <button>요양원</button>
            </Link>
            <Link to="/silvertown">
              <button>실버타운</button>
            </Link>
          </div>

          {/* 필터 박스 */}
          <div className={styles["filter-box"]}>
            <h2>요양사 검색</h2>

            <div className={styles["filter-row"]}>
              <label>지역</label>
              <select onChange={handleRegionChange}>
                <option value="">선택</option>
                {locationOptions.map((region) => (
                  <option key={region.id} value={region.name}>
                    {region.name}
                  </option>
                ))}
              </select>

              <label>시/군/구</label>
              <select
                value={selectedCity}
                onChange={(e) => setSelectedCity(e.target.value)}
              >
                <option value="">선택</option>
                {cityOptions.map((city) => (
                  <option key={city.id} value={city.name}>
                    {city.name}
                  </option>
                ))}
              </select>

              <label>성별</label>
              <select
                value={selectedGender}
                onChange={(e) => setSelectedGender(e.target.value)}
              >
                <option value="">선택</option>
                <option value="female">여자</option>
                <option value="male">남자</option>
                <option value="hidden">무관</option>
              </select>
            </div>

            <div className={styles["filter-category"]}>
              <div>
                <strong>자격증</strong>
                {certOptions.map((opt) => (
                  <label key={opt.optionId}>
                    <input
                      type="checkbox"
                      value={opt.value}
                      onChange={() =>
                        handleCheckboxChange(
                          opt.value,
                          selectedCert,
                          setSelectedCert
                        )
                      }
                    />
                    {opt.value}
                  </label>
                ))}
              </div>

              <div>
                <strong>근무형태</strong>
                {workTypeOptions.map((opt) => (
                  <label key={opt.optionId}>
                    <input
                      type="checkbox"
                      value={opt.value}
                      onChange={() =>
                        handleCheckboxChange(
                          opt.value,
                          selectedWorkType,
                          setSelectedWorkType
                        )
                      }
                    />
                    {opt.value}
                  </label>
                ))}
              </div>

              <div>
                <strong>고용형태</strong>
                {employTypeOptions.map((opt) => (
                  <label key={opt.optionId}>
                    <input
                      type="checkbox"
                      value={opt.value}
                      onChange={() =>
                        handleCheckboxChange(
                          opt.value,
                          selectedEmployType,
                          setSelectedEmployType
                        )
                      }
                    />
                    {opt.value}
                  </label>
                ))}
              </div>
            </div>

            <button
              className={styles["search-button"]}
              onClick={handleSearchClick}
            >
              검색
            </button>
          </div>

          {/* 검색 결과 */}
          {isSearch && appliedFilters ? (
            <CaregiverSearchResult filters={appliedFilters} />
          ) : (
            <CaregiverList />
          )}
        </div>
      </div>
    </>
  );
}

export default Caregiver;
