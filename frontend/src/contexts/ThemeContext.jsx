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
    document.documentElement.setAttribute(
      'data-mui-color-scheme',
      isDarkMode ? 'dark' : 'light'
    );
    document.body.setAttribute(
      'data-mui-color-scheme',
      isDarkMode ? 'dark' : 'light'
    );
  }, [isDarkMode]);

  const toggleDarkMode = () => {
    setIsDarkMode((prev) => !prev);
  };

  const lightTheme = createTheme({
    palette: {
      mode: "light",
      primary: {
        main: "#007AFF",
        light: "#4DA3FF",
        dark: "#0056CC",
        contrastText: "#FFFFFF",
      },
      secondary: {
        main: "#E5E5EA",
        light: "#F2F2F7",
        dark: "#D1D1D6",
        contrastText: "#000000",
      },
      background: {
        default: "#FFFFFF",
        paper: "#F5F5F7",
      },
      text: {
        primary: "#000000",
        secondary: "#6D6D70",
      },
      divider: "#E5E5EA",
      action: {
        hover: "rgba(0, 122, 255, 0.04)",
        selected: "rgba(0, 122, 255, 0.08)",
        disabled: "rgba(60, 60, 67, 0.3)",
        disabledBackground: "rgba(60, 60, 67, 0.12)",
      },
    },
    components: {
      MuiAppBar: {
        styleOverrides: {
          root: {
            backgroundColor: "#FFFFFF",
            backdropFilter: "blur(20px)",
            borderBottom: "1px solid rgba(229, 229, 234, 0.6)",
            boxShadow: "0 1px 3px rgba(0, 0, 0, 0.1)",
          },
        },
      },
      MuiCard: {
        styleOverrides: {
          root: {
            backgroundColor: "#F5F5F7",
            borderRadius: "12px",
            border: "1px solid rgba(229, 229, 234, 0.6)",
            boxShadow: "0 4px 16px rgba(0, 0, 0, 0.08)",
            transition: "all 0.2s ease-in-out",
            "&:hover": {
              transform: "translateY(-2px)",
              boxShadow: "0 8px 24px rgba(0, 0, 0, 0.12)",
            },
          },
        },
      },
      MuiButton: {
        styleOverrides: {
          root: {
            borderRadius: "8px",
            textTransform: "none",
            fontWeight: 600,
            transition: "all 0.2s ease-in-out",
          },
          contained: {
            boxShadow: "0 2px 8px rgba(0, 122, 255, 0.3)",
            "&:hover": {
              boxShadow: "0 4px 12px rgba(0, 122, 255, 0.4)",
              transform: "translateY(-1px)",
            },
          },
        },
      },
    },
  });

  const darkTheme = createTheme({
    palette: {
      mode: "dark",
      primary: {
        main: "#0A84FF",
        light: "#4DA3FF",
        dark: "#0056CC",
        contrastText: "#FFFFFF",
      },
      secondary: {
        main: "#3A3A3C",
        light: "#48484A",
        dark: "#2C2C2E",
        contrastText: "#FFFFFF",
      },
      background: {
        default: "#1C1C1E",
        paper: "#2C2C2E",
      },
      text: {
        primary: "#FFFFFF",
        secondary: "#AEAEB2",
      },
      divider: "#3A3A3C",
      action: {
        hover: "rgba(10, 132, 255, 0.08)",
        selected: "rgba(10, 132, 255, 0.16)",
        disabled: "rgba(235, 235, 245, 0.3)",
        disabledBackground: "rgba(235, 235, 245, 0.12)",
      },
    },
    components: {
      MuiAppBar: {
        styleOverrides: {
          root: {
            backgroundColor: "#1C1C1E",
            backdropFilter: "blur(20px)",
            borderBottom: "1px solid rgba(58, 58, 60, 0.6)",
            boxShadow: "0 1px 3px rgba(0, 0, 0, 0.3)",
          },
        },
      },
      MuiCard: {
        styleOverrides: {
          root: {
            backgroundColor: "#2C2C2E",
            borderRadius: "12px",
            border: "1px solid rgba(58, 58, 60, 0.6)",
            boxShadow: "0 4px 16px rgba(0, 0, 0, 0.3)",
            transition: "all 0.2s ease-in-out",
            "&:hover": {
              transform: "translateY(-2px)",
              boxShadow: "0 8px 24px rgba(0, 0, 0, 0.4)",
            },
          },
        },
      },
      MuiButton: {
        styleOverrides: {
          root: {
            borderRadius: "8px",
            textTransform: "none",
            fontWeight: 600,
            transition: "all 0.2s ease-in-out",
          },
          contained: {
            boxShadow: "0 2px 8px rgba(10, 132, 255, 0.3)",
            "&:hover": {
              boxShadow: "0 4px 12px rgba(10, 132, 255, 0.4)",
              transform: "translateY(-1px)",
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
