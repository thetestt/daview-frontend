import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

// 공통 페이지
import Home from "../pages/Home";

// 인증 (일반 사용자)
import LoginPage from "../pages/auth/LoginPage";
import SignupPage from "../pages/auth/SignupPage";
import MyPage from "../pages/auth/MyPage";

// 관리자 인증
import AdminLoginPage from "../pages/admin/AdminLoginPage";

// 요양사
import CaregiverPage from "../pages/CaregiverPage";
import CaregiverDetail from "../pages/CaregiverDetail";
import CaregiverDashboard from "../features/caregiver/CaregiverDashboard";
import CaregiverProfile from "../features/caregiver/CaregiverProfile";
import CaregiverReservationList from "../features/caregiver/CaregiverReservationList";

// 요양원
import FacilityPage from "../pages/FacilityPage";
import NursingHome from "../pages/NursingHome";
import NursingHomeDetail from "../pages/NursingHomeDetail";
import FacilityDashboard from "../features/facility/FacilityDashboard";
import FacilityRoomManage from "../features/facility/FacilityRoomManage";

// 관리자
import AdminDashboard from "../features/admin/AdminDashboard";

const AppRouter = () => {
  return (
    <Router>
      <Routes>
        {/* 공통 */}
        <Route path="/" element={<Home />} />

        {/* 일반 사용자 인증 */}
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<SignupPage />} />
        <Route path="/mypage" element={<MyPage />} />

        {/* 요양사 */}
        <Route path="/caregiver" element={<CaregiverPage />} />
        <Route path="/caregiver/:id" element={<CaregiverDetail />} />
        <Route path="/caregiver/dashboard" element={<CaregiverDashboard />} />
        <Route path="/caregiver/profile" element={<CaregiverProfile />} />
        <Route path="/caregiver/reservations" element={<CaregiverReservationList />} />

        {/* 요양원 */}
        <Route path="/facility" element={<FacilityPage />} />
        <Route path="/facility/list" element={<NursingHome />} />
        <Route path="/facility/:id" element={<NursingHomeDetail />} />
        <Route path="/facility/dashboard" element={<FacilityDashboard />} />
        <Route path="/facility/rooms" element={<FacilityRoomManage />} />

        {/* 관리자 전용 */}
        <Route path="/admin/login" element={<AdminLoginPage />} />
        <Route path="/admin/dashboard" element={<AdminDashboard />} />
      </Routes>
    </Router>
  );
};

export default AppRouter;
