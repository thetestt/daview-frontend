import React, { useState } from "react";
import "../../styles/auth/SignupPage.css";


function SignupPage() {
  const [agreed, setAgreed] = useState(false); 
  const [smsAgree, setSmsAgree] = useState(false);
  const [emailAgree, setEmailAgree] = useState(false);
  const [pushAgree, setPushAgree] = useState(false);

  return (
    <div className="signup-container">
      <h2>회원가입</h2>

      <form className="signup-form">
        <label>이메일</label>
        <div className="email-box">
          <input type="email" placeholder="이메일" />
          <span className="at">@</span>
          <input type="text" />
        </div>

        <label>비밀번호</label>
        <input type="password" placeholder="영문, 숫자 포함 8자 이상" />

        <label>비밀번호 확인</label>
        <input type="password" placeholder="비밀번호 확인" />
        <label>닉네임</label>
        <input type="text" placeholder="한글 2~10자" />

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

        <button type="submit">회원가입하기</button>
      </form>
    </div>
  );
}

export default SignupPage;
