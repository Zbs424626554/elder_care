// import { StrictMode } from 'react'
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.tsx";

createRoot(document.getElementById("root")!).render(
  // 开发期可启用 StrictMode，但会导致 useEffect 执行两次
  // <StrictMode>
  <App />
  // </StrictMode>
);
