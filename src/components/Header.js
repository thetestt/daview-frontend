import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import logoImg from "../assets/daview-logo.png";
import "../styles/components/Header.css";
import { jwtDecode } from "jwt-decode";

function Header() {
  const [keyword, setKeyword] = useState("");
  const [username, setUsername] = useState(null);
  const navigate = useNavigate();

  const handleSearch = () => {
    if (keyword.trim()) {
      navigate(`/search?query=${encodeURIComponent(keyword)}`);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("username");
    window.location.href = "/";
  };

  useEffect(() => {
    const stored = localStorage.getItem("username");
    if (stored) setUsername(stored);
    const token = localStorage.getItem("token");
    if (token) {
      try {
        const decoded = jwtDecode(token);
        const isExpired = decoded.exp * 1000 < Date.now();
        if (isExpired) {
          localStorage.removeItem("token");
          localStorage.removeItem("username");
          window.location.href = "/login";
        } else {
          setUsername(localStorage.getItem("username"));
        }
      } catch (e) {
        console.error("토큰 에러:", e);
        localStorage.removeItem("token");
        localStorage.removeItem("username");
      }
    }
  }, []);

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

        <div className="auto-buttons">
          {username ? (
            <div className="user-actions">
              <span>{username}님</span>
              <Link to="/mypage">마이페이지</Link>
              <span onClick={handleLogout}>로그아웃</span>
            </div>
          ) : (
            <>
              <Link to="/login">로그인</Link>
              <Link to="/signup">회원가입</Link>
            </>
          )}
        </div>

      </header>

      {/* 네비게이션 */}
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
              <li>
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
                <a href="#">공지게시판</a>
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
