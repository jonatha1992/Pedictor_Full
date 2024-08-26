import React, { useState } from "react";
import { Link } from "react-router-dom";

const Register = () => {
  const [formData, setFormData] = useState({
    name: "",
    birthDate: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

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

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validateForm()) {
      // Aquí iría la lógica para enviar los datos al servidor
      console.log("Formulario válido:", formData);
    } else {
      console.log("Formulario inválido");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-accent py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8 bg-white p-8 rounded-lg shadow-md">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-primary">
            Registro de Usuario
          </h2>
        </div>
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="rounded-md shadow-sm -space-y-px">
            <div>
              <label htmlFor="name" className="sr-only">
                Nombre
              </label>
              <input
                id="name"
                name="name"
                type="text"
                required
                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-secondary focus:border-secondary focus:z-10 sm:text-sm"
                placeholder="Nombre completo"
                value={formData.name}
                onChange={handleChange}
              />
              {errors.name && (
                <p className="text-secondary text-xs mt-1">{errors.name}</p>
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
                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-secondary focus:border-secondary focus:z-10 sm:text-sm"
                value={formData.birthDate}
                onChange={handleChange}
              />
              {errors.birthDate && (
                <p className="text-secondary text-xs mt-1">
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
                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-secondary focus:border-secondary focus:z-10 sm:text-sm"
                placeholder="Correo electrónico"
                value={formData.email}
                onChange={handleChange}
              />
              {errors.email && (
                <p className="text-secondary text-xs mt-1">{errors.email}</p>
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
                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-secondary focus:border-secondary focus:z-10 sm:text-sm"
                placeholder="Contraseña"
                value={formData.password}
                onChange={handleChange}
              />
              {errors.password && (
                <p className="text-secondary text-xs mt-1">{errors.password}</p>
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
                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-b-md focus:outline-none focus:ring-secondary focus:border-secondary focus:z-10 sm:text-sm"
                placeholder="Confirmar Contraseña"
                value={formData.confirmPassword}
                onChange={handleChange}
              />
              {errors.confirmPassword && (
                <p className="text-secondary text-xs mt-1">
                  {errors.confirmPassword}
                </p>
              )}
            </div>
          </div>

          <div>
            <button
              type="submit"
              className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-primary hover:bg-secondary focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-highlight transition-colors"
            >
              Registrarse
            </button>
          </div>
        </form>
        <div className="text-center">
          <p className="mt-2 text-sm text-gray-600">
            ¿Ya tienes una cuenta?{" "}
            <Link
              to="/login"
              className="font-medium text-secondary hover:text-primary transition-colors"
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
