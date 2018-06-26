function createElement(el, text, value) {
    var option = document.createElement(el);
    option.text = `${text} (${value})`;
    option.value = value;

    return option;
}

function appendToTag(tag, ele) {
    var select = document.getElementById(tag);
    select.appendChild(ele);
}

function getValue(id, type) {
    let getId =  document.getElementById(id);
    if (type === 'input') {
        let value = getId.value;
        return value;
    }
    let value = getId.options[getId.selectedIndex].value;
    return value;
}

window.addEventListener('DOMContentLoaded', function() {
    fetch('https://free.currencyconverterapi.com/api/v5/currencies').then(function(response) {
        return response.json();
    }).then(function(datas) {
        let values = datas.results;
        values = Object.values(values);
        values.map(function(s) {
            let countryElement = createElement('option', s.currencyName, s.id);
            let countryElement2 = createElement('option', s.currencyName, s.id);
            appendToTag('currency-1', countryElement);
            appendToTag('currency-2', countryElement2);
        })
    }).then(function() {
        document.getElementById('form').style.display = 'block';
    })
});

document.getElementById('form').addEventListener('submit', function(event) {
    event.preventDefault();
    let currency_1 = getValue('currency-1');
    let currency_2 = getValue('currency-2');
    let amount = getValue('amount', 'input');
    let query = currency_1 + '_' + currency_2;
    fetch(`https://free.currencyconverterapi.com/api/v5/convert?q=${query}&compact=y`).then(function(response) {
    return response.json();
    }).then(function(myjson) {
       let calc = myjson[query].val;
       var total = Math.round(calc * amount * 100) / 100;
       document.getElementById('answer').value = total
       console.log(`${amount} ${currency_1} = ${total} ${currency_2}`);
       
    });
});