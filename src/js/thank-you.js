"use strict";

// if (dataLayer) {
//   dataLayer.push({
//     'event' : 'transaction',
//     'transactionId': 'REPLACE WITH VALUE', //ID of the transaction
//     'transactionTotal': 'REPLACE WITH VALUE' //value of the transaction
//   });
// }

var timeout = 6;

function timer() {
  if (timeout > 1) {
    decreaseTimeout();
    refreshUI();
    setTimeout(timer, 1000);
  }
  else {
    console.log('redirect');
  }
}

function decreaseTimeout() {
  timeout--;
}

function refreshUI() {
  document.querySelector('#secondsNumber').innerHTML = timeout;
}

function redirect() {
  location.href = location.protocol + '//' + location.host;
}

timer();
