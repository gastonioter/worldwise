/* eslint-disable no-unused-vars */
// "https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=0&longitude=0"

import { useEffect, useState } from "react";

import styles from "./Form.module.css";
import Button from "./Button";
import { useNavigate } from "react-router-dom";
import Message from "./Message";
import { useCities } from "../contexts/CityContext";
import DatePicker from "react-datepicker";
import Spinner from "./Spinner";
import "react-datepicker/dist/react-datepicker.css";
import { useSearchURLParams } from "../hooks/useSearchURLParams";
export function convertToEmoji(countryCode) {
  const codePoints = countryCode
    .toUpperCase()
    .split("")
    .map((char) => 127397 + char.charCodeAt());
  return String.fromCodePoint(...codePoints);
}

const BASE_URL = "https://api.bigdatacloud.net/data/reverse-geocode-client";
function Form() {
  const [cityName, setCityName] = useState("");
  const [date, setDate] = useState(new Date());
  const [notes, setNotes] = useState("");
  const [emoji, setEmoji] = useState("");
  const [country, setCountry] = useState("");
  const [error, setError] = useState("");
  const [isGeolocating, setIsGeolocating] = useState(false);

  const { createCity, isLoading } = useCities();
  const [lat, lng] = useSearchURLParams();

  const navigate = useNavigate();

  useEffect(
    function () {
      async function fetchDataCity() {
        try {
          setIsGeolocating(true);
          const res = await fetch(
            `${BASE_URL}?latitude=${lat}&longitude=${lng}`
          );
          if (!res.ok) throw new Error("We have problems to find a city");
          const data = await res.json();
          if (!data.countryCode)
            throw new Error(
              "That doesn't seem to be a city. Click somewhere else"
            );
          setCityName(data.city || data.locality || "");
          setCountry(data.countryName);
          setEmoji(convertToEmoji(data.countryCode));
          setIsGeolocating(false);
          setError("");
        } catch (e) {
          setIsGeolocating(false);
          setError(e.message);
        }
      }
      fetchDataCity();
    },
    [lat, lng]
  );

  function goBack(e) {
    e.preventDefault();
    navigate(-1);
  }

  async function handleSumbit(e) {
    e.preventDefault();
    if (!country || !date) return;

    const newCity = {
      cityName: country,
      date,
      notes,
      emoji,
      country,
      position: {
        lat: Number(lat),
        lng: Number(lng),
      },
    };

    await createCity(newCity);
    navigate("/app/cities");
  }

  if (isGeolocating) return <Spinner />;

  if (error) return <Message message={error} />;

  return (
    <form
      className={`${styles.form} ${isLoading ? styles.loading : ""}`}
      onSubmit={handleSumbit}
    >
      <div className={styles.row}>
        <label htmlFor="cityName">City name</label>
        <input
          id="cityName"
          onChange={(e) => setCityName(e.target.value)}
          value={cityName}
        />
        <span className={styles.flag}>{emoji}</span>
      </div>

      <div className={styles.row}>
        <label htmlFor="date">When did you go to {cityName}?</label>
        <DatePicker
          selected={date}
          id={"date"}
          dateFormat={"dd/MM/yyyy"}
          onChange={(date) => {
            setDate(date);
          }}
        />
      </div>

      <div className={styles.row}>
        <label htmlFor="notes">Notes about your trip to {cityName}</label>
        <textarea
          id="notes"
          onChange={(e) => setNotes(e.target.value)}
          value={notes}
        />
      </div>

      <div className={styles.buttons}>
        <Button type="primary">Add</Button>
        <Button onClick={(e) => goBack(e)} type="back">
          &larr; Back
        </Button>
      </div>
    </form>
  );
}

export default Form;
