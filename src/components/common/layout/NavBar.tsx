"use client";

import React, { useState } from "react";
import Link from "next/link";
import { IoPerson } from "react-icons/io5";
import { useTheme } from "@/components/common/context/ThemeProvider";
import Menu from "@/components/common/layout/Menu";
import AuthModal from "@/components/common/auth/AuthModal";
import { useQuery, gql } from "@apollo/client";

const GET_CURRENT_USER = gql`
  query GetCurrentUser {
    me {
      id
      name
      email
      image
      role
    }
  }
`;

const NavBar: React.FC = () => {
  const { theme, toggleTheme } = useTheme();
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const { data: userData, loading } = useQuery(GET_CURRENT_USER);

  const handleAuthClick = () => {
    setIsAuthModalOpen(true);
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("userRole");
    window.location.reload();
  };

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
            className="block text-center hover:text-blue-500 dark:hover:text-blue-400 transition-colors"
          >
            <h1 className="text-1xl font-bold">My Scoreboard</h1>
          </Link>

          {/* Right side - Auth & Theme */}
          <div className="flex items-center space-x-4">
            {!loading && userData?.me ? (
              <div className="flex items-center space-x-2">
                <span className="text-sm text-gray-600 dark:text-gray-400">
                  {userData.me.role}
                </span>
                <button
                  onClick={handleAuthClick}
                  className="flex items-center space-x-2 hover:text-blue-500 dark:hover:text-blue-400"
                >
                  <IoPerson className="w-5 h-5" />
                  <span className="text-sm hidden sm:inline">
                    {userData.me.name}
                  </span>
                </button>
                <button
                  onClick={handleLogout}
                  className="text-sm text-red-500 hover:text-red-600"
                >
                  Logout
                </button>
              </div>
            ) : (
              <button
                onClick={handleAuthClick}
                className="flex items-center space-x-2 hover:text-blue-500 dark:hover:text-blue-400"
              >
                <IoPerson className="w-5 h-5" />
                <span className="text-sm hidden sm:inline">Login</span>
              </button>
            )}
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

      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
      />
    </nav>
  );
};

export default NavBar;
