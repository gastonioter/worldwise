/* eslint-disable react/prop-types */
/* eslint-disable no-unused-vars */
import {
  createContext,
  useContext,
  useEffect,
  useReducer,
  useState,
} from "react";
import { useParams } from "react-router-dom";
const BASE_URL = "http://localhost:8000";

const CityContext = createContext();

const initalState = {
  cities: [],
  isLoading: false,
  currentCity: {},
  error: "",
};

function reducer(state, action) {
  const { type, payload } = action;

  switch (type) {
    case "loading":
      return {
        ...state,
        isLoading: true,
      };
    case "cities/load":
      return {
        ...state,
        isLoading: false,
        cities: payload,
      };
    case "cities/created":
      return {
        ...state,
        isLoading: false,
        cities: [...state.cities, payload],
      };
    case "cities/deleted":
      return {
        ...state,
        cities: state.cities.filter((c) => c.id !== payload),
        isLoading: false,
      };
    case "cities/current":
      return {
        ...state,
        isLoading: false,
        currentCity: payload,
      };
    case "error":
      return {
        ...state,
        isLoading: false,
        error: payload,
      };

    default:
      return initalState;
  }
}
// eslint-disable-next-line react-refresh/only-export-components
export function useCities() {
  const context = useContext(CityContext);
  if (context === undefined) throw new Error("Invalid use of provider");

  return context;
}

export function CityProvider({ children }) {
  const { id } = useParams();
  const [{ cities, isLoading, currentCity }, dispatch] = useReducer(
    reducer,
    initalState
  );

  useEffect(function fetchCities() {
    // REMOTE L
    async function fetchCities() {
      try {
        dispatch({ type: "loading" });
        const res = await fetch(`${BASE_URL}/cities`);
        if (!res.ok) throw new Error("Error fetching cities");
        const data = await res.json();
        dispatch({ type: "cities/loaded", payload: data });
      } catch (e) {
        console.error(e);
        dispatch({ type: "error", payload: e.message });
      }
    }

    fetchCities();
  }, []);

  useEffect(
    function fetchCurrentCity() {
      fetchCity();
    },
    [id]
  );

  async function fetchCity(id) {
    dispatch({ type: "load" });
    try {
      const res = await fetch(`${BASE_URL}/cities/${id}`);
      if (!res.ok) throw new Error();
      const data = await res.json();
      dispatch({ type: "cities/current", payload: data });
    } catch (e) {
      console.log(e);
      dispatch({ type: "error", payload: e.message });
    }
  }

  async function createCity(newCity) {
    dispatch({ type: "load" });
    try {
      // KEEP IN SYNC REMOTE STATE WITH LOCAL STATE
      const res = await fetch(`${BASE_URL}/cities`, {
        method: "POST",
        body: JSON.stringify(newCity),
        headers: {
          "Content-Type": "application/json",
        },
      });
      if (!res.ok) throw new Error();
      const city = await res.json();
      dispatch({ type: "cities/created", payload: city });
    } catch (e) {
      console.log(e);
      dispatch({ type: "error", payload: e.message });
    }
  }

  async function deleteCity(id) {
    dispatch({ type: "load" });
    try {
      // KEEP IN SYNC REMOTE STATE WITH LOCAL STATE
      await fetch(`${BASE_URL}/cities/${id}`, {
        method: "DELETE",
      });

      dispatch({ type: "cities/deleted", payload: id });
    } catch (e) {
      console.log(e);
      dispatch({ type: "error", payload: e.message });
    }
  }

  return (
    <CityContext.Provider
      value={{
        cities,
        isLoading,
        currentCity,
        fetchCity,
        createCity,
        deleteCity,
      }}
    >
      {children}
    </CityContext.Provider>
  );
}
