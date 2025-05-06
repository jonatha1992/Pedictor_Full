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
    <div className="bg-green-700 rounded p-4 flex flex-col justify-between">
        <button
            className="flex items-center justify-between w-full p-3 font-bold text-white bg-green-600 rounded-t"
            onClick={() => setIsOpen(!isOpen)}
        >
            <span>Configuración del juego</span>
            <span className={`transform transition-transform duration-200 ${isOpen ? "rotate-180" : ""}`}>▼</span>
        </button>
        <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
            <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                    <label className="block text-sm font-medium text-gray-700">Tipo de Ruleta</label>
                    <input type="text" name="tipo" value={gameConfig.tipo} onChange={handleInputChange} className="block w-full p-2 mt-1 border border-gray-300 rounded-md" required />
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700">Nombre de la Ruleta</label>
                    <input type="text" name="nombre_ruleta" value={gameConfig.nombre_ruleta} onChange={handleInputChange} className="block w-full p-2 mt-1 border border-gray-300 rounded-md" required />
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700">Tardanza (en segundos)</label>
                    <input type="number" name="tardanza" value={gameConfig.tardanza} onChange={handleInputChange} className="block w-full p-2 mt-1 border border-gray-300 rounded-md" required />
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700">Cantidad de Vecinos</label>
                    <input type="number" name="cantidad_vecinos" value={gameConfig.cantidad_vecinos} onChange={handleInputChange} className="block w-full p-2 mt-1 border border-gray-300 rounded-md" required />
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700">Umbral de Probabilidad</label>
                    <input type="number" name="umbral_probabilidad" value={gameConfig.umbral_probabilidad} onChange={handleInputChange} step="0.01" className="block w-full p-2 mt-1 border border-gray-300 rounded-md" required />
                </div>
                <button onClick={handleSaveConfig} type="submit" className="w-full py-2 text-white bg-green-500 rounded hover:bg-green-600">Guardar Configuración</button>
            </form>
        </Modal>
        {/* Contenido del acordeón */}
        <div className={`transition-all duration-300 ease-in-out overflow-hidden ${isOpen ? "max-h-[200px] opacity-100" : "max-h-0 opacity-0"}`}>
            <div className="p-4 bg-green-900 rounded-b">
                <div className="flex flex-col items-start justify-center text-xs font-bold text-white">
                    <p>Tipo de ruleta: {gameConfig.tipo}</p>
                    <p>Cantidad de vecinos: {gameConfig.cantidad_vecinos}</p>
                    <p>Nombre de ruleta: {gameConfig.nombre_ruleta}</p>
                    <p>Umbral de probabilidad: {gameConfig.umbral_probabilidad}</p>
                </div>
                <div className="flex flex-col mt-2">
                    <button
                        className="p-2 font-bold text-red-600 transition-all bg-left bg-cover rounded hover:opacity-90"
                        onClick={() => setIsModalOpen(true)}
                        style={{
                            backgroundImage: `url(${crupiers})`,
                            backgroundPositionY: "top",
                            textShadow: "#ffffff 1px -1px 4px, #ffffff 1px -1px 4px, #ffffff 1px -1px 4px",
                            boxShadow: "rgba(0, 0, 0, 0.75) -13px 15px 11px 0px",
                        }}
                    >
                        Reiniciar Juego
                    </button>
                </div>
            </div>
        </div>
    </div>
);

export default ConfiguracionJuego;
