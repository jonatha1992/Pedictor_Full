// src/App.jsx
import React from "react";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import Header from "./components/Header";
import Hero from "./components/Hero";
import Features from "./components/Features";
import Pricing from "./components/Pricing";
import FAQs from "./components/FAQs";
import Footer from "./components/Footer";
import Login from "./views/Login";
import Register from "./views/Register";
import Predict from "./views/Predict";

const Home = () => (
  <>
    <Hero />
    <Features />
    <Pricing />
    <FAQs />
  </>
);

const App = () => {
  return (
    <Router>
      <div className="px-4 mx-auto container-fluid">
        <Header />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/predict" element={<Predict />} />
        </Routes>
        <Footer />
      </div>
    </Router>
  );
};

export default App;
