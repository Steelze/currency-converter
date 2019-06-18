// document.querySelector('#amount').classList.add('field-error');
document.querySelector('#error-msg').classList.add('d-none');
document.querySelector('#processing').classList.add('d-none');
// document.querySelector('#result').classList.add('d-none');
// document.querySelector('#info').classList.add('d-none');

//Register service worker
if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('./sw.js').then(function(reg) {
    // Registration was successful
    console.log('ServiceWorker registration successful with scope: ', reg.scope);
    console.log('ServiceWorker registration waiting: ', reg.waiting);
    console.log('ServiceWorker registration installing: ', reg.installing);
    }, function(err) {
    // registration failed :(
    console.log('ServiceWorker registration failed: ', err);
    });
}