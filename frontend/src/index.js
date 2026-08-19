import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App";

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
);

// Mode hors-ligne (PWA) : enregistre le service worker qui met en cache l'app
// (HTML/JS/CSS) pour qu'elle reste consultable sans connexion. Les appels API
// vers le backend, eux, ne sont jamais mis en cache (voir service-worker.js).
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/service-worker.js').catch(() => {
      // Échec silencieux : l'app fonctionne normalement sans mode hors-ligne
    });
  });
}
