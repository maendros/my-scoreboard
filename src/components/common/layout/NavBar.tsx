"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { IoPerson } from "react-icons/io5";
import { FiSun, FiMoon } from "react-icons/fi";
import { useTheme } from "@/components/common/context/ThemeProvider";
import Menu from "@/components/common/layout/Menu";
import AuthModal from "@/components/common/auth/AuthModal";
import { useQuery, useMutation, gql } from "@apollo/client";
import { toast } from "react-toastify";

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

const SOCIAL_LOGIN_MUTATION = gql`
  mutation SocialLogin($provider: String!, $code: String!) {
    socialLogin(provider: $provider, code: $code) {
      token
      user {
        id
        name
        email
        role
        image
      }
    }
  }
`;

const NavBar: React.FC = () => {
  const { resolvedTheme, toggleTheme } = useTheme();
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);

  const {
    data: userData,
    loading,
    refetch,
  } = useQuery(GET_CURRENT_USER, {
    fetchPolicy: "network-only",
    nextFetchPolicy: "cache-first",
  });

  const [socialLogin] = useMutation(SOCIAL_LOGIN_MUTATION);

  useEffect(() => {
    // Check for auth code in URL and handle OAuth flow
    const handleOAuthLogin = async () => {
      const urlParams = new URLSearchParams(window.location.search);
      const code = urlParams.get("code");
      const provider = sessionStorage.getItem("authProvider");

      if (code && provider) {
        try {
          // Clean up URL and session storage immediately
          window.history.replaceState(
            {},
            document.title,
            window.location.pathname
          );
          sessionStorage.removeItem("authProvider");

          const { data } = await socialLogin({
            variables: { provider, code },
            refetchQueries: ["GetCurrentUser"],
            awaitRefetchQueries: true,
          });

          if (data?.socialLogin) {
            localStorage.setItem("token", data.socialLogin.token);
            localStorage.setItem("userRole", data.socialLogin.user.role);
            toast.success("Successfully logged in!");
            await refetch();
          }
        } catch (error: any) {
          console.error("Social login error:", error);
          toast.error(error.message || "Failed to complete social login");
        }
      }
    };

    handleOAuthLogin();
  }, [socialLogin, refetch]);

  const handleAuthClick = () => {
    setIsAuthModalOpen(true);
  };

  const handleModalClose = () => {
    setIsAuthModalOpen(false);
  };

  const handleLogout = async () => {
    localStorage.removeItem("token");
    localStorage.removeItem("userRole");
    await refetch();
    window.location.href = "/";
  };

  return (
    <nav className="nav-item fixed top-0 left-0 right-0 bg-base shadow-lg z-50">
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
                <Link
                  href="/profile"
                  className="flex items-center space-x-2 hover:text-blue-500"
                >
                  <IoPerson className="w-5 h-5" />
                  <span className="text-sm hidden sm:inline">
                    {userData.me.name}
                  </span>
                </Link>
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

      <AuthModal isOpen={isAuthModalOpen} onClose={handleModalClose} />
    </nav>
  );
};

export default NavBar;
