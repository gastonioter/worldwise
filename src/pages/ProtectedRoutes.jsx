/* eslint-disable react/prop-types */
import { useEffect } from "react";
import { useAuth } from "../contexts/AuthContext";
import { useNavigate } from "react-router-dom";

export default function ProtectedRoutes({ children }) {
  const navigate = useNavigate();
  const { isAuth } = useAuth();

  useEffect(
    function () {
      if (!isAuth) return navigate("/");
    },
    [isAuth, navigate]
  );
  return isAuth ? children : null;
}
