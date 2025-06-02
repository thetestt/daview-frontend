import React from "react";
import { Routes, Route } from "react-router-dom";
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
import Payment from "../components/Payment";
import PaymentResult from "../components/PaymentResult";
import ReviewBoard from "../components/ReviewBoard";
import ReviewWrite from "../components/ReviewWrite";
import AdminDashboard from "../features/admin/AdminDashboard";

const AppRouter = () => {
  return (
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
      <Route path="/notice/:facilityId/:noticeId" element={<NoticeDetail />} />

      {/* 검색 */}
      <Route path="/search" element={<SearchResults />} />

      {/* 채팅 */}
      {/* <Route path="/chat/:targetId" element={<ChatRoom />} /> */}
      <Route path="/chat/:chatroomId" element={<ChatRoom />} />

      {/* 주문 */}
      <Route path="/reservation/member/:memberId" element={<Reservation />} />
      <Route path="/payment" element={<Payment />} />
      <Route path="/payment-result" element={<PaymentResult />} />
      <Route path="/review-board" element={<ReviewBoard />} />
      <Route path="/review-write" element={<ReviewWrite />} />

      {/* 관리자 */}
      <Route path="/admin/dashboard" element={<AdminDashboard />} />
    </Routes>
  );
};

export default AppRouter;
