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
const GOOGLE_MAPS_API_KEY = "AIzaSyDNRMow6Cv6ifnFdq8SwXy-HQ2yF4Rkauk";

function MyComponent() {
  const [searchParams, setSearchParams] = useSearchParams();
  const map = useMap();

  // const lat = searchParams.get("lat");
  // const lng = searchParams.get("lng");

  useEffect(
    function () {
      if (!map) return;
    },

    [map]
  );

  return <></>;
}

export default function Maps() {
  const [userCoords, setUserCoords] = useState({ lat: 0, lng: 0 });
  const navigate = useNavigate();
  const { cities, isLoading } = useCities();

  useEffect(function onLoad() {
    navigator.geolocation.getCurrentPosition((position) => {
      const { latitude: lat, longitude: lng } = position.coords;

      setUserCoords({
        lat,
        lng,
      });
    });
  }, []);

  if ((userCoords.lat === 0 && userCoords.lng === 0) || isLoading)
    return (
      <div className={styles.mapContainer}>
        <Spinner />
      </div>
    );

  console.log("map is on the screen");

  return (
    <div className={styles.mapContainer} onClick={() => navigate("form")}>
      <APIProvider
        apiKey={GOOGLE_MAPS_API_KEY}
        className={styles.mapContainer}
        onClick={() => navigate("form")}
      >
        <Map
          minZoom={3}
          defaultZoom={2}
          defaultCenter={userCoords}
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

  return (
    <>
      <Marker
        ref={markerRef}
        position={{ lat: city.position.lat, lng: city.position.lng }}
      />

      <InfoWindow
        anchor={marker}
        content={` <h1 class=popup-content>${city.emoji} ${city.cityName}</h1>`}
      ></InfoWindow>
    </>
  );
}
