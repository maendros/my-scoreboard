"use client";

import React, { useState } from "react";
import Link from "next/link";

// Define menu items
const menuItems = [
  { name: "Main", path: "/" },
  { name: "Admin Panel", path: "/admin" },
  { name: "Users Panel", path: "/users" },
];

const Menu: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleMenu = () => setIsOpen(!isOpen);

  return (
    <div className="fixed top-0 left-0 w-full z-50 bg-gray-100 dark:bg-gray-800 shadow-md">
      {/* Header with Burger Icon */}
      <div className="flex justify-between items-center p-4">
        <button
          className="p-2 rounded-md text-black dark:text-white focus:outline-none fixed top-4 left-4 md:static" // Keep it fixed top-left for mobile and reset to static for larger screens
          onClick={toggleMenu}
        >
          {/* Burger icon */}
          <span className="text-2xl md:text-lg">☰</span>{" "}
          {/* Larger icon for mobile */}
        </button>
      </div>

      {/* Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40 transition-opacity"
          onClick={() => setIsOpen(false)}
        >
          <nav
            className={`fixed top-0 left-0 h-full w-1/4 bg-white dark:bg-gray-900 p-6 shadow-lg z-50 transform transition-transform duration-300 ${
              isOpen ? "translate-x-0" : "-translate-x-full"
            }`}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close Button */}
            <button
              className="text-gray-900 dark:text-gray-100 mb-4 p-2 focus:outline-none"
              onClick={() => setIsOpen(false)}
            >
              ✖
            </button>
            <ul className="space-y-4">
              {menuItems.map((item) => (
                <li key={item.path}>
                  <Link
                    href={item.path}
                    className="block p-2 text-gray-900 dark:text-gray-100 hover:bg-gray-300 dark:hover:bg-gray-600 rounded"
                    onClick={() => setIsOpen(false)}
                  >
                    {item.name}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        </div>
      )}
    </div>
  );
};

export default Menu;
