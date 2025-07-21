import React from "react";
import { IconContext } from "react-icons/lib";
import { NavLink, Outlet } from "react-router-dom";
import { BsBasket2, BsClipboard2Data, BsQuestionCircle, BsGear, BsChatQuote, BsBriefcase } from "react-icons/bs";
import logo from "../../assets/logo.png";
import { FaHome } from "react-icons/fa";
import { RiMenu3Line } from "react-icons/ri";
import { MdOutlineMessage } from "react-icons/md";
import { FaUsers } from "react-icons/fa6";
import { useGetUser } from "../../AuthProvider/getUser";
import { TbLogs } from "react-icons/tb";
import { VscFeedback } from "react-icons/vsc";
import { MdProductionQuantityLimits } from "react-icons/md";
import dashLogo from "../../assets/footerLogo.svg"

function Dashboard() {
    const { data, isLoading, isError } = useGetUser();

    if (isLoading) {
      return (
        <div className="flex items-center justify-center h-screen">
          <div className="relative">
            <div className="h-24 w-24 rounded-full border-t-8 border-b-8 border-gray-200"></div>
            <div className="absolute top-0 left-0 h-24 w-24 rounded-full border-t-8 border-b-8 border-blue-500 animate-spin"></div>
          </div>
        </div>
      );
    }
  return (
    <div className="drawer lg:drawer-open">
      <input id="my-drawer-2" type="checkbox" className="drawer-toggle" />
      <div className="drawer-content ">
      <div className=" w-full flex justify-between items-center p-3 sticky top-0 z-10 bg-white">
        <p className=" text-xl font-semibold text-blue-400 lg:hidden">Dashboard</p>
      <label
          htmlFor="my-drawer-2"
          className="btn btn-primary drawer-button lg:hidden"
        >
          <RiMenu3Line />
        </label>
      </div>
        <Outlet/>
      </div>
      <div className="drawer-side z-50">
        <label
          htmlFor="my-drawer-2"
          aria-label="close sidebar"
          className="drawer-overlay"
        ></label>
        <ul className="menu bg-base-200 text-base-content min-h-full w-80 p-4 space-y-5">
          <div className="mt-3 mb-6 border-b-2 pb-3 border-gray-200">
            <img width={220} src={dashLogo} alt="" />
          </div>
          <li className={data?.role === "moderator" ? "hidden" : ""}>
            <NavLink
              to="/admin-dashboard"
              className={({ isActive, isPending }) =>
                isActive
                  ? "font-bold text-blue-700 text-lg"
                  : isPending
                  ? "pending"
                  : "block py-2 px-3 rounded hover:bg-gray-100 md:hover:bg-transparent md:border-0 md:hover:text-blue-700 md:p-0 text-lg font-semibold w-full md:text-left text-gray-900"
              }
            >
              <IconContext.Provider value={{ color: "blue", size: "1.5em" }}>
                <div className="flex gap-2 items-center">
                  <BsBasket2 />
                  <p>Manage Services</p>
                </div>
              </IconContext.Provider>
            </NavLink>
          </li>
          <li className={data?.role === "moderator" ? "hidden" : ""}>
            <NavLink
              to="/admin-dashboard/manage-work"
              className={({ isActive, isPending }) =>
                isActive
                  ? "font-bold text-blue-700 text-lg"
                  : isPending
                  ? "pending"
                  : "block py-2 px-3 rounded hover:bg-gray-100 md:hover:bg-transparent md:border-0 md:hover:text-blue-700 md:p-0 text-lg font-semibold w-full md:text-left text-gray-900"
              }
            >
              <IconContext.Provider value={{ color: "blue", size: "1.5em" }}>
                <div className="flex gap-2 items-center">
                  <BsBriefcase />
                  <p>Manage Latest Work</p>
                </div>
              </IconContext.Provider>
            </NavLink>
          </li>
          
          <li className={data?.role === "moderator" ? "hidden" : ""}>
            <NavLink
              to="/admin-dashboard/manage-faq"
              className={({ isActive, isPending }) =>
                isActive
                  ? "font-bold text-blue-700 text-lg"
                  : isPending
                  ? "pending"
                  : "block py-2 px-3 rounded hover:bg-gray-100 md:hover:bg-transparent md:border-0 md:hover:text-blue-700 md:p-0 text-lg font-semibold w-full md:text-left text-gray-900"
              }
            >
              <IconContext.Provider value={{ color: "blue", size: "1.5em" }}>
                <div className="flex gap-2 items-center">
                  <BsQuestionCircle />
                  <p>Manage FAQ</p>
                </div>
              </IconContext.Provider>
            </NavLink>
          </li>
          
          <li className={data?.role === "moderator" ? "hidden" : ""}>
            <NavLink
              to="/admin-dashboard/manage-status"
              className={({ isActive, isPending }) =>
                isActive
                  ? "font-bold text-blue-700 text-lg"
                  : isPending
                  ? "pending"
                  : "block py-2 px-3 rounded hover:bg-gray-100 md:hover:bg-transparent md:border-0 md:hover:text-blue-700 md:p-0 text-lg font-semibold w-full md:text-left text-gray-900"
              }
            >
              <IconContext.Provider value={{ color: "blue", size: "1.5em" }}>
                <div className="flex gap-2 items-center">
                  <BsGear />
                  <p>Working Status</p>
                </div>
              </IconContext.Provider>
            </NavLink>
          </li>
          <li>
            <NavLink
              to="/admin-dashboard/client-messages"
              className={({ isActive, isPending }) =>
                isActive
                  ? "font-bold text-blue-700 text-lg"
                  : isPending
                  ? "pending"
                  : "block py-2 px-3 rounded hover:bg-gray-100 md:hover:bg-transparent md:border-0 md:hover:text-blue-700 md:p-0 text-lg font-semibold w-full md:text-left text-gray-900"
              }
            >
              <IconContext.Provider value={{ color: "blue", size: "1.5em" }}>
                <div className="flex gap-2 items-center">
                <MdOutlineMessage />
                  <p>Client Messages</p>
                </div>
              </IconContext.Provider>
            </NavLink>
          </li>
          <li className={data?.role === "moderator" ? "hidden" : ""}>
            <NavLink
              to="/admin-dashboard/manage-users"
              className={({ isActive, isPending }) =>
                isActive
                  ? "font-bold text-blue-700 text-lg"
                  : isPending
                  ? "pending"
                  : "block py-2 px-3 rounded hover:bg-gray-100 md:hover:bg-transparent md:border-0 md:hover:text-blue-700 md:p-0 text-lg font-semibold w-full md:text-left text-gray-900"
              }
            >
              <IconContext.Provider value={{ color: "blue", size: "1.5em" }}>
                <div className="flex gap-2 items-center">
                <FaUsers />
                  <p>Manage User</p>
                </div>
              </IconContext.Provider>
            </NavLink>
          </li>
          <li >
            <NavLink
              to="/admin-dashboard/manage-blogs"
              className={({ isActive, isPending }) =>
                isActive
                  ? "font-bold text-blue-700 text-lg"
                  : isPending
                  ? "pending"
                  : "block py-2 px-3 rounded hover:bg-gray-100 md:hover:bg-transparent md:border-0 md:hover:text-blue-700 md:p-0 text-lg font-semibold w-full md:text-left text-gray-900"
              }
            >
              <IconContext.Provider value={{ color: "blue", size: "1.5em" }}>
                <div className="flex gap-2 items-center">
                <TbLogs />
                  <p>Manage Blogs</p>
                </div>
              </IconContext.Provider>
            </NavLink>
          </li>
          <li >
            <NavLink
              to="/admin-dashboard/manage-feedback"
              className={({ isActive, isPending }) =>
                isActive
                  ? "font-bold text-blue-700 text-lg"
                  : isPending
                  ? "pending"
                  : "block py-2 px-3 rounded hover:bg-gray-100 md:hover:bg-transparent md:border-0 md:hover:text-blue-700 md:p-0 text-lg font-semibold w-full md:text-left text-gray-900"
              }
            >
              <IconContext.Provider value={{ color: "blue", size: "1.5em" }}>
                <div className="flex gap-2 items-center">
                <VscFeedback />
                  <p>Manage Review</p>
                </div>
              </IconContext.Provider>
            </NavLink>
          </li>
          <li >
            <NavLink
              to="/admin-dashboard/manage-order"
              className={({ isActive, isPending }) =>
                isActive
                  ? "font-bold text-blue-700 text-lg"
                  : isPending
                  ? "pending"
                  : "block py-2 px-3 rounded hover:bg-gray-100 md:hover:bg-transparent md:border-0 md:hover:text-blue-700 md:p-0 text-lg font-semibold w-full md:text-left text-gray-900"
              }
            >
              <IconContext.Provider value={{ color: "blue", size: "1.5em" }}>
                <div className="flex gap-2 items-center">
                <MdProductionQuantityLimits />
                  <p>Manage Order</p>
                </div>
              </IconContext.Provider>
            </NavLink>
          </li>
          <li>
            <NavLink
              to="/"
              className={({ isActive, isPending }) =>
                isActive
                  ? "font-bold text-blue-700 text-lg"
                  : isPending
                  ? "pending"
                  : "block py-2 px-3 rounded hover:bg-gray-100 md:hover:bg-transparent md:border-0 md:hover:text-blue-700 md:p-0 text-lg font-semibold w-full md:text-left text-gray-900"
              }
            >
              <IconContext.Provider value={{ color: "blue", size: "1.5em" }}>
                <div className="flex gap-2 items-center">
                <FaHome />
                  <p>Home</p>
                </div>
              </IconContext.Provider>
            </NavLink>
          </li>
          
        </ul>
      </div>
    </div>
  );
}

export default Dashboard;