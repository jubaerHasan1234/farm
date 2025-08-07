import Link from "next/link";
import { Footer } from "..";
const MenuFooter = ({ justFooter = true }) => {
  return (
    <footer className="dark:bg-gray-900  text-white bg-white ">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <div className="flex items-center space-x-3 mb-4">
              <div className="bg-primary-500 p-2 rounded-lg">
                <i className="fas fa-seedling text-white text-xl"></i>
              </div>
              <div>
                <h3 className="text-xl font-bold">FarmFresh</h3>
                <p className="text-sm text-gray-400">Local Farmer Booking</p>
              </div>
            </div>
            <p className="text-gray-400 mb-4">
              Connecting communities with fresh, local produce directly from
              farmers.
            </p>
            <div className="flex space-x-4">
              <a
                href="#"
                className="text-gray-400 dark:hover:text-white hover:text-primary-600"
              >
                <i className="fab fa-facebook"></i>
              </a>
              <a
                href="#"
                className="text-gray-400 dark:hover:text-white hover:text-primary-600"
              >
                <i className="fab fa-twitter"></i>
              </a>
              <a
                href="#"
                className="text-gray-400 dark:hover:text-white hover:text-primary-600"
              >
                <i className="fab fa-instagram"></i>
              </a>
            </div>
          </div>

          <div>
            <h4 className="font-semibold mb-4">Quick Links</h4>
            <ul className="space-y-2 text-gray-400">
              <li>
                <Link
                  href="/"
                  className="dark:hover:text-white hover:text-primary-600"
                >
                  Home
                </Link>
              </li>
              <li>
                <Link
                  href="/products"
                  className="dark:hover:text-white hover:text-primary-600"
                >
                  Products
                </Link>
              </li>
              <li>
                <Link
                  href="/farmers"
                  className="dark:hover:text-white hover:text-primary-600"
                >
                  Farmers
                </Link>
              </li>
              <li>
                <Link
                  href="/about"
                  className="dark:hover:text-white hover:text-primary-600"
                >
                  About Us
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold mb-4">For Farmers</h4>
            <ul className="space-y-2 text-gray-400">
              <li>
                <Link
                  href="/register"
                  className="dark:hover:text-white hover:text-primary-600"
                >
                  Join as Farmer
                </Link>
              </li>
              <li>
                <Link
                  href="/create"
                  className="dark:hover:text-white hover:text-primary-600"
                >
                  Add Products
                </Link>
              </li>
              <li>
                <Link
                  href="/manage"
                  className="dark:hover:text-white hover:text-primary-600"
                >
                  Manage Listings
                </Link>
              </li>
              <li>
                <Link
                  href="/support"
                  className="dark:hover:text-white hover:text-primary-600"
                >
                  Farmer Support
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold mb-4">Support</h4>
            <ul className="space-y-2 text-gray-400">
              <li>
                <Link
                  href="/help"
                  className="dark:hover:text-white hover:text-primary-600"
                >
                  Help Center
                </Link>
              </li>
              <li>
                <Link
                  href="/contact"
                  className="dark:hover:text-white hover:text-primary-600"
                >
                  Contact Us
                </Link>
              </li>
              <li>
                <Link
                  href="/terms"
                  className="dark:hover:text-white   hover:text-primary-600"
                >
                  Terms of Service
                </Link>
              </li>
              <li>
                <Link
                  href="/privacy"
                  className="dark:hover:text-white hover:text-primary-600"
                >
                  Privacy Policy
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <Footer />
      </div>
    </footer>
  );
};

export default MenuFooter;
