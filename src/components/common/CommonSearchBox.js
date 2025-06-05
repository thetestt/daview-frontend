import React, { useState, useEffect } from "react";
import { getRegionList, getCityListByRegion } from "../../api/SearchResults";
import { getFilterOptions } from "../../api/filterOption";

function CommonSearchBox({ targetType, onSearch }) {
  // 선택한 필터 값
  const [selectedLocation, setSelectedLocation] = useState("");
  const [selectedCity, setSelectedCity] = useState("");
  const [selectedTheme, setSelectedTheme] = useState("");
  const [checkboxValues, setCheckboxValues] = useState({});

  // 옵션 리스트
  const [locationOptions, setLocationOptions] = useState([]);
  const [cityOptions, setCityOptions] = useState([]);
  const [themeOptions, setThemeOptions] = useState([]);
  const [filterOptions, setFilterOptions] = useState({});

  // 지역 리스트
  useEffect(() => {
    const fetchRegions = async () => {
      const regions = await getRegionList();
      setLocationOptions(regions);
    };
    fetchRegions();
  }, []);

  // 지역 선택 시 시군구 변경
  const handleRegionChange = async (e) => {
    const regionId = e.target.value;
    setSelectedLocation(regionId);

    try {
      const cities = await getCityListByRegion(regionId);
      setCityOptions(cities);
      setSelectedCity("");
    } catch (error) {
      console.error("시군구 불러오기 실패:", error);
    }
  };

  // 필터 옵션 불러오기
  useEffect(() => {
    const fetchOptions = async () => {
      const themes = await getFilterOptions(targetType, "테마");
      setThemeOptions(themes);

      const optionMap = {};

      const categories = {
        실버타운: ["주거형태", "시설", "주변환경", "기타"],
        요양원: ["업종", "프로그램", "주변환경", "기타"],
        요양사: ["성별", "자격증", "근무형태", "고용형태"],
      };

      const targetCategories = categories[targetType] || [];

      for (const cat of targetCategories) {
        const opts = await getFilterOptions(targetType, cat);
        optionMap[cat] = opts;
      }

      setFilterOptions(optionMap);
    };

    fetchOptions();
  }, [targetType]);

  // 체크박스 핸들링
  const handleCheckboxChange = (category, value) => {
    const current = checkboxValues[category] || [];
    const updated = current.includes(value)
      ? current.filter((v) => v !== value)
      : [...current, value];

    setCheckboxValues({
      ...checkboxValues,
      [category]: updated,
    });
  };

  // 검색 버튼 클릭
  const handleSearchClick = () => {
    onSearch({
      location: selectedLocation,
      city: selectedCity,
      theme: selectedTheme,
      ...checkboxValues,
    });
  };

  return (
    <div className="filter-box">
      <h2>{targetType}</h2>

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
        {Object.entries(filterOptions).map(([category, options]) => (
          <div key={category}>
            <strong>{category}</strong>
            {options.map((opt) => (
              <label key={opt.optionId}>
                <input
                  type="checkbox"
                  value={opt.value}
                  onChange={() => handleCheckboxChange(category, opt.value)}
                  checked={(checkboxValues[category] || []).includes(opt.value)}
                />{" "}
                {opt.value}
              </label>
            ))}
          </div>
        ))}
      </div>

      <button className="search-button" onClick={handleSearchClick}>
        검색
      </button>
    </div>
  );
}

export default CommonSearchBox;
