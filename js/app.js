const api_key = '98b713dc18f115197d07';
const base_url = `https://free.currconv.com/api/v7/`;
const convert_url = `${base_url}convert?q=USD_PHP&compact=ultra&apiKey=${api_key}`;
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

function hideApplicationError() {
    app_error_field.classList.add('d-none');
    app_error_field_text.textContent = '';
}

function hideProcessingDiv() {
    processing_div.classList.add('d-none');
    processing_div_text.textContent = '';
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
}

function isAmountValid() {
    const value = amount_field.value;
    return (value.trim() === '' || value < 1 || isNaN(value)) ? false : true;
}

amount_field.addEventListener('keyup', _ => {
    if (isAmountValid()) {
        enableSubmitButton();
        removehighlightFromField();
    } else {
        disableSubmitButton();
        highlightField();
    }
});

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


const app = async _ => {
    showProcessingDiv('Starting Application...');
    fetchCurrencies()
        .then(data => {
            appendCurrenciesToSelect(data.results);
        })
        .catch(error => {
            const error_msg = error.message.split('.')[0];
            showApplicationError(error_msg);
        });
}

app().then(_ => hideProcessingDiv());

//Register service worker
// if ('serviceWorker' in navigator) {
//     navigator.serviceWorker.register('./sw.js').then(reg => {
//         // Registration was successful
//         if (reg.waiting) updateServiceWorker();

//         reg.addEventListener('updatefound', _ => {
//             installingServiceWorker(reg.installing);
//         });
//     }).catch(err => console.log('ServiceWorker registration failed: ', err));
// }

function updateServiceWorker() {
    console.log('Update service worker!!!!!!!!!!!!!!!');
}

function installingServiceWorker(worker) {
    worker.addEventListener('statechange', _ => {
       if (worker.state === 'installed') {
            updateServiceWorker()
       }
    });
}
