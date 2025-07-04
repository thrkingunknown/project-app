import React, { useState, useEffect } from "react";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import { CssBaseline } from "@mui/material";
import { ThemeContext } from "./ThemeContextDefinition";
import { cyan } from "@mui/material/colors";

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
        main: cyan["A400"],
      },
      secondary: {
        main: cyan["A700"],
      },
      background: {
        default: "hsl(174, 50%, 95%)",
        paper: "hsl(174, 50%, 98%)",
      },
      text: {
        primary: "hsl(175, 79.90%, 33.10%)",
        secondary: "hsl(174, 30%, 30%)",
      },
    },
    components: {
      MuiAppBar: {
        styleOverrides: {
          root: {
            backgroundColor: "hsl(175, 71.60%, 30.40%)",
          },
        },
      },
      MuiCard: {
        styleOverrides: {
          root: {
            backgroundColor: "hsl(174, 50%, 98%)",
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
        main: cyan["A100"],
      },
      secondary: {
        main: cyan["A200"],
      },
      background: {
        default: "hsl(174, 50%, 5%)",
        paper: "hsl(174, 50%, 8%)",
      },
      text: {
        primary: "hsl(174, 50%, 90%)",
        secondary: "hsl(174, 30%, 70%)",
      },
    },
    components: {
      MuiAppBar: {
        styleOverrides: {
          root: {
            backgroundColor: "hsl(174, 50%, 8%)",
          },
        },
      },
      MuiCard: {
        styleOverrides: {
          root: {
            backgroundColor: "hsl(174, 50%, 8%)",
            boxShadow: "2px 2px 8px hsl(0, 0.00%, 0.00%)",
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
