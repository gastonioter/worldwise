/* eslint-disable no-unused-vars */
import { useState } from "react";

export function useGeolocation() {
  const [isLoading, setIsLoading] = useState(false);
  const [position, setPosition] = useState({});
  const [error, setError] = useState(null);

  function getPosition() {
    if (!navigator.geolocation) return;
    setError("Geolocation is not supported");

    setIsLoading(true);
    navigator.geolocation.getCurrentPosition(handleSuccess, handleError);
  }

  function handleSuccess(position) {
    const { latitude, longitude } = position.coords;
    setPosition({ latitude, longitude });
    setIsLoading(false);
  }

  function handleError(error) {
    setError(error.message);
    setIsLoading(false);

  }

  return { isLoading, position, error, getPosition };
}
