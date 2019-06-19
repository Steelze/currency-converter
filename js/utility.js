const api_key = '98b713dc18f115197d07';
const base_url = `https://free.currconv.com/api/v7/`;
const currencies_url = `${base_url}currencies?apiKey=${api_key}`

const form = document.querySelector('form');
const amount_field = document.querySelector('#amount');
const amount_error_div = document.querySelector('#amount-error em');
const currency_field_1 = document.querySelector('#currency1');
const currency_field_2 = document.querySelector('#currency2');
const processing_div = document.querySelector('#processing');
const processing_div_text = document.querySelector('#processing strong');
const result_div = document.querySelector('#result');
const info_div = document.querySelector('#info');
const submit_button = document.querySelector('#submit');
const app_error_field = document.querySelector('#error-msg');



function disableSubmitButton() {
    submit_button.disabled = true;
}

function enableSubmitButton() {
    submit_button.disabled = false;
}

// https://blog.abelotech.com/posts/number-currency-formatting-javascript/
function formatAmount(amount) {    
    return Number(amount).toFixed(2).replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1,');
}

function hideApplicationError() {
    app_error_field.classList.add('d-none');
    app_error_field.textContent = '';
}

function hideProcessingDiv() {
    processing_div.classList.add('d-none');
    processing_div_text.textContent = '';
    enableSubmitButton();
}

function hideResultDiv() {
    result_div.classList.add('d-none');
    result_div.innerHTML = '';
}

function hideInfoDiv() {
    info_div.classList.add('d-none');
    info_div.innerHTML = '';
}

function highlightField() {
    amount_field.classList.add('field-error');
    amount_field.nextSibling.nextSibling.classList.remove('d-none');
    amount_error_div.textContent = ' Enter valid value'
}

function removehighlightFromField() {
    amount_field.classList.remove('field-error');
    amount_field.nextSibling.nextSibling.classList.add('d-none');
    amount_error_div.textContent = ''
}

function showApplicationError(text = 'Oops... Something went wrong') {
    hideProcessingDiv();
    app_error_field.classList.remove('d-none');
    app_error_field.textContent = text;
}

function showProcessingDiv(text = 'Processing...') {
    processing_div.classList.remove('d-none');
    processing_div_text.textContent = text;
    disableSubmitButton();
}

function showResultDiv({from_name, to_name, amount, result} = {}) {
    hideProcessingDiv();
    result_div.classList.remove('d-none');
    result_div.innerHTML = `<span class="text-muted">${amount} ${from_name} equals</span>
    <br>
    <span class="text-nile-blue display-5 p-2">${formatAmount(result)} ${to_name}</span>`;
    showInfoDiv({from_name, to_name, amount, result})
}

function showInfoDiv({from_name, to_name, amount, result} = {}) {
    info_div.classList.remove('d-none');
    const value = result / amount;
    info_div.innerHTML = `<u>1 ${from_name} = ${value} ${to_name}</u>`;
}

function isAmountValid() {
    const value = amount_field.value;
    return (value.trim() === '' || value <= -1 || isNaN(value)) ? false : true;
}


function createOptionTag(text = '', value = '') {
    const option = document.createElement("option");
    option.text = text;
    option.value = value;
    return option;
}

function appendCurrenciesToSelect(currencies){
    const entries = Object.values(currencies)
    for (const currency of entries) {
        currency_field_1.appendChild(createOptionTag(currency.currencyName, currency.id));
        currency_field_2.appendChild(createOptionTag(currency.currencyName, currency.id));
    }
}

function fetchCurrencies() {
    return fetch(currencies_url)
    .then(function(response) {
        return response.json();
    }).then( data => {
        if (data.status === 400) {
            throw new Error(data.error);
        }
        return data;
    });
}