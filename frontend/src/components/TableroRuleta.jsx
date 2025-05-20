
const TableroRuleta = ({ handleNumeroClick }) => (
    <div className="bg-green-900 rounded-lg p-2 flex flex-col items-center justify-center max-w-[550px]  border-4 border-black shadow-xl" style={{ background: 'repeating-linear-gradient(135deg, #14532d 0 10px, #166534 10px 20px)' }}>
        <div className="flex flex-col items-center w-full">
            <div className="relative grid items-center justify-center w-full grid-rows-3 gap-[1px] grid-cols-13">
                {/* 0 ocupa la primera columna y las filas 1-3 */}
                <div className="flex items-center justify-center col-start-1 row-span-3 row-start-1">
                    <button
                        onClick={() => handleNumeroClick(0)}
                        className="flex flex-col items-center justify-center text-base font-extrabold text-white bg-green-600 rounded-l-lg w-10 h-[120px] border-2 border-white shadow hover:z-10 hover:scale-125 hover:border-white"
                        style={{ writingMode: 'vertical-lr', textOrientation: 'mixed', fontSize: '1.1rem' }}
                    >
                        0
                    </button>
                </div>
                {/* Números 1-36: distribuidos en 12 columnas x 3 filas, de abajo hacia arriba, con forma ovalada */}
                {Array.from({ length: 36 }).map((_, idx) => {
                    const col = Math.floor(idx / 3) + 2;
                    const row = 3 - (idx % 3);
                    const num = idx + 1;
                    const isRed = [1, 3, 5, 7, 9, 12, 14, 16, 18, 19, 21, 23, 25, 27, 30, 32, 34, 36].includes(num);
                    // Bordes personalizados para simular tablero real
                    let borderClass = "border border-white";
                    // Bordes redondeados solo en las esquinas externas
                    let rounded = "rounded-full";
                    return (
                        <button
                            key={num}
                            onClick={() => handleNumeroClick(num)}
                            className={`flex flex-col items-center justify-center w-9 h-8 text-white text-xs font-extrabold m-0 p-0 transition-all duration-150 ${isRed ? "bg-red-600" : "bg-black"} ${borderClass} ${rounded} hover:z-10 hover:scale-125 hover:border-white`}
                            style={{ gridColumn: col, gridRow: row }}
                        >
                            {num}
                        </button>
                    );
                })}
            </div>
            {/* Etiquetas de docena */}
            <div className="flex w-full m">
                <span className="w-[40px]"></span>
                <span className="flex-1 p-1 text-xs font-extrabold text-center text-white bg-green-900 border border-white rounded">1st 12</span>
                <span className="flex-1 p-1 text-xs font-extrabold text-center text-white bg-green-900 border border-white rounded">2nd 12</span>
                <span className="flex-1 p-1 text-xs font-extrabold text-center text-white bg-green-900 border border-white rounded">3rd 12</span>
            </div>
            {/* Etiquetas de columna */}

            {/* Apuestas externas visuales (no botones) */}
            <div className="flex flex-row flex-wrap justify-between w-full gap-1 px-1 mt-2">
                <span className="w-[40px]"></span>
                <span className="flex-1 min-w-[40px] py-1 px-1 text-[11px] font-bold text-white bg-green-900 border border-white rounded text-center">1 al 18</span>
                <span className="flex-1 min-w-[40px] py-1 px-1 text-[11px] font-bold text-white bg-green-900 border border-white rounded text-center">Par</span>
                <span className="flex-1 min-w-[40px] py-1 px-1 text-[11px] font-bold text-white bg-red-600 border border-white rounded text-center">◆</span>
                <span className="flex-1 min-w-[40px] py-1 px-1 text-[11px] font-bold text-white bg-black border border-white rounded text-center">◆</span>
                <span className="flex-1 min-w-[40px] py-1 px-1 text-[11px] font-bold text-white bg-green-900 border border-white rounded text-center">Impar</span>
                <span className="flex-1 min-w-[40px] py-1 px-1 text-[11px] font-bold text-white bg-green-900 border border-white rounded text-center">19 al 36</span>
            </div>
        </div>
    </div>
);

export default TableroRuleta;
