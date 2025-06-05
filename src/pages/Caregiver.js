import React, { useState, useEffect } from "react";
import "../styles/pages/Caregiver.css";
import { Link } from "react-router-dom";
import CaregiverList from "../components/CaregiverList";
import "../styles/layouts/layout.css";
import FloatingNavButtons from "../components/FloatingNavButtons";
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
  const [selectedEmployment, setSelectedEmployment] = useState([]);

  // 옵션 리스트
  const [locationOptions, setLocationOptions] = useState([]);
  const [cityOptions, setCityOptions] = useState([]);
  const [genderOptions, setGenderOptions] = useState([]);
  const [certOptions, setCertOptions] = useState([]);
  const [workTypeOptions, setWorkTypeOptions] = useState([]);
  const [employmentTypeOptions, setEmploymentTypeOptions] = useState([]);

  useEffect(() => {
    const fetchOptions = async () => {
      const gender = await getFilterOptions("요양사", "성별");
      const cert = await getFilterOptions("요양사", "자격증");
      const workType = await getFilterOptions("요양사", "근무형태");
      const empType = await getFilterOptions("요양사", "고용형태");

      setGenderOptions(gender);
      setCertOptions(cert);
      setWorkTypeOptions(workType);
      setEmploymentTypeOptions(empType);
    };

    const fetchRegions = async () => {
      const regions = await getRegionList();
      setLocationOptions(regions);
    };

    fetchOptions();
    fetchRegions();
  }, []);

  // 지역 선택 시 시군구 업데이트
  const handleRegionChange = async (e) => {
    const regionId = e.target.value;
    setSelectedLocation(regionId);
    const cities = await getCityListByRegion(regionId);
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
    setAppliedFilters({
      location: selectedLocation,
      city: selectedCity,
      gender: selectedGender,
      certificate: selectedCert,
      workType: selectedWorkType,
      employmentType: selectedEmployment,
    });
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

              <label>성별</label>
              <select
                onChange={(e) => setSelectedGender(e.target.value)}
                value={selectedGender}
              >
                <option value="">선택</option>
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
                {employmentTypeOptions.map((opt) => (
                  <label key={opt.optionId}>
                    <input
                      type="checkbox"
                      value={opt.value}
                      onChange={() =>
                        handleCheckboxChange(
                          opt.value,
                          selectedEmployment,
                          setSelectedEmployment
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

          {/* 검색 결과 영역 */}
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
