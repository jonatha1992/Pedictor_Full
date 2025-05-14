
import React, { useEffect, useState, useRef } from "react";
import backgroundImage1 from "../assets/tablero1.jpg";
import axios from 'axios';
import ConfiguracionJuego from "../components/ConfiguracionJuego";
import ProbabilidadAcumulada from "../components/ProbabilidadAcumulada";
import TableroRuleta from "../components/TableroRuleta";
import NumerosJugados from "../components/NumerosJugados";
import { vecino1lugar, vecino2lugar, vecinos3lugar, Vecino4lugar } from "../config/vecinos";
import crupiers from "../assets/crupiers.webp";

const Predict = () => {
  const numbers = Array.from({ length: 37 }, (_, i) => i); // Array de 0 a 36
  const [notificaciones, setNotificaciones] = useState([]);
  const [numerosSeleccionados, setNumerosSeleccionados] = useState([]);
  // --- NUEVOS ESTADOS PARA LOGICA DE DOS LISTAS Y ACIERTOS ---
  const [historialPredecidos, setHistorialPredecidos] = useState([]); // [{numero, probabilidad}]
  const [numerosAJugar, setNumerosAJugar] = useState([]); // [{numero, probabilidad, tardancia, repetido}]
  const [aciertos, setAciertos] = useState([]);
  const [aciertosVecinos, setAciertosVecinos] = useState([]);
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


  // --- LOGICA DE DOS LISTAS Y ACIERTOS ---
  useEffect(() => {
    if (!isConfigReady) return;
    const fetchProbabilidades = async () => {
      if (numerosSeleccionados.length >= 8) {
        try {
          console.log("[Consulta] Enviando al backend:", {
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
          console.log("[Consulta] Respuesta del backend:", response.data);
          const probabilidades = response.data.probabilidades;
          actualizarListas(probabilidades);
        } catch (error) {
          setNotificaciones(prev => [...prev, "Error al consultar el backend"]);
          console.error("[Consulta] Error al consultar el backend:", error);
        }
      } else {
        console.log("[Consulta] No se consulta al backend, faltan números seleccionados:", numerosSeleccionados);
      }
    };
    fetchProbabilidades();
    // eslint-disable-next-line
  }, [numerosSeleccionados, isConfigReady]);

  // Actualiza historialPredecidos y numerosAJugar
  const actualizarListas = (predicciones) => {
    console.log("[ActualizarListas] Predicciones recibidas:", predicciones);
    const umbral = Number(gameConfig.umbral_probabilidad) || 0;
    let nuevoHistorial = [...historialPredecidos];
    let nuevosAJugar = [...numerosAJugar];

    predicciones.forEach(pred => {
      let probabilidad = pred.probabilidad;
      if (typeof probabilidad === 'string') probabilidad = parseInt(probabilidad);
      if (typeof probabilidad === 'number' && probabilidad <= 1) probabilidad = Math.round(probabilidad * 100);
      if (probabilidad > 100) probabilidad = 100;
      if (probabilidad < 0) probabilidad = 0;
      const idx = nuevoHistorial.findIndex(h => h.numero === pred.numero);
      if (idx !== -1) {
        nuevoHistorial[idx].probabilidad = probabilidad;
      } else {
        nuevoHistorial.push({ numero: pred.numero, probabilidad });
      }
    });

    // Mover a jugados si supera umbral
    nuevoHistorial = nuevoHistorial.filter(h => {
      if (h.probabilidad >= umbral) {
        if (!nuevosAJugar.some(j => j.numero === h.numero)) {
          nuevosAJugar.push({ ...h, tardancia: 0, repetido: false });
        }
        return false;
      }
      return true;
    });

    console.log("[ActualizarListas] Nuevo historial:", nuevoHistorial);
    console.log("[ActualizarListas] Números a jugar:", nuevosAJugar);
    setHistorialPredecidos(nuevoHistorial);
    setNumerosAJugar(nuevosAJugar);
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



  // Utilidad para obtener vecinos según la config
  const getVecinos = (numero, cantidadVecinos) => {
    let vecinos = [];
    if (cantidadVecinos >= 1 && vecino1lugar[numero]) vecinos.push(...vecino1lugar[numero]);
    if (cantidadVecinos >= 2 && vecino2lugar[numero]) vecinos.push(...vecino2lugar[numero]);
    if (cantidadVecinos >= 3 && vecinos3lugar[numero]) vecinos.push(...vecinos3lugar[numero]);
    if (cantidadVecinos >= 4 && Vecino4lugar[numero]) vecinos.push(...Vecino4lugar[numero]);
    return vecinos;
  };

  // Procesar número ingresado y marcar aciertos y vecinos
  const handleNumeroClick = (numero) => {
    setNumerosSeleccionados((prev) => [...prev, numero]);

    setNumerosAJugar(prev => {
      const idx = prev.findIndex(n => n.numero === numero);
      if (idx !== -1) {
        setAciertos(a => [...a, numero]);
        console.log(`[Acierto Directo] Número ${numero} estaba en jugados. Lista antes:`, prev.map(n => n.numero));
        // Eliminar de la lista de jugados
        return prev.filter((_, i) => i !== idx);
      }
      // Chequear si es vecino de algún número jugado (según la config actual)
      // Solo si NO es acierto directo y NO está ya en aciertosVecinos
      let aciertoVecino = false;
      let vecinoPegado = null;
      for (let jugado of prev) {
        // Solo revisa vecinos de los números actualmente en juego
        const vecinos = getVecinos(jugado.numero, gameConfig.cantidad_vecinos);
        console.log(`[Vecino] Revisando si ${numero} es vecino de ${jugado.numero}. Vecinos:`, vecinos);
        if (vecinos.includes(numero)) {
          // Chequear que no esté ya en aciertosVecinos ni en aciertos
          if (!aciertosVecinos.some(v => v.numero === numero) && !aciertos.includes(numero)) {
            aciertoVecino = true;
            vecinoPegado = jugado.numero;
            break;
          }
        }
      }
      if (aciertoVecino) {
        setAciertosVecinos(a => [...a, { numero, vecinoDe: vecinoPegado }]);
        console.log(`[Acierto Vecino] Número ${numero} es vecino de ${vecinoPegado}. Lista jugados:`, prev.map(n => n.numero));
      }
      // Si no es acierto ni vecino, aumentar tardancia y eliminar si supera el límite
      return prev.map(n => {
        if (n.numero !== numero) {
          const nuevaTardancia = n.tardancia + 1;
          return { ...n, tardancia: nuevaTardancia };
        }
        return n;
      }).filter(n => n.tardancia <= (gameConfig.tardanza || 7));
    });
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
            historial={numerosAJugar}
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
          <NumerosJugados numerosSeleccionados={numerosSeleccionados} aciertos={aciertos} aciertosVecinos={aciertosVecinos} />
        </div>
      </div>
    </div>
  );
};

export default Predict;
