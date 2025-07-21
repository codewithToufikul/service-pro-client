import React, { useState, useEffect } from "react";
import logo from "../assets/logo.png";
import { Link, NavLink } from "react-router-dom";
import { getUserFromToken } from "../AuthProvider/getUserFromToken";
import { IoPersonCircleOutline } from "react-icons/io5";
import { MdOutlinePayments } from "react-icons/md";
import { VscFeedback } from "react-icons/vsc";
import { HiOutlineLogout } from "react-icons/hi";
import { MdOutlinePersonOutline } from "react-icons/md";
import { useGetUser } from "../AuthProvider/getUser";
import navLogo from "../assets/navbarLogo.svg"

function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const user = getUserFromToken();
    const { data} = useGetUser();

  // Handle body scroll when menu is open
  useEffect(() => {
    if (isMenuOpen) {
      // Prevent scrolling when menu is open
      document.body.style.overflow = "hidden";
    } else {
      // Re-enable scrolling when menu is closed
      document.body.style.overflow = "auto";
    }

    return () => {
      document.body.style.overflow = "auto";
    };
  }, [isMenuOpen]);

  // Close menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      const navbar = document.getElementById("navbar-default");
      const toggleButton = document.querySelector(
        "[data-collapse-toggle='navbar-default']"
      );

      if (
        isMenuOpen &&
        navbar &&
        !navbar.contains(event.target) &&
        !toggleButton.contains(event.target)
      ) {
        setIsMenuOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isMenuOpen]);

  // Close menu when window is resized to desktop size
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 768 && isMenuOpen) {
        setIsMenuOpen(false);
      }
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [isMenuOpen]);

  // Add scroll event listener
  useEffect(() => {
    const handleScroll = () => {
      // Check if page is scrolled
      if (window.scrollY > 0) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };

    // Add the event listener
    window.addEventListener("scroll", handleScroll);

    // Clean up the event listener
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  const logOutUser = () => {
    localStorage.removeItem("token");
    window.location.reload();
  };

  return (
    <>
      {/* Overlay when mobile menu is open */}
      {isMenuOpen && (
        <div
          className="sticky inset-0 bg-black bg-opacity-50 z-40 md:hidden transition-opacity duration-300 ease-in-out"
          onClick={() => setIsMenuOpen(false)}
        />
      )}

      <nav
        className={`transition-all duration-300 sticky top-0 z-50 ${
          scrolled ? "bg-white shadow-md" : "bg-transparent"
        }`}
      >
        <div className="max-w-screen-xl flex flex-wrap items-center justify-between mx-auto p-4">
          <a
            href="/"
            className="flex items-center space-x-3 rtl:space-x-reverse"
          >
            <img src={navLogo} className=" h-14 md:h-16" alt="Flowbite Logo" />
          </a>
          <button
            data-collapse-toggle="navbar-default"
            type="button"
            className="inline-flex items-center p-2 w-10 h-10 justify-center text-sm text-gray-500 rounded-lg md:hidden hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-200"
            aria-controls="navbar-default"
            aria-expanded={isMenuOpen ? "true" : "false"}
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            <span className="sr-only">Open main menu</span>
            <svg
              className="w-5 h-5"
              aria-hidden="true"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 17 14"
            >
              <path
                stroke="currentColor"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M1 1h15M1 7h15M1 13h15"
              />
            </svg>
          </button>
          <div className={`dropdown  m-0 ml-[-60px] dropdown-end ${user ? "block" : "hidden"} md:hidden `}>
            <div
              tabIndex={0}
              role="button"
              className=" bg-blue-500 rounded-full cursor-pointer"
            >
              {
                data?.profileImage ? (
                  <img className=" w-10 p-[1px] rounded-full h-10" src={data.profileImage} alt="" />
                ) : (
<IoPersonCircleOutline className=" text-2xl  text-white" />
                )
              }
              
            </div>
            <ul
              tabIndex={0}
              className="dropdown-content menu bg-base-100 rounded-box z-1 w-52 p-2 shadow-sm"
            >
              <li className="">
                          <Link
                            to={"/user-profile"}
                            className=" flex flex-row "
                          >
                            <span className=" text-2xl ">
                              <MdOutlinePersonOutline />
                            </span>
                            <span>Profile</span>
                          </Link>
                        </li>
              <li className="">
                <Link to={"/payment-history"} className=" flex flex-row ">
                  <span className=" text-2xl ">
                    <MdOutlinePayments />
                  </span>
                  <span>Payment History</span>
                </Link>
              </li>
              <li>
                <Link to={"/give-feedback"} className=" flex flex-row ">
                  <span className=" text-xl ">
                    <VscFeedback />
                  </span>
                  <span>Give Feedback</span>
                </Link>
              </li>
              <li onClick={() => logOutUser()}>
                <a className=" flex flex-row  text-red-500">
                  <span className=" text-xl ">
                    <HiOutlineLogout />
                  </span>
                  <span>Log Out</span>
                </a>
              </li>
            </ul>
          </div>
          {/* Mobile menu - slides in from left */}
          <div
            className={`fixed md:static top-0 left-0 h-full md:h-auto w-3/4 md:w-auto z-50 bg-white md:bg-transparent shadow-lg md:shadow-none transition-all duration-300 ease-in-out transform ${
              isMenuOpen ? "translate-x-0" : "-translate-x-full"
            } md:translate-x-0`}
            id="navbar-default"
          >
            {/* Close button for mobile */}
            <button
              className="absolute top-4 right-4 text-gray-500 hover:text-gray-700 md:hidden"
              onClick={() => setIsMenuOpen(false)}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>

            {/* Mobile logo */}
            <div className="p-4 border-b border-gray-200 md:hidden">
              <img src={logo} className="h-10" alt="Logo" />
            </div>

            <ul className="font-medium flex flex-col items-start justify-start p-4 md:p-0 md:flex-row md:space-x-8 rtl:space-x-reverse md:items-center">
              <li>
                <NavLink
                  to="/"
                  className={({ isActive, isPending }) =>
                    isActive
                      ? "font-bold  text-blue-700 text-lg"
                      : isPending
                      ? "pending"
                      : "block py-2 px-3 rounded hover:bg-gray-100 md:hover:bg-transparent md:border-0 md:hover:text-blue-700 md:p-0 text-lg font-semibold w-full md:text-left text-gray-900"
                  }
                >
                  Home
                </NavLink>
              </li>
              <li>
                <NavLink
                  to="/services"
                  className={({ isActive, isPending }) =>
                    isActive
                      ? "font-bold  text-blue-700 text-lg"
                      : isPending
                      ? "pending"
                      : "block py-2 px-3 rounded hover:bg-gray-100 md:hover:bg-transparent md:border-0 md:hover:text-blue-700 md:p-0 text-lg font-semibold w-full md:text-left text-gray-900"
                  }
                >
                  Services
                </NavLink>
              </li>
              <li>
                <NavLink
                  to="/project"
                  className={({ isActive, isPending }) =>
                    isActive
                      ? "font-bold  text-blue-700 text-lg"
                      : isPending
                      ? "pending"
                      : "block py-2 px-3 rounded hover:bg-gray-100 md:hover:bg-transparent md:border-0 md:hover:text-blue-700 md:p-0 text-lg font-semibold w-full md:text-left text-gray-900"
                  }
                >
                  Project
                </NavLink>
              </li>
              <li>
                <NavLink
                  to="/blogs"
                  className={({ isActive, isPending }) =>
                    isActive
                      ? "font-bold  text-blue-700 text-lg"
                      : isPending
                      ? "pending"
                      : "block py-2 px-3 rounded hover:bg-gray-100 md:hover:bg-transparent md:border-0 md:hover:text-blue-700 md:p-0 text-lg font-semibold w-full md:text-left text-gray-900"
                  }
                >
                  Blog
                </NavLink>
              </li>
              <li>
                <Link
                  to="/contract"
                  type="button"
                  className="text-xl border-[1px] border-green-400 bg-[#0dc181] py-2 px-4 md:py-3 rounded-md text-white hover:bg-white hover:text-black transition duration-300 w-full md:w-auto mt-4 md:mt-0"
                >
                  Contact Us
                </Link>
              </li>
              <li className=" mt-4 md:mt-0">
                {user ? (
                  <div className=" hidden md:block">
                    <div className="dropdown m-0 lg:ml-[-20px] dropdown-end">
                      <div
                        tabIndex={0}
                        role="button"
                        className=" bg-blue-500  rounded-full cursor-pointer mt-2 "
                      >
                        {
                data?.profileImage ? (
                  <img className=" w-10 rounded-full h-10" src={data.profileImage} alt="" />
                ) : (
<IoPersonCircleOutline className=" text-2xl  text-white" />
                )
              }
                      </div>
                      <ul
                        tabIndex={0}
                        className="dropdown-content menu bg-base-100 rounded-box z-1 w-52 p-2 shadow-sm"
                      >
                        <li className="">
                          <Link
                            to={"/user-profile"}
                            className=" flex flex-row "
                          >
                            <span className=" text-2xl ">
                              <MdOutlinePersonOutline />
                            </span>
                            <span>Profile</span>
                          </Link>
                        </li>
                        <li className="">
                          <Link
                            to={"/payment-history"}
                            className=" flex flex-row "
                          >
                            <span className=" text-2xl ">
                              <MdOutlinePayments />
                            </span>
                            <span>Payment History</span>
                          </Link>
                        </li>
                        <li>
                          <Link
                            to={"/give-feedback"}
                            className=" flex flex-row "
                          >
                            <span className=" text-xl ">
                              <VscFeedback />
                            </span>
                            <span>Give Feedback</span>
                          </Link>
                        </li>
                        <li onClick={() => logOutUser()}>
                          <a className=" flex flex-row  text-red-500">
                            <span className=" text-xl ">
                              <HiOutlineLogout />
                            </span>
                            <span>Log Out</span>
                          </a>
                        </li>
                      </ul>
                    </div>
                  </div>
                ) : (
                  <Link
                    to="/login"
                    type="button"
                    className="text-xl border-[1px] border-blue-400 bg-blue-500 md:ml-[-20px] py-2 px-4 md:py-3 rounded-md text-white hover:bg-white hover:text-black transition duration-300 w-full md:w-auto "
                  >
                    Sign In
                  </Link>
                )}
              </li>
            </ul>
          </div>
        </div>
      </nav>
    </>
  );
}

export default Navbar;
