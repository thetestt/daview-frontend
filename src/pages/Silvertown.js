import React from "react";
import "./Silvertown.css";
import { Link } from "react-router-dom";
import SilvertownList from "../components/SilvertownList";

function Silvertown() {
  return (
    <div className="silvertown-main">
      {/* 상단 탭 */}
      <div className="tab-menu">
        <button className="active">실버타운</button>

        <Link to="/nursinghome">
          <button>요양원</button>
        </Link>

        <Link to="/caregiver">
          <button>요양사</button>
        </Link>
      </div>

      {/* 필터 영역 */}
      <div className="filter-box">
        <h2>실버타운</h2>
        <div className="filter-row">
          <label>지역</label>
          <select>
            <option>선택</option>
          </select>

          <label>시/구/군</label>
          <select>
            <option>선택</option>
          </select>

          <label>테마</label>
          <select>
            <option>선택</option>
          </select>
        </div>

        <div className="filter-category">
          <div>
            <strong>주거형태</strong>
            <label>
              <input type="checkbox" /> 아파트형
            </label>
            <label>
              <input type="checkbox" /> 호텔형
            </label>
            <label>
              <input type="checkbox" /> 빌딩형
            </label>
            <label>
              <input type="checkbox" /> 주택형
            </label>
          </div>

          <div>
            <strong>시설</strong>
            <label>
              <input type="checkbox" /> 수영장
            </label>
            <label>
              <input type="checkbox" /> 도서관
            </label>
            <label>
              <input type="checkbox" /> 영화관
            </label>
            <label>
              <input type="checkbox" /> 병원
            </label>
          </div>

          <div>
            <strong>주변환경</strong>
            <label>
              <input type="checkbox" /> 산
            </label>
            <label>
              <input type="checkbox" /> 바다
            </label>
            <label>
              <input type="checkbox" /> 강, 호수
            </label>
          </div>

          <div>
            <strong>기타</strong>
            <label>
              <input type="checkbox" /> 자유면회
            </label>
            <label>
              <input type="checkbox" /> 주차가능
            </label>
          </div>
        </div>

        <button className="search-button">검색</button>
      </div>
      <SilvertownList />

    </div>
  );
}

export default Silvertown;