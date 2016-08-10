/* eslint import/no-mutable-exports: 0 */

let taskDurations = {
  standard: 1500,
  resting: 300,
};

let offLineThreshold = 60; // minutes
let checkMemberInterval = 1000; // ms

let firebaseConfig = {
  apiKey: 'AIzaSyCbB0yB-qabmzQ_STyAngEd5-D0MypBbBE',
  authDomain: 'tomato5-pro.firebaseapp.com',
  databaseURL: 'https://tomato5-pro.firebaseio.com',
  storageBucket: 'tomato5-pro.appspot.com',
};

if (window.location.hostname === 'localhost'
    || window.location.hostname === 'tomato5-dev.firebaseapp.com') {
  taskDurations = {
    standard: 10,
    resting: 5,
  };

  offLineThreshold = 1;
  checkMemberInterval = 1000;

  firebaseConfig = {
    apiKey: 'AIzaSyBanxSDWrWUKStXGi8lSQtA1AeMmGDNmks',
    authDomain: 'tomato5-dev.firebaseapp.com',
    databaseURL: 'https://tomato5-dev.firebaseio.com',
    storageBucket: 'tomato5-dev.appspot.com',
  };
}

export { taskDurations, offLineThreshold, checkMemberInterval, firebaseConfig };
