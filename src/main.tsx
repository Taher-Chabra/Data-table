import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import { PrimeReactProvider } from "primereact/api";
import "primereact/resources/primereact.css";
import "primereact/resources/themes/soho-light/theme.css";
import "primeicons/primeicons.css";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <PrimeReactProvider>
      <div style={{backgroundColor: '#f1f1f1'}}>
        <App />
      </div>
    </PrimeReactProvider>
  </StrictMode>
);
