import React from "react";



const Probabilidades = ({ historial, maxRepeticiones }) => {
  // Calcular el total para porcentaje (ya en escala 1-100)
  const total = historial.reduce((acc, item) => acc + item.probabilidadAcumulada, 0);
  // Ordenar por probabilidad acumulada descendente
  const sorted = [...historial].sort((a, b) => b.probabilidadAcumulada - a.probabilidadAcumulada);
  // Obtener el umbral desde el localStorage (set por Predict.jsx) o prop si lo pasas
  const umbral = Number(localStorage.getItem('umbral_probabilidad')) || 0;
  // Mostrar solo los que superan el umbral
  const filtrados = sorted.filter(item => {
    // El umbral es entero, compara directo
    return item.probabilidadAcumulada >= umbral;
  });
  return (
    <div className="flex items-center justify-center">
      <div className="w-full p-4">
        <div className="overflow-x-auto max-h-[40vh]">
          <table className="w-full border-gray-300 rounded-lg shadow-md">
            <thead className="sticky top-0 z-10 bg-black">
              <tr className="text-center">
                <th className="px-2 py-1 whitespace-nowrap">Número</th>
                <th className="px-2 py-1 whitespace-nowrap">% Probabilidad</th>
                <th className="px-2 py-1 whitespace-nowrap">Tardanza</th>
              </tr>
            </thead>
            <tbody>
              {filtrados.map((item, idx) => {
                // Mostrar el porcentaje como entero directo
                const porcentaje = item.probabilidadAcumulada;
                // Mostrar la tardanza correctamente
                let tardanza = null;
                if (typeof item.tardancia !== 'undefined') {
                  tardanza = item.tardancia;
                } else if (typeof item.tardanza !== 'undefined') {
                  tardanza = item.tardanza;
                } else if (typeof item.repeticiones !== 'undefined') {
                  tardanza = item.repeticiones;
                } else {
                  tardanza = '-';
                }
                // Resalta si supera el umbral
                const superaUmbral = porcentaje >= umbral;
                return (
                  <tr
                    key={item.numero + '-' + idx}
                    className={`hover:bg-slate-600 text-2xl font-bold ${item.numero % 2 === 0 ? 'bg-[#ffffff30]' : ''} ${superaUmbral ? 'bg-green-400 text-white animate-pulse' : ''}`}
                  >
                    <td className="px-2 py-1 whitespace-nowrap">{item.numero}</td>
                    <td className="px-2 py-1 whitespace-nowrap">{porcentaje}%</td>
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
