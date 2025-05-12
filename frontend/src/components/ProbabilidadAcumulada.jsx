import React from "react";


const ProbabilidadTabla = ({ historial, maxRepeticiones }) => {
    const sorted = [...historial].sort((a, b) => b.probabilidadAcumulada - a.probabilidadAcumulada);
    const umbral = Number(localStorage.getItem('umbral_probabilidad')) || 0;
    const filtrados = sorted.filter(item => item.probabilidadAcumulada >= umbral);
    return (
        <div className="flex items-center justify-center">
            <div className="w-full p-2">
                <div className="overflow-x-auto max-h-[30vh]">
                    <table className="w-full min-w-[220px] rounded-xl shadow-lg text-xs bg-white border border-gray-200">
                        <thead className="sticky top-0 z-10 bg-gray-100 border-b border-gray-300">
                            <tr className="text-center">
                                <th className="px-2 py-1 font-semibold text-gray-700">Nro</th>
                                <th className="px-2 py-1 font-semibold text-gray-700">% Prob</th>
                                <th className="px-2 py-1 font-semibold text-gray-700">Tardanza</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filtrados.map((item, idx) => {
                                const porcentaje = item.probabilidadAcumulada;
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
                                    >
                                        <td className="px-2 py-1 text-gray-800">{item.numero}</td>
                                        <td className="px-2 py-1 text-gray-800">{porcentaje}%</td>
                                        <td className="px-2 py-1 text-gray-800">{tardanza}</td>
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

const ProbabilidadAcumulada = ({ historial, maxRepeticiones }) => (
    <div className="flex flex-col h-full p-2 border border-green-300 shadow rounded-xl">
        <div className="flex flex-col items-center justify-center h-full text-center bg-center bg-cover">
            <h3 className="w-full pb-1 mb-2 text-base font-extrabold tracking-wide text-center text-gray-700 uppercase border-b-2 border-gray-300">Probabilidad Acumulada</h3>
            <ProbabilidadTabla historial={historial} maxRepeticiones={maxRepeticiones} />
        </div>
    </div>
);

export default ProbabilidadAcumulada;
