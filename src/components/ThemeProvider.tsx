"use client";

import React, { useState, useEffect } from "react";

const ThemeProvider = ({ children }: { children: React.ReactNode }) => {
  const [theme, setTheme] = useState("light");

  useEffect(() => {
    const savedTheme = localStorage.getItem("theme");
    if (savedTheme) {
      setTheme(savedTheme);
      document.documentElement.classList.add(savedTheme);
    }
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
      <div className="flex justify-end p-4">
        <button onClick={toggleTheme} className="text-xl">
          {theme === "light" ? "🌞" : "🌜"}
        </button>
      </div>
      {children}
    </div>
  );
};

export default ThemeProvider;
