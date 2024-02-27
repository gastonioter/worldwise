import { useSearchParams } from "react-router-dom";

export function useSearchURLParams() {
  const [searchParams] = useSearchParams();

  const lat = searchParams.get("lat");
  const lng = searchParams.get("lng");

  return [lat, lng];
}
