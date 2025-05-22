import React from "react";

const etiquetas = {
    ingresados: { label: "Nros. Ingresados", color: "bg-green-700" },
    jugados: { label: "Nros. Predecidos", color: "bg-blue-700" },
    aciertos_totales: { label: "Aciertos", color: "bg-yellow-700" },
    aciertos_vecinos: { label: "Aciertos Vecinos", color: "bg-pink-700" },
    Sin_salir_nada: { label: "No acertados", color: "bg-gray-700" },
    efectividad: { label: "Efectividad (%)", color: "bg-indigo-700" },
};

const EstadisticasJuego = ({ contador }) => {
    return (
        <div className="flex flex-col flex-1 w-full h-full max-w-xs gap-1 p-2 mx-auto mt-1 border border-green-700 bg-gradient-to-br to-green-900 md:p-2 rounded-xl md:h-full"
            style={{ fontSize: "15px" }}
        >
            <h3 className="w-full pb-1 mb-1 text-lg font-extrabold tracking-wide text-center text-green-200 uppercase border-b border-green-400">
                Estadísticas del Juego
            </h3>
            <div className="flex flex-col gap-0.5 w-full flex-1 justify-center font-semibold text-white">
                <div className="flex items-center justify-between w-full">
                    <span className="text-green-200">{etiquetas.ingresados.label}:</span>
                    <span className={`${etiquetas.ingresados.color} px-2 py-0.5 rounded text-sm ml-2`}>{contador.ingresados}</span>
                </div>
                <div className="flex items-center justify-between w-full">
                    <span className="text-green-200">{etiquetas.jugados.label}:</span>
                    <span className={`${etiquetas.jugados.color} px-2 py-0.5 rounded text-sm ml-2`}>{contador.jugados}</span>
                </div>
                <div className="flex items-center justify-between w-full">
                    <span className="text-green-200">{etiquetas.aciertos_totales.label}:</span>
                    <span className={`${etiquetas.aciertos_totales.color} px-2 py-0.5 rounded text-sm ml-2`}>{contador.aciertos_totales}</span>
                </div>
                <div className="flex items-center justify-between w-full">
                    <span className="text-green-200">{etiquetas.aciertos_vecinos.label}:</span>
                    <span className={`${etiquetas.aciertos_vecinos.color} px-2 py-0.5 rounded text-sm ml-2`}>{contador.aciertos_vecinos}</span>
                </div>
                <div className="flex items-center justify-between w-full">
                    <span className="text-green-200">{etiquetas.Sin_salir_nada.label}:</span>
                    <span className={`${etiquetas.Sin_salir_nada.color} px-2 py-0.5 rounded text-sm ml-2`}>{contador.Sin_salir_nada}</span>
                </div>
                <div className="flex items-center justify-between w-full">
                    <span className="text-green-200">{etiquetas.efectividad.label}:</span>
                    <span className={`${etiquetas.efectividad.color} px-2 py-0.5 rounded text-sm ml-2`}>{contador.efectividad}</span>
                </div>
            </div>
        </div>
    );
};

export default EstadisticasJuego;
