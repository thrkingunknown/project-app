import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";
import { BrowserRouter } from "react-router-dom";
import { CustomThemeProvider } from "./contexts/ThemeContext.jsx";
import { SpeedInsights } from "@vercel/speed-insights/react";
import { Analytics } from "@vercel/analytics/react";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <SpeedInsights />
    <Analytics />
    <CustomThemeProvider>
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </CustomThemeProvider>
  </StrictMode>,
);
