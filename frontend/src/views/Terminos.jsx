// src/views/Terminos.jsx
import React from "react";
import LegalInfo from "../components/LegalInfo";

const Terminos = () => (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 via-green-900 to-black px-4 py-12">
        <div className="max-w-2xl w-full p-10 rounded-xl shadow-2xl border border-green-700 bg-gradient-to-br from-green-800 to-green-900 flex flex-col items-center justify-center">
            <h1 className="text-3xl font-extrabold text-highlight drop-shadow-lg mb-8">Términos y Privacidad</h1>
            <LegalInfo />
        </div>
    </div>
);

export default Terminos;
