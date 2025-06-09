import React, { useState } from "react";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useAuth } from "../context/AuthContext";
// Importar íconos necesarios
import { FaPlay, FaCrown, FaEnvelope, FaCog, FaSignInAlt, FaSignOutAlt } from 'react-icons/fa';

const Navbar = () => {

  const { t, i18n } = useTranslation();
  const { logout, user } = useAuth();
  const [menuOpen, setMenuOpen] = useState(false);

  const handleLogout = async () => {
    try {
      await logout();
    } catch (error) {
      console.error(error.message);
    }
  };

  const changeLanguage = (lng) => {
    i18n.changeLanguage(lng);
  };

  return (
    // Cambia p-4 por py-2 px-4 para reducir el alto
    <header className="relative flex items-center justify-between py-2 px-4 text-white border-b-2 border-green-700 shadow-2xl bg-gradient-to-br from-green-800 to-primary min-h-[48px]">
      <div className="flex flex-col items-start flex-shrink-0">
        <a
          href="/"
          // Reduce py-1 a py-0.5 y text-lg a text-base
          className="px-4 py-0.5 text-base font-extrabold tracking-wide transition-colors border-2 rounded-full shadow-md drop-shadow-lg text-highlight hover:text-white bg-black/40 border-highlight"
          style={{ letterSpacing: '0.08em' }}
        >
          Spin Predictor
        </a>

      </div>
      <div className="flex items-center gap-2 ml-auto">
        {/* Botón hamburguesa visible en mobile/tablet, oculto en desktop */}
        <button
          // Reduce h-10 w-10 a h-8 w-8 y ml-2 a ml-1
          className="flex flex-col items-center justify-center w-8 h-8 ml-1 rounded-lg lg:hidden focus:outline-none focus:ring-2 focus:ring-green-400"
          aria-label="Abrir menú"
          onClick={() => setMenuOpen(!menuOpen)}
        >
          {/* Reduce w-7 h-1 a w-6 h-0.5 */}
          <span className={`block w-6 h-0.5 bg-white rounded transition-all duration-200 ${menuOpen ? 'rotate-45 translate-y-2' : ''}`}></span>
          <span className={`block w-6 h-0.5 bg-white rounded my-0.5 transition-all duration-200 ${menuOpen ? 'opacity-0' : ''}`}></span>
          <span className={`block w-6 h-0.5 bg-white rounded transition-all duration-200 ${menuOpen ? '-rotate-45 -translate-y-2' : ''}`}></span>
        </button>
        {/* Menú horizontal en desktop, hamburguesa en mobile/tablet */}
        <nav className="">
          {/* Desktop */}
          <ul className="items-center hidden space-x-2 lg:flex md:space-x-4">
            {user && (
              <li>
                <Link to="/predict" className="flex items-center gap-2 px-4 py-2 font-bold text-white transition-colors border border-green-700 rounded-full shadow group bg-primary hover:bg-highlight">
                  <FaPlay className="text-yellow-300 transition-colors group-hover:text-black" />
                  <span>Jugar</span>
                </Link>
              </li>
            )}
            <li>
              <Link to="/subscribe" className="flex items-center gap-2 px-4 py-2 font-bold text-white transition-colors border border-green-700 rounded-full shadow group bg-primary hover:bg-highlight">
                <FaCrown className="text-yellow-300 transition-colors group-hover:text-black" />
                <span>Suscripción</span>
              </Link>
            </li>
            <li>
              <Link to="/contact" className="flex items-center gap-2 px-4 py-2 font-bold text-white transition-colors border border-green-700 rounded-full shadow group bg-primary hover:bg-highlight">
                <FaEnvelope className="text-yellow-300 transition-colors group-hover:text-black" />
                <span>Contacto</span>
              </Link>
            </li>
            {user && (
              <li>
                <Link to="/config" className="flex items-center gap-2 px-4 py-2 font-bold text-white transition-colors border border-green-700 rounded-full shadow group bg-primary hover:bg-highlight">
                  <FaCog className="text-yellow-300 transition-colors group-hover:text-black" />
                  <span>Configuración</span>
                </Link>
              </li>
            )}
            <li>
              {user ? (
                <button
                  onClick={handleLogout}
                  className="flex items-center gap-2 px-4 py-2 font-bold text-white transition-colors border border-green-700 rounded-full shadow-md group bg-primary hover:bg-highlight"
                >
                  <FaSignOutAlt className="text-yellow-300 transition-colors group-hover:text-black" />
                  {t("Logout")}
                </button>
              ) : (
                <Link
                  to="/login"
                  className="flex items-center gap-2 px-4 py-2 font-bold text-white transition-colors border border-green-700 rounded-full shadow-md group bg-primary hover:bg-highlight"
                >
                  <FaSignInAlt className="text-yellow-300 transition-colors group-hover:text-black" />
                  {t("Login")}
                </Link>
              )}
            </li>
          </ul>
          {/* Mobile/Tablet: menú hamburguesa */}
          {menuOpen && (
            <ul className="absolute left-0 z-50 flex flex-col w-full p-2 mt-1 space-y-2 font-bold text-white bg-green-900 border-b-2 border-green-700 shadow-2xl top-full rounded-b-xl lg:hidden animate-fade-in-down">              {user && (
              <li className="w-full">
                <Link to="/predict" className="flex items-center w-full gap-2 px-4 py-2 border border-green-700 rounded-full shadow group bg-primary hover:bg-highlight" onClick={() => setMenuOpen(false)}>
                  <FaPlay className="text-yellow-300 transition-colors group-hover:text-black" />
                  <span>Jugar</span>
                </Link>
              </li>
            )}
              <li className="w-full">
                <Link to="/subscribe" className="flex items-center w-full gap-2 px-4 py-2 border border-green-700 rounded-full shadow group bg-primary hover:bg-highlight" onClick={() => setMenuOpen(false)}>
                  <FaCrown className="text-yellow-300 transition-colors group-hover:text-black" />
                  <span>Suscripción</span>
                </Link>
              </li>
              <li className="w-full">
                <Link to="/contact" className="flex items-center w-full gap-2 px-4 py-2 border border-green-700 rounded-full shadow group bg-primary hover:bg-highlight" onClick={() => setMenuOpen(false)}>
                  <FaEnvelope className="text-yellow-300 transition-colors group-hover:text-black" />
                  <span>Contacto</span>
                </Link>
              </li>
              {user && (
                <li className="w-full">
                  <Link to="/config" className="flex items-center w-full gap-2 px-4 py-2 border border-green-700 rounded-full shadow group bg-primary hover:bg-highlight" onClick={() => setMenuOpen(false)}>
                    <FaCog className="text-yellow-300 transition-colors group-hover:text-black" />
                    <span>Configuración</span>
                  </Link>
                </li>
              )}<li className="w-full">
                {user ? (
                  <button
                    onClick={() => { handleLogout(); setMenuOpen(false); }}
                    className="flex items-center w-full gap-2 px-4 py-2 border border-green-700 rounded-full shadow-md group bg-primary hover:bg-highlight"
                  >
                    <FaSignOutAlt className="text-yellow-300 transition-colors group-hover:text-black" />
                    {t("Logout")}
                  </button>
                ) : (
                  <Link
                    to="/login"
                    className="flex items-center w-full gap-2 px-4 py-2 border border-green-700 rounded-full shadow-md group bg-primary hover:bg-highlight"
                    onClick={() => setMenuOpen(false)}
                  >
                    <FaSignInAlt className="text-yellow-300 transition-colors group-hover:text-black" />
                    {t("Login")}
                  </Link>
                )}
              </li>
            </ul>
          )}
        </nav>
      </div>
    </header>
  );
};

export default Navbar;
