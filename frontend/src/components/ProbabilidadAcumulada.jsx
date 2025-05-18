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
            <div className="relative flex flex-col w-full px-2">
                <div className="max-h-[220px] overflow-auto scrollbar-thin scrollbar-thumb-green-700 scrollbar-track-gray-200">
                    <table className="w-full min-w-[180px] rounded-lg shadow-md text-xs md:text-sm border border-green-700 bg-gradient-to-b from-gray-900 to-green-900">
                        <thead className="sticky top-0 z-10 border-b border-green-600 bg-gradient-to-r from-green-900 to-green-800">
                            <tr className="text-center">
                                <th className="px-2 py-2 font-bold text-green-200">Numero</th>
                                <th className="px-2 py-2 font-bold text-green-200">Probabilidad</th>
                                <th className="px-2 py-2 font-bold text-green-200">Tardanza</th>
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
                                        className={`text-center transition-colors ${idx % 2 === 0 ? 'bg-opacity-20 bg-green-900' : 'bg-opacity-10 bg-green-800'} ${superaUmbral ? 'font-bold border-l-2 border-green-500' : ''} hover:bg-green-700 hover:bg-opacity-25`}
                                        style={{ height: '28px' }}
                                    >
                                        <td className="px-2">
                                            <span
                                                className={` h-6 w-6 rounded-full text-white flex items-center justify-center border-2 border-white  text-xs  mx-auto ${getColorClass(item.numero)}`}

                                            >
                                                {item.numero}
                                            </span>
                                        </td>
                                        <td className="px-1 text-xs font-medium text-green-200 md:text-sm">{porcentaje}%</td>
                                        <td className="px-1 text-xs font-medium text-green-200 md:text-sm">{tardanza}</td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};




const ProbabilidadAcumulada = ({ historial, maxRepeticiones, soloRuleta }) => {
    if (soloRuleta) {
        return (
            <div className="flex flex-col items-center justify-center w-full h-full min-h-[180px]">
                <div className="flex flex-col items-center justify-center min-w-[120px] max-w-[220px]">
                    <img src={ruletaImg} alt="Ruleta" height={250} className="max-w-[220px] md:max-w-[180px] w-full border-green-700 shadow-lg" />
                    <span className="mt-2 text-xs text-green-200">Ruleta y vecinos</span>
                </div>
            </div>
        );
    }
    return (
        <div className="flex flex-col md:flex-row w-full gap-1 pt-1 text-center bg-center bg-cover max-h-[320px] min-h-[220px]">
            {/* Tabla de probabilidad */}
            <div className="flex flex-col items-center justify-start w-full">
                <h3 className="w-full pb-1 mb-1 text-lg font-extrabold tracking-wide text-center text-green-200 uppercase border-b border-green-400">Números a Jugar</h3>
                <ProbabilidadTabla historial={historial} maxRepeticiones={maxRepeticiones} />
            </div>
        </div>
    );
};

export default ProbabilidadAcumulada;