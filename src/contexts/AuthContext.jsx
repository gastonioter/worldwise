/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
import { createContext, useContext, useReducer } from "react";

const FAKE_USER = {
  name: "Jack",
  email: "jack@example.com",
  password: "qwerty",
  avatar: "https://i.pravatar.cc/100?u=zz",
};

const AuthContext = createContext();

function reducer(state, action) {
  console.log("reducererrr");
  const { type, payload } = action;
  switch (type) {
    case "login":
      return {
        ...state,
        isAuth: true,
        user: payload,
      };
    case "logout":
      return {
        ...state,
        isAuth: false,
        user: null,
      };

    default:
      break;
  }
}

const initialState = {
  user: null,
  isAuth: false,
};

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) return;
  return context;
}

export function AuthProvider({ children }) {
  const [{ isAuth, user }, dispatch] = useReducer(reducer, initialState);

  function login(email, password) {
    if (email === FAKE_USER.email && FAKE_USER.password === password)
      dispatch({ type: "login", payload: FAKE_USER });
    console.log(isAuth);
  }

  function logout() {
    dispatch({ type: "logout" });
  }

  const dataToProvide = { user, isAuth, login, logout };

  return (
    <AuthContext.Provider value={dataToProvide}>
      {children}
    </AuthContext.Provider>
  );
}
