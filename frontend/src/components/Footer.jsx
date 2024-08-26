// src/components/Footer.jsx
import React from "react";

const Footer = () => {
  return (
    <footer className="bg-primary text-white p-6">
      <div className="container mx-auto text-center">
        <p>&copy; 2024 AppName. All rights reserved.</p>
        <div className="flex justify-center space-x-4 mt-4">
          <a href="#" className="hover:text-highlight">
            Terms
          </a>
          <a href="#" className="hover:text-highlight">
            Privacy
          </a>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
