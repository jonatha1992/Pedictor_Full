import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { Alert } from "../components/Alert";

const Register = () => {
  const [formData, setFormData] = useState({
    name: "",
    birthDate: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const { signup } = useAuth();
  const navigate = useNavigate();

  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const validateForm = () => {
    let tempErrors = {};
    if (!formData.name.trim()) tempErrors.name = "El nombre es obligatorio";
    if (!formData.birthDate)
      tempErrors.birthDate = "La fecha de nacimiento es obligatoria";
    if (!formData.email.trim()) {
      tempErrors.email = "El email es obligatorio";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      tempErrors.email = "Email inválido";
    }
    if (!formData.password) {
      tempErrors.password = "La contraseña es obligatoria";
    } else if (formData.password.length < 6) {
      tempErrors.password = "La contraseña debe tener al menos 6 caracteres";
    }
    if (formData.password !== formData.confirmPassword) {
      tempErrors.confirmPassword = "Las contraseñas no coinciden";
    }
    setErrors(tempErrors);
    return Object.keys(tempErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (validateForm()) {
      try {
        await signup(formData.email, formData.password);
        navigate("/");
      } catch (error) {
        console.error(error);
        setErrors({ general: "Error al registrar el usuario" });
      }
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen px-4 py-12 bg-gradient-to-br from-gray-900 via-green-900 to-black sm:px-6 lg:px-8">
      <div className="w-full max-w-md p-8 space-y-8 border border-green-700 shadow-2xl bg-gradient-to-br from-green-800 to-green-900 rounded-xl">
        <div>
          <h2 className="mt-6 text-3xl font-extrabold text-center text-highlight drop-shadow-lg">
            Registro de Usuario
          </h2>
        </div>
        {errors.general && <Alert message={errors.general} />}
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="-space-y-px rounded-md shadow-sm">
            <div>
              <label htmlFor="name" className="sr-only">
                Nombre
              </label>
              <input
                id="name"
                name="name"
                type="text"
                required
                className="relative block w-full px-3 py-2 text-white placeholder-gray-300 transition-colors border border-green-700 appearance-none bg-black/60 rounded-t-xl focus:outline-none focus:ring-2 focus:ring-highlight focus:border-highlight focus:z-10 sm:text-sm"
                placeholder="Nombre completo"
                value={formData.name}
                onChange={handleChange}
              />
              {errors.name && (
                <p className="mt-1 text-xs text-secondary">{errors.name}</p>
              )}
            </div>
            <div>
              <label htmlFor="birthDate" className="sr-only">
                Fecha de nacimiento
              </label>
              <input
                id="birthDate"
                name="birthDate"
                type="date"
                required
                className="relative block w-full px-3 py-2 text-white placeholder-gray-300 transition-colors border border-green-700 appearance-none bg-black/60 focus:outline-none focus:ring-2 focus:ring-highlight focus:border-highlight focus:z-10 sm:text-sm"
                value={formData.birthDate}
                onChange={handleChange}
              />
              {errors.birthDate && (
                <p className="mt-1 text-xs text-secondary">
                  {errors.birthDate}
                </p>
              )}
            </div>
            <div>
              <label htmlFor="email" className="sr-only">
                Email
              </label>
              <input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                required
                className="relative block w-full px-3 py-2 text-white placeholder-gray-300 transition-colors border border-green-700 appearance-none bg-black/60 focus:outline-none focus:ring-2 focus:ring-highlight focus:border-highlight focus:z-10 sm:text-sm"
                placeholder="Correo electrónico"
                value={formData.email}
                onChange={handleChange}
              />
              {errors.email && (
                <p className="mt-1 text-xs text-secondary">{errors.email}</p>
              )}
            </div>
            <div>
              <label htmlFor="password" className="sr-only">
                Contraseña
              </label>
              <input
                id="password"
                name="password"
                type="password"
                autoComplete="new-password"
                required
                className="relative block w-full px-3 py-2 text-white placeholder-gray-300 transition-colors border border-green-700 appearance-none bg-black/60 focus:outline-none focus:ring-2 focus:ring-highlight focus:border-highlight focus:z-10 sm:text-sm"
                placeholder="Contraseña"
                value={formData.password}
                onChange={handleChange}
              />
              {errors.password && (
                <p className="mt-1 text-xs text-secondary">{errors.password}</p>
              )}
            </div>
            <div>
              <label htmlFor="confirmPassword" className="sr-only">
                Confirmar Contraseña
              </label>
              <input
                id="confirmPassword"
                name="confirmPassword"
                type="password"
                autoComplete="new-password"
                required
                className="relative block w-full px-3 py-2 text-white placeholder-gray-300 transition-colors border border-green-700 appearance-none bg-black/60 rounded-b-xl focus:outline-none focus:ring-2 focus:ring-highlight focus:border-highlight focus:z-10 sm:text-sm"
                placeholder="Confirmar Contraseña"
                value={formData.confirmPassword}
                onChange={handleChange}
              />
              {errors.confirmPassword && (
                <p className="mt-1 text-xs text-secondary">
                  {errors.confirmPassword}
                </p>
              )}
            </div>
          </div>

          <div>
            <button
              type="submit"
              className="relative flex justify-center w-full px-4 py-2 text-sm font-bold text-white transition-colors border border-green-700 rounded-full shadow-md group bg-primary hover:bg-highlight hover:text-primary focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-highlight"
            >
              Registrarse
            </button>
          </div>
        </form>
        <div className="text-center">
          <p className="mt-2 text-sm ">
            ¿Ya tienes una cuenta?{" "}
            <Link
              to="/login"
              className="font-bold transition-colors text-highlight hover:text-white drop-shadow"
            >
              Inicia sesión
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Register;
