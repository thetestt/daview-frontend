import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import logoImg from "../assets/daview-logo.png";
import "../styles/components/Header.css";
import { jwtDecode } from "jwt-decode";

function Header() {
  const [keyword, setKeyword] = useState("");
  const [username, setUsername] = useState(null);
  const navigate = useNavigate();
  const memberId = localStorage.getItem("memberId");

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
    const handleStorageChange = () => {
      const token = localStorage.getItem("token");
      if (token) {
        try {
          const decoded = jwtDecode(token);
          const isExpired = decoded.exp * 1000 < Date.now();
          if (!isExpired) {
            setUsername(decoded.sub);
            localStorage.setItem("memberId", decoded.memberId);
          } else {
            localStorage.removeItem("token");
            localStorage.removeItem("username");
            localStorage.removeItem("memberId");
            setUsername(null);
          }
        } catch (e) {
          console.error("토큰 에러:", e);
          localStorage.removeItem("token");
          localStorage.removeItem("username");
          localStorage.removeItem("memberId");
          setUsername(null);
        }
      } else {
        localStorage.removeItem("memberId");
        setUsername(null);
      }
    };

    // storage 이벤트 리스너
    window.addEventListener("storage", handleStorageChange);
    handleStorageChange(); // 최초 1회 실행

    return () => {
      window.removeEventListener("storage", handleStorageChange);
    };
  }, []);

  return (
    <div>
      <header className="header">
        {/* 왼쪽: 로고 + 텍스트 */}
        <div className="header-left">
          <div className="logo-container">
            <Link to="/" className="logo">
              <img src={logoImg} alt="LOGO" className="logo-image" />
            </Link>
            <span className="logo-text">전국 모든 요양원 / 실버타운</span>
          </div>
        </div>

        {/* 가운데: 검색 input + 버튼 */}
        <div className="header-right">
          <div className="search-box">
            <span className="search-icon">
              <img src="/images/buttonimage/searchicon.png" alt="검색" />
            </span>
            <input
              type="text"
              className="search-input"
              placeholder="검색어를 입력하세요"
              value={keyword}
              onChange={(e) => setKeyword(e.target.value)}
            />
            <button className="search-button" onClick={handleSearch}>
              검색
            </button>
          </div>

          {/* 오른쪽: 로그인 / 회원가입 */}
          {username ? (
            <div className="user-actions">
              <span>{username}님</span>
              <Link to="/mypage">마이페이지</Link>
              <Link to={`/reservation/member/${memberId}`}>나의예약</Link>
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
