import React from 'react';
import { Link } from 'react-router-dom';
import { User, LogIn, PackageSearch } from 'lucide-react';

const Navbar = () => {
  return (
    <nav className="backdrop-blur-md bg-white/80 shadow-lg fixed top-0 left-0 w-full z-50">
      <div className="max-w-7xl mx-auto flex justify-between items-center px-4 py-3 sm:px-6 sm:py-4">
        {/* Brand as Logo */}
        <div className="text-2xl sm:text-3xl font-extrabold uppercase tracking-wider text-transparent bg-clip-text bg-gradient-to-r from-[#00B8DB] to-[#3B82F6] drop-shadow-md hover:scale-105 transition-transform duration-300">
          <Link
            to="/home"
            className="inline-block no-underline"
            aria-label="True Bill Home"
          >
            <span className="px-2 py-1 rounded">true bill</span>
          </Link>
        </div>

        {/* Nav Items */}
        <div className="flex items-center space-x-2 sm:space-x-4">
          {/* Products */}
          <Link
            to="/products"
            className="no-underline group inline-flex items-center justify-center gap-0 sm:gap-2 p-2 sm:px-4 sm:py-2 text-sm font-medium rounded-full sm:rounded-md text-gray-800 hover:bg-gradient-to-r from-[#00B8DB] to-[#3B82F6] hover:text-white transition-all duration-300 shadow-sm"
          >
            <PackageSearch className="h-5 w-5" />
            <span className="hidden sm:inline">My Products</span>
          </Link>

          {/* Profile */}
          <Link
            to="/my-profile"
            className="no-underline group inline-flex items-center justify-center gap-0 sm:gap-2 p-2 sm:px-4 sm:py-2 text-sm font-medium rounded-full sm:rounded-md text-gray-800 hover:bg-gradient-to-r from-[#00B8DB] to-[#3B82F6] hover:text-white transition-all duration-300 shadow-sm"
          >
            <User className="h-5 w-5" />
            <span className="hidden sm:inline">My Profile</span>
          </Link>

          {/* Login */}
          <Link
            to="/login"
            className="no-underline group inline-flex items-center justify-center gap-0 sm:gap-2 p-2 sm:px-4 sm:py-2 text-sm font-medium rounded-full sm:rounded-md text-gray-800 hover:bg-gradient-to-r from-[#00B8DB] to-[#3B82F6] hover:text-white transition-all duration-300 shadow-sm"
          >
            <LogIn className="h-5 w-5" />
            <span className="hidden sm:inline">Login</span>
          </Link>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
