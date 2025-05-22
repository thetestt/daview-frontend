import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const AdminLoginPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleLogin = async () => {
    try {
      const res = await axios.post("/api/admin/login", { email, password });
      if (res.data && res.data.token) {
        localStorage.setItem("admin_token", res.data.token);
        navigate("/admin/dashboard");
      }
    } catch (e) {
      alert("관리자 로그인 실패: 권한이 없거나 정보가 일치하지 않습니다.");
    }
  };

  return (
    <div>
      <h2>관리자 로그인</h2>
      <input
        type="email"
        placeholder="이메일"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />
      <input
        type="password"
        placeholder="비밀번호"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />
      <button onClick={handleLogin}>로그인</button>
    </div>
  );
};

export default AdminLoginPage;
