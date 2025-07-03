import React, { useState, useEffect } from "react";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import { CssBaseline } from "@mui/material";
import { ThemeContext } from "./ThemeContextDefinition";

export const CustomThemeProvider = ({ children }) => {
  const [isDarkMode, setIsDarkMode] = useState(() => {
    const savedTheme = localStorage.getItem("darkMode");
    return savedTheme ? JSON.parse(savedTheme) : false;
  });

  useEffect(() => {
    localStorage.setItem("darkMode", JSON.stringify(isDarkMode));
  }, [isDarkMode]);

  const toggleDarkMode = () => {
    setIsDarkMode((prev) => !prev);
  };

  const lightTheme = createTheme({
    palette: {
      mode: "light",
      primary: {
        main: "#1976d2",
      },
      secondary: {
        main: "#dc004e",
      },
      background: {
        default: "#ffffff",
        paper: "#f5f5f5",
      },
      text: {
        primary: "#000000",
        secondary: "#666666",
      },
    },
    components: {
      MuiAppBar: {
        styleOverrides: {
          root: {
            backgroundColor: "#1976d2",
          },
        },
      },
      MuiCard: {
        styleOverrides: {
          root: {
            backgroundColor: "#ffffff",
            boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
          },
        },
      },
    },
  });

  const darkTheme = createTheme({
    palette: {
      mode: "dark",
      primary: {
        main: "#90caf9",
      },
      secondary: {
        main: "#f48fb1",
      },
      background: {
        default: "#121212",
        paper: "#1e1e1e",
      },
      text: {
        primary: "#ffffff",
        secondary: "#b0b0b0",
      },
    },
    components: {
      MuiAppBar: {
        styleOverrides: {
          root: {
            backgroundColor: "#1e1e1e",
          },
        },
      },
      MuiCard: {
        styleOverrides: {
          root: {
            backgroundColor: "#2d2d2d",
            boxShadow: "0 2px 8px rgba(0,0,0,0.3)",
          },
        },
      },
      MuiButton: {
        styleOverrides: {
          outlined: {
            borderColor: "#90caf9",
            color: "#90caf9",
            "&:hover": {
              borderColor: "#64b5f6",
              backgroundColor: "rgba(144, 202, 249, 0.04)",
            },
          },
        },
      },
    },
  });

  const theme = isDarkMode ? darkTheme : lightTheme;

  return (
    <ThemeContext.Provider value={{ isDarkMode, toggleDarkMode }}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        {children}
      </ThemeProvider>
    </ThemeContext.Provider>
  );
};
