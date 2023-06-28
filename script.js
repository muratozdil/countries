'use strict';

const btn = document.querySelector('.btn-country');
const countriesContainer = document.querySelector('.countries');

//lecture 1
const getCountryData = function (country) {
    const request = new XMLHttpRequest();
    request.open('GET', `https://restcountries.com/v2/name/${country}`);
    request.send();

    request.addEventListener('load', function () {
        // console.log(this.responseText);

        const [data] = JSON.parse(this.responseText);
        // console.log(data);

        const names = [];
        data.languages.forEach((_, i) => {
            names.push(data.languages[i].name);
        });

        const html = `
        <article class="country">
            <img class="country__img" src="${data.flag}" />
            <div class="country__data">
                <h3 class="country__name">${data.name}</h3>
                <h4 class="country__region">${data.region}</h4>
                <p class="country__row"><span>👨🏼‍🤝‍👩🏼</span>${Math.round(
                    +data.population / 1000000
                )} M</p>
                <p class="country__row"><span>🗣️</span>${names.join(
                    ' and '
                )}</p>
                <p class="country__row"><span>💰</span>${
                    data.currencies[0].name
                }</p>
            </div>
        </article>
    `;

        countriesContainer.insertAdjacentHTML('beforeend', html);
        countriesContainer.style.opacity = 1;
    });
};
const input = prompt('enter country');
getCountryData(input);
