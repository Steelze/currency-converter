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

//Initialize App
app().then(_ => hideProcessingDiv());

//Handle keyup event on amount input field
amount_field.addEventListener('keyup', _ => {
    if (isAmountValid()) {
        enableSubmitButton();
        removehighlightFromField();
    } else {
        disableSubmitButton();
        highlightField();
    }
});

//Handle form submission
form.addEventListener('submit', e => {
    e.preventDefault();
    e.stopPropagation();
    hideApplicationError();
    hideResultDiv();
    hideInfoDiv();
    if (!isAmountValid()) {
        disableSubmitButton();
        highlightField();
        return;
    }
    if (currency_field_1.value === '' || currency_field_2.value === '') {
        return false;
    }
    
    showProcessingDiv('Converting...')
    const from = currency_field_1.value;
    const from_name = currency_field_1.options[currency_field_1.selectedIndex].text;
    const to = currency_field_2.value;
    const to_name = currency_field_2.options[currency_field_2.selectedIndex].text;
    const amount = amount_field.value;
    if (from === to) {
        showResultDiv({from_name, to_name, amount, result: amount});
        return;
    }
    const from_to = `${from}_${to}`;
    const to_from = `${to}_${from}`;
    fetch(`${base_url}convert?q=${from_to},${to_from}&compact=ultra&apiKey=${api_key}`)
    .then(function(response) {
        return response.json();
    }).then( data => {
        const result = amount * data[from_to];
        showResultDiv({from_name, to_name, amount, result});
    }).catch(error => {
        console.log(error);
        const error_msg = error.message.split('.')[0];
        showApplicationError(error_msg);
    })
    
});

//Register service worker
if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('./sw.js').then(reg => {
        // Registration was successful
        if (reg.waiting) updateServiceWorker();

        reg.addEventListener('updatefound', _ => {
            installingServiceWorker(reg.installing);
        });
    }).catch(err => console.log('ServiceWorker registration failed: ', err));
}

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

