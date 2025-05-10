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

  // Redirigir a configuración si no está configurado antes de jugar
  const isConfigReady = gameConfig.tipo && gameConfig.nombre_ruleta && gameConfig.tardanza > 0 && gameConfig.cantidad_vecinos > 0 && gameConfig.umbral_probabilidad > 0;
  const [showConfigWarning, setShowConfigWarning] = useState(false);


  // Mostrar el modal automáticamente si la configuración no está lista
  useEffect(() => {
    if (!isConfigReady) {
      setIsModalOpen(true);
    }
  }, [isConfigReady]);

  useEffect(() => {
    if (!isConfigReady && numerosSeleccionados.length > 0) {
      setShowConfigWarning(true);
    } else {
      setShowConfigWarning(false);
    }
  }, [isConfigReady, numerosSeleccionados]);

  // Llama al backend cuando hay suficientes números seleccionados y la config está lista
  useEffect(() => {
    if (!isConfigReady) return;
    const fetchProbabilidades = async () => {
      if (numerosSeleccionados.length >= 8) {
        try {
          console.log("Enviando consulta al backend con:", {
            numeros: numerosSeleccionados.slice(-8),
            parametros: {
              numeros_anteriores: 8,
              tipo_ruleta: gameConfig.tipo || "Electromecanica"
            }
          });
          const response = await axios.post("http://127.0.0.1:8000/api/games/predict/", {
            numeros: numerosSeleccionados.slice(-8),
            parametros: {
              numeros_anteriores: 8,
              tipo_ruleta: gameConfig.tipo || "Electromecanica"
            }
          });
          console.log("Respuesta del backend:", response.data);
          const probabilidades = response.data.probabilidades;
          actualizarHistorial(probabilidades);
        } catch (error) {
          setNotificaciones(prev => [...prev, "Error al consultar el backend"]);
          console.error("Error al consultar el backend:", error);
        }
      }
    };
    fetchProbabilidades();
    // eslint-disable-next-line
  }, [numerosSeleccionados, isConfigReady]);

  // Actualiza el historial local acumulando probabilidad y repeticiones
  const actualizarHistorial = (predicciones) => {
    console.log("Probabilidades recibidas para actualizarHistorial:", predicciones);
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
      console.log("Historial actualizado:", nuevoHistorial);
      return nuevoHistorial;
    });
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setGameConfig({
      ...gameConfig,
      [name]: value,
    });
    // Guardar el umbral en localStorage para que Probabilidades.jsx lo use
    if (name === 'umbral_probabilidad') {
      localStorage.setItem('umbral_probabilidad', value);
    }
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
      {showConfigWarning && (
        <div className="p-4 mb-4 font-bold text-center text-white bg-red-500 rounded animate-pulse">
          Debes elegir los parámetros de juego antes de comenzar a jugar.
        </div>
      )}
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
        <TableroRuleta handleNumeroClick={isConfigReady ? handleNumeroClick : () => setShowConfigWarning(true)} />

        {/* Abajo Derecha: Números jugados */}
        <NumerosJugados numerosSeleccionados={numerosSeleccionados} />
      </div>
    </div>
  );
};

export default Predict;
