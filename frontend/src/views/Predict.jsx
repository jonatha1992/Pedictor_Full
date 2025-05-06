import React, { useEffect, useState, useRef } from "react";
import backgroundImage1 from "../assets/tablero1.jpg"; // Asegúrate de ajustar la ruta según la ubicación de tu imagen
import axios from 'axios';
import ConfiguracionJuego from "../components/ConfiguracionJuego";
import ProbabilidadAcumulada from "../components/ProbabilidadAcumulada";
import TableroRuleta from "../components/TableroRuleta";
import NumerosJugados from "../components/NumerosJugados";
import crupiers from "../assets/crupiers.webp";

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
    <div className="p-2 bg-green-800 md:h-screen md:p-6">
      <div className="grid w-full h-full grid-cols-1 grid-rows-4 gap-4 md:grid-cols-2 md:grid-rows-2">
        {/* Arriba Izquierda: Configuración del juego */}
        <ConfiguracionJuego
          isOpen={isOpen}
          setIsOpen={setIsOpen}
          isModalOpen={isModalOpen}
          setIsModalOpen={setIsModalOpen}
          gameConfig={gameConfig}
          handleInputChange={handleInputChange}
          handleSubmit={handleSubmit}
          handleSaveConfig={handleSaveConfig}
          crupiers={crupiers}
        />

        {/* Arriba Derecha: Probabilidad acumulada por tirada */}
        <ProbabilidadAcumulada
          historial={historial}
          backgroundImage1={backgroundImage1}
          maxRepeticiones={gameConfig.cantidad_vecinos}
        />

        {/* Abajo Izquierda: Tablero de ruleta */}
        <TableroRuleta handleNumeroClick={handleNumeroClick} />

        {/* Abajo Derecha: Números jugados */}
        <NumerosJugados numerosSeleccionados={numerosSeleccionados} />
      </div>
    </div>
  );
};

export default Predict;
