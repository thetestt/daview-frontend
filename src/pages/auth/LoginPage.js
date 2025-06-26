import React, { useState } from "react";
import axios from "axios";
import styles from "../../styles/auth/LoginPage.module.css";
import { useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";

function LoginPage() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  const navigate = useNavigate();

  const handleKakaoLogin = () => {
    window.location.href = `https://kauth.kakao.com/oauth/authorize?client_id=REST_API_KEY&redirect_uri=REDIRECT_URI&response_type=code`;
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    console.log("로그인 버튼 눌림");

    try {
      const response = await axios.post(
        "http://localhost:8080/api/auth/login",
        { username, password },
        { withCredentials: true }
      );

      console.log("로그인 응답", response.data);

      if (response.data.success) {
        const token = response.data.token;
        const decoded = jwtDecode(token);

        localStorage.setItem("token", token);
        localStorage.setItem("username", decoded.sub);
        localStorage.setItem("role", decoded.role);
        localStorage.setItem("memberId", decoded.memberId);

        window.dispatchEvent(new Event("storage"));

        console.log("로그인 성공!");
        console.log("토큰:", token);
        console.log("디코딩 결과:", decoded);

        // const role = decoded.role.toLowerCase();
        const role = decoded.role ? decoded.role.toLowerCase() : "";

        if (role === "user") {
          navigate("/");
        } else if (role === "company") {
          navigate("/company/main");
        } else if (role === "caregiver") {
          navigate("/caregiver/main");
        } else if (role === "admin") {
          navigate("/admin/main");
        }
      } else {
        setErrorMsg("아이디 또는 비밀번호가 틀렸습니다.");
        alert("로그인 실패: 아이디 또는 비밀번호가 틀렸습니다.");
      }
    } catch (error) {
      console.error("로그인 에러", error);
      setErrorMsg("서버 오류가 발생했습니다.");
      alert("서버 오류");
    }
  };

  return (
    <div className={styles["page-wrapper"]}>
      <div className={styles["login-container"]}>
        <div className={styles["login-inner"]}>
          <p className={styles["login-subtitle"]}>전국 모든 요양원 / 실버타운</p>
          <h1 className={styles["login-logo"]}>다뷰</h1>

          <form onSubmit={handleLogin} className={styles["login-form"]}>
            <input
              type="text"
              placeholder="아이디"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
            <input
              type="password"
              placeholder="비밀번호"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />

            <button type="submit" className={styles["login-button"]}>
              로그인
            </button>

            <button
              type="button"
              onClick={handleKakaoLogin}
              className="kakao-login-button"
            >
              카카오로 로그인하기
            </button>

            <div className={styles["kakao-login"]}>
              카카오로 로그인 시 자동 회원가입 처리됩니다.
            </div>

            {errorMsg && <p className={styles["error-message"]}>{errorMsg}</p>}
          </form>

          <div className={styles["login-links"]}>
            <a href="/findidpage">아이디찾기</a>
            <span>|</span>
            <a href="/findpasswordpage">비밀번호찾기</a>
            <span>|</span>
            <a href="/signup">회원가입</a>
          </div>
        </div>
      </div>
    </div>
  );
}

export default LoginPage;
