import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import logoImg from "../assets/daview-logo.png";
import styles from "../styles/components/Header.module.css";
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
      <header className={styles["header"]}>
        {/* 왼쪽: 로고 + 텍스트 */}
        <div className={styles["header-left"]}>
          <div className={styles["logo-container"]}>
            <Link to="/" className={styles["logo"]}>
              <img src={logoImg} alt="LOGO" className={styles["logo-image"]} />
            </Link>
            <span className={styles["logo-text"]}>
              전국 모든 요양원 / 실버타운
            </span>
          </div>
        </div>

        {/* 가운데: 검색 input + 버튼 */}
        <div className={styles["header-right"]}>
          <div className={styles["search-box"]}>
            <span className={styles["search-icon"]}>
              <img
                src="/images/buttonimage/searchicon.png"
                alt="검색"
                onClick={handleSearch}
              />
            </span>
            <input
              type="text"
              className={styles["search-input"]}
              placeholder="검색어를 입력하세요"
              value={keyword}
              onChange={(e) => setKeyword(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  handleSearch();
                }
              }}
            />
            {/* <button className={styles["search-button"]} onClick={handleSearch}>
              검색
            </button> */}
          </div>

          {/* 오른쪽: 로그인 / 회원가입 */}
          {username ? (
            <div className={styles["user-actions"]}>
              <span>{username}님</span>
              <Link to="/mypage">마이페이지</Link>
              <Link to={`/reservation/member/${memberId}`}>나의예약</Link>
              <span onClick={handleLogout}>로그아웃</span>
            </div>
          ) : (
            <div className={styles["user-actions"]}>
              <Link to="/login">로그인</Link>
              <Link to="/signup">회원가입</Link>
            </div>
          )}
        </div>
      </header>

      {/* 네비게이션 */}
      <nav className={styles["nav-bar"]}>
        <ul>
          <li className={styles["dropdown"]}>
            <Link to="/caregiver">요양사</Link>
            <ul className={styles["dropdown-menu"]}>
              <li>
                <Link to="/caregiver">상품 보러가기</Link>
                <Link to="/caregiver">예약하기</Link>
              </li>
            </ul>
          </li>
          <li className={styles["dropdown"]}>
            <Link to="/nursinghome">요양원</Link>
            <ul className={styles["dropdown-menu"]}>
              <li>
                <Link to="/nursinghome">상품 보러가기</Link>
                <Link to="/nursinghome">예약하기</Link>
              </li>
            </ul>
          </li>
          <li className={styles["dropdown"]}>
            <Link to="/silvertown">실버타운</Link>
            <ul className={styles["dropdown-menu"]}>
              <li>
                <Link to="/silvertown">상품 보러가기</Link>
                <Link to="/silvertown">예약하기</Link>
              </li>
            </ul>
          </li>
          <li className={styles["dropdown"]}>
            <Link to="#">고객의 소리</Link>
            <ul className={styles["dropdown-menu"]}>
              <li>
                <Link to="/notice/00000000-0000-0000-0000-000000000001">
                  공지게시판
                </Link>
                <Link to="/mypage">문의하기</Link>
                <Link to="/review-board">고객 후기</Link>
              </li>
            </ul>
          </li>
        </ul>
      </nav>
    </div>
  );
}

export default Header;
