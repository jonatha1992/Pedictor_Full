import React from "react";

const data = [
  { numero: 1, probabilidad: "30%", tardanza: "2 días", repeticion: 3 },
  { numero: 2, probabilidad: "50%", tardanza: "1 día", repeticion: 2 },
  { numero: 3, probabilidad: "80%", tardanza: "0 días", repeticion: 1 },
];

const Probabilidades = () => {
  return (
    <div className="flex justify-center items-center ">
      <div className=" max-w-4xl p-4 overflow-x-auto w-full">
        <table className="min-w-full  border-gray-300 shadow-md rounded-lg overflow-hidden ">
          <thead className="bg-black">
            <tr className="text-center">
              <th >Probabilidad</th>
              <th >Tardanza</th>
              <th >Repetición</th>
              <th >Número</th>
            </tr>
          </thead>
          <tbody>
            {data.map((item) => (
              <tr key={item.numero} className={`hover:bg-slate-600 text-2xl font-bold ${item.numero % 2 === 0 ? 'bg-[#ffffff30]' : ''}`}>
                <td className="">{item.numero}</td>
                <td className="">{item.probabilidad}</td>
                <td className="">{item.tardanza}</td>
                <td className="">{item.repeticion}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Probabilidades;
