import React from "react";

const TableroRuleta = ({ handleNumeroClick }) => (
    <div className="bg-green-900 rounded p-2 flex flex-col items-center justify-center">
        <div className="w-full flex flex-col items-center">
            <div className="grid items-center justify-center w-full grid-rows-3 gap-2 grid-cols-13">
                {/* 0 ocupa la primera columna y las filas 1-3 */}
                <div className="flex items-center justify-center col-start-1 row-span-3 row-start-1">
                    <button
                        onClick={() => handleNumeroClick(0)}
                        className="flex flex-col items-center justify-center w-12 h-40 text-xl font-bold text-white bg-green-500 rounded"
                    >
                        0
                    </button>
                </div>
                {/* Números 1-36: distribuidos en 12 columnas x 3 filas, de abajo hacia arriba */}
                {Array.from({ length: 36 }).map((_, idx) => {
                    const col = Math.floor(idx / 3) + 2;
                    const row = 3 - (idx % 3);
                    const num = idx + 1;
                    const isRed = [1, 3, 5, 7, 9, 12, 14, 16, 18, 19, 21, 23, 25, 27, 30, 32, 34, 36].includes(num);
                    return (
                        <button
                            key={num}
                            onClick={() => handleNumeroClick(num)}
                            className={`flex flex-col items-center justify-center w-12 h-12 rounded text-white text-lg font-bold ${isRed ? "bg-red-500" : "bg-black"}`}
                            style={{ gridColumn: col, gridRow: row }}
                        >
                            {num}
                        </button>
                    );
                })}
            </div>
        </div>
    </div>
);

export default TableroRuleta;
