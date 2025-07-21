import { Navigate } from "react-router-dom";
import { getUserFromToken } from "./getUserFromToken";

const PrivateRoute = ({ children }) => {
  const token = localStorage.getItem("token");
  const user = getUserFromToken();

  if (!token || !user) {
    return <Navigate to="/login" replace />;
  }

  return children;
};

export default PrivateRoute;
