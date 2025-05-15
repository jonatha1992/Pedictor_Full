import React, { useState } from "react";
import Modal from "./Modal";

const iconos = {
    tipo: (
        <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10" /><path d="M12 6v6l4 2" /></svg>
    ),
    nombre: (
        <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M12 20l9-5-9-5-9 5 9 5z" /><path d="M12 12V4" /></svg>
    ),
    tardanza: (
        <svg className="w-5 h-5 text-yellow-500" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10" /><path d="M12 6v6l4 2" /></svg>
    ),
    vecinos: (
        <svg className="w-5 h-5 text-pink-500" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10" /><path d="M8 12h8" /></svg>
    ),
    umbral: (
        <svg className="w-5 h-5 text-indigo-500" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10" /><path d="M12 8v4l3 3" /></svg>
    ),
};

const ConfiguracionJuego = ({
    isOpen,
    setIsOpen,
    isModalOpen,
    setIsModalOpen,
    gameConfig,
    handleInputChange,
    handleSubmit,
    handleSaveConfig,
}) => {
    const [errores, setErrores] = useState({});

    // Validación simple
    const validar = (name, value) => {
        let error = "";
        if (name === "nombre_ruleta" && !value) error = "El nombre es obligatorio";
        if (name === "tardanza" && (value < 1 || value > 20)) error = "Debe ser entre 1 y 20";
        if (name === "cantidad_vecinos" && (value < 0 || value > 4)) error = "Debe ser entre 0 y 4";
        if (name === "umbral_probabilidad" && (value < 0 || value > 100)) error = "Debe ser entre 0 y 100";
        setErrores(prev => ({ ...prev, [name]: error }));
    };

    const onInputChange = (e) => {
        handleInputChange(e);
        validar(e.target.name, e.target.value);
    };

    return (
        <>
            <Modal isOpen={isModalOpen} onClose={null}>
                <form onSubmit={handleSubmit} className="p-2 text-sm bg-white border border-gray-200 rounded-lg shadow-xl md:p-4 md:text-base">
                    <div className="grid grid-cols-1 gap-2 md:grid-cols-2 md:gap-4">
                        <div>
                            <label className="flex items-center gap-2 text-xs font-semibold text-gray-800 md:text-sm">
                                {iconos.tipo} Tipo de Ruleta
                                <span className="text-gray-400 cursor-pointer" title="Ejemplo: Electromecánica. Elige el tipo de ruleta.">?</span>
                            </label>
                            <select
                                name="tipo"
                                value={gameConfig.tipo}
                                onChange={onInputChange}
                                className="block w-full p-2 mt-1 transition border border-gray-300 rounded focus:ring-2 focus:ring-green-400 focus:border-green-400"
                                required
                            >
                                <option value="">Selecciona un tipo</option>
                                <option value="Electromecanica">Electromecánica</option>
                            </select>
                        </div>
                        <div>
                            <label className="flex items-center gap-2 text-xs font-semibold text-gray-800 md:text-sm">
                                {iconos.nombre} Nombre de la Ruleta
                                <span className="text-gray-400 cursor-pointer" title="Identifica tu ruleta.">?</span>
                            </label>
                            <input type="text" name="nombre_ruleta" value={gameConfig.nombre_ruleta} onChange={onInputChange} className={`block w-full p-2 mt-1 transition border ${errores.nombre_ruleta ? "border-red-500" : "border-gray-300"} rounded focus:ring-2 focus:ring-blue-400 focus:border-blue-400`} required />
                            {errores.nombre_ruleta && <span className="text-xs text-red-500">{errores.nombre_ruleta}</span>}
                        </div>
                        <div>
                            <label className="flex items-center gap-2 text-xs font-semibold text-gray-800 md:text-sm">
                                {iconos.tardanza} Tardanza (jugadas)
                                <span className="text-gray-400 cursor-pointer" title="Si un número no sale en este número de jugadas, su probabilidad se reinicia.">?</span>
                            </label>
                            <input type="number" name="tardanza" value={gameConfig.tardanza} onChange={onInputChange} className={`block w-full p-2 mt-1 transition border ${errores.tardanza ? "border-red-500" : "border-gray-300"} rounded focus:ring-2 focus:ring-yellow-400 focus:border-yellow-400`} required />
                            {errores.tardanza && <span className="text-xs text-red-500">{errores.tardanza}</span>}
                        </div>
                        <div>
                            <label className="flex items-center gap-2 text-xs font-semibold text-gray-800 md:text-sm">
                                {iconos.vecinos} Cantidad de Vecinos
                                <span className="text-gray-400 cursor-pointer" title="Números laterales considerados en la predicción.">?</span>
                            </label>
                            <input type="number" name="cantidad_vecinos" value={gameConfig.cantidad_vecinos} onChange={onInputChange} className={`block w-full p-2 mt-1 transition border ${errores.cantidad_vecinos ? "border-red-500" : "border-gray-300"} rounded focus:ring-2 focus:ring-pink-400 focus:border-pink-400`} required />
                            {errores.cantidad_vecinos && <span className="text-xs text-red-500">{errores.cantidad_vecinos}</span>}
                        </div>
                        <div className="md:col-span-2">
                            <label className="flex items-center gap-2 text-xs font-semibold text-gray-800 md:text-sm">
                                {iconos.umbral} Umbral de Probabilidad (%)
                                <span className="text-gray-400 cursor-pointer" title="Probabilidad mínima (entera, sin decimales) para sugerir un número. Ejemplo: 50">?</span>
                            </label>
                            <input type="number" name="umbral_probabilidad" value={gameConfig.umbral_probabilidad} onChange={onInputChange} min="0" max="100" step="1" className={`block w-full p-2 mt-1 transition border ${errores.umbral_probabilidad ? "border-red-500" : "border-gray-300"} rounded focus:ring-2 focus:ring-indigo-400 focus:border-indigo-400`} required />
                            {errores.umbral_probabilidad && <span className="text-xs text-red-500">{errores.umbral_probabilidad}</span>}
                        </div>
                    </div>
                    <button onClick={handleSaveConfig} type="submit" className="flex items-center justify-center w-full gap-2 py-2 mt-4 text-sm font-semibold text-white transition rounded shadow-lg bg-gradient-to-r from-green-600 to-green-800 hover:from-green-700 hover:to-green-900 md:text-base">
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M5 13l4 4L19 7" /></svg>
                        Guardar Configuración
                    </button>
                </form>
            </Modal>
            {/* Config siempre visible en desktop, acordeón en mobile */}
            <div
                className={`flex flex-col gap-1 mt-1 p-2 border border-green-700 bg-gradient-to-br to-green-900 md:p-2 rounded-xl max-w-[220px] min-w-[170px] h-full md:h-full flex-1
                ${isOpen ? 'flex' : 'hidden'} md:flex`}
            >
                <h3 className="w-full pb-1 mb-1 text-lg font-extrabold tracking-wide text-center text-green-200 uppercase border-b border-green-400">Configuración Juego</h3>
                <div className="flex flex-col gap-0.5 w-full flex-1 justify-center text-[13px] font-semibold text-white">
                    <div className="flex items-center justify-between w-full"><span className="text-green-200">Tipo:</span> <span className="bg-green-700 px-2 py-0.5 rounded text-xs ml-2">{gameConfig.tipo}</span></div>
                    <div className="flex items-center justify-between w-full"><span className="text-green-200">Ruleta:</span> <span className="bg-blue-700 px-2 py-0.5 rounded text-xs ml-2">{gameConfig.nombre_ruleta}</span></div>
                    <div className="flex items-center justify-between w-full"><span className="text-green-200">Vecinos:</span> <span className="bg-pink-700 px-2 py-0.5 rounded text-xs ml-2">{gameConfig.cantidad_vecinos}</span></div>
                    <div className="flex items-center justify-between w-full"><span className="text-green-200">Tardanza:</span> <span className="bg-yellow-700 px-2 py-0.5 rounded text-xs ml-2">{gameConfig.tardanza}</span></div>
                    <div className="flex items-center justify-between w-full"><span className="text-green-200">Umbral:</span> <span className="bg-indigo-700 px-2 py-0.5 rounded text-xs ml-2">{gameConfig.umbral_probabilidad}%</span></div>
                </div>
                <button
                    className="self-end w-full p-1 text-xs font-bold text-white transition-all border border-green-700 rounded shadow bg-gradient-to-r from-green-600 to-green-900 hover:opacity-90"
                    style={{ marginTop: "auto" }}
                    onClick={() => setIsModalOpen(true)}>
                    Reiniciar Juego
                </button>
            </div>
        </>
    );
};

export default ConfiguracionJuego;