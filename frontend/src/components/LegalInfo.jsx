// src/components/LegalInfo.jsx
import React from "react";

const LegalInfo = () => (
  <div className="space-y-8 text-base leading-relaxed text-white/90">
    <section>
      <h2 className="mb-2 text-2xl font-bold text-highlight">Términos y Condiciones</h2>
      <p>
        Al utilizar Spin Predictor, aceptas cumplir con estos términos y condiciones. El servicio está destinado únicamente para fines informativos y de entretenimiento. No garantizamos resultados ni ganancias. El uso indebido de la plataforma puede resultar en la suspensión de la cuenta.
      </p>
    </section>
    <section>
      <h2 className="mb-2 text-2xl font-bold text-highlight">Política de Privacidad</h2>
      <p>
        Spin Predictor respeta tu privacidad. Recopilamos únicamente la información necesaria para el funcionamiento de la aplicación, como correo electrónico y datos de uso. No compartimos tus datos con terceros sin tu consentimiento, salvo requerimiento legal. Puedes solicitar la eliminación de tu cuenta y datos en cualquier momento.
      </p>
    </section>
    <section>
      <h2 className="mb-2 text-2xl font-bold text-highlight">Responsabilidad</h2>
      <p>
        El usuario es responsable del uso que haga de la información proporcionada por la app. Spin Predictor no se hace responsable por pérdidas económicas derivadas del uso de las predicciones. El juego debe ser realizado de manera responsable y legal según la jurisdicción del usuario.
      </p>
    </section>
    <section>
      <h2 className="mb-2 text-2xl font-bold text-highlight">Contacto</h2>
      <p>
        Para consultas sobre estos términos o la privacidad, puedes contactarnos a través de la sección de contacto de la app o al correo soporte@spinpredictor.com.
      </p>
    </section>
  </div>
);

export default LegalInfo;
