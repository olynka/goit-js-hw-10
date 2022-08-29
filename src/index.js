import './css/styles.css';
import fetchCountries from './fetchCountries';
import debounce from 'lodash.debounce';
import { Notify } from 'notiflix/build/notiflix-notify-aio';


const DEBOUNCE_DELAY = 300;

const refs = {
  inputEl: document.querySelector('#search-box'),
  listEl: document.querySelector('.country-list'),
  infoEl: document.querySelector('.country-info'),
};

function CountryList(countryInfo) {
  return countryInfo
    .map(
      ({ name, flags }) => `<li class="country-list__item">
    <img src="${flags.svg}" width="30" hight = "30" alt="${name.official} flag" class="country-list-img"> ${name.official}
</li>`
    )
    .join('');
}

function CountryCard(countryInfo) {
  return countryInfo
    .map(
      ({ name, capital, population, flags, languages }) => `<h1 class="country">
    <img src="${flags.svg}" width="40" hight = "40" alt="${
        name.official
      }" class="gallery-img"> ${name.official}</h1>
    <p><b>Capital:</b> ${capital}</p>
    <p><b>Population:</b> ${population}</p>
    <p><b>Languages:</b> ${Object.values(languages).join(', ')}</p>
`
    )
    .join('');
}


function handleOnInputEnter(event) {
  const inputCountry = event.target.value;
  if (inputCountry === '') {
    refs.infoEl.innerHTML = '';
    refs.listEl.innerHTML = '';
    return;
  }
  const countryName = String(inputCountry).trim();

  fetchCountries(countryName)
    .then(results => {
      if (results.length > 10) {
        Notify.info(
          'Too many matches found. Please enter a more specific name.'
        );
        refs.infoEl.innerHTML = '';
        refs.listEl.innerHTML = '';
        return;
      } else if (results.length >= 2 && results.length <= 10) {
        const markUp = CountryList(results);
        refs.infoEl.innerHTML = '';
        refs.listEl.innerHTML = markUp;
      } else {
        const countryCard = CountryCard(results);
        refs.listEl.innerHTML = '';
        refs.infoEl.innerHTML = countryCard;
      }
    })
    .catch(error => {
      refs.infoEl.innerHTML = '';
      refs.listEl.innerHTML = '';
      return Notify.warning(`Oops, there is no country with that name`);
    });
}

refs.inputEl.addEventListener('input', debounce(handleOnInputEnter, DEBOUNCE_DELAY));

