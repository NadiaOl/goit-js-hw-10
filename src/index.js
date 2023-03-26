import './css/styles.css';

// импортируем fetch, debounce, Notify
import { fetchCountries } from './fetchCountries';
import debounce from 'lodash.debounce';
import { Notify } from 'notiflix/build/notiflix-notify-aio';

const DEBOUNCE_DELAY = 300;

// получаем доступ к полю ввода и div, в который будем помещать разметку
const refs = {
    cardContainer: document.querySelector('.country-info'),
    searchField: document.querySelector('#search-box'),
}

// вешаем слушателя на поле ввода
refs.searchField.addEventListener('input', debounce((onSearch), DEBOUNCE_DELAY));


// создаем функцию, которая 
// 1) получает данные из поля ввода, проверяет, чтоб поле ввода не было пустым
// 2) запускает запрос на бэк-энд
// 3) осуществляет поиск, по результату производит разметку либо обрабатывает ошибку

let seekedCountry = "country name";

function onSearch(event) {
    seekedCountry = event.target.value.trim();
    if (seekedCountry === "") {
        refs.cardContainer.innerHTML = "";
        return
    };

    fetchCountries(seekedCountry)
        .then(renderCoutryCard)
        .catch(({ message }) => {
    event.target.value = "";
    if (message === "404") {
        Notify.failure('Oops, there is no country with that name');
    } else {
        Notify.failure('Something went wrong :( Please, try again later')
    }
})
}

// функция подготовки полной разметки
function countryCard({ capital, name, population, languages, flags }) {
    return `
        <div class="country_header">
        <img class="list_img" src="${flags.svg}" alt="${name.official}" width=25>
            <span class="country_span" style="font-size: 24px">${name.official}</span>
        </div>
        <ul class="country_card_list" style="list-style: none">
            <li class="country_item">
                <span class="country_key">Capital:</span>
                <span class="country_value">${capital}</span>
            </li>
            <li class="country_item">
                <span class="country_key">Population:</span>
                <span class="country_value">${population}</span>
            </li>
            <li class="country_item">
                <span class="country_key">Languages:</span>
                <span class="country_value">${Object.values(languages)}</span>
            </li>
        </ul>
        `
}
// функция подготовки короткой разметки
function countryPreview({ name, flags }) {
    return `
        <div class="country_header" style="display: flex; align-items: center; padding-bottom: 10px">
        <img class="list_img" src="${flags.svg}" alt="${name.official}" width=20 style="margin-right: 10px">
            <span class="country_span">${name.official}</span>
        </div>
        `
}

// если кол-во результатов больше 10, выводим сообщение,
// если от 2 до 10 выводим короткую разметку
// если 1 - полную 
function renderCoutryCard(country) {
    if (country.length >= 10) {
        Notify.info('Too many matches found. Please enter a more specific name.');
        refs.cardContainer.innerHTML = ""
    } else { 
    if (country.length >= 2) {
        refs.cardContainer.innerHTML = country.map(countryPreview).join("")
    } else {
        refs.cardContainer.innerHTML = country.map(countryCard);
    }
}
}

