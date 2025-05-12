// src/components/Footer.jsx
import React from "react";

const Footer = () => {
  return (
    <footer className="p-6 text-white bg-primary">
      <div className="container mx-auto text-center">
        <p>&copy; 2025 Spin predictor. All rights reserved.</p>
        <div className="flex justify-center mt-4 space-x-4">
          <a href="/terminos" className="hover:text-highlight">
            Términos y condiciones
          </a>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
