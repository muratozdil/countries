'use strict';
const btn = document.querySelector('.btn-country');
const countriesContainer = document.querySelector('.countries');

const renderCountry = function (data, className = '') {
    const html = `
        <article class="country ${className}">
            <img class="country__img" src="${data.flag}" />
            <div class="country__data">
                <h3 class="country__name">${data.name}</h3>
                <h4 class="country__region">${data.region}</h4>
                <p class="country__row"><span>👨🏼‍🤝‍👩🏼</span>${(
                    +data.population / 1000000
                ).toFixed(2)} M</p>
                <p class="country__row"><span>🗣️</span>${displayNames(data)}</p>
                <p class="country__row"><span>💰</span>${
                    data.currencies[0].name
                }</p>
            </div>
        </article>
    `;
    countriesContainer.insertAdjacentHTML('beforeend', html);
};

const displayNames = function (data) {
    const names = [];
    data.languages.forEach((_, i) => {
        names.push(data.languages[i].name);
    });
    return names.join(' and ');
};

const whereAmI = function () {
    getPosition()
        .then(pos => {
            const { latitude: lat, longitude: lng } = pos.coords;
            return fetch(
                `https://geocode.xyz/${lat},${lng}?geoit=json&auth=468294515968085320791x110080`
            );
        })
        .then(response => {
            return response.json();
        })
        .then(data => {
            // console.log(data.error.message);
            if (data.success === false) throw new Error(data.error.message);
            getCountryData(data.country);
            return console.log(`you are in ${data.city}, ${data.country}`);
        })
        .catch(err => console.error(err.message));
};

const getCountryData = function (country) {
    fetch(`https://restcountries.com/v2/name/${country}`)
        .then(request => request.json())
        .then(data => {
            if (data[0].borders) getNeighborData(data[0].borders);
            renderCountry(...data);
        })
        .finally(() => (countriesContainer.style.opacity = 1));
};

const getNeighborData = function (countries) {
    // console.log(countries);
    countries.forEach((country, i) => {
        if (i < 3) {
            fetch(`https://restcountries.com/v2/alpha/${country}`)
                .then(request => request.json())
                .then(data => renderCountry(data, 'neighbour'));
        }
    });
};

btn.addEventListener('click', whereAmI);

const getPosition = () =>
    new Promise((resolve, reject) =>
        navigator.geolocation.getCurrentPosition(resolve, reject)
    );

getPosition()
    .then(pos => console.log(pos))
    .catch(err => console.error(err.message));
