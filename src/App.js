import React from "react";
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

function App() {
  return (
    //<Router>
    <div>
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
        
      </Routes>
      <Footer />
    </div>
    //</Router>
  );
}

export default App;
