
import React, { useEffect, useState } from "react";
import { FaBackspace } from 'react-icons/fa';




// Permite que el prop sea opcional para evitar error si no se pasa
const NumerosJugados = ({ numerosSeleccionados, aciertos = [], aciertosVecinos = [], onBorrarUltimo = () => { } }) => {
    const [mensajePegado, setMensajePegado] = useState(false);

    useEffect(() => {
        if (numerosSeleccionados.length < 2) {
            setMensajePegado(false);
            return;
        }
        const ultimo = numerosSeleccionados[numerosSeleccionados.length - 1];
        const yaEstaba = numerosSeleccionados.slice(0, -1).includes(ultimo);
        setMensajePegado(yaEstaba);
        if (yaEstaba) {
            const timer = setTimeout(() => setMensajePegado(false), 2000);
            return () => clearTimeout(timer);
        }
    }, [numerosSeleccionados]);
    return (
        <div className="flex flex-col h-full p-4 rounded">
            <div className="flex items-center justify-between w-full mb-1">
                <h3 className="flex-1 pb-1 text-xl font-extrabold tracking-wide text-left text-green-200 uppercase border-b border-green-400">ÚLTIMOS RESULTADOS</h3>
                <button
                    className="flex items-center gap-1 px-3 py-1 ml-2 text-sm font-bold text-white transition-colors bg-red-600 border-2 border-red-800 rounded-full shadow focus:outline-none focus:ring-2 focus:ring-yellow-400 hover:bg-yellow-300 hover:text-red-900 hover:border-yellow-500"
                    title="Borrar el último número"
                    onClick={onBorrarUltimo}
                    disabled={numerosSeleccionados.length === 0}
                >
                    <FaBackspace className="text-lg" />
                    <span>Borrar último</span>
                </button>
            </div>
            <div className="flex flex-col flex-1 w-full">
                <div className="flex flex-row flex-wrap w-full gap-1" style={{ justifyContent: "flex-start", alignItems: "flex-start", paddingLeft: "0" }}>
                    {numerosSeleccionados.slice().reverse().map((numero, index) => {
                        let colorClass = "bg-black";
                        if (numero === 0) colorClass = "bg-green-500";
                        else if ([1, 3, 5, 7, 9, 12, 14, 16, 18, 19, 21, 23, 25, 27, 30, 32, 34, 36].includes(numero)) colorClass = "bg-red-600";
                        // Si es acierto, resaltar
                        const isAcierto = aciertos.includes(numero);
                        const esVecino = aciertosVecinos.some(v => v.numero === numero);
                        return (
                            <span
                                key={index}
                                className={`shadow-lg hover:z-10 hover:scale-110 hover:border-white h-8 w-8 rounded-full text-white flex items-center justify-center border-2 border-white text-base font-extrabold transition-all duration-150 ${colorClass} ${isAcierto ? 'ring-4 ring-green-400 animate-pulse' : ''} ${esVecino ? 'ring-4 ring-blue-400 animate-pulse' : ''}`}
                                style={{
                                    boxShadow: "0 2px 8px rgba(0,0,0,0.3)",
                                    margin: "2px"
                                }}
                            >
                                {numero}
                            </span>
                        );
                    })}
                </div>
                {aciertosVecinos.length > 0 && (
                    <div className="self-start px-4 py-2 mt-3 font-bold text-blue-900 bg-blue-200 border-2 border-blue-600 rounded shadow animate-bounce">
                        ¡Se pegó un vecino! Números: {aciertosVecinos.map(v => `${v.numero} (vecino de ${v.vecinoDe})`).join(', ')}
                    </div>
                )}
            </div>
        </div>
    );
};

export default NumerosJugados;
