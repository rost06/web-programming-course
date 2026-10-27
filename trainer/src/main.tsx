import { createRoot } from "react-dom/client";
import App from "./App";


const rootElement = document.getElementById("root");
if (!rootElement) throw new Error("Root element is missing");

// запуск приложения
createRoot(rootElement).render(<App />);