import React from "react";
import Probabilidades from "./Probabilidades";

const ProbabilidadAcumulada = ({ historial, backgroundImage1 }) => (
    <div className="bg-green-200 rounded p-4 flex flex-col h-full">
        <div className="h-full text-center text-white bg-center bg-cover flex flex-col justify-center items-center" style={{ backgroundImage: `url(${backgroundImage1})` }}>
            <Probabilidades historial={historial} />
        </div>
    </div>
);

export default ProbabilidadAcumulada;
