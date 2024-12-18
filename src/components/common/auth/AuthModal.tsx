"use client";

import React, { useState } from "react";
import { useMutation, gql } from "@apollo/client";
import { FcGoogle } from "react-icons/fc";
import { FaApple } from "react-icons/fa";
import { toast } from "react-toastify";

const LOGIN_MUTATION = gql`
  mutation Login($input: LoginInput!) {
    login(input: $input) {
      token
      user {
        id
        email
        name
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
        email
        name
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

  const [login, { loading: loginLoading }] = useMutation(LOGIN_MUTATION, {
    onCompleted: (data) => {
      if (data?.login) {
        localStorage.setItem("token", data.login.token);
        localStorage.setItem("userRole", data.login.user.role);
        toast.success(`Logged in successfully as ${data.login.user.role}!`);
        onClose();
        window.location.reload();
      }
    },
    onError: (error) => {
      console.error("Login error:", error);
      toast.error(error.message || "Login failed");
    },
  });

  const [register, { loading: registerLoading }] = useMutation(
    REGISTER_MUTATION,
    {
      onCompleted: (data) => {
        if (data?.register) {
          localStorage.setItem("token", data.register.token);
          localStorage.setItem("userRole", data.register.user.role);
          toast.success(
            `Registered successfully as ${data.register.user.role}!`
          );
          onClose();
          window.location.reload();
        }
      },
      onError: (error) => {
        console.error("Register error:", error);
        toast.error(error.message || "Registration failed");
      },
    }
  );

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isLogin) {
      await login({
        variables: {
          input: { email, password },
        },
      });
    } else {
      await register({
        variables: {
          input: { email, password, name },
        },
      });
    }
  };

  const handleSocialLogin = async (provider: string) => {
    toast.info(`${provider} login coming soon!`);
  };

  const loading = loginLoading || registerLoading;

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white dark:bg-gray-800 rounded-lg p-8 max-w-md w-full">
        <h2 className="text-2xl font-bold mb-6 text-center">
          {isLogin ? "Login" : "Register"}
        </h2>

        {/* Social Login Buttons */}
        <div className="space-y-4 mb-6">
          <button
            onClick={() => handleSocialLogin("Google")}
            className="w-full flex items-center justify-center gap-2 p-2 border border-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700"
            disabled={loading}
          >
            <FcGoogle className="w-6 h-6" />
            Continue with Google
          </button>
          <button
            onClick={() => handleSocialLogin("Apple")}
            className="w-full flex items-center justify-center gap-2 p-2 border border-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700"
            disabled={loading}
          >
            <FaApple className="w-6 h-6" />
            Continue with Apple
          </button>
        </div>

        <div className="relative my-6">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-gray-300"></div>
          </div>
          <div className="relative flex justify-center text-sm">
            <span className="px-2 bg-white dark:bg-gray-800 text-gray-500">
              Or continue with email
            </span>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {!isLogin && (
            <input
              type="text"
              placeholder="Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded dark:bg-gray-700"
              required
              disabled={loading}
            />
          )}
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full p-2 border border-gray-300 rounded dark:bg-gray-700"
            required
            disabled={loading}
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full p-2 border border-gray-300 rounded dark:bg-gray-700"
            required
            disabled={loading}
          />
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-500 text-white p-2 rounded hover:bg-blue-600 disabled:opacity-50"
          >
            {loading ? "Loading..." : isLogin ? "Login" : "Register"}
          </button>
        </form>

        <p className="mt-4 text-center text-sm text-gray-600 dark:text-gray-400">
          {isLogin ? "Don't have an account? " : "Already have an account? "}
          <button
            onClick={() => setIsLogin(!isLogin)}
            className="text-blue-500 hover:underline"
            disabled={loading}
          >
            {isLogin ? "Register" : "Login"}
          </button>
        </p>

        <button
          onClick={onClose}
          className="absolute top-2 right-2 text-gray-500 hover:text-gray-700"
          disabled={loading}
        >
          ✕
        </button>
      </div>
    </div>
  );
};

export default AuthModal;
