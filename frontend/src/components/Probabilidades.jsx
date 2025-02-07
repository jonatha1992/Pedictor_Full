import React from "react";

const data = [
  { numero: 6, probabilidad: "60%", tardanza: "0 días", repeticion: 0 },
  { numero: 12, probabilidad: "60%", tardanza: "0 días", repeticion: 0 },
  { numero: 5, probabilidad: "50%", tardanza: "1 día", repeticion: 1 },
  { numero: 11, probabilidad: "50%", tardanza: "1 día", repeticion: 1 },
  { numero: 4, probabilidad: "40%", tardanza: "2 días", repeticion: 2 },
  { numero: 10, probabilidad: "40%", tardanza: "2 días", repeticion: 2 },
  { numero: 3, probabilidad: "30%", tardanza: "3 días", repeticion: 3 },
  { numero: 9, probabilidad: "30%", tardanza: "3 días", repeticion: 3 },
  { numero: 2, probabilidad: "20%", tardanza: "4 días", repeticion: 4 },
  { numero: 8, probabilidad: "20%", tardanza: "4 días", repeticion: 4 },
  { numero: 1, probabilidad: "10%", tardanza: "5 días", repeticion: 5 },
  { numero: 7, probabilidad: "10%", tardanza: "5 días", repeticion: 5 },
];

const Probabilidades = () => {
  return (
    <div className="flex justify-center items-center">
      <div className="p-4 w-full">
        <div className="overflow-x-auto max-h-[40vh]">
          <table className="w-full border-gray-300 shadow-md rounded-lg">
            <thead className="bg-black sticky top-0 z-10">
              <tr className="text-center">
                <th className="px-2 py-1 whitespace-nowrap">Probabilidad</th>
                <th className="px-2 py-1 whitespace-nowrap">Número</th>
                <th className="px-2 py-1 whitespace-nowrap">Repetición</th>
                <th className="px-2 py-1 whitespace-nowrap">Tardanza</th>
              </tr>
            </thead>
            <tbody>
              {data.map((item) => (
                <tr key={item.numero} className={`hover:bg-slate-600 text-2xl font-bold ${item.numero % 2 === 0 ? 'bg-[#ffffff30]' : ''}`}>
                  <td className="px-2 py-1 whitespace-nowrap">{item.probabilidad}</td>
                  <td className="px-2 py-1 whitespace-nowrap">{item.numero}</td>
                  <td className="px-2 py-1 whitespace-nowrap">{item.repeticion}</td>
                  <td className="px-2 py-1 whitespace-nowrap">{item.tardanza}</td>
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
