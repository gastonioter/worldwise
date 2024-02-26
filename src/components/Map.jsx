/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react/prop-types */
/* eslint-disable react/jsx-key */
/* eslint-disable no-unused-vars */
import { useNavigate, useSearchParams } from "react-router-dom";
import styles from "./Map.module.css";
import Spinner from "./Spinner";
import {
  APIProvider,
  InfoWindow,
  Map,
  Marker,
  useMarkerRef,
  useMap,
} from "@vis.gl/react-google-maps";
import { useEffect, useState } from "react";
import { useCities } from "../contexts/CityContext";
import { useGeolocation } from "../hooks/useGeolocation";
const GOOGLE_MAPS_API_KEY = "AIzaSyDNRMow6Cv6ifnFdq8SwXy-HQ2yF4Rkauk";

function MyComponent() {
  const [searchParams, setSearchParams] = useSearchParams();
  const map = useMap();

  const lat = searchParams.get("lat");
  const lng = searchParams.get("lng");

  useEffect(
    function () {
      if (!map) return;
      if (!lat || !lng) return;

      map.panTo({ lat: parseFloat(lat), lng: parseFloat(lng) });
      map.setZoom(8);
    },

    [map, lat, lng]
  );

  return <></>;
}

export default function Maps() {
  const [searchParams, setSearchParams] = useSearchParams();
  const { getPosition, isLoading: isLoadingGeo, position } = useGeolocation();

  const navigate = useNavigate();

  const { cities } = useCities();

  useEffect(function () {
    getPosition();
  }, []);

  if (isLoadingGeo)
    return (
      <div className={styles.mapContainer}>
        <Spinner />
      </div>
    );

  function handleOnClick(e) {
    const { lat, lng } = e.detail.latLng;
    navigate(`form?lat=${lat}&lng=${lng}`);
  }

  return (
    <div className={styles.mapContainer}>
      <APIProvider apiKey={GOOGLE_MAPS_API_KEY} className={styles.mapContainer}>
        <Map
          minZoom={3}
          defaultZoom={2}
          defaultCenter={position}
          styles={[
            {
              featureType: "poi",
              elementType: "labels",
              stylers: [{ visibility: "off" }],
            },
            {
              featureType: "transit",
              elementType: "labels.icon",
              stylers: [{ visibility: "off" }],
            },
          ]}
          onClick={handleOnClick}
        >
          {cities.map((city) => (
            <MyMarker key={city.id} city={city} />
          ))}
        </Map>

        <MyComponent />
      </APIProvider>
    </div>
  );
}

function MyMarker({ city }) {
  const [markerRef, marker] = useMarkerRef();

  function handleMarkerClick(e) {
    // show info window
  }
  return (
    <>
      <Marker
        ref={markerRef}
        onClick={handleMarkerClick}
        position={{ lat: city.position.lat, lng: city.position.lng }}
      />

      <InfoWindow
        anchor={marker}
        content={` <h1 class=popup-content>${city.emoji} ${city.cityName}</h1>`}
      ></InfoWindow>
    </>
  );
}
