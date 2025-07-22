// import { useCookies } from "react-cookie";
// import { Navigate } from "react-router-dom";

// export function ProtectRoute({ children }) {
//   //console.log(children);
//   const [cookies] = useCookies(["email"]);
//   const isAuthenticated = cookies.email !== undefined;

//   return isAuthenticated ? children : <Navigate to="/login" />;
// }

import { useCookies } from "react-cookie";
import { Navigate } from "react-router-dom";

export function ProtectRoute({ children, allowedRole }) {
  const [cookies] = useCookies(["email", "role"]);

  const isAuthenticated = cookies.email !== undefined;
  const role = cookies.role;

  if (!isAuthenticated) {
    return <Navigate to="/login" />;
  }

  // If allowedRole is provided and doesn't match the user's role
  if (allowedRole && role !== allowedRole) {
    return <Navigate to="/unauthorized" />;
  }

  return children;
}
