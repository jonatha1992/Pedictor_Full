// src/App.jsx
import React from "react";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import Header from "./components/Header";
import Hero from "./components/Hero";
import Features from "./components/Features";
import Pricing from "./components/Pricing";
import FAQs from "./components/FAQs";
import Footer from "./components/Footer";
import Login from "./components/Login";
import Register from "./components/Register";
import Predict from "./components/Predict";
import Test from "./test/Test";

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
      <div>
        <Header />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/test" element={<Test />} />
          <Route path="/register" element={<Register />} />
          <Route path="/predict" element={<Predict />} />
        </Routes>
        <Footer />
      </div>
    </Router>
  );
};

export default App;
