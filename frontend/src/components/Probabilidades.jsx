import React from "react";

const data = [
  { numero: 1, probabilidad: "30%", tardanza: "2 días", repeticion: 3 },
  { numero: 2, probabilidad: "50%", tardanza: "1 día", repeticion: 2 },
  { numero: 3, probabilidad: "80%", tardanza: "0 días", repeticion: 1 },
];

const Probabilidades = () => {
  return (
    <div className="flex justify-center items-center ">
      <div className=" max-w-4xl p-4 overflow-x-auto">
        <table className="min-w-full  border-gray-300 shadow-md rounded-lg overflow-hidden">
          <thead>
            <tr className="">
              <th className=" text-left">Número</th>
              <th className=" text-left">Probabilidad</th>
              <th className=" text-left">Tardanza</th>
              <th className=" text-left">Repetición</th>
            </tr>
          </thead>
          <tbody>
            {data.map((item) => (
              <tr key={item.numero} className="hover:bg-slate-600">
                <td className=" border-b">{item.numero}</td>
                <td className=" border-b">{item.probabilidad}</td>
                <td className=" border-b">{item.tardanza}</td>
                <td className=" border-b">{item.repeticion}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Probabilidades;
