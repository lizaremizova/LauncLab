import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import "primereact/resources/themes/lara-light-cyan/theme.css";
import "primereact/resources/primereact.min.css";
import "primeicons/primeicons.css";
import { PrimeReactProvider } from 'primereact/api';
import "/node_modules/primeflex/primeflex.css";

ReactDOM.createRoot(document.getElementById("root")).render(
    <React.StrictMode>
        <PrimeReactProvider>
            <App />
        </PrimeReactProvider>
    </React.StrictMode>,
);
