import React from "react";

const EstadisticasJuego = ({ contador }) => {
    return (
        <div className="border border-green-700 shadow-2xl rounded-xl bg-gradient-to-br from-green-800 to-green-900 p-4 m-2">
            <h3 className="text-lg font-bold text-center text-white mb-2">Estadísticas de Juego</h3>
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
