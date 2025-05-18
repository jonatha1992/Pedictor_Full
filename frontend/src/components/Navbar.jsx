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
    <header className="relative flex items-center justify-between p-4 text-white border-b-2 border-green-700 shadow-2xl bg-gradient-to-br from-green-800 to-primary">
      <div className="flex flex-col items-start flex-shrink-0">
        <a
          href={user ? "/predict" : "/"}
          className="px-4 py-1 text-lg font-extrabold tracking-wide transition-colors border-2 rounded-full shadow-md drop-shadow-lg text-highlight hover:text-white bg-black/40 border-highlight"
          style={{ letterSpacing: '0.08em' }}
        >
          Spin Predictor
        </a>
        {user && (
          <span className="mt-1 text-xs font-semibold text-white/80 bg-black/30 px-3 py-1 rounded-full border border-highlight shadow-sm max-w-[180px] overflow-hidden text-ellipsis whitespace-nowrap">
            {user.displayName || user.email}
          </span>
        )}
      </div>
      <div className="flex items-center gap-2 ml-auto">
        {/* Botón hamburguesa visible en mobile/tablet, oculto en desktop */}
        <button
          className="flex flex-col items-center justify-center w-10 h-10 ml-2 rounded-lg lg:hidden focus:outline-none focus:ring-2 focus:ring-green-400"
          aria-label="Abrir menú"
          onClick={() => setMenuOpen(!menuOpen)}
        >
          <span className={`block w-7 h-1 bg-white rounded transition-all duration-200 ${menuOpen ? 'rotate-45 translate-y-2' : ''}`}></span>
          <span className={`block w-7 h-1 bg-white rounded my-1 transition-all duration-200 ${menuOpen ? 'opacity-0' : ''}`}></span>
          <span className={`block w-7 h-1 bg-white rounded transition-all duration-200 ${menuOpen ? '-rotate-45 -translate-y-2' : ''}`}></span>
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
            <ul className="absolute left-0 z-50 flex flex-col w-full p-4 mt-2 space-y-2 font-bold text-white bg-green-900 border-b-2 border-green-700 shadow-2xl top-full rounded-b-xl lg:hidden animate-fade-in-down">
              {user && (
                <li>
                  <Link to="/predict" className="flex items-center gap-2 px-4 py-2 border border-green-700 rounded-full shadow group bg-primary hover:bg-highlight" onClick={() => setMenuOpen(false)}>
                    <FaPlay className="text-yellow-300 transition-colors group-hover:text-black" />
                    <span>Jugar</span>
                  </Link>
                </li>
              )}
              <li>
                <Link to="/subscribe" className="flex items-center gap-2 px-4 py-2 border border-green-700 rounded-full shadow group bg-primary hover:bg-highlight" onClick={() => setMenuOpen(false)}>
                  <FaCrown className="text-yellow-300 transition-colors group-hover:text-black" />
                  <span>Suscripción</span>
                </Link>
              </li>
              <li>
                <Link to="/contact" className="flex items-center gap-2 px-4 py-2 border border-green-700 rounded-full shadow group bg-primary hover:bg-highlight" onClick={() => setMenuOpen(false)}>
                  <FaEnvelope className="text-yellow-300 transition-colors group-hover:text-black" />
                  <span>Contacto</span>
                </Link>
              </li>
              {user && (
                <li>
                  <Link to="/config" className="flex items-center gap-2 px-4 py-2 border border-green-700 rounded-full shadow group bg-primary hover:bg-highlight" onClick={() => setMenuOpen(false)}>
                    <FaCog className="text-yellow-300 transition-colors group-hover:text-black" />
                    <span>Configuración</span>
                  </Link>
                </li>
              )}
              <li>
                {user ? (
                  <button
                    onClick={() => { handleLogout(); setMenuOpen(false); }}
                    className="flex items-center gap-2 px-4 py-2 border border-green-700 rounded-full shadow-md group bg-primary hover:bg-highlight"
                  >
                    <FaSignOutAlt className="text-yellow-300 transition-colors group-hover:text-black" />
                    {t("Logout")}
                  </button>
                ) : (
                  <Link
                    to="/login"
                    className="flex items-center gap-2 px-4 py-2 border border-green-700 rounded-full shadow-md group bg-primary hover:bg-highlight"
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
