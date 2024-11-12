import { createContext, useState, useMemo, useContext } from "react";
import { createTheme } from "@mui/material";

export const token = (mode) => ({
  ...(mode === "dark"
    ? {
        gray: {
          100: "#d2d3d3",
          200: "#a5a7a6",
          300: "#797c7a",
          400: "#4c504d",
          500: "#1f2421",
          600: "#191d1a",
          700: "#131614",
          800: "#0c0e0d",
          900: "#060707",
        },
        primary: {
          100: "#0f2310",
          200: "#1e4620",
          300: "#2e6930",
          400: "#3d8c40",
          500: "#4caf50",
          600: "#70bf73",
          700: "#94cf96",
          800: "#b7dfb9",
          900: "#dbefdc",
        },
      }
    : {
        gray: {
          100: "#060707",
          200: "#0c0e0d",
          300: "#131614",
          400: "#191d1a",
          500: "#1f2421",
          600: "#4c504d",
          700: "#797c7a",
          800: "#a5a7a6",
          900: "#d2d3d3",
        },
        primary: {
          100: "#dbefdc",
          200: "#b7dfb9",
          300: "#94cf96",
          400: "#70bf73",
          500: "#4caf50",
          600: "#3d8c40",
          700: "#2e6930",
          800: "#1e4620",
          900: "#0f2310",
        },
      }),
});

export const themeSettings = (mode) => {
  const colors = token(mode);

  return {
    palette: {
      mode: mode,
      ...(mode === "light"
        ? {
            background: {
              default: "#f4f4f4",
            },
          }
        : {}),
    },
    typography: {
      fontFamily: ["Source Sans 3", "sans-serif"].join(","),
      fontSize: 12,
      h1: {
        fontFamily: ["Source Sans 3", "sans-serif"].join(","),
        fontSize: 40,
      },
      h2: {
        fontFamily: ["Source Sans 3", "sans-serif"].join(","),
        fontSize: 32,
      },
      h3: {
        fontFamily: ["Source Sans 3", "sans-serif"].join(","),
        fontSize: 24,
      },
      h4: {
        fontFamily: ["Source Sans 3", "sans-serif"].join(","),
        fontSize: 20,
      },
      h5: {
        fontFamily: ["Source Sans 3", "sans-serif"].join(","),
        fontSize: 16,
      },
      h6: {
        fontFamily: ["Source Sans 3", "sans-serif"].join(","),
        fontSize: 14,
      },
    },
  };
};

export const ColorModeContext = createContext({
  toggleColorMode: () => {},
});

export const useMode = () => {
  const [mode, setMode] = useState("light");

  const colorMode = useMemo(
    () => ({
      toggleColorMode: () =>
        setMode((prev) => (prev === "light" ? "dark" : "light")),
    }),
    []
  );

  const theme = useMemo(() => createTheme(themeSettings(mode)), [mode]);

  return [theme, colorMode];
};
