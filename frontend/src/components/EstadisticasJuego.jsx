import React from "react";

const EstadisticasJuego = ({ contador }) => {
    return (
        <div className="p-4 m-2 border border-green-700 shadow-2xl rounded-xl bg-gradient-to-br to-green-900">
            <h3 className="w-full pb-1 mb-1 text-xl font-extrabold tracking-wide text-center text-green-200 uppercase border-b border-green-400">Estadisticas del Juego</h3>

            <table className="w-full text-sm text-white">
                <tbody>
                    <tr>
                        <td className="py-1 pr-2">Nros. Ingresados</td>
                        <td className="py-1 text-right">{contador.ingresados}</td>
                    </tr>
                    <tr>
                        <td className="py-1 pr-2">Nros. Predecidos</td>
                        <td className="py-1 text-right">{contador.jugados}</td>
                    </tr>
                    <tr>
                        <td className="py-1 pr-2">Aciertos</td>
                        <td className="py-1 text-right">{contador.aciertos_totales}</td>
                    </tr>
                    <tr>
                        <td className="py-1 pr-2">Aciertos Vecinos</td>
                        <td className="py-1 text-right">{contador.aciertos_vecinos}</td>
                    </tr>
                    <tr>
                        <td className="py-1 pr-2">No acertados</td>
                        <td className="py-1 text-right">{contador.Sin_salir_nada}</td>
                    </tr>
                    <tr>
                        <td className="py-1 pr-2">Efectividad (%)</td>
                        <td className="py-1 text-right">{contador.efectividad}</td>
                    </tr>
                </tbody>
            </table>
        </div>
    );
};

export default EstadisticasJuego;
