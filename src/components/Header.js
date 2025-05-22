import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "../styles/components/Header.css";
import logoImg from "../assets/daview-logo.png";
import { useSearch } from "../context/SearchContext";

function Header() {
  const [keyword, setKeyword] = useState("");
  const navigate = useNavigate();

  const handleSearch = () => {
    if (keyword.trim()) {
      navigate(`/search?query=${encodeURIComponent(keyword)}`);
    }
  };

  return (
    <div>
      <header className="header">
        {/* 로고 */}
        <div className="logo">
          <Link to="/">
            <img src={logoImg} alt="LOGO" className="logo-image" />
          </Link>
        </div>
        <div className="logo-text">전국 모든 요양원 / 실버타운</div>

        {/* 검색창 */}
        <input
          value={keyword}
          onChange={(e) => setKeyword(e.target.value)}
          placeholder="검색어를 입력하세요"
        />
        <button onClick={handleSearch}>검색</button>

        {/* 로그인/회원가입 */}
        <div className="auto-buttons">
          <Link to="/login">로그인</Link>
          <Link to="/signup">회원가입</Link>
        </div>
      </header>
      <nav className="nav-bar">
        <ul>
          <li className="dropdown">
            <a href="/caregiver">요양사</a>
            <ul className="dropdown-menu">
              <li>
                <a href="/nursinghome">상품 보러가기</a>
                <a href="/nursinghome">예약하기</a>
              </li>
            </ul>
          </li>
          <li className="dropdown">
            <a href="/nursinghome">요양원</a>
            <ul className="dropdown-menu">
              <li className="dropdown">
                <a href="/nursinghome">상품 보러가기</a>
                <a href="/nursinghome">예약하기</a>
              </li>
            </ul>
          </li>
          <li className="dropdown">
            <a href="/silvertown">실버타운</a>
            <ul className="dropdown-menu">
              <li>
                <a href="/nursinghome">상품 보러가기</a>
                <a href="/nursinghome">예약하기</a>
              </li>
            </ul>
          </li>
          <li className="dropdown">
            <a href="#">고객의 소리</a>
            <ul className="dropdown-menu">
              <li>
                <a href="#">문의하기</a>
                <a href="#">고객 후기</a>
              </li>
            </ul>
          </li>
        </ul>
      </nav>
    </div>
  );
}

export default Header;
