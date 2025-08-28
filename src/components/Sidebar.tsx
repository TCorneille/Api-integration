import React, { useState } from "react";
import { Link } from "react-router-dom";
import { FiMenu, FiX } from "react-icons/fi";

export default function Sidebar() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      {/* Hamburger button only on small screens */}
      <button
        className="sm:hidden fixed top-4 left-4 z-50 p-2 rounded-md bg-primaryColor-600 text-black"
        onClick={() => setIsOpen((prev) => !prev)}
      >
        <FiMenu size={24} />
      </button>

      {/* Sidebar */}
      <aside
        className={`fixed top-0 left-0 h-screen w-64 bg-white shadow-lg p-6 flex flex-col space-y-4 border-r border-gray-200 transform transition-transform duration-300 ease-in-out 
        ${isOpen ? "translate-x-0" : "-translate-x-full"} sm:translate-x-0 sm:static sm:w-56`}
      >
        {/* Close button (only on small screens) */}
        {/* <button
          className="sm:hidden self-end mb-4 text-gray-600"
          onClick={() => setIsOpen(false)}
        >
          <FiX size={24} />
        </button> */}

        {/* Navigation Links */}
        <Link
          to="/products"
          className="px-3 py-2 rounded hover:bg-primaryColor-50 transition-colors max-sm:mt-10 flex hover:text-primaryColor-600"
          onClick={() => setIsOpen(false)} // close menu after click
        >
          Products
        </Link>

        <Link
          to="/category"
          className="px-3 py-2 rounded hover:bg-primaryColor-50 hover:text-primaryColor-600 transition-colors flex"
          onClick={() => setIsOpen(false)}
        >
          Categories
        </Link>
      </aside>

      {/* Dark overlay when menu is open (only on small screens) */}
      {isOpen && (
        <div
          className="sm:hidden fixed inset-0   z-40"
          onClick={() => setIsOpen(false)}
        />
      )}
    </>
  );
}
