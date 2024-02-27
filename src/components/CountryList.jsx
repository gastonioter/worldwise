/* eslint-disable react/prop-types */

import Message from "./Message";
import CountryItem from "./CountryItem";
import Spinner from "./Spinner";
import styles from "./CountryList.module.css";
import { useCities } from "../contexts/CityContext";

export default function CountryList() {
  const { cities, isLoading } = useCities();
  if (isLoading) return <Spinner />;

  if (cities.length === 0)
    return (
      <Message message="Add your first city by clicking on a city on the map" />
    );

  const countries = cities.reduce((acc, cityIteration) => {
    if (acc.some((city) => city.country === cityIteration.country)) return acc;
    else
      return [
        ...acc,
        { country: cityIteration.country, emoji: cityIteration.emoji },
      ];
  }, []);

  console.log(countries);

  return (
    <ul className={styles.countryList}>
      {countries.map((country, i) => (
        <CountryItem country={country} key={i} />
      ))}
    </ul>
  );
}
