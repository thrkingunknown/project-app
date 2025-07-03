import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";
import { BrowserRouter } from "react-router-dom";
import { CustomThemeProvider } from "./contexts/ThemeContext.jsx";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <CustomThemeProvider>
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </CustomThemeProvider>
  </StrictMode>,
);
