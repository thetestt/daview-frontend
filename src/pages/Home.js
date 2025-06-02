import React from "react";
import SlideBanner from "../components/SliderBanner";
import MainButton from "../components/MainButton";

function Home() {
  const username = localStorage.getItem("username");
  const role = localStorage.getItem("role");

  let mainMessage;
  if (role === "user") {
    mainMessage = `${username}님, 일반 유저 페이지에 오신 걸 환영합니다.`;
  } else if (role === "caregiver") {
    mainMessage = `${username}님, 요양사 페이지입니다.`;
  } else if (role === "company") {
    mainMessage = `${username}님, 기업 전용 페이지입니다.`;
  } else {
    mainMessage = "";
  }

  const handleLogout = () => {
    localStorage.clear();
    window.location.href = "/login";
  };

  return (
    <div>
      <SlideBanner />
      <MainButton />

      <p>{mainMessage}</p>
      {role && (
        <>
          <a href="/mypage">마이페이지</a>
          <button onClick={handleLogout}>로그아웃</button>
        </>
      )}
    </div>
  );
}

export default Home;


// 헷갈려서 여기 좀 적을게여~ - 수현

// 로그인한 사람의 username과 role 가져오고 mainMessage 보여주고
// 기존에 있던 <SlideBanner />, <MainButton />는 유지함
// handleLogout 함수 새로 정의 - 는 뭔말이지;