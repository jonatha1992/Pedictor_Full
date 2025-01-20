import React, { useEffect, useState } from "react";
import backgroundImage from "../assets/tablero.webp"; // Asegúrate de ajustar la ruta según la ubicación de tu imagen
import backgroundImage1 from "../assets/tablero1.jpg"; // Asegúrate de ajustar la ruta según la ubicación de tu imagen
import Probabilidades from "./Probabilidades";
import Notificaciones from "./Notificaciones";

const Predict = () => {
  const numbers = Array.from({ length: 37 }, (_, i) => i); // Array de 0 a 36
  const [notificaciones, setNotificaciones] = useState([]);
  const [numerosSeleccionados, setNumerosSeleccionados] = useState([]); // Nuevo estado

  // useEffect para llamar a fetchDataWithToken cuando se monte el componente
  useEffect(() => {}, []);

  const agregarNotificacion = (mensaje) => {
    setNotificaciones(prev => [...prev, mensaje]);
  };

  const handleNumeroClick = (numero) => {
    setNumerosSeleccionados(prev => [...prev, numero]);
  };

  return (
    <div className="md:h-screen">
      
      
      <div className="h-[50vh] md:h-1/2 flex flex-col md:flex-row">
        <div className="w-full h-full md:w-1/2 bg-green-200">
          <div
            className="text-center text-white bg-cover bg-center h-full"
            style={{ backgroundImage: `url(${backgroundImage1})` }}
          >
            <Probabilidades></Probabilidades>
          </div>
        </div>
        <div className=" w-full md:h-full h-[50vh] md:w-1/2 bg-green-200">
          <div
            className="text-center  text-white bg-cover bg-center h-full flex"
            style={{ backgroundImage: `url(${backgroundImage1})` }}
          >
            <Notificaciones notificaciones={notificaciones} />
          </div>
        </div>
      </div>

      {/* Parte inferior con tres columnas */}
      <div className="p-4 bg-green-800 md:h-1/2 md:flex md:flex-col  md:mt-0">
        <div className="flex flex-col md:flex-row items-center md:h-full">
          {/* Columna 1 */}
          <div className="w-full md:w-1/2 p-2 h-full overflow-y-auto ">
          <div className="flex flex-col h-full justify-end">
            <div className="grid md:grid-cols-10 grid-cols-5 gap-2 mb-20">
              {/* Distribución de los números en la columna 1 */}
              {numbers.slice(0, 37).map((num, index) => (
                <div
                  key={index}
                  className={`col-span-1 text-center ${
                    num === 0 ? "md:row-span-4" : ""
                  }`}
                >
                  <button
                    onClick={() => handleNumeroClick(num)}
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
          </div>
         
          <div className="w-full md:w-1/2 p-2 flex flex-row justify-between md:justify-around md:h-full">
            <div className="md:h-full flex flex-col w-full">
              <div className="w-full md:p-2 flex overflow-x-auto whitespace-nowrap overflow-hidden" 
                   style={{ scrollBehavior: 'smooth', borderRadius: '1rem', backgroundColor: '#7f1414ad' }} 
                   ref={(el) => el?.scrollTo(0, 0)}>
                <p className="text-white text-center flex items-center p2">Últimos resultados:</p>
                {numerosSeleccionados.slice().reverse().map((numero, index) => (
                  <div key={index} className="p-2 flex-shrink-0">
                    <button className="h-full rounded text-white bg-blue-500 min-w-[40px]">
                      {numero}
                    </button>
                  </div>
                ))}
              </div>

          
          <div className="flex justify-around mt-4">
            <div className="text-end pr-8">
              <p>Tipo de ruleta:</p>
              <p>Cantidad de vecinos:</p>
              <p>Limite de juego:</p>
              <p>Umbral de probabilidad:</p>
            </div>
            <div className="flex flex-col ">
              <button 
                className="mb-2 p-2 rounded text-white bg-red-500"
                onClick={() => agregarNotificacion("Juego iniciado")}
              >
                Iniciar Juego
              </button>
              <button 
                className="p-2 rounded text-white bg-black"
                onClick={() => agregarNotificacion("Juego reiniciado")}
              >
                Reiniciar Juego
              </button>
            </div>
          </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Predict;
