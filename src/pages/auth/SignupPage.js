import React, { useState } from "react";
import axios from "axios";
import "../../styles/auth/SignupPage.css";
import { useNavigate } from "react-router-dom";

function SignupPage() {
  const [agreed, setAgreed] = useState(false);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [passwordConfirm, setPasswordConfirm] = useState("");
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [emailId, setEmailId] = useState("");
  const [emailDomain, setEmailDomain] = useState("");
  const [gender, setGender] = useState("");
  const [birth, setBirth] = useState("");
  const [role, setRole] = useState("");
  const [smsAgree, setSmsAgree] = useState(false);
  const [emailAgree, setEmailAgree] = useState(false);
  const [pushAgree, setPushAgree] = useState(false);

  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!agreed) {
      alert("약관에 동의해주세요.");
      return;
    }
    if (password !== passwordConfirm) {
      alert("비밀번호가 일치하지 않습니다.");
      return;
    }

    const email = `${emailId}@${emailDomain}`;

    axios.post("http://localhost:8080/api/auth/signup", {
      username,
      password,
      name,
      phone,
      email,
      gender,
      birth,
      role,
    })
      .then(() => {
        alert("회원가입 성공!");
        navigate("/login");
      })
      .catch((err) => {
        console.error("회원가입 실패", err);
        alert("회원가입 실패!\n" + (err.response?.data?.message || "서버 오류"));
      });
  };

  return (
    <div className="signup-container">
      <h2>회원가입</h2>
      <form className="signup-form" onSubmit={handleSubmit}>
        <label>아이디</label>
        <input type="text" value={username} onChange={(e) => setUsername(e.target.value)} placeholder="아이디 입력" />

        <label>비밀번호</label>
        <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="비밀번호" />

        <label>비밀번호 확인</label>
        <input type="password" value={passwordConfirm} onChange={(e) => setPasswordConfirm(e.target.value)} placeholder="비밀번호 확인" />

        <label>이름</label>
        <input type="text" value={name} onChange={(e) => setName(e.target.value)} placeholder="이름 입력" />

        <label>전화번호</label>
        <input type="text" value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="전화번호 입력" />

        <label>이메일</label>
        <div className="email-box">
          <input type="text" value={emailId} onChange={(e) => setEmailId(e.target.value)} placeholder="이메일" />
          <span>@</span>
          <input type="text" value={emailDomain} onChange={(e) => setEmailDomain(e.target.value)} placeholder="도메인" />
          <select onChange={(e) => setEmailDomain(e.target.value)}>
            <option value="">직접 입력</option>
            <option value="naver.com">naver.com</option>
            <option value="gmail.com">gmail.com</option>
            <option value="daum.net">daum.net</option>
          </select>
        </div>

        <label>성별</label>
        <select value={gender} onChange={(e) => setGender(e.target.value)}>
          <option value="">선택</option>
          <option value="male">남성</option>
          <option value="female">여성</option>
        </select>

        <label>생년월일</label>
        <input type="date" value={birth} onChange={(e) => setBirth(e.target.value)} />

        <label>회원 유형</label>
        <select value={role} onChange={(e) => setRole(e.target.value)}>
          <option value="">선택하세요</option>
          <option value="user">일반 회원</option>
          <option value="company">기업</option>
          <option value="caregiver">요양사</option>
        </select>

        <label>약관동의</label>
        <div className="terms-content">
          [이용약관 요약]<br /><br />
          본 웹사이트는 요양 정보 제공 및 이용자 간 서비스 매칭을 위한 플랫폼입니다. <br />
          회원은 가입 시 실명 및 정확한 정보를 제공해야 하며, 허위 정보 등록 시 서비스 이용에 제한이 발생할 수 있습니다.<br />
          수집된 개인정보는 서비스 제공 목적 이외의 용도로 사용되지 않으며, 개인정보 보호법 등 관련 법령을 준수하여 안전하게 관리됩니다. <br />
          이용자는 언제든지 본인의 정보에 대한 열람, 수정, 삭제를 요청할 수 있습니다.<br />
          서비스 이용 시 무단 광고, 비방, 욕설, 허위 사실 유포 등은 금지되며, 운영진 판단에 따라 사전 경고 없이 이용 제한이 적용될 수 있습니다. <br />
          본 약관은 변경될 수 있으며, 변경 시 공지사항을 통해 사전 안내합니다.<br />
          회원은 항상 최신 약관을 숙지하고 이를 준수해야 하며, 지속적으로 서비스를 이용함으로써 약관 변경에 동의한 것으로 간주됩니다.<br />
          자세한 사항은 정식 이용약관 전문을 참고해주세요.<br /><br />

        </div>

        <label className="agree-check">
          <input
            type="checkbox"
            checked={agreed}
            onChange={() => setAgreed(!agreed)}
          />
          <span>약관에 동의합니다</span><br /><br />
        </label>

        <div className="terms-content2">
          [선택약관]<br /><br />
        </div>

        <label className="agree-check">
          <input
            type="checkbox"
            checked={smsAgree}
            onChange={() => setSmsAgree(!smsAgree)}
          />
          <span>SMS 문자 수신 동의</span>
        </label>

        <label className="agree-check">
          <input
            type="checkbox"
            checked={emailAgree}
            onChange={() => setEmailAgree(!emailAgree)}
          />
          <span>이메일 수신 동의</span>
        </label>

        <label className="agree-check">
          <input
            type="checkbox"
            checked={pushAgree}
            onChange={() => setPushAgree(!pushAgree)}
          />
          <span>앱 푸시 알림 동의</span>
        </label>


        <button type="submit">회원가입</button>
      </form>
    </div>
  );
}

export default SignupPage;
