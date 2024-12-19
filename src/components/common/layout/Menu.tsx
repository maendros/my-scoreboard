"use client";

import React, { useState } from "react";
import Link from "next/link";
import { RiMenuLine } from "react-icons/ri";
import { useQuery, gql } from "@apollo/client";

const GET_CURRENT_USER = gql`
  query GetCurrentUser {
    me {
      id
      role
    }
  }
`;

// Define menu items with required roles
const menuItems = [
  { name: "Home", path: "/", roles: ["PUBLIC"] },
  { name: "Admin Panel", path: "/admin", roles: ["ADMIN"] },
  { name: "Teams Panel", path: "/teams", roles: ["ADMIN", "EDITOR"] },
  { name: "League Panel", path: "/leagues", roles: ["ADMIN", "EDITOR"] },
];

const Menu: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { data: userData } = useQuery(GET_CURRENT_USER);
  const userRole = userData?.me?.role || "PUBLIC";

  const toggleMenu = () => setIsOpen((prev) => !prev);

  // Filter menu items based on user role
  const authorizedMenuItems = menuItems.filter((item) => {
    if (item.roles.includes("PUBLIC")) return true;
    return item.roles.includes(userRole);
  });

  return (
    <>
      {/* Burger Icon */}

      {!isOpen && (
        <button
          className="fixed top-2 left-4 z-50 p-3 shadow-md focus:outline-none"
          onClick={toggleMenu}
          aria-label="Toggle Menu"
        >
          <RiMenuLine className="w-6 h-6" />
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
          {authorizedMenuItems.map((item) => (
            <li key={item.path}>
              <Link
                href={item.path}
                className="block text-lg font-semibold text-gray-800 dark:text-gray-200 hover:bg-gray-200 dark:hover:bg-gray-800 px-4 py-2 rounded-md"
                onClick={toggleMenu}
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
