const input = document.querySelector('#search-box');
const countryList = document.querySelector('.country-list');
const countryInfo = document.querySelector('.country-info');

const DELAY = 500;
let timeoutId;

input.addEventListener('input', onSearch);

function onSearch(event) {
    clearTimeout(timeoutId);
    const query = event.target.value.trim();
    if (!query) {
        clearMarkup();
        return;
    }

    timeoutId = setTimeout(() => {
        fetchCountries(query)
            .then(countries => {
                if (countries.length > 10) {
                    alert('Занадто багато збігів. Уточніть запит.');
                    clearMarkup();
                } else if (countries.length >= 2 && countries.length <= 10) {
                    renderCountryList(countries);
                } else if (countries.length === 1) {
                    renderCountryInfo(countries[0]);
                }
            })
            .catch(error => {
                console.error(error);
                alert('Не знайдено жодної країни.');
                clearMarkup();
            });
    }, DELAY);
}

function fetchCountries(query) {
    return fetch(`https://restcountries.com/v3.1/name/${query}`)
        .then(response => {
            if (!response.ok) {
                throw new Error('Помилка запиту');
            }
            return response.json();
        });
}

function renderCountryList(countries) {
    const markup = countries.map(({ name }) => `<li>${name.common}</li>`).join('');
    countryList.innerHTML = markup;
    countryInfo.innerHTML = '';
}

function renderCountryInfo({ name, capital, population, languages, flags }) {
    countryList.innerHTML = '';
    countryInfo.innerHTML = `
        <h2>${name.common}</h2>
        <p><b>Столиця:</b> ${capital}</p>
        <p><b>Населення:</b> ${population}</p>
        <p><b>Мови:</b> ${Object.values(languages).join(', ')}</p>
        <img src="${flags.svg}" alt="Прапор ${name.common}" width="150">
    `;
}

function clearMarkup() {
    countryList.innerHTML = '';
    countryInfo.innerHTML = '';
}
