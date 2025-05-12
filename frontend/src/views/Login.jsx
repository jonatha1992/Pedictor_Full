import React, { useState } from "react";
import googleLogo from "../assets/google.svg";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { Alert } from "../components/Alert";

const Login = () => {
  const [user, setUser] = useState({
    email: "",
    password: "",
  });
  const { login, loginWithGoogle, resetPassword } = useAuth();
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    try {
      await login(user.email, user.password);
      navigate("/predict");
    } catch (error) {
      setError(error.message);
    }
  };

  const handleChange = ({ target: { value, name } }) =>
    setUser({ ...user, [name]: value });

  const handleGoogleSignin = async () => {
    try {
      await loginWithGoogle();
      navigate("/");
    } catch (error) {
      setError(error.message);
    }
  };

  const handleResetPassword = async (e) => {
    e.preventDefault();
    if (!user.email) return setError("Write an email to reset password");
    try {
      await resetPassword(user.email);
      setError("We sent you an email. Check your inbox");
    } catch (error) {
      setError(error.message);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen px-4 py-12 bg-gradient-to-br from-gray-900 via-green-900 to-black sm:px-6 lg:px-8">
      <div className="w-full max-w-md p-8 space-y-8 border border-green-700 shadow-2xl bg-gradient-to-br from-green-800 to-green-900 rounded-xl">
        <div>
          <h2 className="mt-6 text-3xl font-extrabold text-center text-highlight drop-shadow-lg">
            Iniciar sesión
          </h2>
        </div>
        {error && <Alert message={error} />}
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <input type="hidden" name="remember" value="true" />
          <div className="-space-y-px rounded-md shadow-sm">
            <div>
              <label htmlFor="email" className="sr-only">
                Correo electrónico
              </label>
              <input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                required
                className="relative block w-full px-3 py-2 text-white placeholder-gray-300 transition-colors border border-green-700 appearance-none bg-black/60 rounded-t-xl focus:outline-none focus:ring-2 focus:ring-highlight focus:border-highlight focus:z-10 sm:text-sm"
                placeholder="Correo electrónico"
                onChange={handleChange}
                value={user.email}
              />
            </div>
            <div>
              <label htmlFor="password" className="sr-only">
                Contraseña
              </label>
              <input
                id="password"
                name="password"
                type="password"
                autoComplete="current-password"
                required
                className="relative block w-full px-3 py-2 text-white placeholder-gray-300 transition-colors border border-green-700 appearance-none bg-black/60 rounded-b-xl focus:outline-none focus:ring-2 focus:ring-highlight focus:border-highlight focus:z-10 sm:text-sm"
                placeholder="Contraseña"
                onChange={handleChange}
                value={user.password}
              />
            </div>
          </div>

          <div className="flex items-center justify-between">
            <div className="text-sm">
              <a
                href="#"
                className="font-bold transition-colors text-highlight hover:text-white drop-shadow"
              >
                ¿Olvidaste tu contraseña?
              </a>
            </div>
          </div>

          <div>
            <button
              type="submit"
              className="relative flex justify-center w-full px-4 py-2 text-sm font-bold text-white transition-colors border border-green-700 rounded-full shadow-md group bg-primary hover:bg-highlight hover:text-primary focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-highlight"
            >
              Iniciar sesión
            </button>
          </div>
        </form>
        <button
          onClick={handleGoogleSignin}
          className="w-full flex items-center justify-center gap-2 px-4 py-2 mt-2 font-bold transition-colors border-2 rounded-full shadow bg-white text-gray-800 border-gray-300 hover:bg-gray-100 hover:text-primary"
        >
          <img src={googleLogo} alt="Google" className="w-6 h-6" />
          Iniciar sesión con Google
        </button>
        <div className="text-center">
          <p className="mt-2 text-sm ">
            ¿No tienes una cuenta?{" "}
            <Link
              to="/register"
              className="font-bold transition-colors text-highlight hover:text-white drop-shadow"
            >
              Regístrate
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
