import React from "react";

const NumerosJugados = ({ numerosSeleccionados }) => (
    <div className="flex flex-col items-center justify-center p-4 bg-green-900 rounded">
        <div className="flex flex-col items-center w-full">
            <p className="px-2 mb-2 text-white whitespace-nowrap">Últimos resultados:</p>
            <div className="flex flex-row flex-wrap items-center justify-center w-full gap-2">
                {numerosSeleccionados.slice().reverse().map((numero, index) => {
                    let colorClass = "bg-black";
                    if (numero === 0) colorClass = "bg-green-500";
                    else if ([1, 3, 5, 7, 9, 12, 14, 16, 18, 19, 21, 23, 25, 27, 30, 32, 34, 36].includes(numero)) colorClass = "bg-red-500";
                    return (
                        <button
                            key={index}
                            className={`hover:z-10 hover:scale-125 hover:border-white h-8 w-8 rounded text-white flex items-center justify-center border border-solid border-white text-lg font-bold ${colorClass}`}
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
