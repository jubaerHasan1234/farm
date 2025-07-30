"use client";

import { useDarkMode } from "@/hooks";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";

const Navbar = ({ menu = true, searchAndUserProfile = true, order = true }) => {
  const { isDarkMode, toggleDarkMode, mounted } = useDarkMode();
  const pathname = usePathname();
  if (!mounted) return null;
  const navLinks = [
    { href: "/", label: "Home" },
    { href: "/products", label: "Products" },
    { href: "/farmers", label: "Farmers" },
    { href: "/about", label: "About" },
    { href: "/orders", label: "My Orders" },
    { href: "/login", label: "Login" },
    { href: "/register", label: "Sign Up" },
  ];

  return (
    <nav className="bg-white dark:bg-gray-800 shadow-lg sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex items-center space-x-3">
            <Link href="/" className="flex items-center space-x-3">
              <div className="bg-primary-500 p-2 rounded-lg">
                <i className="fas fa-seedling text-white text-xl"></i>
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-900 dark:text-white">
                  FarmFresh
                </h1>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  Local Farmer Booking
                </p>
              </div>
            </Link>
          </div>

          {/* Desktop Navigation */}
          {menu && (
            <div className="hidden md:flex items-center space-x-8">
              {navLinks.map(({ href, label }) => (
                <Link
                  key={href}
                  href={href}
                  className={`${
                    pathname === href
                      ? "text-primary-600 dark:text-primary-400 font-semibold"
                      : "text-gray-700 dark:text-gray-300"
                  } hover:text-primary-600 dark:hover:text-primary-400 transition`}
                >
                  {label}
                </Link>
              ))}
            </div>
          )}

          {/* User Actions */}
          <div className="flex items-center space-x-4">
            {searchAndUserProfile && (
              <>
                {order && (
                  <>
                    {" "}
                    {/* Search */}
                    <div className="hidden sm:block relative">
                      <input
                        type="text"
                        placeholder="Search products..."
                        className="w-64 pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                      />
                      <i className="fas fa-search absolute left-3 top-3 text-gray-400"></i>
                    </div>
                    {/* Cart */}
                    <Link
                      className="relative p-2 text-gray-700 dark:text-gray-300 hover:text-primary-600 dark:hover:text-primary-400"
                      aria-label="Shopping Cart"
                      href={"/cart"}
                    >
                      <i className="fas fa-shopping-cart text-xl"></i>
                      <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                        3
                      </span>
                    </Link>
                    {/* Favourite */}
                    <Link
                      className="relative p-2 text-gray-700 dark:text-gray-300 hover:text-primary-600 dark:hover:text-primary-400"
                      aria-label="Favourite"
                      href={"/favourites"}
                    >
                      <i className="far fa-heart text-gray-600 dark:text-gray-400 text-xl"></i>
                      <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                        3
                      </span>
                    </Link>
                  </>
                )}
                {/* User Menu */}
                <div className="relative">
                  <button
                    className="flex items-center space-x-2 text-gray-700 dark:text-gray-300 hover:text-primary-600 dark:hover:text-primary-400"
                    aria-label="User Menu"
                  >
                    <div className="w-8 h-8 relative rounded-full overflow-hidden">
                      <Image
                        src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=80&h=80&fit=crop&crop=face"
                        alt="User"
                        width={32}
                        height={32}
                        className="object-cover rounded-full"
                      />
                    </div>
                    <span className="hidden sm:block">John Doe</span>
                    <i className="fas fa-chevron-down text-sm"></i>
                  </button>
                </div>
              </>
            )}
            {/* Dark Mode Toggle */}
            <button
              onClick={toggleDarkMode}
              className="p-2 text-gray-700 dark:text-gray-300 hover:text-primary-600 dark:hover:text-primary-400"
              aria-label={
                isDarkMode ? "Switch to light mode" : "Switch to dark mode"
              }
            >
              {isDarkMode ? (
                <i className="fas fa-sun"></i>
              ) : (
                <i className="fas fa-moon"></i>
              )}
            </button>
            {/* Mobile Menu Button */}
            <button
              className="md:hidden p-2 text-gray-700 dark:text-gray-300"
              aria-label="Mobile Menu"
            >
              <i className="fas fa-bars"></i>
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
