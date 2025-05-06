import React from "react";



const Probabilidades = ({ historial, maxRepeticiones }) => {
  // Calcular el total para porcentaje
  const total = historial.reduce((acc, item) => acc + item.probabilidadAcumulada, 0);
  // Ordenar por probabilidad acumulada descendente
  const sorted = [...historial].sort((a, b) => b.probabilidadAcumulada - a.probabilidadAcumulada);
  return (
    <div className="flex justify-center items-center">
      <div className="p-4 w-full">
        <div className="overflow-x-auto max-h-[40vh]">
          <table className="w-full border-gray-300 shadow-md rounded-lg">
            <thead className="bg-black sticky top-0 z-10">
              <tr className="text-center">
                <th className="px-2 py-1 whitespace-nowrap">Número</th>
                <th className="px-2 py-1 whitespace-nowrap">% Probabilidad</th>
                <th className="px-2 py-1 whitespace-nowrap">Repeticiones</th>
              </tr>
            </thead>
            <tbody>
              {sorted.map((item, idx) => {
                const porcentaje = total > 0 ? (item.probabilidadAcumulada * 100) / total : 0;
                const superaMax = maxRepeticiones && item.repeticiones > maxRepeticiones;
                return (
                  <tr
                    key={item.numero + '-' + idx}
                    className={`hover:bg-slate-600 text-2xl font-bold ${item.numero % 2 === 0 ? 'bg-[#ffffff30]' : ''} ${superaMax ? 'bg-red-400 text-white animate-pulse' : ''}`}
                  >
                    <td className="px-2 py-1 whitespace-nowrap">{item.numero}</td>
                    <td className="px-2 py-1 whitespace-nowrap">{porcentaje.toFixed(2)}%</td>
                    <td className="px-2 py-1 whitespace-nowrap">{item.repeticiones}</td>
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

export default Probabilidades;
