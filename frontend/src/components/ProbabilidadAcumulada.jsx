import React from "react";
import Probabilidades from "./Probabilidades";


const ProbabilidadAcumulada = ({ historial, backgroundImage1, maxRepeticiones }) => (
    <div className="flex flex-col h-full p-4 bg-green-200 rounded">
        <div className="flex flex-col items-center justify-center h-full text-center text-white bg-center bg-cover"  >
            <Probabilidades historial={historial} maxRepeticiones={maxRepeticiones} />
        </div>
    </div >
);

export default ProbabilidadAcumulada;
