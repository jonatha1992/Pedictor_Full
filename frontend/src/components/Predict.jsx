import React, { useEffect, useState, useRef } from "react";
import backgroundImage from "../assets/tablero.webp"; // Asegúrate de ajustar la ruta según la ubicación de tu imagen
import backgroundImage1 from "../assets/tablero1.jpg"; // Asegúrate de ajustar la ruta según la ubicación de tu imagen
import Probabilidades from "./Probabilidades";
import Notificaciones from "./Notificaciones";
import oro from "../assets/oro.webp";
import crupiers from "../assets/crupiers.webp"; // Añadir esta importación
import Modal from "./Modal"; // Asegúrate de ajustar la ruta
import axios from 'axios';

const Predict = () => {
  const numbers = Array.from({ length: 37 }, (_, i) => i); // Array de 0 a 36
  const [notificaciones, setNotificaciones] = useState([]);
  const [numerosSeleccionados, setNumerosSeleccionados] = useState([]); // Nuevo estado
  const [isOpen, setIsOpen] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [gameConfig, setGameConfig] = useState({
    tipo: "",
    nombre_ruleta: "",
    tardanza: 0,
    cantidad_vecinos: 0,
    umbral_probabilidad: 0,
    user:2
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setGameConfig({
      ...gameConfig,
      [name]: value,
    });
  };

  const handleSaveConfig = async () => {
    try {

    console.log("Configuración del juego:", gameConfig);
    
      const response = await axios.post('http://127.0.0.1:8000/api/games', gameConfig);
      console.log(response.data); // Puedes manejar la respuesta de la API aquí
    } catch (error) {
      console.error(error);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Configuración del juego:", gameConfig);
    setIsModalOpen(false); // Cierra el modal después de enviar
  };

  // Agregar una referencia al contenedor
  const containerRef = useRef(null);

  // Agregar una referencia para el contenedor de números
  const scrollContainerRef = useRef(null);

  // Agregar useEffect para controlar el scroll
  useEffect(() => {
    if (containerRef.current) {
      containerRef.current.scrollTop = 0;
    }
  }, [numerosSeleccionados]);

  // Efecto para mantener el scroll al inicio cuando se agregan nuevos números
  useEffect(() => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollLeft = 0;
    }
  }, [numerosSeleccionados]);

  // useEffect para llamar a fetchDataWithToken cuando se monte el componente
  useEffect(() => {}, []);

  const agregarNotificacion = (mensaje) => {
    setNotificaciones((prev) => [...prev, mensaje]);
  };

  const handleNumeroClick = (numero) => {
    setNumerosSeleccionados((prev) => [...prev, numero]);
  };

  return (
    <div className="md:h-screen">
      <div className="h-[40vh] md:h-1/2 flex flex-col md:flex-row">
        <div className="w-full h-full md:w-1/2  bg-green-200">
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

      <div className="p-4 bg-green-800 md:h-1/2 md:flex md:flex-col  md:mt-0">
        <div
          ref={containerRef}
          className=" flex flex-col-reverse  md:flex-row items-center md:h-full"
          style={{ scrollBehavior: "smooth" }}
        >
          {/* Columna 1 */}
          <div className="w-full md:w-1/2 p-2 h-full  ">
            <div className="   md:flex md:flex-col flex-row md:h-full overflow-y-auto h-[30vh] justify-center block">
              <div className="grid md:grid-cols-10 grid-cols-5 gap-2 ">
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

          {/* Columna 2 - Panel de control */}
          <div className="w-full md:w-1/2 p-2 flex flex-row justify-between md:justify-around md:h-full bg-green-800">
            <div className="md:h-full flex flex-col w-full">
              <div ref={scrollContainerRef} className="w-full md:p-2 flex ">
                <div
                  className="flex flex-col w-full"
                  style={{ backgroundImage: `url(${oro})` }}
                >
                  <p className="text-white whitespace-nowrap px-2">
                    Últimos resultados:
                  </p>
                  <div
                    className="flex flex-row overflow-x-auto whitespace-nowrap "
                    style={{
                      scrollBehavior: "smooth",
                      borderRadius: "1rem",
                      msOverflowStyle: "none", // Para IE y Edge
                      scrollbarWidth: "none", // Para Firefox
                    }}
                  >
                    {numerosSeleccionados
                      .slice()
                      .reverse()
                      .map((numero, index) => (
                        <div key={index} className="p-1">
                          <button className="h-8 w-8 rounded text-white flex items-center justify-center  border border-solid border-[#d69747]">
                            {numero}
                          </button>
                        </div>
                      ))}
                  </div>
                </div>
              </div>

              <div className="w-full mt-2">
                {/* Botón del acordeón */}
                <button
                  className="w-full p-3 bg-green-700 text-white font-bold rounded-t flex justify-between items-center"
                  onClick={() => setIsOpen(!isOpen)}
                >
                  <span>Configuración del juego</span>
                  <span
                    className={`transform transition-transform duration-200 ${
                      isOpen ? "rotate-180" : ""
                    }`}
                  >
                    ▼
                  </span>
                </button>
                <Modal
                  isOpen={isModalOpen}
                  onClose={() => setIsModalOpen(false)}
                >
                  <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700">
                        Tipo de Ruleta
                      </label>
                      <input
                        type="text"
                        name="tipo"
                        value={gameConfig.tipo}
                        onChange={handleInputChange}
                        className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700">
                        Nombre de la Ruleta
                      </label>
                      <input
                        type="text"
                        name="nombre_ruleta"
                        value={gameConfig.nombre_ruleta}
                        onChange={handleInputChange}
                        className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700">
                        Tardanza (en segundos)
                      </label>
                      <input
                        type="number"
                        name="tardanza"
                        value={gameConfig.tardanza}
                        onChange={handleInputChange}
                        className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700">
                        Cantidad de Vecinos
                      </label>
                      <input
                        type="number"
                        name="cantidad_vecinos"
                        value={gameConfig.cantidad_vecinos}
                        onChange={handleInputChange}
                        className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700">
                        Umbral de Probabilidad
                      </label>
                      <input
                        type="number"
                        name="umbral_probabilidad"
                        value={gameConfig.umbral_probabilidad}
                        onChange={handleInputChange}
                        step="0.01"
                        className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
                        required
                      />
                    </div>

                    <button
                    onClick={handleSaveConfig}
                      type="submit"
                      className="w-full bg-green-500 text-white py-2 rounded hover:bg-green-600"
                    >
                      Guardar Configuración
                    </button>
                  </form>
                </Modal>
                {/* Contenido del acordeón */}
                <div
                  className={`transition-all duration-300 ease-in-out overflow-hidden ${
                    isOpen ? "max-h-[200px] opacity-100" : "max-h-0 opacity-0"
                  }`}
                >
                  <div className="bg-green-900 p-4 rounded-b">
                    <div className="flex justify-around">
                      <div className="flex flex-col  justify-center text-white text-xs font-bold pr-8 items-start">
                        <p>Tipo de ruleta: {gameConfig.tipo}</p>
                        <p>Cantidad de vecinos: {gameConfig.cantidad_vecinos}</p>
                        <p>Nombre de ruleta: {gameConfig.nombre_ruleta}</p>
                        <p>Umbral de probabilidad: {gameConfig.umbral_probabilidad}</p>
                      </div>
                      <div className="flex flex-col">
                        <button
                          className="p-2 rounded text-red-600 hover:opacity-90 transition-all bg-cover bg-left font-bold"
                          onClick={() => setIsModalOpen(true)}
                          style={{
                            backgroundImage: `url(${crupiers})`,
                            backgroundPositionY: "top",
                            textShadow:
                              "#ffffff 1px -1px 4px, #ffffff 1px -1px 4px, #ffffff 1px -1px 4px",
                            boxShadow:
                              "rgba(0, 0, 0, 0.75) -13px 15px 11px 0px",
                          }}
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
        </div>
      </div>
    </div>
  );
};

export default Predict;
