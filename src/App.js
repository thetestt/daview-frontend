import { Routes, Route } from "react-router-dom";

import Header from "./components/Header";
import Footer from "./components/Footer";
import Home from "./pages/Home";
import Caregiver from "./pages/Caregiver";
import CaregiverDetail from "./pages/CaregiverDetail";
import NursingHome from "./pages/NursingHome";
import NursingHomeDetail from "./pages/NursingHomeDetail";
import Silvertown from "./pages/Silvertown";
import SilvertownDetail from "./pages/SilvertownDetail";
import LoginPage from "./pages/auth/LoginPage";
import SignupPage from "./pages/auth/SignupPage";
import NoticeDetail from "./pages/NoticeDetail";
import NoticeList from "./pages/NoticeList";
import FindPasswordPage from "./pages/auth/FindPasswordPage";
import FindIdPage from "./pages/auth/FindIdPage";

import Reservation from "./pages/ReservationPage";
import Payment from "./pages/PaymentPage";
import PaymentResult from "./pages/PaymentResultPage";
import ReviewBoard from "./pages/ReviewBoardPage";
import ReviewWrite from "./pages/ReviewWritePage";
import { SearchProvider } from "./context/SearchContext";
import SearchResults from "./pages/SearchResults";
import ChatRoom from "./pages/ChatRoom";
import MyPage from "./pages/auth/MyPage";

function App() {
  return (
    //<Router>
    <SearchProvider>
      <Header />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/caregiver" element={<Caregiver />} />
        <Route path="/caregiver/:id" element={<CaregiverDetail />} />
        <Route path="/nursinghome" element={<NursingHome />} />
        <Route path="/nursinghome/:id" element={<NursingHomeDetail />} />
        <Route path="/silvertown" element={<Silvertown />} />
        <Route path="/silvertown/:id" element={<SilvertownDetail />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<SignupPage />} />
        <Route path="/mypage" element={<MyPage />} />
        <Route path="/notice/:facilityId" element={<NoticeList />} />
        <Route
          path="/notice/:facilityId/:noticeId"
          element={<NoticeDetail />}
        />
        <Route path="/findpasswordpage" element={<FindPasswordPage />} />
        <Route path="/findidpage" element={<FindIdPage />} />

        <Route path="/reservation/member/:memberId" element={<Reservation />} />
        <Route path="/payment" element={<Payment />} />
        <Route path="/payment-result" element={<PaymentResult />} />
        <Route path="/review-board" element={<ReviewBoard />} />
        <Route path="/review-write" element={<ReviewWrite />} />
        <Route path="/search" element={<SearchResults />} />

        {/* <Route path="/chat/:targetId" element={<ChatRoom />} /> */}
        <Route path="/chat/:chatroomId" element={<ChatRoom />} />
      </Routes>
      <Footer />
    </SearchProvider>
    //</Router>
  );
}

export default App;
