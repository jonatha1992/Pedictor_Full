import React from "react";


const Probabilidades = ({ historial }) => {
  return (
    <div className="flex justify-center items-center">
      <div className="p-4 w-full">
        <div className="overflow-x-auto max-h-[40vh]">
          <table className="w-full border-gray-300 shadow-md rounded-lg">
            <thead className="bg-black sticky top-0 z-10">
              <tr className="text-center">
                <th className="px-2 py-1 whitespace-nowrap">Probabilidad Acumulada</th>
                <th className="px-2 py-1 whitespace-nowrap">Número</th>
                <th className="px-2 py-1 whitespace-nowrap">Repeticiones</th>
              </tr>
            </thead>
            <tbody>
              {historial
                .sort((a, b) => b.probabilidadAcumulada - a.probabilidadAcumulada)
                .map((item, idx) => (
                  <tr key={item.numero + '-' + idx} className={`hover:bg-slate-600 text-2xl font-bold ${item.numero % 2 === 0 ? 'bg-[#ffffff30]' : ''}`}>
                    <td className="px-2 py-1 whitespace-nowrap">{item.probabilidadAcumulada.toFixed(2)}</td>
                    <td className="px-2 py-1 whitespace-nowrap">{item.numero}</td>
                    <td className="px-2 py-1 whitespace-nowrap">{item.repeticiones}</td>
                  </tr>
                ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Probabilidades;
