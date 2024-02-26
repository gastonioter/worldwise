/* eslint-disable react/prop-types */
/* eslint-disable no-unused-vars */
import { createContext, useContext, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
const BASE_URL = "http://localhost:8000";

const CityContext = createContext();

// eslint-disable-next-line react-refresh/only-export-components
export function useCities() {
  const context = useContext(CityContext);
  if (context === undefined) throw new Error("Invalid use of provider");

  return context;
}

export function CityProvider({ children }) {
  const [cities, setCities] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [currentCity, setCurrentCity] = useState({});
  const { id } = useParams();

  useEffect(function fetchCities() {
    // REMOTE L
    async function fetchCities() {
      try {
        setIsLoading(true);
        const res = await fetch(`${BASE_URL}/cities`);
        if (!res.ok) throw new Error("Error fetching cities");
        const data = await res.json();
        setCities(data);
      } catch (e) {
        console.error(e);
      } finally {
        setIsLoading(false);
      }
    }

    fetchCities();
  }, []);

  useEffect(
    function fetchCurrentCity() {
      async function fetchCity() {
        try {
          const res = await fetch(`${BASE_URL}/cities/${id}`);
          if (!res.ok) throw new Error();
          const data = await res.json();
          setCurrentCity(data);
        } catch (e) {
          console.log(e);
        }
      }

      fetchCity();
    },
    [id]
  );

  async function fetchCity(id) {
    try {
      setIsLoading(true);
      const res = await fetch(`${BASE_URL}/cities/${id}`);
      if (!res.ok) throw new Error();
      const data = await res.json();
      setCurrentCity(data);
    } catch (e) {
      console.log(e);
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <CityContext.Provider value={{ cities, isLoading, currentCity, fetchCity }}>
      {children}
    </CityContext.Provider>
  );
}
