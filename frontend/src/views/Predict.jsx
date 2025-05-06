import React, { useEffect, useState, useRef } from "react";
import backgroundImage from "../assets/tablero.webp"; // Asegúrate de ajustar la ruta según la ubicación de tu imagen
import backgroundImage1 from "../assets/tablero1.jpg"; // Asegúrate de ajustar la ruta según la ubicación de tu imagen
import Probabilidades from "../components/Probabilidades";
import Notificaciones from "../components/Notificaciones";
import oro from "../assets/oro.webp";
import crupiers from "../assets/crupiers.webp"; // Añadir esta importación
import Modal from "../components/Modal"; // Asegúrate de ajustar la ruta
import axios from 'axios';

const Predict = () => {
  const numbers = Array.from({ length: 37 }, (_, i) => i); // Array de 0 a 36
  const [notificaciones, setNotificaciones] = useState([]);
  const [numerosSeleccionados, setNumerosSeleccionados] = useState([]);
  const [historial, setHistorial] = useState([]); // Historial de probabilidades acumuladas
  const [isOpen, setIsOpen] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [gameConfig, setGameConfig] = useState({
    tipo: "",
    nombre_ruleta: "",
    tardanza: 0,
    cantidad_vecinos: 0,
    umbral_probabilidad: 0,
    user: 2
  });
  // Llama al backend cuando hay suficientes números seleccionados
  useEffect(() => {
    const fetchProbabilidades = async () => {
      console.log("[Predict] numerosSeleccionados:", numerosSeleccionados);
      if (numerosSeleccionados.length >= 8) {
        console.log("[Predict] Enviando consulta al backend con:", numerosSeleccionados.slice(-8));
        try {
          const response = await axios.post("http://127.0.0.1:8000/api/games/predict/", {
            numeros: numerosSeleccionados.slice(-8),
            parametros: {
              numeros_anteriores: 8,
              tipo_ruleta: gameConfig.tipo || "Electromecanica"
            }
          });
          const probabilidades = response.data.probabilidades;
          console.log("[Predict] Respuesta del backend:", probabilidades);
          actualizarHistorial(probabilidades);
        } catch (error) {
          setNotificaciones(prev => [...prev, "Error al consultar el backend"]);
          console.error("[Predict] Error al consultar el backend:", error);
        }
      } else {
        console.log("[Predict] Menos de 8 números seleccionados, no se consulta el backend.");
      }
    };
    fetchProbabilidades();
    // eslint-disable-next-line
  }, [numerosSeleccionados]);

  // Actualiza el historial local acumulando probabilidad y repeticiones
  const actualizarHistorial = (predicciones) => {
    setHistorial(prevHistorial => {
      const nuevoHistorial = [...prevHistorial];
      predicciones.forEach(pred => {
        const idx = nuevoHistorial.findIndex(h => h.numero === pred.numero);
        if (idx !== -1) {
          nuevoHistorial[idx].probabilidadAcumulada += pred.probabilidad;
          nuevoHistorial[idx].repeticiones += 1;
        } else {
          nuevoHistorial.push({
            numero: pred.numero,
            probabilidadAcumulada: pred.probabilidad,
            repeticiones: 1
          });
        }
      });
      return nuevoHistorial;
    });
  };

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

      const response = await axios.post('http://127.0.0.1:8000/api/games/predict', gameConfig);
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
  useEffect(() => { }, []);

  const agregarNotificacion = (mensaje) => {
    setNotificaciones((prev) => [...prev, mensaje]);
  };

  const handleNumeroClick = (numero) => {
    setNumerosSeleccionados((prev) => [...prev, numero]);
  };

  return (
    <div className="md:h-screen">
      <div className="h-[40vh] md:h-1/2 flex flex-col md:flex-row">
        <div className="w-full h-full bg-green-200 md:w-1/2">
          <div
            className="h-full text-center text-white bg-center bg-cover"
            style={{ backgroundImage: `url(${backgroundImage1})` }}
          >
            <Probabilidades historial={historial} />
          </div>
        </div>
        <div className=" w-full md:h-full h-[50vh] md:w-1/2 bg-green-200">
          <div
            className="flex h-full text-center text-white bg-center bg-cover"
            style={{ backgroundImage: `url(${backgroundImage1})` }}
          >
            <Notificaciones notificaciones={notificaciones} />
          </div>
        </div>
      </div>

      <div className="p-4 bg-green-800 md:h-1/2 md:flex md:flex-col md:mt-0">
        <div
          ref={containerRef}
          className="flex flex-col-reverse items-center md:flex-row md:h-full"
          style={{ scrollBehavior: "smooth" }}
        >
          {/* Columna 1 */}
          <div className="w-full h-full p-2 md:w-1/2 ">
            <div className="   md:flex md:flex-col flex-row md:h-full overflow-y-auto h-[30vh] justify-center block">
              <div className="grid grid-cols-5 gap-2 md:grid-cols-10 ">
                {/* Distribución de los números en la columna 1 */}
                {numbers.slice(0, 37).map((num, index) => (
                  <div
                    key={index}
                    className={`col-span-1 text-center ${num === 0 ? "md:row-span-4" : ""
                      }`}
                  >
                    <button
                      onClick={() => handleNumeroClick(num)}
                      className={`w-full h-full p-2 rounded text-white ${num === 0
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
          <div className="flex flex-row justify-between w-full p-2 bg-green-800 md:w-1/2 md:justify-around md:h-full">
            <div className="flex flex-col w-full md:h-full">
              <div ref={scrollContainerRef} className="flex w-full md:p-2 ">
                <div
                  className="flex flex-col w-full"
                  style={{ backgroundImage: `url(${oro})` }}
                >
                  <p className="px-2 text-white whitespace-nowrap">
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
                  className="flex items-center justify-between w-full p-3 font-bold text-white bg-green-700 rounded-t"
                  onClick={() => setIsOpen(!isOpen)}
                >
                  <span>Configuración del juego</span>
                  <span
                    className={`transform transition-transform duration-200 ${isOpen ? "rotate-180" : ""
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
                        className="block w-full p-2 mt-1 border border-gray-300 rounded-md"
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
                        className="block w-full p-2 mt-1 border border-gray-300 rounded-md"
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
                        className="block w-full p-2 mt-1 border border-gray-300 rounded-md"
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
                        className="block w-full p-2 mt-1 border border-gray-300 rounded-md"
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
                        className="block w-full p-2 mt-1 border border-gray-300 rounded-md"
                        required
                      />
                    </div>

                    <button
                      onClick={handleSaveConfig}
                      type="submit"
                      className="w-full py-2 text-white bg-green-500 rounded hover:bg-green-600"
                    >
                      Guardar Configuración
                    </button>
                  </form>
                </Modal>
                {/* Contenido del acordeón */}
                <div
                  className={`transition-all duration-300 ease-in-out overflow-hidden ${isOpen ? "max-h-[200px] opacity-100" : "max-h-0 opacity-0"
                    }`}
                >
                  <div className="p-4 bg-green-900 rounded-b">
                    <div className="flex justify-around">
                      <div className="flex flex-col items-start justify-center pr-8 text-xs font-bold text-white">
                        <p>Tipo de ruleta: {gameConfig.tipo}</p>
                        <p>Cantidad de vecinos: {gameConfig.cantidad_vecinos}</p>
                        <p>Nombre de ruleta: {gameConfig.nombre_ruleta}</p>
                        <p>Umbral de probabilidad: {gameConfig.umbral_probabilidad}</p>
                      </div>
                      <div className="flex flex-col">
                        <button
                          className="p-2 font-bold text-red-600 transition-all bg-left bg-cover rounded hover:opacity-90"
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
