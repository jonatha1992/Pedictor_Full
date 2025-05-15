
import React, { useEffect, useState, useRef } from "react";
import backgroundImage1 from "../assets/tablero1.jpg";
import axios from 'axios';
import ConfiguracionJuego from "../components/ConfiguracionJuego";
import EstadisticasJuego from "../components/EstadisticasJuego";
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
  const [contador, setContador] = useState({
    ingresados: 0,
    jugados: 0,
    aciertos_totales: 0,
    aciertos_vecinos: 0,
    Sin_salir_nada: 0,
    efectividad: "0"
  });
  const [historialPredecidos, setHistorialPredecidos] = useState([]); // [{numero, probabilidad}]
  const [numerosAJugar, setNumerosAJugar] = useState([]); // [{numero, probabilidad, tardancia, repetido}]
  const [aciertos, setAciertos] = useState([]);
  const [aciertosVecinos, setAciertosVecinos] = useState([]);
  const [isOpen, setIsOpen] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [gameConfig, setGameConfig] = useState({
    tipo: "Electromecanica",
    nombre_ruleta: "Roling money",
    tardanza: 5,
    cantidad_vecinos: 1,
    umbral_probabilidad: 50,
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
    // Copias para no mutar los estados directamente
    let nuevoHistorial = [...historialPredecidos];
    let nuevosAJugar = [...numerosAJugar];

    predicciones.forEach(pred => {
      let probabilidad = pred.probabilidad;
      if (typeof probabilidad === 'string') probabilidad = parseFloat(probabilidad);
      // Multiplicar por 100 para escalar a porcentaje
      probabilidad = probabilidad * 100;
      if (probabilidad > 100) probabilidad = 100;
      if (probabilidad < 0) probabilidad = 0;

      // Buscar en numerosAJugar
      let idxJugar = nuevosAJugar.findIndex(n => n.numero === pred.numero);
      let idxHist = nuevoHistorial.findIndex(h => h.numero === pred.numero);

      // Sumar probabilidad acumulada
      if (idxJugar !== -1) {
        nuevosAJugar[idxJugar].probabilidad += probabilidad;
        if (nuevosAJugar[idxJugar].probabilidad > 100) nuevosAJugar[idxJugar].probabilidad = 100;
      } else if (idxHist !== -1) {
        nuevoHistorial[idxHist].probabilidad += probabilidad;
        if (nuevoHistorial[idxHist].probabilidad > 100) nuevoHistorial[idxHist].probabilidad = 100;
      } else {
        // Si no existe en ninguna lista, agregar al historial
        if (probabilidad > 0) {
          nuevoHistorial.push({ numero: pred.numero, probabilidad });
        }
      }
    });

    // Mover del historial a jugar si supera el umbral
    nuevoHistorial = nuevoHistorial.filter(h => {
      if (h.probabilidad >= umbral) {
        // Si ya está en jugar, no lo agregues de nuevo
        if (!nuevosAJugar.some(n => n.numero === h.numero)) {
          nuevosAJugar.push({
            numero: h.numero,
            probabilidad: h.probabilidad,
            tardancia: 0,
            repetido: false
          });
        }
        return false;
      }
      return true;
    });

    // Limpiar historial de probabilidad <= 0
    nuevoHistorial = nuevoHistorial.filter(h => h.probabilidad > 0);

    setHistorialPredecidos(nuevoHistorial);
    setNumerosAJugar(nuevosAJugar);
    // Consola: Probabilidad acumulada en memoria (historial y numerosAJugar)
    const acumulada = {
      historial: nuevoHistorial,
      numerosAJugar: nuevosAJugar
    };
    console.log("[Probabilidad acumulada en memoria]", acumulada);
    // Consola: Números a jugar finales
    console.log("[Números a jugar FINAL]", nuevosAJugar);
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
      let actualizado = [...prev];
      const idx = actualizado.findIndex(n => n.numero === numero);
      let vecinosPegados = [];
      let nuevosAciertos = 0;
      let nuevosAciertosVecinos = 0;
      let nuevosJugados = 0;
      if (idx !== -1) {
        setAciertos(a => [...a, numero]);
        agregarNotificacion(`¡Acierto! Número: ${numero}`);
        nuevosAciertos = 1;
        nuevosJugados = 1;
        // Eliminar el número acertado
        actualizado = actualizado.filter(n => n.numero !== numero);
        // Eliminar vecinos si están en la lista
        const vecinos = getVecinos(numero, gameConfig.cantidad_vecinos);
        vecinos.forEach(vecino => {
          if (actualizado.some(n => n.numero === vecino)) {
            actualizado = actualizado.filter(n => n.numero !== vecino);
            vecinosPegados.push(vecino);
          }
        });
        if (vecinosPegados.length > 0) {
          setAciertosVecinos(a => [...a, ...vecinosPegados.map(v => ({ numero: v, vecinoDe: numero }))]);
          agregarNotificacion(`¡Se pegó un vecino! Números: ${vecinosPegados.map(v => `${v} (vecino de ${numero})`).join(', ')}`);
          setTimeout(() => setAciertosVecinos([]), 5000);
          nuevosAciertosVecinos = vecinosPegados.length;
          nuevosJugados += vecinosPegados.length;
        }
      } else {
        // Chequear si es vecino de algún número jugado
        let aciertoVecino = false;
        let vecinoPegado = null;
        for (let jugado of actualizado) {
          const vecinos = getVecinos(jugado.numero, gameConfig.cantidad_vecinos);
          if (vecinos.includes(numero)) {
            if (!aciertosVecinos.some(v => v.numero === numero) && !aciertos.includes(numero)) {
              aciertoVecino = true;
              vecinoPegado = jugado.numero;
              break;
            }
          }
        }
        if (aciertoVecino && vecinoPegado !== null) {
          setAciertosVecinos(a => [...a, { numero, vecinoDe: vecinoPegado }]);
          agregarNotificacion(`¡Se pegó el ${numero}! (vecino de ${vecinoPegado})`);
          setTimeout(() => setAciertosVecinos([]), 5000);
          // Eliminar el vecino pegado
          actualizado = actualizado.filter(n => n.numero !== vecinoPegado);
          nuevosAciertosVecinos = 1;
          nuevosJugados = 1;
        } else {
          // Si no es acierto ni vecino, aumentar tardancia de todos
          actualizado = actualizado.map(n => ({ ...n, tardancia: n.tardancia + 1 }));
        }
      }
      // Eliminar los que superan el límite de tardanza
      const limite = gameConfig.tardanza || 7;
      actualizado = actualizado.filter(n => n.tardancia <= limite);

      // Actualizar el contador de estadísticas
      setContador(prev => {
        const nuevosIngresados = prev.ingresados + 1;
        const nuevosJugadosTot = prev.jugados + nuevosJugados;
        const nuevosAciertosTot = prev.aciertos_totales + nuevosAciertos;
        const nuevosAciertosVecinosTot = prev.aciertos_vecinos + nuevosAciertosVecinos;
        // Efectividad: aciertos_totales / jugados * 100
        const efectividad = nuevosJugadosTot > 0 ? `${Math.round((nuevosAciertosTot / nuevosJugadosTot) * 100)}` : "0";
        return {
          ...prev,
          ingresados: nuevosIngresados,
          jugados: nuevosJugadosTot,
          aciertos_totales: nuevosAciertosTot,
          aciertos_vecinos: nuevosAciertosVecinosTot,
          efectividad,
        };
      });
      return actualizado;
    });
  };

  return (
    <div className="min-h-screen px-2 py-8 bg-gradient-to-br from-gray-900 via-green-900 to-black md:px-8">
      {showConfigWarning && (
        <div className="p-4 mb-4 font-bold text-center text-white bg-red-600 border-2 border-red-300 rounded-lg shadow-lg animate-pulse">
          Debes elegir los parámetros de juego antes de comenzar a jugar.
        </div>
      )}
      <div className="grid w-full max-w-6xl grid-cols-1 grid-rows-4 gap-6 mx-auto md:grid-cols-2 md:grid-rows-2">
        {/* Arriba Izquierda: Configuración del juego */}
        <div className="flex flex-row gap-2">
          <ConfiguracionJuego
            isOpen={isOpen}
            setIsOpen={setIsOpen}
            isModalOpen={isModalOpen}
            setIsModalOpen={setIsModalOpen}
            gameConfig={gameConfig}
            handleInputChange={handleInputChange}
            handleSubmit={handleSubmit}
            handleSaveConfig={handleSaveConfig}
          />
          <div className="flex-1">
            <EstadisticasJuego contador={contador} />
          </div>
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
    </div >
  );



};

export default Predict;
