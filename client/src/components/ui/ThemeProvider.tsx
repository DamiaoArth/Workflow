import { createContext, useContext, useEffect, useState, type ReactNode } from "react";

type Theme = "light" | "dark";

const ThemeProviderContext = createContext<{
  theme: Theme;
  setTheme: (theme: Theme) => void;
  toggleTheme: () => void;
}>({
  theme: "light",
  setTheme: () => null,
  toggleTheme: () => null,
});

export function ThemeProvider({ children }: { children: ReactNode }) {
  // Get initial theme from localStorage or use light mode
  const [theme, setTheme] = useState<Theme>(() => {
    const savedTheme = localStorage.getItem("theme");
    return (savedTheme === "dark" ? "dark" : "light") as Theme;
  });

  // Apply theme class to document root
  useEffect(() => {
    const root = window.document.documentElement;
    
    // Remove both classes and add the current one
    root.classList.remove("light", "dark");
    root.classList.add(theme);
    
    // Save to localStorage for persistence
    localStorage.setItem("theme", theme);
  }, [theme]);

  // Toggle between light and dark
  const toggleTheme = () => {
    setTheme(prevTheme => prevTheme === "light" ? "dark" : "light");
  };

  const value = {
    theme,
    setTheme: (theme: Theme) => {
      setTheme(theme);
    },
    toggleTheme,
  };

  return (
    <ThemeProviderContext.Provider value={value}>
      {children}
    </ThemeProviderContext.Provider>
  );
}

export const useTheme = () => {
  const context = useContext(ThemeProviderContext);
  
  if (context === undefined)
    throw new Error("useTheme must be used within a ThemeProvider");
  
  return context;
};
