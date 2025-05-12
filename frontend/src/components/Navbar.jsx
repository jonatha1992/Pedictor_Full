import React from "react";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useAuth } from "../context/AuthContext";

const Navbar = () => {
  const { t, i18n } = useTranslation();
  const { logout, user } = useAuth();

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
    <header className="flex items-center justify-between p-4 text-white border-b-2 border-green-700 shadow-2xl bg-gradient-to-br from-green-800 to-primary">
      <div className="flex flex-col items-center">
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
      <nav className="flex items-center">
        <ul className="flex items-center space-x-2 md:space-x-4">
          {user && (
            <li>
              <Link to="/predict" className="px-4 py-2 font-bold text-white transition-colors border border-green-700 rounded-full shadow bg-primary hover:bg-highlight">Jugar</Link>
            </li>
          )}
          <li>
            <Link to="/subscribe" className="px-4 py-2 font-bold text-white transition-colors border border-green-700 rounded-full shadow bg-primary hover:bg-highlight">Suscripción</Link>
          </li>
          <li>
            <Link to="/contact" className="px-4 py-2 font-bold text-white transition-colors border border-green-700 rounded-full shadow bg-primary hover:bg-highlight">Contacto</Link>
          </li>
          {user && (
            <li>
              <Link to="/config" className="px-4 py-2 font-bold text-white transition-colors border border-green-700 rounded-full shadow bg-primary hover:bg-highlight">Configuración</Link>
            </li>
          )}
          <li>
            {user ? (
              <button
                onClick={handleLogout}
                className="px-4 py-2 font-bold text-white transition-colors border border-green-700 rounded-full shadow-md bg-primary hover:bg-highlight"
              >
                {t("Logout")}
              </button>
            ) : (
              <Link
                to="/login"
                className="px-4 py-2 font-bold text-white transition-colors border border-green-700 rounded-full shadow-md bg-primary hover:bg-highlight"
              >
                {t("Login")}
              </Link>
            )}
          </li>
        </ul>
      </nav>
    </header>
  );
};

export default Navbar;
