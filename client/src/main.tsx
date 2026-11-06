import { hydrateRoot } from "react-dom/client";
import App from "./App";
import "./index.css";
import "./styles/akibit.css";

hydrateRoot(document.getElementById("root")!, <App />);

// Installable app: register the service worker once the page has loaded (production only).
if ("serviceWorker" in navigator && import.meta.env.PROD) {
  window.addEventListener("load", () => {
    navigator.serviceWorker.register("/sw.js").catch(() => {
      /* no offline support; the site still works */
    });
  });
}
