/* eslint-disable no-unused-vars */
import { useNavigate, useSearchParams } from "react-router-dom";
import styles from "./Map.module.css";
import Spinner from "./Spinner";
import { APIProvider, Map, Marker, useMap } from "@vis.gl/react-google-maps";
import { useEffect, useState } from "react";
const GOOGLE_MAPS_API_KEY = "AIzaSyDNRMow6Cv6ifnFdq8SwXy-HQ2yF4Rkauk";

function MyComponent() {
  const [searchParams, setSearchParams] = useSearchParams();

  // const lat = searchParams.get("lat");
  // const lng = searchParams.get("lng");
  const map = useMap();

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

  useEffect(function onLoad() {
    navigator.geolocation.getCurrentPosition((position) => {
      const { latitude: lat, longitude: lng } = position.coords;

      setUserCoords({
        lat,
        lng,
      });
    });
  }, []);

  if (userCoords.lat === 0 && userCoords.lng === 0)
    return (
      <div className={styles.mapContainer}>
        <Spinner />
      </div>
    );

  return (
    <div className={styles.mapContainer} onClick={() => navigate("form")}>
      <APIProvider
        apiKey={GOOGLE_MAPS_API_KEY}
        className={styles.mapContainer}
        onClick={() => navigate("form")}
      >
        <Map
          minZoom={3}
          defaultZoom={10}
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
        />

        <MyComponent />
      </APIProvider>
    </div>
  );
}
