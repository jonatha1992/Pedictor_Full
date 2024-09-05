import React, { useEffect } from "react";
import backgroundImage from "../assets/tablero.webp"; // Asegúrate de ajustar la ruta según la ubicación de tu imagen
import backgroundImage1 from "../assets/tablero1.jpg"; // Asegúrate de ajustar la ruta según la ubicación de tu imagen
import Probabilidades from "./Probabilidades";

const Predict = () => {
  const numbers = Array.from({ length: 37 }, (_, i) => i); // Array de 0 a 36

  // useEffect para llamar a fetchDataWithToken cuando se monte el componente
  useEffect(() => {}, []);

  return (
    <div className="md:h-screen">
      {/* Parte superior dividida en dos columnas */}
      <div className="flex flex-col md:flex-row md:h-1/2">
        <div className="w-full md:w-1/2">
          <div
            className="text-center py-20 text-white bg-cover bg-center h-full"
            style={{ backgroundImage: `url(${backgroundImage1})` }}
          ></div>
        </div>
        <div className="w-full md:w-1/2 bg-green-200">
          <div
            className="text-center text-white bg-cover bg-center h-full"
            style={{ backgroundImage: `url(${backgroundImage1})` }}
          >
            <Probabilidades></Probabilidades>
          </div>
        </div>
      </div>

      {/* Parte inferior con tres columnas */}
      <div className="p-4 bg-green-800 ">
        <div className="flex flex-col md:flex-row items-center">
          {/* Columna 1 */}
          <div className="w-full md:w-1/2 p-2 ">
            <div className="grid md:grid-cols-10 grid-cols-5 gap-2">
              {/* Distribución de los números en la columna 1 */}
              {numbers.slice(0, 37).map((num, index) => (
                <div
                  key={index}
                  className={`col-span-1 text-center ${
                    num === 0 ? "md:row-span-4" : ""
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
          <div className="w-full md:w-1/2 p-2 flex h-full">
            <div>
              <p>Tipo de ruleta:</p>
              <p>Cantidad de vecinos:</p>
              <p>Limite de juego:</p>
              <p>Umbral de probabilidad:</p>
            </div>
            <div className="flex flex-col">
              <button className=" h-full p-2 rounded text-white bg-red-500">
                iniciar Juego
              </button>
              <button className=" h-full p-2 rounded text-white bg-black ">
                Reiniciar Juego
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Predict;
