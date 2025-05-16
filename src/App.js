import React from "react";
import { Routes, Route } from "react-router-dom";

import Header from "./components/Header";
import Footer from "./components/Footer";
import Home from "./pages/Home";
import Caregiver from "./pages/Caregiver";
import NursingHome from "./pages/NursingHome";
import Slivertown from "./pages/Slivertown";

function App() {
  return (
    //<Router>
    <div>
      <Header />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/caregiver" element={<Caregiver />} />
        <Route path="/nursinghome" element={<NursingHome />} />
        <Route path="/slivertown" element={<Slivertown />} />
      </Routes>
      <Footer />
    </div>
    //</Router>
  );
}

export default App;
