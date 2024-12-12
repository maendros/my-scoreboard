"use client";

import React, { useState } from "react";
import Link from "next/link";

// Define menu items
const menuItems = [
  { name: "Main", path: "/" },
  { name: "Admin Panel", path: "/admin" },
  { name: "Teams Panel", path: "/teams" },
  { name: "League Panel", path: "/leagues" },
];

const Menu: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleMenu = () => setIsOpen((prev) => !prev);

  return (
    <>
      {/* Burger Icon */}

      {!isOpen && (
        <button
          className="fixed top-4 left-4 z-50 p-3 bg-gray-200 dark:bg-gray-700 rounded-full shadow-md focus:outline-none"
          onClick={toggleMenu}
          aria-label="Toggle Menu"
        >
          ☰
        </button>
      )}
      {/* Menu Overlay */}
      <div
        className={`fixed inset-0 z-40 bg-black bg-opacity-50 transition-opacity ${
          isOpen
            ? "opacity-100 pointer-events-auto"
            : "opacity-0 pointer-events-none"
        }`}
        onClick={toggleMenu}
      />

      {/* Slide-in Menu */}
      <nav
        className={`fixed top-0 left-0 z-50 h-full w-3/4 max-w-sm bg-white dark:bg-gray-900 shadow-lg transition-transform transform ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        {isOpen && (
          <button
            className="fixed top-4 right-4 z-50 p-3 bg-gray-200 dark:bg-gray-700 rounded-full shadow-md focus:outline-none"
            onClick={toggleMenu}
            aria-label="Toggle Menu"
          >
            ✖
          </button>
        )}
        <ul className="p-6 space-y-6">
          {menuItems.map((item) => (
            <li key={item.path}>
              <Link
                href={item.path}
                className="block text-lg font-semibold text-gray-800 dark:text-gray-200 hover:bg-gray-200 dark:hover:bg-gray-800 px-4 py-2 rounded-md"
                onClick={toggleMenu} // Close menu on link click
              >
                {item.name}
              </Link>
            </li>
          ))}
        </ul>
      </nav>
    </>
  );
};

export default Menu;
