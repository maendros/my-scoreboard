"use client";

import React, { useState, useEffect } from "react";

type Theme = "light" | "dark" | "system";

interface ThemeProviderProps {
  children: React.ReactNode;
  defaultTheme?: Theme;
}

const ThemeProvider = ({
  children,
  defaultTheme = "system",
}: ThemeProviderProps) => {
  const [theme, setTheme] = useState(defaultTheme);

  useEffect(() => {
    const savedTheme = (localStorage.getItem("theme") as Theme) || defaultTheme;

    if (savedTheme === "system") {
      const systemTheme = window.matchMedia("(prefers-color-scheme: dark)")
        .matches
        ? "dark"
        : "light";
      setTheme(systemTheme);
      document.documentElement.classList.add(systemTheme);
    } else {
      setTheme(savedTheme);
      document.documentElement.classList.add(savedTheme);
    }
  }, [defaultTheme]);

  const toggleTheme = () => {
    const newTheme = theme === "light" ? "dark" : "light";
    setTheme(newTheme);
    document.documentElement.classList.remove(theme);
    document.documentElement.classList.add(newTheme);
    localStorage.setItem("theme", newTheme);
  };

  return (
    <div>
      <div
        className="fixed top-4 right-4 p-2 bg-gray-200 dark:bg-gray-700 rounded-full shadow-md"
        style={{ zIndex: 500 }}
      >
        <button onClick={toggleTheme} className="text-xl">
          {theme === "light" ? "🌞" : "🌜"}
        </button>
      </div>
      {children}
    </div>
  );
};

export default ThemeProvider;
