// src/components/Header.jsx
import React from "react";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import esp from "../assets/esp.png";
import eng from "../assets/eng.png";

const Header = () => {
  const { t, i18n } = useTranslation();

  const changeLanguage = (lng) => {
    i18n.changeLanguage(lng);
  };

  return (
    <header className="flex justify-between items-center p-4 bg-primary text-white">
      <div className="text-lg font-bold">AppName</div>
      <nav className="flex items-center">
        <ul className="flex space-x-4">
          <li>
            <a href="#features" className="hover:text-highlight">
              {t("Features")}
            </a>
          </li>
          <li>
            <a href="#pricing" className="hover:text-highlight">
              {t("Pricing")}
            </a>
          </li>
          <li>
            <a href="#faq" className="hover:text-highlight">
              {t("FAQ")}
            </a>
          </li>
          <li>
            <Link
              to="/login"
              className="bg-secondary px-4 py-2 rounded hover:bg-highlight transition-colors"
            >
              {t("Login")}
            </Link>
          </li>
        </ul>
        <div className="flex space-x-2 ml-4">
          <img
            src={eng}
            alt="English"
            onClick={() => changeLanguage("en")}
            className="text-white text-xl cursor-pointer hover:text-highlight h-6"
          />
          <img
            src={esp}
            alt="Español"
            className="text-white text-xl cursor-pointer hover:text-highlight h-6"
            onClick={() => changeLanguage("es")}
          />
        </div>
      </nav>
    </header>
  );
};

export default Header;
