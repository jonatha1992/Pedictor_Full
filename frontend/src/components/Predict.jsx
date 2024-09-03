import React, { useEffect } from "react";
import { useAuth } from "../context/AuthContext";

const Predict = () => {
  const { getUserToken, user } = useAuth(); // Obteniendo getUserToken y user desde el AuthContext
  const numbers = Array.from({ length: 37 }, (_, i) => i); // Array de 0 a 36

  // Función para obtener datos usando el token de Firebase
  const fetchDataWithToken = async () => {
    try {
      if (user) {
        // Obtén el token de usuario
        const idToken = await getUserToken();
        console.log(idToken);
        // Realizar la solicitud GET con el token en el encabezado
        const response = await fetch("http://127.0.0.1:8000", {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${idToken}`, // Enviando el token en el encabezado
          },
        });

        if (response.ok) {
          const data = await response.json();
          console.log(data); // Maneja los datos de respuesta aquí
        } else {
          console.error("Error en la solicitud:", response.statusText);
        }
      } else {
        console.error("No hay un usuario autenticado");
      }
    } catch (error) {
      console.error("Error al obtener el token o hacer la solicitud:", error);
    }
  };

  // useEffect para llamar a fetchDataWithToken cuando se monte el componente
  useEffect(() => {
    fetchDataWithToken();
  }, [user]);

  return (
    <div className="h-screen">
      {/* Parte superior dividida en dos columnas */}
      <div className="h-1/2 flex">
        <div className="w-1/2 bg-blue-200 p-4">
          <h2>Columna 1</h2>
          <p>Contenido de la primera columna.</p>
        </div>
        <div className="w-1/2 bg-green-200 p-4">
          <h2>Columna 2</h2>
          <p>Contenido de la segunda columna.</p>
        </div>
      </div>

      {/* Parte inferior con tres columnas */}
      <div className=" p-4 bg-green-800">
        <div className="flex flex-wrap md:flex-nowrap items-center">
          {/* Columna 1 */}
          <div className="w-full md:w-1/3 p-2">
            <div className="grid md:grid-cols-4 grid-cols-3 gap-2 ">
              {/* Distribución de los números en la columna 1 */}
              {numbers.slice(0, 13).map((num, index) => (
                <div
                  key={index}
                  className={`col-span-1 text-center ${
                    num === 0 ? "row-span-4" : ""
                  }`}
                >
                  <button
                    className={`w-full h-full p-2 rounded text-white ${
                      num === 0
                        ? "bg-green-500"
                        : index % 2 === 0
                        ? "bg-red-500"
                        : "bg-black"
                    }`}
                  >
                    {num}
                  </button>
                </div>
              ))}
            </div>
          </div>
          {/* Columna 2 */}
          <div className="w-full md:w-1/3 p-2">
            <div className="grid grid-cols-3 gap-2  p-2">
              {/* Distribución de los números en la columna 2 */}
              {numbers.slice(13, 25).map((num, index) => (
                <div key={index} className="text-center">
                  <button
                    className={`w-full h-full p-2 rounded text-white ${
                      index % 2 === 0 ? "bg-red-500" : "bg-black"
                    }`}
                  >
                    {num}
                  </button>
                </div>
              ))}
            </div>
          </div>
          {/* Columna 3 */}
          <div className="w-full md:w-1/3 p-2">
            <div className="grid grid-cols-3 gap-2  p-2">
              {/* Distribución de los números en la columna 3 */}
              {numbers.slice(25).map((num, index) => (
                <div key={index} className="text-center">
                  <button
                    className={`w-full h-full p-2 rounded text-white ${
                      index % 2 === 0 ? "bg-red-500" : "bg-black"
                    }`}
                  >
                    {num}
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Predict;
