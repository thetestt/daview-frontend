import React from "react";
import { Link } from "react-router-dom";
import "./Header.css";
import logoImg from "../assets/daview-logo.png";

function Header() {
  return (
    <div>
      <header className="header">
        {/* 로고 */}
        <div className="logo">
          <Link to="/">
            <img src={logoImg} alt="LOGO" className="logo-image" />
          </Link>
        </div>

        {/* 검색창 */}
        <div className="search-placeholder">검색창 자리</div>

        {/* 로그인/회원가입 */}
        <div className="auto-buttons">
          <Link to="/login">로그인</Link>
          <Link to="/signup">회원가입</Link>
        </div>
      </header>
    </div>
  );
}

export default Header;
