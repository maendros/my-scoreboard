"use client";

import React, { useState, useEffect } from "react";

const ThemeProvider = ({ children }: { children: React.ReactNode }) => {
  const [theme, setTheme] = useState("light");

  useEffect(() => {
    const savedTheme = localStorage.getItem("theme") || "light";
    setTheme(savedTheme);
    document.documentElement.classList.add(savedTheme);
  }, []);

  const toggleTheme = () => {
    const newTheme = theme === "light" ? "dark" : "light";
    setTheme(newTheme);
    document.documentElement.classList.remove(theme);
    document.documentElement.classList.add(newTheme);
    localStorage.setItem("theme", newTheme);
  };

  return (
    <div>
      {/* Theme toggle button */}
      <div className="fixed top-4 right-4 p-2 bg-gray-200 dark:bg-gray-700 rounded-full shadow-md" style={{zIndex:500}}>
        <button onClick={toggleTheme} className="text-xl">
          {theme === "light" ? "🌞" : "🌜"}
        </button>
      </div>
      {children}
    </div>
  );
};

export default ThemeProvider;
