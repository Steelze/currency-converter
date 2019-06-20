//Create Database
dbPromise = function openDatabase() {
    return idb.open('currency_converter', 1, function(upgradeDb) {
        switch (upgradeDb.oldVersion) {
            case 0:
                upgradeDb.createObjectStore('currencies', {keyPath: 'id'});
                upgradeDb.createObjectStore('rates', {keyPath: 'id'});
        }
    })
}

function putDB(store, data) {
    return dbPromise().then(function(db) {
        let tx = db.transaction(store, 'readwrite');
        let dbStore = tx.objectStore(store);
        dbStore.put(data);
        return tx.complete;
    });
}

function getCurrenciesFromDb() {
    return dbPromise().then(function(db) {
        let tx = db.transaction('currencies');
        let currencyStore = tx.objectStore('currencies');
        return currencyStore.getAll();
    });
}

async function saveCurrenciesData(res) {
    res.then(data => {
        const currencies = Object.values(data.results)
        for (const currency of currencies) {
            putDB('currencies', currency);
        }
    });
}

async function saveRateData(res) {
    res.then(data => {
        const rates = Object.entries(data)
        for (const [id, value] of rates) {
            putDB('rates', {id, value});
        }
    });
}

function getRate(id) {
    return dbPromise().then(function(db) {
        let tx = db.transaction('rates');
        let currencyStore = tx.objectStore('rates');
        return currencyStore.get(id);
    });
}