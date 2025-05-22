import React from 'react';
import { Link } from 'react-router-dom';

const Navbar = () => {
  return (
    <nav className="bg-gray-500 px-6 py-4 shadow-md">
      <div className="max-w-7xl mx-auto flex justify-between items-center">
        {/* Left: Logo/Brand */}
        <div className="text-2xl font-bold text-white">
          Truebill
        </div>

        {/* Right: Login Button as Link */}
        <div>
          <Link
            to="/login"
            className="px-4 py-2 border border-white text-white rounded-md hover:bg-white hover:text-gray-500 transition"
          >
            Login
          </Link>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
