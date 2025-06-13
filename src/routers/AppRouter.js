import React, { useEffect } from "react";
import { Routes, Route, useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";

import Home from "../pages/Home";
import LoginPage from "../pages/auth/LoginPage";
import SignupPage from "../pages/auth/SignupPage";
import MyPage from "../pages/auth/MyPage";
import FindPasswordPage from "../pages/auth/FindPasswordPage";
import FindIdPage from "../pages/auth/FindIdPage";
import CaregiverDetail from "../pages/CaregiverDetail";
import Caregiver from "../pages/Caregiver";
import NursingHome from "../pages/NursingHome";
import NursingHomeDetail from "../pages/NursingHomeDetail";
import Silvertown from "../pages/Silvertown";
import SilvertownDetail from "../pages/SilvertownDetail";
import NoticeList from "../pages/NoticeList";
import NoticeDetail from "../pages/NoticeDetail";
import SearchResults from "../pages/SearchResults";
import ChatRoom from "../pages/ChatRoom";
import Reservation from "../pages/ReservationPage";
import Payment from "../pages/PaymentPage";
import PaymentResult from "../pages/PaymentResultPage";
import ReviewBoard from "../pages/ReviewBoardPage";
import ReviewWrite from "../pages/ReviewWritePage";
import CaregiverDashboard from "../pages/caregiver/CaregiverDashboard";
import AdminDashboard from "../pages/admin/AdminDashboard";
import CompanyDashboard from "../pages/company/CompanyDashboard";

//import Header from "../components/Header"; 헤더  APP.js에 있어서 주석처리.
import ChatList from "../pages/ChatList";


const AppRouter = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");
    const currentPath = window.location.pathname;

    if (token && currentPath === "/login") {
      try {
        const decoded = jwtDecode(token);
        const isExpired = decoded.exp * 1000 < Date.now();
        if (!isExpired) {
          const role = decoded.role.toLowerCase();

          if (role === "admin") navigate("/admin/main");
          else if (role === "silvertown") navigate("/silvertown/main");
          else if (role === "caregiver") navigate("/caregiver/main");
          else if (role === "nursinghome") navigate("/nursinghome/main");
          else if (role === "user") navigate("/");
        }
      } catch (e) {
        console.error("토큰 디코딩 실패", e);
      }
    }
  }, [navigate]);

  return (
    <>
      <Routes>
        {/* 공통 */}
        <Route path="/" element={<Home />} />

        {/* 회원 */}
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<SignupPage />} />
        <Route path="/mypage" element={<MyPage />} />
        <Route path="/findpasswordpage" element={<FindPasswordPage />} />
        <Route path="/findidpage" element={<FindIdPage />} />

        {/* 요양사 */}
        <Route path="/caregiver" element={<Caregiver />} />
        <Route path="/caregiver/:id" element={<CaregiverDetail />} />

        {/* 요양기관 */}
        <Route path="/nursinghome" element={<NursingHome />} />
        <Route path="/nursinghome/:id" element={<NursingHomeDetail />} />
        <Route path="/silvertown" element={<Silvertown />} />
        <Route path="/silvertown/:id" element={<SilvertownDetail />} />

        {/* 공지 */}
        <Route path="/notice/:facilityId" element={<NoticeList />} />
        <Route
          path="/notice/:facilityId/:noticeId"
          element={<NoticeDetail />}
        />

        {/* 검색 */}
        <Route path="/search" element={<SearchResults />} />

        {/* 채팅 */}
        {/* <Route path="/chat/:targetId" element={<ChatRoom />} /> */}
        <Route path="/chat/:chatroomId" element={<ChatRoom />} />
        <Route
          path="/chatlist"
          element={<ChatList currentUser={{ memberId: 1 }} />}
        />

        {/* 주문 */}
        <Route path="/reservation/member/:memberId" element={<Reservation />} />
        <Route path="/payment" element={<Payment />} />
        <Route path="/payment-result" element={<PaymentResult />} />
        <Route path="/review-board" element={<ReviewBoard />} />
        <Route path="/review-write" element={<ReviewWrite />} />

        {/* 관리자 */}
        <Route path="/admin/main" element={<AdminDashboard />} />
        <Route path="/company/main" element={<CompanyDashboard />} />
        <Route path="/caregiver/main" element={<CaregiverDashboard />} />
      </Routes>
    </>
  );
};

export default AppRouter;
