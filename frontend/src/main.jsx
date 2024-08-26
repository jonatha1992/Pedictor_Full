import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App.jsx";
import "./index.css";
import "./config/i18n.jsx"; // Importa la configuración de i18n

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <App />
  </StrictMode>
);
