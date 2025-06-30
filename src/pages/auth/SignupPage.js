import React, { useState, useEffect } from "react";
import axios from "axios";
import styles from "../../styles/auth/SignupPage.module.css";
import { useNavigate } from "react-router-dom";

function SignupPage() {
  const [agreed, setAgreed] = useState(false);
  const [agreeAll, setAgreeAll] = useState(false);
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
  const [isDuplicate, setIsDuplicate] = useState(null); // null, true, false
  
  useEffect(() => {
    console.log("SignupPage 렌더링 시작");
    const allChecked = agreed && smsAgree && emailAgree && pushAgree;
    setAgreeAll(allChecked);
  }, [agreed, smsAgree, emailAgree, pushAgree]);

  const navigate = useNavigate();

  const formatPhoneNumber = (value) => {
    const onlyNums = value.replace(/\D/g, '');

    if (onlyNums.length < 4) return onlyNums;
    if (onlyNums.length < 7) return `${onlyNums.slice(0, 3)}-${onlyNums.slice(3)}`;
    return `${onlyNums.slice(0, 3)}-${onlyNums.slice(3, 7)}-${onlyNums.slice(7, 11)}`;
  };


  const checkUsername = async () => {
    if (!username) {
      alert("아이디를 입력해주세요.");
      return;
    }

    try {
      const res = await axios.get(`http://localhost:8080/api/auth/check-username?username=${username}`);
      if (res.data === true) {
        alert("이미 사용 중인 아이디입니다.");
        setIsDuplicate(true);
      } else {
        alert("사용 가능한 아이디입니다.");
        setIsDuplicate(false);
      }
    } catch (err) {
      console.error("중복 확인 오류", err);
      alert("중복 확인 중 오류 발생");
    }
  };

  const handleSubmit = (e) => {
    const nameRegex = /^[가-힣]{1,7}$/;

    if (!nameRegex.test(name)) {
      alert("이름은 한글 1~7자만 입력 가능합니다.");
      return;
    }

    const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)(?=.*[!@#$%^&*()\-_=+{};:,<.>]).{10,16}$/;

    if (!passwordRegex.test(password)) {
      alert("비밀번호는 10~16자, 영문/숫자/기호를 모두 포함해야 합니다.");
      return;
    }

    e.preventDefault();
    if (!agreed) {
      alert("필수약관에 동의해주세요.");
      return;
    }
    if (password !== passwordConfirm) {
      alert("비밀번호가 일치하지 않습니다.");
      return;
    }
    if (isDuplicate !== false) {
      alert("아이디 중복 확인을 해주세요.");
      return;
    }
    if (!name || !emailId || !emailDomain || !password || !role || !gender) {
      alert("필수값이 입력되지 않았습니다.");
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
      smsAgree,
      emailAgree,
      pushAgree,
    },
      { withCredentials: true }
    )
      .then(() => {
        alert("회원가입 성공!");
        navigate("/login");
      })
      .catch((err) => {
        console.error("회원가입 실패", err);
        alert("회원가입 실패!\n" + (err.response?.data?.message || "서버 오류"));
      });
  };

  console.log("SignupPage 렌더링 시작");
  return (
    <div className={styles["signup-container"]}>
      <h2>회원가입</h2>
      <form className={styles["signup-form"]} onSubmit={handleSubmit}>

        <label>회원 유형</label>
        <select value={role} onChange={(e) => setRole(e.target.value)}>
          <option value="">선택하세요</option>
          <option value="user">일반 회원</option>
          <option value="company">기업</option>
          <option value="caregiver">요양사</option>
        </select> <br /><br />

        <label>아이디</label>
        <div className={styles["username-check-wrapper"]}>
          <input type="text" value={username} onChange={(e) => { setUsername(e.target.value); setIsDuplicate(null); }} placeholder="아이디 입력" />
          <button type="button" className={styles["username-check-button"]} onClick={checkUsername}>중복 확인</button>
        </div>
        {isDuplicate === true && <p className={styles["input-error"]}>이미 사용 중인 아이디입니다.</p>}
        {isDuplicate === false && <p className={styles["input-success"]}>사용 가능한 아이디입니다.</p>}

        <label>비밀번호</label>
        <p className={styles["terms-content"]}>
          비밀번호는 10~16자, 영문/숫자/기호를 모두 포함해야 합니다.
        </p>
        <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="비밀번호" />

        <label>비밀번호 확인</label>
        <input type="password" value={passwordConfirm} onChange={(e) => setPasswordConfirm(e.target.value)} placeholder="비밀번호 확인" />
        {passwordConfirm && password !== passwordConfirm && (<p className="input-error">비밀번호가 일치하지 않습니다.</p>)}

        <label>이름</label>
        <input type="text" value={name} onChange={(e) => setName(e.target.value)} placeholder="이름 입력" />

        <label>전화번호</label>
        <input type="text" value={phone} onChange={(e) => setPhone(formatPhoneNumber(e.target.value))} placeholder="휴대전화번호 '-' 없이 입력" />

        <label>이메일</label>
        <div className={styles["email-box"]}>
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
        <input type="date" max={new Date().toISOString().split("T")[0]} value={birth} onChange={(e) => setBirth(e.target.value)} />

        <div className={styles["terms-row"]}>
          <label className={styles["terms-label"]}>약관동의</label>
          <div className={styles["agree-all-line"]}>
            <input
              type="checkbox"
              checked={agreeAll}
              onChange={(e) => {
                const checked = e.target.checked;
                setAgreeAll(checked);
                setAgreed(checked);
                setSmsAgree(checked);
                setEmailAgree(checked);
                setPushAgree(checked);
              }}
            />
            <span>전체 약관에 동의합니다</span>
          </div>
        </div>

        <div className={styles["terms-content"]}>
          [이용약관 요약]<br /><br />
          [필수선택약관]<br />
          본 웹사이트는 요양 정보 제공 및 이용자 간 서비스 매칭을 위한 플랫폼입니다. <br />
          회원은 가입 시 실명 및 정확한 정보를 제공해야 하며, 허위 정보 등록 시 서비스 이용에 제한이 발생할 수 있습니다.<br />
          수집된 개인정보는 서비스 제공 목적 이외의 용도로 사용되지 않으며, 개인정보 보호법 등 관련 법령을 준수하여 안전하게 관리됩니다. <br />
          이용자는 언제든지 본인의 정보에 대한 열람, 수정, 삭제를 요청할 수 있습니다.<br />
          서비스 이용 시 무단 광고, 비방, 욕설, 허위 사실 유포 등은 금지되며, 운영진 판단에 따라 사전 경고 없이 이용 제한이 적용될 수 있습니다. <br />
          본 약관은 변경될 수 있으며, 변경 시 공지사항을 통해 사전 안내합니다.<br />
          회원은 항상 최신 약관을 숙지하고 이를 준수해야 하며, 지속적으로 서비스를 이용함으로써 약관 변경에 동의한 것으로 간주됩니다.<br />
          자세한 사항은 정식 이용약관 전문을 참고해주세요.<br />

        </div>

        <label className={styles["agree-check"]}>
          <input
            type="checkbox"
            checked={agreed}
            onChange={(e) => setAgreed(e.target.checked)}
          />
          <span>약관에 동의합니다</span><br />
        </label>

        <div className={styles["terms-content2"]}>
          [선택약관]<br />
        </div>

        <label className={styles["agree-check"]}>
          <input
            type="checkbox"
            checked={smsAgree}
            onChange={(e) => setSmsAgree(e.target.checked)}
          />
          <span>SMS 문자 수신 동의</span>
          <div className={styles["agree-desc"]}>
            서비스 관련 주요 안내 및 혜택 정보를 문자로 받아보실 수 있습니다.<br />
            수신 동의 시, 이벤트 알림 및 고객 맞춤 정보를 제공해드립니다.<br />
            원치 않으실 경우 언제든지 수신 거부가 가능합니다.<br />
          </div>
        </label>

        <label className={styles["agree-check"]}>
          <input
            type="checkbox"
            checked={emailAgree}
            onChange={(e) => setEmailAgree(e.target.checked)}
          />
          <span>이메일 수신 동의</span>
          <div className={styles["agree-desc"]}>
            다양한 혜택, 프로모션 및 신규 서비스 안내 메일을 보내드립니다.<br />
            수신 동의 시, 맞춤형 정보와 소식지를 정기적으로 받아보실 수 있습니다.<br />
            이메일은 언제든지 수신 거부를 통해 해지하실 수 있습니다.<br />
          </div>
        </label>

        <label className={styles["agree-check"]}>
          <input
            type="checkbox"
            checked={pushAgree}
            onChange={(e) => setPushAgree(e.target.checked)}
          />
          <span>앱 푸시 알림 동의</span>
          <div className={styles["agree-desc"]}>
            앱을 통해 실시간 알림, 혜택 정보, 이벤트 소식을 받아보실 수 있습니다.<br />
            푸시 알림은 설정에서 언제든지 ON/OFF 변경이 가능합니다.<br />
            중요한 정보 누락 없이 빠르게 전달받을 수 있습니다.<br />
          </div>
        </label><br /><br />


        <button className={styles["pass-btn"]} type="submit">회원가입</button>
      </form>
    </div>
  );
}

export default SignupPage;
