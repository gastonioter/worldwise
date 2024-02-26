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
} from "@vis.gl/react-google-maps";
import { useCities } from "../contexts/CityContext";
import { useState } from "react";
const GOOGLE_MAPS_API_KEY = "AIzaSyDNRMow6Cv6ifnFdq8SwXy-HQ2yF4Rkauk";

const center = { lat: -34, lng: -60 };
export default function Maps() {
  const { cities } = useCities();

  return (
    <div className={styles.mapContainer}>
      <APIProvider apiKey={GOOGLE_MAPS_API_KEY} className={styles.mapContainer}>
        <Map
          minZoom={3}
          defaultZoom={8}
          defaultCenter={center}
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
            <MarkerWithInfo key={city.id} city={city} />
          ))}
        </Map>
      </APIProvider>
    </div>
  );
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
          content={` <h3 class=popup-content>${city.emoji} ${city.cityName}</h3>`}
        ></InfoWindow>
      )}
    </>
  );
}
