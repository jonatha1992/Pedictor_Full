import React from "react";
import ruletaImg from "../assets/ruleta.png";

const ProbabilidadTabla = ({ historial, maxRepeticiones }) => {
    const sorted = [...historial].sort((a, b) => {
        const pa = typeof a.probabilidadAcumulada !== 'undefined' ? a.probabilidadAcumulada : a.probabilidad;
        const pb = typeof b.probabilidadAcumulada !== 'undefined' ? b.probabilidadAcumulada : b.probabilidad;
        return pb - pa;
    });
    const umbral = Number(localStorage.getItem('umbral_probabilidad')) || 0;
    const filtrados = sorted.filter(item => {
        const prob = typeof item.probabilidadAcumulada !== 'undefined' ? item.probabilidadAcumulada : item.probabilidad;
        return prob >= umbral;
    });

    // Función para color de fondo según el número (igual que NumerosJugados)
    const getColorClass = (numero) => {
        if (numero === 0) return "bg-green-500";
        const rojos = [1, 3, 5, 7, 9, 12, 14, 16, 18, 19, 21, 23, 25, 27, 30, 32, 34, 36];
        if (rojos.includes(numero)) return "bg-red-600";
        return "bg-black";
    };

    return (
        <div className="flex items-start justify-center w-full">
            <div className="flex flex-col w-full p-0 md:p-2">
                <table className="w-full min-w-[180px] rounded shadow text-sm bg-white border border-gray-200 ">
                    <thead className="bg-gray-100 border-b border-gray-300">
                        <tr className="text-center">
                            <th className="px-2 py-1 font-semibold text-gray-700">Numero</th>
                            <th className="px-2 py-1 font-semibold text-gray-700">Probabilidad</th>
                            <th className="px-2 py-1 font-semibold text-gray-700">Tardanza</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filtrados.map((item, idx) => {
                            let porcentaje = typeof item.probabilidadAcumulada !== 'undefined' ? item.probabilidadAcumulada : item.probabilidad;
                            porcentaje = Math.round(porcentaje);
                            let tardanza = null;
                            if (typeof item.tardancia !== 'undefined') tardanza = item.tardancia;
                            else if (typeof item.tardanza !== 'undefined') tardanza = item.tardanza;
                            else if (typeof item.repeticiones !== 'undefined') tardanza = item.repeticiones;
                            else tardanza = '-';
                            const superaUmbral = porcentaje >= umbral;
                            return (
                                <tr
                                    key={item.numero + '-' + idx}
                                    className={`text-center transition-colors ${idx % 2 === 0 ? 'bg-gray-50' : 'bg-white'} ${superaUmbral ? 'bg-green-100 font-bold border-l-4 border-green-500' : ''}`}
                                    style={{ height: '38px' }}
                                >
                                    <td className="px-2 py-1">
                                        <span
                                            className={`h-7 w-7 rounded-full text-white flex items-center justify-center border-2 border-white text-base font-extrabold mx-auto ${getColorClass(item.numero)}`}
                                            style={{
                                                boxShadow: "0 2px 8px rgba(0,0,0,0.3)",
                                                margin: "2px"
                                            }}
                                        >
                                            {item.numero}
                                        </span>
                                    </td>
                                    <td className="px-2 py-1 text-base text-gray-800">{porcentaje}%</td>
                                    <td className="px-2 py-1 text-base text-gray-800">{tardanza}</td>
                                </tr>
                            );
                        })}
                    </tbody>
                </table>
            </div>
        </div>
    );
};


const ProbabilidadAcumulada = ({ historial, maxRepeticiones }) => (
    <div className="flex flex-col items-start justify-center w-full h-full gap-2 pt-2 text-center bg-center bg-cover md:flex-row md:pt-4">
        {/* Tabla de probabilidad */}
        <div className="flex flex-col items-stretch flex-1">
            <h3 className="w-full pb-1 mb-1 text-2xl font-extrabold tracking-wide text-center text-green-200 uppercase border-b border-green-400">Números a Jugar</h3>
            <ProbabilidadTabla historial={historial} maxRepeticiones={maxRepeticiones} />
        </div>
        {/* Imagen de la ruleta */}
        <div className="flex flex-col items-start justify-start flex-1">
            <img src={ruletaImg} alt="Ruleta" className="max-w-[150px] md:max-w-[270px] w-full h-auto border-green-700 shadow-lg" />
            <span className="mt-2 text-xs text-green-200">Visualización de la ruleta y vecinos</span>
        </div>
    </div>
);

export default ProbabilidadAcumulada;