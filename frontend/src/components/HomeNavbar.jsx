import React, { useEffect } from 'react';
import SvgLogo from '../assets/SvgLogo';
import { Link } from 'react-router-dom';


function HomeNavbar() {
  useEffect(() => {
    const dropdownButton = document.getElementById("dropdownButton");
    const dropdownMenu = document.getElementById("dropdownMenu");

    if (dropdownButton && dropdownMenu) {
      dropdownButton.addEventListener("mouseover", () => {
        dropdownMenu.classList.remove("hidden");
      });

      dropdownMenu.addEventListener("mouseleave", () => {
        dropdownMenu.classList.add("hidden");
      });
    }

    const mobileMenuToggle = document.getElementById("mobile-menu-toggle");
    const mobileMenu = document.getElementById("mobile-menu");

    if (mobileMenuToggle && mobileMenu) {
      mobileMenuToggle.addEventListener("click", () => {
        mobileMenu.classList.toggle("hidden");
      });
    }

    return () => {
      if (dropdownButton && dropdownMenu) {
        dropdownButton.removeEventListener("mouseover", () => {
          dropdownMenu.classList.remove("hidden");
        });

        dropdownMenu.removeEventListener("mouseleave", () => {
          dropdownMenu.classList.add("hidden");
        });
      }

      if (mobileMenuToggle && mobileMenu) {
        mobileMenuToggle.removeEventListener("click", () => {
          mobileMenu.classList.toggle("hidden");
        });
      }
    };
  }, []);

  return (
    <>
      <nav className="bg-amber-700 text-white fixed top-0 w-full">
        <div className="max-w-7xl mx-auto px-10 md:px-0 lg:px-2">
          <div className="flex items-center justify-between bg-amber-700 h-16 text-lg">
            <div className="">
                
              <a href="/" className="text-2xl font-bold text-yellow-400 bg-amber-100">
             <SvgLogo />
              </a>
            </div>

            <div className="hidden md:flex space-x-8">
              <a href="#" className="hover:text-yellow-600">Home</a>
              <a href="#" className="hover:text-yellow-600">About</a>

              <div className="relative">
                <button id="dropdownButton" className="hover:text-yellow-600 flex items-center">
                  Products
                  <svg
                    className="ml-1 h-4 w-4"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M19 9l-7 7-7-7"
                    />
                  </svg>
                </button>
                <div
                  id="dropdownMenu"
                  className="absolute left-0 hidden bg-white text-gray-800 border border-gray-200 shadow-lg rounded-md mt-2 p-4"
                >
                  <ul>
                    <li>
                      <a href="#" className="block hover:bg-gray-100 px-3 py-1 rounded">
                        Item 1
                      </a>
                    </li>
                    <li>
                      <a href="#" className="block hover:bg-gray-100 px-3 py-1 rounded">
                        Item 2
                      </a>
                    </li>
                    <li>
                      <a href="#" className="block hover:bg-gray-100 px-3 py-1 rounded">
                        Item 3
                      </a>
                    </li>
                  </ul>
                </div>
              </div>

              <a href="#" className="hover:text-yellow-600">Contact</a>
            </div>

            <div className="hidden md:flex space-x-4">
              <Link to="/signup" className="bg-yellow-600 text-white px-4 py-2 rounded hover:bg-yellow-700">
                Sign Up
              </Link>
              <a
                href="#"
                className="border border-yellow-600 text-yellow-600 px-4 py-2 rounded hover:bg-yellow-50"
              >
                Login
              </a>
            </div>

            <div className="md:hidden">
              <button
                id="mobile-menu-toggle"
                className="text-white focus:outline-none"
              >
                <svg
                  className="h-6 w-6"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M4 6h16M4 12h16M4 18h16"
                  />
                </svg>
              </button>
            </div>
          </div>
        </div>

        

        {/* Mobile Menu */}

        <div id="mobile-menu" className="hidden md:hidden">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
            <a href="#" className="block text-gray-700 hover:bg-gray-50 px-3 py-2 rounded">
              Home
            </a>
            <a href="#" className="block text-gray-700 hover:bg-gray-50 px-3 py-2 rounded">
              About
            </a>
            <a href="#" className="block text-gray-700 hover:bg-gray-50 px-3 py-2 rounded">
              Products
            </a>
            <a href="#" className="block text-gray-700 hover:bg-gray-50 px-3 py-2 rounded">
              Contact
            </a>

            <Link
              to="/signup"
              
              className="block bg-yellow-600 text-white px-4 py-2 rounded hover:bg-yellow-700"
            >
              Sign Up
            </Link>
            <Link
              to="/login"
              className="block border border-yellow-600 text-yellow-600 px-4 py-2 rounded hover:bg-yellow-50"
            >
              Login
            </Link>
          </div>
        </div>
      </nav>
    </>
  );
}

export default HomeNavbar;