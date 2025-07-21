import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useGetUser } from "./getUser";

const AdminRoute = ({ children }) => {
  const { data, isLoading, isError } = useGetUser();
  const navigate = useNavigate();
  const [checked, setChecked] = useState(false); // To delay navigation check until data is ready
  useEffect(() => {
    if (!isLoading) {
      if (data?.role === "admin" || data?.role === "moderator") {
        setChecked(true); 
      } else {
        navigate("/"); 
      }
    }
  }, [isLoading, data, navigate]);

  if (isLoading || !checked) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="relative">
          <div className="h-24 w-24 rounded-full border-t-8 border-b-8 border-gray-200"></div>
          <div className="absolute top-0 left-0 h-24 w-24 rounded-full border-t-8 border-b-8 border-blue-500 animate-spin"></div>
        </div>
      </div>
    );
  }

  return children;
};

export default AdminRoute;
