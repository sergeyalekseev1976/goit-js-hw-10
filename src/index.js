import './css/styles.css';
import { fetchCountries } from './fetchCountries';
const debounce = require('lodash.debounce');
import Notiflix from 'notiflix';

const DEBOUNCE_DELAY = 300;

const inputEl = document.querySelector('#search-box');
const listEl = document.querySelector('.country-list');
const infoEl = document.querySelector('.country-info');

inputEl.addEventListener('input', debounce(onInput, DEBOUNCE_DELAY));

function onInput(e) {
  const inputValue = e.target.value.trim();
  listEl.innerHTML = '';
  infoEl.innerHTML = '';

  fetchCountries(inputValue)
    .then(countries => {
      if (countries.length > 10) {
        Notiflix.Notify.info(
          'Too many matches found. Please enter a more specific name.'
        );
      }
      if (countries.length > 1) {
        createListCountries(countries);
        listEl.classList.remove('country-name');
      }
      if (countries.length === 1) {
        createListCountries(countries);

        createInfoCountries(countries);
        listEl.classList.add('country-name');
      }
    })
    .catch(error => {
      Notiflix.Notify.failure('Oops, there is no country with that name');
    });
}
function createListCountries(countries) {
  const markupCountries = countries
    .map(({ name, flags }) => {
      return `<li><img src="${flags.svg}" alt="flag of ${name.common}" width = 40 ><h2>${name.common}</h2></li>  `;
    })
    .join('');
  listEl.innerHTML = markupCountries;
}
function createInfoCountries(countries) {
  const markupCountries = countries
    .map(({ capital, population, languages }) => {
      return `<p><b>Capital: </b>${capital}</p>
       <p><b>Population: </b>${population}</p>
       <p><b>Languages: </b>${Object.values(languages).join(', ')}</p>`;
    })
    .join('');
  infoEl.innerHTML = markupCountries;
}
