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
    tipo: "Electromecanica",
    nombre_ruleta: "Roling money",
    tardanza: 7,
    cantidad_vecinos: 1,
    umbral_probabilidad: 20,
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

  // Actualiza el historial local acumulando probabilidad
  const actualizarHistorial = (predicciones) => {
    setHistorial(prevHistorial => {
      const nuevoHistorial = [...prevHistorial];
      const umbral = Number(localStorage.getItem('umbral_probabilidad')) || 0;
      const tardanzaMax = Number(localStorage.getItem('tardanza_max')) || 7; // o usa gameConfig.tardanza si lo tienes accesible
      predicciones.forEach(pred => {
        let probabilidad = pred.probabilidad;
        if (typeof probabilidad === 'string') probabilidad = parseInt(probabilidad);
        if (typeof probabilidad === 'number' && probabilidad <= 1) probabilidad = Math.round(probabilidad * 100);
        if (probabilidad > 100) probabilidad = 100;
        if (probabilidad < 0) probabilidad = 0;
        const idx = nuevoHistorial.findIndex(h => h.numero === pred.numero);
        // Si ya existe en historial
        if (idx !== -1) {
          // Si ya está apostando (superó umbral antes)
          if (nuevoHistorial[idx].probabilidadAcumulada >= umbral) {
            // Aumentar tardanza
            nuevoHistorial[idx].tardanza = (nuevoHistorial[idx].tardanza || 0) + 1;
            // Si supera la tardanza máxima, reiniciar
            if (nuevoHistorial[idx].tardanza > tardanzaMax) {
              nuevoHistorial[idx].tardanza = 0;
              nuevoHistorial[idx].probabilidadAcumulada = 0;
            } else {
              nuevoHistorial[idx].probabilidadAcumulada += probabilidad;
            }
          } else {
            // Si no está apostando, solo suma probabilidad y reinicia tardanza
            nuevoHistorial[idx].probabilidadAcumulada += probabilidad;
            nuevoHistorial[idx].tardanza = 0;
          }
        } else {
          // Nuevo número
          nuevoHistorial.push({
            numero: pred.numero,
            probabilidadAcumulada: probabilidad,
            tardanza: 0
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
    <div className="min-h-screen px-2 py-8 bg-gradient-to-br from-gray-900 via-green-900 to-black md:px-8">
      {showConfigWarning && (
        <div className="p-4 mb-4 font-bold text-center text-white bg-red-600 border-2 border-red-300 rounded-lg shadow-lg animate-pulse">
          Debes elegir los parámetros de juego antes de comenzar a jugar.
        </div>
      )}
      <div className="grid w-full h-full max-w-6xl grid-cols-1 grid-rows-4 gap-6 mx-auto md:grid-cols-2 md:grid-rows-2">
        {/* Arriba Izquierda: Configuración del juego */}
        <div className="border border-green-700 shadow-2xl rounded-xl bg-gradient-to-br from-green-800 to-green-900">
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
        </div>

        {/* Arriba Derecha: Probabilidad acumulada por tirada */}
        <div className="flex flex-col border border-green-700 shadow-2xl rounded-xl bg-gradient-to-br from-gray-800 to-green-800">
          <ProbabilidadAcumulada
            historial={historial}
            backgroundImage1={backgroundImage1}
            maxRepeticiones={gameConfig.cantidad_vecinos}
          />
        </div>

        {/* Abajo Izquierda: Tablero de ruleta */}
        <div className="flex flex-col items-center justify-center border border-green-700 shadow-2xl rounded-xl bg-gradient-to-br from-gray-900 to-green-900">
          <TableroRuleta handleNumeroClick={isConfigReady ? handleNumeroClick : () => setShowConfigWarning(true)} />
        </div>

        {/* Abajo Derecha: Números jugados */}
        <div className="flex flex-col items-center justify-center border border-green-700 shadow-2xl rounded-xl bg-gradient-to-br from-gray-900 to-green-900">
          <NumerosJugados numerosSeleccionados={numerosSeleccionados} />
        </div>
      </div>
    </div>
  );
};

export default Predict;
