import React from "react";

const NumerosJugados = ({ numerosSeleccionados }) => (
    <div className="bg-green-900 rounded p-4 flex flex-col items-center justify-center">
        <div className="w-full flex flex-col items-center">
            <p className="px-2 text-white whitespace-nowrap mb-2">Últimos resultados:</p>
            <div className="flex flex-row flex-wrap gap-2 justify-center items-center w-full">
                {numerosSeleccionados.slice().reverse().map((numero, index) => {
                    let colorClass = "bg-black";
                    if (numero === 0) colorClass = "bg-green-500";
                    else if ([1, 3, 5, 7, 9, 12, 14, 16, 18, 19, 21, 23, 25, 27, 30, 32, 34, 36].includes(numero)) colorClass = "bg-red-500";
                    return (
                        <button
                            key={index}
                            className={`h-10 w-10 rounded text-white flex items-center justify-center border border-solid border-[#d69747] text-lg font-bold ${colorClass}`}
                        >
                            {numero}
                        </button>
                    );
                })}
            </div>
        </div>
    </div>
);

export default NumerosJugados;
