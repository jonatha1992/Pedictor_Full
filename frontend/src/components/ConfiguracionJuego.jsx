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

// Componente reutilizable de confirmación (profesional)
const ConfirmDialog = ({ open, mensaje, onConfirm, onCancel }) => {
    const aceptarRef = React.useRef(null);

    React.useEffect(() => {
        if (open && aceptarRef.current) {
            aceptarRef.current.focus();
        }
    }, [open]);

    if (!open) return null;
    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center transition-opacity bg-black bg-opacity-50 animate-fade-in">
            <div className="w-full max-w-sm p-6 text-center bg-white border-2 border-green-700 shadow-2xl rounded-xl animate-scale-in">
                <div className="flex flex-col items-center">
                    <div className="mb-2">
                        <svg className="w-12 h-12 mx-auto text-yellow-500" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                            <circle cx="12" cy="12" r="10" className="text-yellow-300 stroke-current" fill="#FEF9C3" />
                            <path d="M12 8v4m0 4h.01" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                    </div>
                    <div className="mb-4 text-lg font-semibold text-gray-800">{mensaje}</div>
                    <div className="flex justify-center gap-4 mt-2">
                        <button
                            ref={aceptarRef}
                            className="px-5 py-2 font-bold text-white transition bg-green-700 rounded-lg shadow hover:bg-green-800 focus:outline-none focus:ring-2 focus:ring-green-400"
                            onClick={onConfirm}
                        >
                            Aceptar
                        </button>
                        <button
                            className="px-5 py-2 font-bold text-gray-800 transition bg-gray-300 rounded-lg shadow hover:bg-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-400"
                            onClick={onCancel}
                        >
                            Cancelar
                        </button>
                    </div>
                </div>
            </div>
            {/* Animaciones Tailwind personalizadas */}
            <style>{`
                .animate-fade-in { animation: fadeIn 0.18s ease; }
                .animate-scale-in { animation: scaleIn 0.18s cubic-bezier(.4,2,.6,1); }
                @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
                @keyframes scaleIn { from { transform: scale(0.95); opacity: 0; } to { transform: scale(1); opacity: 1; } }
            `}</style>
        </div>
    );
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
    const [errores, setErrores] = useState({});    // Validación simple
    const validar = (name, value) => {
        let error = "";
        if (name === "nombre_ruleta" && !value) error = "El nombre es obligatorio";
        if (name === "tardanza" && value !== "") {
            const numValue = Number(value);
            if (numValue < 1 || numValue > 20) error = "Debe ser entre 1 y 20";
        }
        if (name === "cantidad_vecinos" && value !== "") {
            const numValue = Number(value);
            if (numValue < 0 || numValue > 4) error = "Debe ser entre 0 y 4";
        }
        if (name === "umbral_probabilidad" && value !== "") {
            const numValue = Number(value);
            if (numValue < 1 || numValue > 100) error = "Debe ser entre 1 y 100";
        }
        setErrores(prev => ({ ...prev, [name]: error }));
    };

    const onInputChange = (e) => {
        handleInputChange(e);
        validar(e.target.name, e.target.value);
    };

    const [showConfirm, setShowConfirm] = useState(false);

    // Nueva función para reinicio total usando ConfirmDialog
    const handleReiniciarTotal = () => {
        setShowConfirm(true);
    };
    const confirmarReinicio = () => {
        setShowConfirm(false);
        if (typeof window.reiniciarJuegoTotal === 'function') {
            window.reiniciarJuegoTotal();
        }
        if (typeof setIsModalOpen === 'function') setIsModalOpen(false);
    };
    const cancelarReinicio = () => setShowConfirm(false);

    return (
        <>
            {/* Modal solo para editar configuración */}
            <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
                {/* Marco verde relativo para posicionar la X */}
                <div className="relative">
                    {/* Botón X para cerrar el modal, en el marco verde */}
                    <button
                        type="button"
                        aria-label="Cerrar"
                        onClick={() => setIsModalOpen(false)}
                        className="absolute z-20 p-1 bg-gray-200 rounded-full top-2 right-2 hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-red-400"
                        style={{ lineHeight: 0 }}
                    >
                        <svg className="w-5 h-5 text-gray-700" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                            <line x1="18" y1="6" x2="6" y2="18" strokeLinecap="round" />
                            <line x1="6" y1="6" x2="18" y2="18" strokeLinecap="round" />
                        </svg>
                    </button>
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
                                <input type="number" name="tardanza" min="1" max="20" step="1" value={gameConfig.tardanza} placeholder="5" onChange={onInputChange} className={`block w-full p-2 mt-1 transition border ${errores.tardanza ? "border-red-500" : "border-gray-300"} rounded focus:ring-2 focus:ring-yellow-400 focus:border-yellow-400`} required />
                                {errores.tardanza && <span className="text-xs text-red-500">{errores.tardanza}</span>}
                            </div>
                            <div>
                                <label className="flex items-center gap-2 text-xs font-semibold text-gray-800 md:text-sm">
                                    {iconos.vecinos} Cantidad de Vecinos
                                    <span className="text-gray-400 cursor-pointer" title="Números laterales considerados en la predicción.">?</span>
                                </label>
                                <input type="number" name="cantidad_vecinos" min="0" max="4" step="1" value={gameConfig.cantidad_vecinos} placeholder="1" onChange={onInputChange} className={`block w-full p-2 mt-1 transition border ${errores.cantidad_vecinos ? "border-red-500" : "border-gray-300"} rounded focus:ring-2 focus:ring-pink-400 focus:border-pink-400`} required />
                                {errores.cantidad_vecinos && <span className="text-xs text-red-500">{errores.cantidad_vecinos}</span>}
                            </div>
                            <div className="md:col-span-2">
                                <label className="flex items-center gap-2 text-xs font-semibold text-gray-800 md:text-sm">
                                    {iconos.umbral} Umbral de Probabilidad (%)
                                    <span className="text-gray-400 cursor-pointer" title="Probabilidad mínima (entera, sin decimales) para sugerir un número. Ejemplo: 50">?</span>
                                </label>
                                <input type="number" name="umbral_probabilidad" value={gameConfig.umbral_probabilidad} placeholder="50" onChange={onInputChange} min="1" max="100" step="1" className={`block w-full p-2 mt-1 transition border ${errores.umbral_probabilidad ? "border-red-500" : "border-gray-300"} rounded focus:ring-2 focus:ring-indigo-400 focus:border-indigo-400`} required />
                                {errores.umbral_probabilidad && <span className="text-xs text-red-500">{errores.umbral_probabilidad}</span>}
                            </div>
                        </div>
                        <button onClick={handleSaveConfig} type="submit" className="flex items-center justify-center w-full gap-2 py-2 mt-4 text-sm font-semibold text-white transition rounded shadow-lg bg-gradient-to-r from-green-600 to-green-800 hover:from-green-700 hover:to-green-900 md:text-base">
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M5 13l4 4L19 7" /></svg>
                            Guardar Cambios
                        </button>
                    </form>
                </div>
            </Modal>
            {/* Confirmación personalizada para reinicio total */}
            <ConfirmDialog
                open={showConfirm}
                mensaje="¿Estás seguro que quieres reiniciar el juego? Se borrarán todos los números y estadísticas."
                onConfirm={confirmarReinicio}
                onCancel={cancelarReinicio}
            />
            {/* Config siempre visible en desktop, acordeón en mobile */}
            <div
                className={`flex flex-col gap-1 mt-1 p-2 border border-green-700 bg-gradient-to-br to-green-900 md:p-2 rounded-xl w-full max-w-xs h-full md:h-full flex-1 mx-auto
                ${(isOpen || window.innerWidth >= 768) ? 'flex' : 'hidden'} md:flex`}
                style={{ fontSize: "15px" }}
            >
                <h3 className="w-full pb-1 mb-1 text-lg font-extrabold tracking-wide text-center text-green-200 uppercase border-b border-green-400">Configuración Juego</h3>
                <div className="flex flex-col gap-0.5 w-full flex-1 justify-center font-semibold text-white">
                    <div className="flex items-center justify-between w-full"><span className="text-green-200">Tipo:</span> <span className="bg-green-700 px-2 py-0.5 rounded text-sm ml-2">{gameConfig.tipo}</span></div>
                    <div className="flex items-center justify-between w-full"><span className="text-green-200">Ruleta:</span> <span className="bg-blue-700 px-2 py-0.5 rounded text-sm ml-2">{gameConfig.nombre_ruleta}</span></div>
                    <div className="flex items-center justify-between w-full"><span className="text-green-200">Vecinos:</span> <span className="bg-pink-700 px-2 py-0.5 rounded text-sm ml-2">{gameConfig.cantidad_vecinos}</span></div>
                    <div className="flex items-center justify-between w-full"><span className="text-green-200">Tardanza:</span> <span className="bg-yellow-700 px-2 py-0.5 rounded text-sm ml-2">{gameConfig.tardanza}</span></div>
                    <div className="flex items-center justify-between w-full"><span className="text-green-200">Umbral:</span> <span className="bg-indigo-700 px-2 py-0.5 rounded text-sm ml-2">{gameConfig.umbral_probabilidad}%</span></div>
                </div>
                {/* Botón para abrir modal de configuración */}
                <button
                    className="w-full p-1 mt-2 text-xs font-bold text-white transition-all border border-green-700 rounded shadow bg-gradient-to-r from-blue-600 to-blue-900 hover:opacity-90"
                    onClick={() => setIsModalOpen(true)}>
                    Cambiar Configuración
                </button>
                {/* Botón para reiniciar total */}
                <button
                    className="w-full p-1 text-xs font-bold text-white transition-all border border-red-700 rounded shadow bg-gradient-to-r from-red-600 to-red-900 hover:opacity-90 "
                    onClick={handleReiniciarTotal}>
                    Reiniciar Juego (Total)
                </button>
            </div>
        </>
    );
};

export default ConfiguracionJuego;