import React from 'react';
import { Link } from 'react-router-dom';

const Navbar = () => {
  return (
    <nav className="bg-white shadow-md">
      <div className="max-w-7xl mx-auto flex justify-between items-center px-6 py-4">
        {/* Left: Logo/Brand (no hover effect) */}
        <div className="text-3xl font-extrabold text-gray-800 tracking-wide">
          <Link to="/home" className="inline-block px-2 py-1" aria-label="True Bill Home">
            true bill
          </Link>
        </div>

        {/* Right: Login and My Profile */}
        <div className="flex items-center space-x-4">
           <Link
            to="/products"
            className="px-4 py-2 border border-gray-800 text-gray-800 rounded-md hover:bg-gray-800 hover:text-white transition duration-300"
          >
            My products
          </Link>
          <Link
            to="/my-profile"
            className="px-4 py-2 border border-gray-800 text-gray-800 rounded-md hover:bg-gray-800 hover:text-white transition duration-300"
          >
            My Profile
          </Link>

          <Link
            to="/login"
            className="px-4 py-2 border border-gray-800 text-gray-800 rounded-md hover:bg-gray-800 hover:text-white transition duration-300"
          >
            Login
          </Link>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
