"use client";

import React, { useState } from "react";
import Link from "next/link";
import { IoPerson } from "react-icons/io5";
import { FiSun, FiMoon } from "react-icons/fi";
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
  const { resolvedTheme, toggleTheme } = useTheme();
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
    <nav className=" nav-item fixed top-0 left-0 right-0 bg-base shadow-lg z-50">
      <Menu />
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          {/* Left side - Menu items */}
          <div className="flex space-x-4"></div>

          {/* Center - Title */}
          <Link
            href="/"
            className="block text-center hover:text-blue-500 transition-colors"
          >
            <h1 className="text-1xl font-bold ml-10 sm:ml-0">My Scoreboard</h1>
          </Link>

          {/* Right side - Auth & Theme */}
          <div className="flex items-center space-x-4">
            {!loading && userData?.me ? (
              <div className="flex items-center space-x-2">
                <span className="text-sm opacity-75">{userData.me.role}</span>
                <button
                  onClick={handleAuthClick}
                  className="flex items-center space-x-2 hover:text-blue-500"
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
                className="flex items-center space-x-2 hover:text-blue-500"
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
              {resolvedTheme === "light" ? (
                <FiMoon className="w-5 h-5" />
              ) : (
                <FiSun className="w-5 h-5" />
              )}
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
