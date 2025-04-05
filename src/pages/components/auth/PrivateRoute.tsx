import { useState, useEffect, useRef, JSX } from "react";
import { Navigate } from "react-router-dom";

interface PrivateRouteProps {
  readonly element: JSX.Element;
}

function PrivateRoute({ element }: PrivateRouteProps) {
  const [redirect, setRedirect] = useState(false);
  const alertShown = useRef(false);

  const token = localStorage.getItem("token");

  useEffect(() => {
    if (!token && !alertShown.current) {
      alert("Porfavor registrare para acceder a esta pagina");
      alertShown.current = true;
      setRedirect(true);
    }
  }, [token]);

  if (redirect) return <Navigate to="/registrarse" />;

  return element;
}

export default PrivateRoute;
