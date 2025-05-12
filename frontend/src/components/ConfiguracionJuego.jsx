import React from "react";
import Modal from "./Modal";

const ConfiguracionJuego = ({
    isOpen,
    setIsOpen,
    isModalOpen,
    setIsModalOpen,
    gameConfig,
    handleInputChange,
    handleSubmit,
    handleSaveConfig,
    crupiers
}) => (
    <div className="flex flex-col justify-between p-4 bg-green-700 rounded"
    >
        <button
            className="flex items-center justify-between w-full p-3 font-bold text-white bg-green-600 rounded-t"
            onClick={() => setIsOpen(!isOpen)}
        >
            <span>Configuración del juego</span>
            <span className={`transform transition-transform duration-200 ${isOpen ? "rotate-180" : ""}`}>▼</span>
        </button>
        <Modal isOpen={isModalOpen} onClose={null}>
            <form onSubmit={handleSubmit} className="p-6 space-y-5 bg-white border border-gray-200 rounded-lg shadow-xl"
            >
                <div>
                    <label className="flex items-center gap-1 text-sm font-semibold text-gray-800">
                        Tipo de Ruleta
                        <span className="text-gray-400 cursor-pointer" title="Ejemplo: Electromecánica. Elige el tipo de ruleta.">?</span>
                    </label>
                    <select
                        name="tipo"
                        value={gameConfig.tipo}
                        onChange={handleInputChange}
                        className="block w-full p-2 mt-1 transition border border-gray-300 rounded focus:ring-2 focus:ring-indigo-400 focus:border-indigo-400"
                        required
                    >
                        <option value="">Selecciona un tipo</option>
                        <option value="Electromecanica">Electromecánica</option>
                    </select>
                </div>
                <div>
                    <label className="flex items-center gap-1 text-sm font-semibold text-gray-800">
                        Nombre de la Ruleta
                        <span className="text-gray-400 cursor-pointer" title="Identifica tu ruleta.">?</span>
                    </label>
                    <input type="text" name="nombre_ruleta" value={gameConfig.nombre_ruleta} onChange={handleInputChange} className="block w-full p-2 mt-1 transition border border-gray-300 rounded focus:ring-2 focus:ring-indigo-400 focus:border-indigo-400" required />
                </div>
                <div>
                    <label className="flex items-center gap-1 text-sm font-semibold text-gray-800">
                        Tardanza (jugadas)
                        <span className="text-gray-400 cursor-pointer" title="Si un número no sale en este número de jugadas, su probabilidad se reinicia.">?</span>
                    </label>
                    <input type="number" name="tardanza" value={gameConfig.tardanza} onChange={handleInputChange} className="block w-full p-2 mt-1 transition border border-gray-300 rounded focus:ring-2 focus:ring-indigo-400 focus:border-indigo-400" required />
                </div>
                <div>
                    <label className="flex items-center gap-1 text-sm font-semibold text-gray-800">
                        Cantidad de Vecinos
                        <span className="text-gray-400 cursor-pointer" title="Números laterales considerados en la predicción.">?</span>
                    </label>
                    <input type="number" name="cantidad_vecinos" value={gameConfig.cantidad_vecinos} onChange={handleInputChange} className="block w-full p-2 mt-1 transition border border-gray-300 rounded focus:ring-2 focus:ring-indigo-400 focus:border-indigo-400" required />
                </div>
                <div>
                    <label className="flex items-center gap-1 text-sm font-semibold text-gray-800">
                        Umbral de Probabilidad (%)
                        <span className="text-gray-400 cursor-pointer" title="Probabilidad mínima (entera, sin decimales) para sugerir un número. Ejemplo: 50">?</span>
                    </label>
                    <input type="number" name="umbral_probabilidad" value={gameConfig.umbral_probabilidad} onChange={handleInputChange} min="0" max="100" step="1" className="block w-full p-2 mt-1 transition border border-gray-300 rounded focus:ring-2 focus:ring-indigo-400 focus:border-indigo-400" required />
                </div>
                <button onClick={handleSaveConfig} type="submit" className="w-full py-2 font-semibold text-white transition bg-indigo-600 rounded hover:bg-indigo-700">Guardar Configuración</button>
            </form>
        </Modal>
        {/* Config siempre visible en desktop, acordeón en mobile */}
        <div className={`transition-all duration-300 ease-in-out overflow-hidden md:max-h-full md:opacity-100 md:overflow-visible ${isOpen ? "max-h-[200px] opacity-100" : "max-h-0 opacity-0"}`}>
            <div className="p-4 bg-green-900 rounded-b">
                <div className="flex flex-col items-start justify-center text-xs font-bold text-white">
                    <p>Tipo de ruleta: {gameConfig.tipo}</p>
                    <p>Nombre de ruleta: {gameConfig.nombre_ruleta}</p>
                    <p>Cantidad de vecinos: {gameConfig.cantidad_vecinos}</p>
                    <p>Tardanza (jugadas): {gameConfig.tardanza}</p>
                    <p>Umbral de probabilidad: {gameConfig.umbral_probabilidad}%</p>
                </div>
                <div className="flex flex-col mt-2">
                    <button
                        className="p-2 font-bold text-red-600 transition-all bg-left bg-cover rounded hover:opacity-90"
                        onClick={() => setIsModalOpen(true)}
                    >
                        Reiniciar Juego
                    </button>
                </div>
            </div>
        </div>
    </div>
);

export default ConfiguracionJuego;
