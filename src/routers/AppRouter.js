import { jwtDecode } from "jwt-decode";
import React, { useEffect } from "react";
import { Route, Routes, useNavigate } from "react-router-dom";

import Caregiver from "../pages/Caregiver";
import CaregiverDetail from "../pages/CaregiverDetail";
import ChatRoom from "../pages/ChatRoom";
import Home from "../pages/Home";
import NoticeDetail from "../pages/NoticeDetail";
import NoticeList from "../pages/NoticeList";
import NursingHome from "../pages/NursingHome";
import NursingHomeDetail from "../pages/NursingHomeDetail";
import Reservation from "../pages/ReservationPage";
import Payment from "../pages/PaymentPage";
import PaymentResult from "../pages/PaymentResultPage";
import PaymentList from "../pages/PaymentListPage";
import RefundList from "../pages/RefundListPage";
import ReviewBoard from "../pages/ReviewBoardPage";
import ReviewWrite from "../pages/ReviewWritePage";
import ReviewDetail from "../pages/ReviewDetailPage";
import ReviewUpdate from "../pages/ReviewUpdatePage";
import SearchResults from "../pages/SearchResults";
import Silvertown from "../pages/Silvertown";
import SilvertownDetail from "../pages/SilvertownDetail";
import FindIdPage from "../pages/auth/FindIdPage";
import FindIdResultPage from "../pages/auth/FindIdResultPage";
import FindPasswordPage from "../pages/auth/FindPasswordPage";
import LoginPage from "../pages/auth/LoginPage";
import MyPage from "../pages/auth/MyPage";
import WishlistPage from "../components/WishlistPage";
import MyProfile from "../pages/auth/MyProfile";
import SignupPage from "../pages/auth/SignupPage";
import ChangePasswordPage from "../pages/auth/ChangePasswordPage";
import ChangePasswordCheckPage from "../pages/auth/ChangePasswordCheckPage";
import ChangeIdPage from "../pages/auth/ChangeIdPage";
import CouponPage from "../pages/auth/CouponPage";
import WithdrawPage from "../pages/auth/WithdrawPage"
import RefundAccountPage from "../pages/auth/RefundAccountPage";
import MyReviewPage from "../pages/auth/MyReviewPage";
import CaregiverDashboard from "../pages/caregiver/CaregiverDashboard";
import CompanyDashboard from "../pages/company/CompanyDashboard";
import AdminLayout from "../components/admin_components/AdminLayout"; //관리자 레이아웃
import AdminDashboard from "../pages/admin/AdminDashboard"; //관리자 대시보드
import AdminProductList from "../pages/admin/admin_service/AdminProductList"; //관리자 상품 목록
import AdminUserList from "../pages/admin/admin_service/AdminUserList"; //관리자 유저 목록
import AdminReservationList from "../pages/admin/admin_service/AdminReservationList"; //관리자 예약 목록
import AdminPaymentList from '../pages/admin/admin_service/AdminPaymentList';
import AdminReviewList from '../pages/admin/admin_service/AdminReviewList'; //관리자 후기 목록
import AdminNoticeList from '../pages/admin/admin_service/AdminNoticeList'; //관리자 공지사항 목록
import AdminInquiryList from '../pages/admin/admin_service/AdminInquiryList'; //관리자 1:1 문의관리

//import Header from "../components/Header"; 헤더  APP.js에 있어서 주석처리.
import ChatList from "../pages/ChatList";
import RegisterPage from "../pages/RegisterPage";



const AppRouter = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");
    const currentPath = window.location.pathname;

    console.log("=== AppRouter useEffect 디버깅 ===");
    console.log("현재 경로:", currentPath);
    console.log("토큰 존재 여부:", !!token);

    if (token && currentPath === "/login") {
      try {
        const decoded = jwtDecode(token);
        const isExpired = decoded.exp * 1000 < Date.now();
        console.log("토큰 만료 여부:", isExpired);
        console.log("디코딩된 role:", decoded.role);
        
        if (!isExpired) {
          const role = decoded.role.toLowerCase();
          
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
          
          console.log("소문자 role:", role);
          console.log("정리된 role:", cleanRole);

          if (cleanRole === "admin") {
            console.log("AppRouter에서 ADMIN으로 리다이렉트");
            navigate("/admin");
          } else if (cleanRole === "silvertown") {
            console.log("AppRouter에서 SILVERTOWN으로 리다이렉트");
            navigate("/silvertown/main");
          } else if (cleanRole === "caregiver") {
            console.log("AppRouter에서 CAREGIVER로 리다이렉트");
            navigate("/caregiver/main");
          } else if (cleanRole === "nursinghome") {
            console.log("AppRouter에서 NURSINGHOME으로 리다이렉트");
            navigate("/nursinghome/main");
          } else if (cleanRole === "user") {
            console.log("AppRouter에서 USER로 리다이렉트");
            navigate("/");
          }
        }
      } catch (e) {
        console.error("토큰 디코딩 실패", e);
      }
    }
    console.log("=== AppRouter useEffect 끝 ===");
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
        <Route path="/register" element={<RegisterPage />} />
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
        <Route path="/chat" element={<ChatRoom />} />
        <Route path="/chat/:chatroomId" element={<ChatRoom />} />
        <Route path="/chatlist" element={<ChatList />} />

        {/* 주문 */}
        <Route path="/reservation/member/:memberId" element={<Reservation />} />
        <Route path="/payment" element={<Payment />} />
        <Route path="/payment-result" element={<PaymentResult />} />
        <Route path="/payments/member/:memberId" element={<PaymentList />} />
        <Route path="/refunds/:memberId" element={<RefundList />} />

        {/* 후기 */}
        <Route path="/review-board" element={<ReviewBoard />} />
        <Route path="/review-write" element={<ReviewWrite />} />
        <Route path="/review/:revId" element={<ReviewDetail />} />
        <Route path="/review/:revId/update" element={<ReviewUpdate />} />

        {/* 관리자 외 대시보드 */}
        <Route path="/company/main" element={<CompanyDashboard />} />
        <Route path="/caregiver/main" element={<CaregiverDashboard />} />

        {/* 마이페이지 */}
        {/* 아이디찾기 */}
        <Route path="/FindIdPage/result" element={<FindIdResultPage />} />
        {/* 비밀번호변경 */}
        <Route path="/FindPasswordPage/CPw" element={<ChangePasswordPage />} />
        <Route
          path="/FindPasswordPage/CPw-check"
          element={<ChangePasswordCheckPage />}
        />
        {/* 아이디변경*/}
        <Route path="mypage/ChangeIdPage" element={<ChangeIdPage />} />
        {/* 내 프로필 */}
        <Route path="/mypage/myprofile" element={<MyProfile />} />
        {/* 찜 */}
        <Route path="/mypage/wishlist" element={<WishlistPage />} />
        {/* 쿠폰 */}
        <Route path="/mypage/mycoupon" element={<CouponPage />} />
        {/* 환불계좌 */}
        <Route
          path="/mypage/myprofile/refundaccount" element={<RefundAccountPage />}/>
        {/* 회원탈퇴 */}
        <Route path="/mypage/myprofile/withdraw" element={<WithdrawPage />} />
        {/* 내가 쓴 후기 */}
        <Route path="/mypage/myprofile/myreview" element={<MyReviewPage />} />


        {/* 관리자 레이아웃 공통 적용 */}
        <Route path="/admin" element={<AdminLayout />}>
          <Route index element={<AdminDashboard />} />
          <Route path="products" element={<AdminProductList />} />
          <Route path="users" element={<AdminUserList />} />
          <Route path="reservations" element={<AdminReservationList />} />
          <Route path="payments" element={<AdminPaymentList />} />
          <Route path="reviews" element={<AdminReviewList />} />
          <Route path="notices" element={<AdminNoticeList />} />
          <Route path="inquiries" element={<AdminInquiryList />} />
        </Route>
      </Routes>
    </>
  );
};

export default AppRouter;
