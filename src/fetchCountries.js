
const DATA_URL = `https://restcountries.com/v3.1/name/`;
const FILTER = 'fields=name,capital,population,flags,languages';

export default function fetchCountries(name) {
  const Url = `${DATA_URL}${name}?${FILTER}`;
  return fetch(Url).then(response => {
    if (!response.ok) {
      throw new Error(response.status);
    }
    return response.json();
  });
}