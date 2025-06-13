import { createRoot } from "react-dom/client";
import TestApp from "./TestApp";
import "./index.css";

const rootElement = document.getElementById("root");
if (rootElement) {
  createRoot(rootElement).render(<TestApp />);
} else {
  console.error("Root element not found");
}
