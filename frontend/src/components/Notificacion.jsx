import React from 'react';

const Notificacion = ({ mensaje, visible, saliendo }) => {
    if (!visible) return null;

    return (
        <div
            className={`fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 
      ${saliendo ? 'opacity-0 scale-110' : 'opacity-100 scale-100'} 
      bg-gradient-to-br from-green-600/95 to-teal-800/95 text-white py-3 px-6 
      rounded-lg shadow-2xl z-50 font-bold text-center text-base md:text-lg 
      border-2 border-green-300 max-w-[90vw] transition-all duration-300`}
        >
            {mensaje}
        </div>
    );
};

export default Notificacion;
