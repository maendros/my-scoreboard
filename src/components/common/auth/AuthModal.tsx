"use client";

import React, { useState } from "react";
import { FcGoogle } from "react-icons/fc";
import { FaApple } from "react-icons/fa";
import { useMutation, useApolloClient, gql } from "@apollo/client";
import { toast } from "react-toastify";

const LOGIN_MUTATION = gql`
  mutation Login($input: LoginInput!) {
    login(input: $input) {
      token
      user {
        id
        name
        email
        role
      }
    }
  }
`;

const REGISTER_MUTATION = gql`
  mutation Register($input: RegisterInput!) {
    register(input: $input) {
      token
      user {
        id
        name
        email
        role
      }
    }
  }
`;

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const AuthModal: React.FC<AuthModalProps> = ({ isOpen, onClose }) => {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const apolloClient = useApolloClient();

  const [login] = useMutation(LOGIN_MUTATION);
  const [register] = useMutation(REGISTER_MUTATION);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const mutation = isLogin ? login : register;
      const variables = isLogin
        ? { input: { email, password } }
        : { input: { email, password, name } };

      const { data } = await mutation({
        variables,
        refetchQueries: ["GetCurrentUser"],
        awaitRefetchQueries: true,
      });

      const result = isLogin ? data.login : data.register;

      // Clear Apollo cache to ensure fresh data
      await apolloClient.resetStore();

      localStorage.setItem("token", result.token);
      localStorage.setItem("userRole", result.user.role);

      toast.success(`Successfully ${isLogin ? "logged in" : "registered"}!`);
      onClose();

      // Ensure the Apollo cache is updated
      await apolloClient.refetchQueries({
        include: ["GetCurrentUser"],
      });
    } catch (error: any) {
      console.error("Login/Register error:", error);
      toast.error(error.message || "An error occurred during authentication");
    }
  };

  const handleSocialLogin = (provider: string) => {
    // Store the provider for when we return
    sessionStorage.setItem("authProvider", provider);

    // Get the correct redirect URI based on environment
    const redirectUri =
      process.env.NODE_ENV === "production"
        ? "https://my-scoreboard.vercel.app"
        : "http://localhost:5000";

    // Redirect to the appropriate OAuth provider
    if (provider === "google") {
      window.location.href = `https://accounts.google.com/o/oauth2/v2/auth?client_id=${process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID}&redirect_uri=${redirectUri}&response_type=code&scope=email profile&access_type=offline`;
    } else if (provider === "apple") {
      window.location.href = `https://appleid.apple.com/auth/authorize?client_id=${process.env.NEXT_PUBLIC_APPLE_CLIENT_ID}&redirect_uri=${redirectUri}&response_type=code&scope=name email&response_mode=query`;
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-base-darker p-8 rounded-lg shadow-xl max-w-md w-full">
        <h2 className="text-2xl font-bold mb-6 text-center">
          {isLogin ? "Login" : "Register"}
        </h2>

        {/* Social Login Buttons */}
        <div className="space-y-4 mb-6">
          <button
            onClick={() => handleSocialLogin("google")}
            className="w-full flex items-center justify-center gap-3 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
          >
            <FcGoogle className="w-5 h-5" />
            Continue with Google
          </button>
          <button
            onClick={() => handleSocialLogin("apple")}
            className="w-full flex items-center justify-center gap-3 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
          >
            <FaApple className="w-5 h-5" />
            Continue with Apple
          </button>
        </div>

        <div className="relative mb-6">
          <hr className="border-gray-300 dark:border-gray-600" />
          <span className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 bg-base-darker px-4 text-sm text-gray-500">
            or
          </span>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {!isLogin && (
            <input
              type="text"
              placeholder="Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded dark:bg-gray-700 dark:border-gray-600"
              required
            />
          )}
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full p-2 border border-gray-300 rounded dark:bg-gray-700 dark:border-gray-600"
            required
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full p-2 border border-gray-300 rounded dark:bg-gray-700 dark:border-gray-600"
            required
          />
          <button
            type="submit"
            className="w-full bg-blue-500 text-white py-2 rounded hover:bg-blue-600 transition-colors"
          >
            {isLogin ? "Login" : "Register"}
          </button>
        </form>

        <p className="mt-4 text-center text-sm">
          {isLogin ? "Don't have an account? " : "Already have an account? "}
          <button
            onClick={() => setIsLogin(!isLogin)}
            className="text-blue-500 hover:underline"
          >
            {isLogin ? "Register" : "Login"}
          </button>
        </p>

        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-500 hover:text-gray-700"
        >
          ✕
        </button>
      </div>
    </div>
  );
};

export default AuthModal;
