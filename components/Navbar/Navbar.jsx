"use client";

import { useDarkMode } from "@/hooks";
import { signOut, useSession } from "next-auth/react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect } from "react";
import { useGlobal } from "../context/GlobalProvider";
import Search from "./Search";
const Navbar = ({
  menu = true,
  searchAndUserProfile = true,
  order = true,
  search = true,
  cartAndFavourite = true,
}) => {
  const { isDarkMode, toggleDarkMode, mounted } = useDarkMode();
  const pathname = usePathname();

  const { data: session, status } = useSession();
  // console.log(session);
  const { cartCount, favoriteCount } = useGlobal();
  useEffect(() => {
    if (
      session?.error === "RefreshAccessTokenError" ||
      session?.error === "CredentialRefreshError"
    ) {
      signOut({ callbackUrl: "/login" });
    }
  }, [session?.error]);

  const isLoggedIn = !!session?.user;
  const userType = session?.user?.userType;
  // console.log(isLoggedIn);

  /* image start*/
  const userImage =
    session?.user?.profilePicture && session.user.profilePicture !== ""
      ? session.user.profilePicture
      : session?.user?.image && session.user.image !== ""
      ? session.user.image
      : "/default-profile.png"; // <- fallback image in /public folder
  /* image end*/
  const navLinks = [
    { id: 1, href: "/", label: "Home", show: true },
    { id: 2, href: "/products", label: "Products", show: true },
    { id: 3, href: "/farmers", label: "Farmers", show: true },
    { id: 4, href: "/about", label: "About", show: true },
    {
      id: 5,
      href: "/orders",
      label: userType === "farmer" ? "Orders" : "My Orders",
      show: isLoggedIn,
    },
    { id: 6, href: "/login", label: "Login", show: !isLoggedIn },
    { id: 7, href: "/register", label: "Sign Up", show: !isLoggedIn },
    {
      id: 8,
      href: "/manage",
      label: "Manage Products",
      show: (isLoggedIn && userType === "admin") || userType === "farmer",
    },
    {
      id: 9,
      label: "Logout",
      isLogout: true,
      show: isLoggedIn,
    },
  ];

  return (
    <nav className="bg-white dark:bg-gray-800 shadow-lg sticky top-0 z-50 ">
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
            <div className="hidden md:flex items-center space-x-3">
              {navLinks
                .filter((link) => link.show)
                .map(({ id, href, label, isLogout }) =>
                  isLogout ? (
                    <button
                      key={id}
                      onClick={() => signOut({ callbackUrl: "/login" })}
                      className="text-gray-700 dark:text-gray-300 hover:text-primary-600 dark:hover:text-primary-400 transition"
                    >
                      {label}
                    </button>
                  ) : (
                    <Link
                      key={id}
                      href={href}
                      className={`${
                        pathname === href
                          ? "text-primary-600 dark:text-primary-400 font-semibold"
                          : "text-gray-700 dark:text-gray-300"
                      } hover:text-primary-600 dark:hover:text-primary-400 transition`}
                    >
                      {label}
                    </Link>
                  )
                )}
            </div>
          )}

          {/* User Actions */}
          <div className="flex items-center space-x-3">
            {searchAndUserProfile && (
              <>
                {order && (
                  <>
                    {/* Search */}
                    {search && <Search />}

                    {cartAndFavourite && (
                      <>
                        {/* Cart */}
                        <Link
                          className="relative p-2 text-gray-700 dark:text-gray-300 hover:text-primary-600 dark:hover:text-primary-400"
                          aria-label="Shopping Cart"
                          href="/cart"
                        >
                          <i className="fas fa-shopping-cart text-xl"></i>
                          <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                            {cartCount}
                          </span>
                        </Link>

                        {/* Favourite */}
                        <Link
                          className="relative p-2 text-gray-700 dark:text-gray-300 hover:text-primary-600 dark:hover:text-primary-400"
                          aria-label="Favourite"
                          href="/favourites"
                        >
                          <i className="far fa-heart text-gray-600 dark:text-gray-400 text-xl"></i>
                          <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                            {favoriteCount}
                          </span>
                        </Link>
                      </>
                    )}
                  </>
                )}

                {/* User Menu */}
                {isLoggedIn && (
                  <div className="relative">
                    <button
                      className="flex items-center space-x-2 text-gray-700 dark:text-gray-300 hover:text-primary-600 dark:hover:text-primary-400"
                      aria-label="User Menu"
                    >
                      <div className="w-8 h-8 relative rounded-full overflow-hidden">
                        <Image
                          src={userImage}
                          alt={session?.user?.name || "User"}
                          fill
                          sizes="20"
                          style={{ objectFit: "cover" }}
                        />
                      </div>
                      <span className="hidden sm:block ">
                        {session?.user?.name?.split(" ").slice(0, 2).join(" ")}
                      </span>
                      <i className="fas fa-chevron-down text-sm"></i>
                    </button>
                  </div>
                )}
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
