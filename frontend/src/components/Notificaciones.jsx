import React, { useState, useEffect, useRef } from 'react';

const Notificaciones = ({ notificaciones }) => {
  const [notificacionesActivas, setNotificacionesActivas] = useState([]);
  const [historial, setHistorial] = useState([]);
  const historialRef = useRef(null);

  useEffect(() => {
    if (notificaciones.length > 0) {
      const nuevaNotificacion = notificaciones[notificaciones.length - 1];
      setNotificacionesActivas(prev => [...prev, nuevaNotificacion]);
      
      setTimeout(() => {
        setNotificacionesActivas(prev => prev.filter(n => n !== nuevaNotificacion));
        setHistorial(prev => [...prev, nuevaNotificacion]);
      }, 1000);
    }
  }, [notificaciones]);

  useEffect(() => {
    if (historialRef.current) {
      historialRef.current.scrollTop = historialRef.current.scrollHeight;
    }
  }, [historial]);

  return (
    <div className="bg-transparent w-full h-full flex flex-col relative">
      {/* Notificaciones activas */}
      <div className="absolute top-0 left-0 right-0 z-10">
        {notificacionesActivas.map((notificacion, index) => (
          <div key={index} className="bg-blue-500 bg-opacity-50 text-white p-2 rounded shadow-lg animate-fade-in-down mb-2 text-end">
            {notificacion}
          </div>
        ))}
      </div>
      
      {/* Historial de notificaciones */}
      <div ref={historialRef} className="bg-transparent p-2 rounded shadow-lg overflow-y-auto flex-grow">
        <ul className="space-y-1">
          {historial.map((notificacion, index) => (
            <li key={index} className="text-sm text-white">{notificacion}</li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default Notificaciones;