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

        console.log("로그인 응답", response.data);
        console.log("토큰 디코딩 결과", decoded);

        localStorage.setItem("token", token);
        localStorage.setItem("username", decoded.sub);
        localStorage.setItem("role", decoded.role);
        localStorage.setItem("memberId", decoded.memberId);

        // 헤더 컴포넌트에게 로그인 상태 변경을 알리기 위해 커스텀 이벤트 발생
        window.dispatchEvent(new Event('loginStatusChanged'));

        console.log("로그인 성공!");
        console.log("토큰:", token);
        console.log("디코딩 결과:", decoded);

        // const role = decoded.role.toLowerCase();
        const role = decoded.role ? decoded.role.toLowerCase() : "";
        
        // ROLE_ 접두사 제거 (더 안전한 방식)
        let cleanRole = role;
        if (role === "role_admin") cleanRole = "admin";
        else if (role === "role_user") cleanRole = "user";
        else if (role === "role_company") cleanRole = "company";
        else if (role === "role_caregiver") cleanRole = "caregiver";
        else if (role === "role_silvertown") cleanRole = "silvertown";
        else if (role === "role_nursinghome") cleanRole = "nursinghome";
        // 기존 형태는 그대로 유지
        else cleanRole = role;
        
        console.log("=== 로그인 후 리다이렉트 디버깅 ===");
        console.log("원본 role:", decoded.role);
        console.log("소문자 role:", role);
        console.log("정리된 role:", cleanRole);

        if (cleanRole === "user") {
          console.log("USER로 리다이렉트");
          window.location.href = "/";
        } else if (cleanRole === "company") {
          console.log("COMPANY로 리다이렉트");
          window.location.href = "/company/main";
        } else if (cleanRole === "caregiver") {
          console.log("CAREGIVER로 리다이렉트");
          window.location.href = "/caregiver/main";
        } else if (cleanRole === "admin") {
          console.log("ADMIN으로 리다이렉트 - /admin으로 이동");
          window.location.href = "/admin";
        } else {
          console.log("알 수 없는 역할:", cleanRole);
        }
        
        console.log("navigate 함수 실행 완료");
        console.log("=== 디버깅 끝 ===");
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
