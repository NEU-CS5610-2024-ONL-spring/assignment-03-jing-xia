import { Navigate } from "react";
import { useAuth0 } from "@auth0/auth0-react";

export default function RequireAuth({ children }) {
  const { isAuthenticated, isLoading, loginWithRedirect } = useAuth0();

  // If the user is not authenticated, login with redirect
  if (!isLoading && !isAuthenticated) {
    loginWithRedirect();
    return <></>;
  }

  // Otherwise, display the children (the protected page)
  return children;
}