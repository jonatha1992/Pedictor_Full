import React from "react";



const Probabilidades = ({ historial, maxRepeticiones }) => {
  // Calcular el total para porcentaje
  const total = historial.reduce((acc, item) => acc + item.probabilidadAcumulada, 0);
  // Ordenar por probabilidad acumulada descendente
  const sorted = [...historial].sort((a, b) => b.probabilidadAcumulada - a.probabilidadAcumulada);
  // Obtener el umbral desde el localStorage (set por Predict.jsx) o prop si lo pasas
  const umbral = Number(localStorage.getItem('umbral_probabilidad')) || 0;
  // Mostrar solo los que superan el umbral
  const filtrados = sorted.filter(item => {
    const porcentaje = total > 0 ? (item.probabilidadAcumulada * 100) / total : 0;
    return porcentaje >= umbral;
  });
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
                <th className="px-2 py-1 whitespace-nowrap">Tardanza</th>
              </tr>
            </thead>
            <tbody>
              {filtrados.map((item, idx) => {
                const porcentaje = total > 0 ? (item.probabilidadAcumulada * 100) / total : 0;
                const superaMax = maxRepeticiones && item.repeticiones > maxRepeticiones;
                // Simulación de tardanza: repeticiones como ejemplo, deberías pasar el dato real si lo tienes
                const tardanza = item.tardancia !== undefined ? item.tardancia : item.repeticiones;
                return (
                  <tr
                    key={item.numero + '-' + idx}
                    className={`hover:bg-slate-600 text-2xl font-bold ${item.numero % 2 === 0 ? 'bg-[#ffffff30]' : ''} ${superaMax ? 'bg-red-400 text-white animate-pulse' : ''}`}
                  >
                    <td className="px-2 py-1 whitespace-nowrap">{item.numero}</td>
                    <td className="px-2 py-1 whitespace-nowrap">{porcentaje.toFixed(2)}%</td>
                    <td className="px-2 py-1 whitespace-nowrap">{item.repeticiones}</td>
                    <td className="px-2 py-1 whitespace-nowrap">{tardanza}</td>
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
