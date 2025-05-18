import React from "react";
import "./NursingHome.css";
import { Link } from "react-router-dom";
import NursingHomeList from "../components/NursingHomeList";
import "../styles/layout.css";

function NursingHome() {
  return (
    <div className="layout-container">
    <div className="nursinghome-main">
      {/* 상단 탭 */}
           <div className="tab-menu">
        <Link to="/silvertown">
          <button>실버타운</button>
        </Link>
        <button className="active">요양원</button>
        <Link to="/caregiver">
          <button>요양사</button>
        </Link>
      </div>

      {/* 필터 영역 */}
      <div className="filter-box">
        <h2>요양원</h2>
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
              <input type="checkbox" /> 단독빌딩
            </label>
            <label>
              <input type="checkbox" /> 일반빌딩
            </label>
            <label>
              <input type="checkbox" /> 주택형
            </label>
          </div>

          <div>
            <strong>프로그램</strong>
            <label>
              <input type="checkbox" /> 재활·물리치료
            </label>
            <label>
              <input type="checkbox" /> 체육교실
            </label>
            <label>
              <input type="checkbox" /> 노래교실
            </label>
            <label>
              <input type="checkbox" /> 문화·공연
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
      <NursingHomeList />
    </div>
    </div>
  );
}

export default NursingHome;
