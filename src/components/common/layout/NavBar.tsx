"use client";

import React from "react";
import Link from "next/link";

import { IoPerson } from "react-icons/io5";
import { useTheme } from "@/components/common/context/ThemeProvider";
import Menu from "@/components/common/layout/Menu";

const NavBar: React.FC = () => {
  const { theme, toggleTheme } = useTheme();

  return (
    <nav className="fixed top-0 left-0 right-0 bg-white dark:bg-gray-900 shadow-lg z-50">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          {/* Left side - Menu items */}
          <div className="flex space-x-4">
            <Menu />
          </div>
          {/* Center - Title */}

          <Link
            href="/"
            className="block text-center hover:text-blue-500 dark:hover:text-blue-400 transition-colors "
          >
            <h1 className="text-1xl font-bold">My Scoreboard</h1>
          </Link>

          {/* Right side - Auth & Theme */}
          <div className="flex items-center space-x-4">
            <IoPerson className="w-5 h-5" />
            <button
              onClick={toggleTheme}
              className="p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700"
              aria-label="Toggle theme"
            >
              {theme === "light" ? "🌞" : "🌜"}
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default NavBar;
