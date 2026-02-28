import React, { createContext, useContext, useEffect, useState } from "react";

type Theme = "light" | "dark" | "system";
type ColorTheme = "rose" | "blue" | "violet" | "orange" | "cyan";

interface ThemeContextValue {
  theme: Theme;
  setTheme: (theme: Theme) => void;
  colorTheme: ColorTheme;
  setColorTheme: (theme: ColorTheme) => void;
}

const ThemeContext = createContext<ThemeContextValue>({
  theme: "system",
  setTheme: () => { },
  colorTheme: "orange",
  setColorTheme: () => { },
});

export function ThemeProvider({
  children,
  defaultTheme = "system",
  defaultColorTheme = "orange",
  storageKey = "vite-ui-theme",
  colorStorageKey = "vite-ui-color-theme",
}: {
  children: React.ReactNode;
  defaultTheme?: Theme;
  defaultColorTheme?: ColorTheme;
  storageKey?: string;
  colorStorageKey?: string;
}) {
  const [theme, setThemeState] = useState<Theme>(() => {
    return (localStorage.getItem(storageKey) as Theme) || defaultTheme;
  });

  const [colorTheme, setColorThemeState] = useState<ColorTheme>(() => {
    return (localStorage.getItem(colorStorageKey) as ColorTheme) || defaultColorTheme;
  });

  const setTheme = (newTheme: Theme) => {
    setThemeState(newTheme);
    localStorage.setItem(storageKey, newTheme);
  };

  const setColorTheme = (newColorTheme: ColorTheme) => {
    setColorThemeState(newColorTheme);
    localStorage.setItem(colorStorageKey, newColorTheme);
  };

  // Apply mode (light/dark)
  useEffect(() => {
    const root = window.document.documentElement;

    const systemDark = window.matchMedia("(prefers-color-scheme: dark)").matches;

    let appliedTheme =
      theme === "system" ? (systemDark ? "dark" : "light") : theme;

    root.classList.remove("light", "dark");
    root.classList.add(appliedTheme);
  }, [theme]);

  // Apply color theme
  useEffect(() => {
    const root = window.document.documentElement;
    root.setAttribute("data-theme", colorTheme);
  }, [colorTheme]);

  return (
    <ThemeContext.Provider value={{ theme, setTheme, colorTheme, setColorTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  return useContext(ThemeContext);
}
