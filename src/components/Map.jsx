/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react/prop-types */
/* eslint-disable react/jsx-key */
/* eslint-disable no-unused-vars */
import { useNavigate, useSearchParams } from "react-router-dom";
import styles from "./Map.module.css";
import {
  APIProvider,
  ControlPosition,
  InfoWindow,
  useMapsLibrary,
  Map,
  MapControl,
  Marker,
  useMap,
  useMarkerRef,
} from "@vis.gl/react-google-maps";
import { useCities } from "../contexts/CityContext";
import { useEffect, useState } from "react";
import { useGeolocation } from "../hooks/useGeolocation";
const API_KEY = "AIzaSyDNRMow6Cv6ifnFdq8SwXy-HQ2yF4Rkauk";

export default function Maps() {
  const { cities } = useCities();
  const navigate = useNavigate();
  const geocodeLib = useMapsLibrary("geocoding");

  const {
    getPosition,
    position,
    isLoading: isGeolocating,
  } = useGeolocation({
    lat: -50,
    lng: 0,
  });

  function onMapClick(e) {
    const { lat, lng } = e.detail.latLng;
    console.log(geocodeLib);
    navigate(`form?lat=${lat}&lng=${lng}`);
  }

  return (
    <div className={styles.mapContainer}>
      <APIProvider apiKey={API_KEY}>
        <Map
          defaultCenter={position}
          defaultZoom={4}
          disableDefaultUI
          onClick={onMapClick}
        >
          <MapControl position={ControlPosition.BOTTOM_CENTER}>
            <div>
              {" "}
              <button
                onClick={getPosition}
                className={`btnMap ${isGeolocating ? "btnLoading" : ""}`}
              >
                {isGeolocating ? "Loading..." : "USE YOUR LOCATION"}
              </button>{" "}
            </div>
          </MapControl>

          {cities.map((c) => (
            <MarkerWithInfo city={c} key={c.id}></MarkerWithInfo>
          ))}
        </Map>

        <MapController position={position} />
      </APIProvider>
    </div>
  );
}

function MapController({ position }) {
  const map = useMap();
  const [mapPosition, setMapPosition] = useState({ lat: -50, lng: -0 });
  const [searchParams] = useSearchParams();
  const lat = searchParams.get("lat");
  const lng = searchParams.get("lng");

  // Synchronize with URL params
  useEffect(
    function updateMapCenter() {
      if (!lat || !lng) return;
      setMapPosition({ lat: +lat, lng: +lng });
    },
    [lat, lng]
  );

  // Synchronize with geolocation api
  useEffect(
    function () {
      setMapPosition(position);
    },
    [position]
  );

  useEffect(
    function () {
      if (!map) return;

      map.panTo(mapPosition);
    },
    [map, mapPosition]
  );

  return <></>;
}
function MarkerWithInfo({ city }) {
  const [markerRef, marker] = useMarkerRef();
  const [isMarkerOpen, setIsMarkerOpen] = useState(true);
  return (
    <>
      <Marker
        ref={markerRef}
        onClick={() => setIsMarkerOpen(true)}
        position={{ lat: city.position.lat, lng: city.position.lng }}
      />

      {isMarkerOpen && (
        <InfoWindow
          onCloseClick={() => setIsMarkerOpen(false)}
          anchor={marker}
          content={` <h2 class=popup-content>${city.emoji} ${city.cityName}</h2>`}
        ></InfoWindow>
      )}
    </>
  );
}
