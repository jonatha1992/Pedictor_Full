
import React, { useEffect, useState } from "react";



const NumerosJugados = ({ numerosSeleccionados, aciertos = [], aciertosVecinos = [] }) => {
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
        <div className="flex flex-col items-center justify-center p-4 bg-green-900 rounded">
            <div className="flex flex-col items-center w-full">
                <p className="px-2 mb-2 text-white whitespace-nowrap">Últimos resultados:</p>
                <div className="flex flex-row flex-wrap items-center justify-center w-full gap-1">
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
                {/* Eliminada la notificación amarilla de '¡Se pegó!' para evitar confusión */}
                {aciertos.length > 0 && (
                    <div className="px-4 py-2 mt-3 font-bold text-green-900 bg-green-300 border-2 border-green-600 rounded shadow animate-bounce">
                        ¡Acierto! Números: {aciertos.join(', ')}
                    </div>
                )}
                {aciertosVecinos.length > 0 && (
                    <div className="px-4 py-2 mt-3 font-bold text-blue-900 bg-blue-200 border-2 border-blue-600 rounded shadow animate-bounce">
                        ¡Se pegó un vecino! Números: {aciertosVecinos.map(v => `${v.numero} (vecino de ${v.vecinoDe})`).join(', ')}
                    </div>
                )}
            </div>
        </div>
    );
};

export default NumerosJugados;
