// document.querySelector('#amount').classList.add('field-error');
document.querySelector('#error-msg').classList.add('d-none');
document.querySelector('#processing').classList.add('d-none');
// document.querySelector('#result').classList.add('d-none');
// document.querySelector('#info').classList.add('d-none');

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