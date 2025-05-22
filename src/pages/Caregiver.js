import React from "react";
import "../styles/pages/Caregiver.css";
import { Link } from "react-router-dom";
import CaregiverList from "../components/CaregiverList";
import "../styles/layouts/layout.css";
import FloatingNavButtons from "../components/FloatingNavButtons";

function Caregiver() {
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

          {/* 필터 영역 */}
          <div className="filter-box">
            <h2>요양보호사</h2>
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
                <strong>성별</strong>
                <select>
                  <option>선택</option>
                  <option>남</option>
                  <option>여</option>
                </select>
              </div>

              <div>
                <strong>자격증</strong>
                <label>
                  <input type="checkbox" /> 요양보호사
                </label>
                <label>
                  <input type="checkbox" /> 사회복지사
                </label>
                <label>
                  <input type="checkbox" /> 간호조무사
                </label>
                <label>
                  <input type="checkbox" /> 간호사
                </label>
              </div>

              <div>
                <strong>근무형태</strong>
                <label>
                  <input type="checkbox" /> 출퇴근
                </label>
                <label>
                  <input type="checkbox" /> 입주
                </label>
              </div>

              <div>
                <strong>고용형태</strong>
                <label>
                  <input type="checkbox" /> 정규직
                </label>
                <label>
                  <input type="checkbox" /> 계약직
                </label>
                <label>
                  <input type="checkbox" /> 단기
                </label>
                <label>
                  <input type="checkbox" /> 장기
                </label>
                <label>
                  <input type="checkbox" /> 임시
                </label>
              </div>
            </div>

            <button className="search-button">검색</button>
          </div>
          <CaregiverList />
        </div>
      </div>
    </>
  );
}

export default Caregiver;
