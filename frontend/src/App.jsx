// src/App.jsx
import React from "react";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";

import Navbar from "./components/Navbar";
import Home from "./views/Home";
import Footer from "./components/Footer";
import Login from "./views/Login";
import Register from "./views/Register";
import Predict from "./views/Predict";
import Subscribe from "./views/Subscribe";
import Contact from "./views/Contact";
import Config from "./views/Config";
import Terminos from "./views/Terminos";



const App = () => {
  return (
    <Router>
      <div className="px-4 mx-auto container-fluid">
        <Navbar />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/predict" element={<Predict />} />
          <Route path="/subscribe" element={<Subscribe />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/config" element={<Config />} />
          <Route path="/terminos" element={<Terminos />} />
        </Routes>
        <Footer />
      </div>
    </Router>
  );
};

export default App;
