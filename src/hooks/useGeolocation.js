import { useState } from "react";

export function useGeolocation(defaultPosition) {
  const [isLoading, setIsLoading] = useState(false);
  const [position, setPosition] = useState(defaultPosition);
  const [error, setError] = useState(null);

  function getPosition() {
    setIsLoading(true);
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude: lat, longitude: lng } = position.coords;

        setIsLoading(false);
        setPosition({ lat, lng });
      },
      (error) => {
        setError(error.message);
        setIsLoading(false);
      }
    );
  }

  return { getPosition, isLoading, error, position };
}
