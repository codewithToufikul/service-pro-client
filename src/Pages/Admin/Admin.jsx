import React, { useState } from "react";
import Navbar from "../../Component/Navbar";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { useGetUser } from "../../AuthProvider/getUser";

function Admin() {
  const navigate = useNavigate();
  const [password, setPassword] = useState("");
  const { data, isLoading, isError } = useGetUser();

  const handleDashboardLogin = (e) => {
    e.preventDefault();
    const password = e.target.password.value;
    if (password === "1234") {
      navigate(
        data.role === "admin"
          ? "/admin-dashboard"
          : data.role === "moderator"
          ? "/admin-dashboard/client-messages"
          : "/"
      );
      
    } else {
      toast.error("Password is not correct");
    }
  };

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
    <div className="bg-gradient-to-br from-blue-100 to-purple-100 ">
      <Navbar />
      <div className="min-h-screen flex items-center justify-center  p-4">
        <div className="bg-white rounded-lg shadow-xl overflow-hidden w-full max-w-md">
          <div className="bg-indigo-600 p-6">
            <h1 className="text-2xl font-bold text-center text-white">
              Login Required
            </h1>
          </div>

          <div className="p-8">
            <form onSubmit={handleDashboardLogin} className="space-y-6">
              <div>
                <label
                  htmlFor="password"
                  className="block text-sm font-medium text-gray-700 mb-2"
                >
                  Password
                </label>
                <div className="relative">
                  <input
                    id="password"
                    name="password"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Enter your password"
                    className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                    required
                  />
                </div>
              </div>

              <div>
                <button
                  type="submit"
                  className="w-full flex justify-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition duration-150"
                >
                  LOGIN
                </button>
              </div>
            </form>

            <div
              onClick={() => {
                toast.success("contract with developer !");
              }}
              className="mt-6 text-center"
            >
              <a
                href="#"
                className="text-sm text-indigo-600 hover:text-indigo-500"
              >
                Forgot your password?
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Admin;
