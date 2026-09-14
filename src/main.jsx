import React from "react";
import { createRoot } from "react-dom/client";
import FitnessApp from "./FitnessApp.jsx";
import "./styles.css";

createRoot(document.getElementById("root")).render(<FitnessApp />);


// Register the service worker for offline/PWA support.
if ("serviceWorker" in navigator) {
  window.addEventListener("load", () => {
    navigator.serviceWorker.register("./sw.js").catch((error) => {
      console.warn("SPLIT RUN service worker registration failed:", error);
    });
  });
}
