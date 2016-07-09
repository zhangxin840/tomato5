<template>
  <div id="app">
    <div class="title">
      <img class="logo" src="./assets/tomato.svg">
      <h1 class="">We Tomatoes!</h1>
    </div>
    <panel></panel>
    <panel></panel>
    <panel></panel>

    <div id="firebaseui-auth-container"></div>
    <div id="sign-in-status"></div>
    <div id="sign-in"></div>
    <div id="account-details"></div>
  </div>
</template>

<script>
import normalizeCss from 'normalize.css'; /* eslint no-unused-vars: 0 */
import animateCss from 'animate.css'; /* eslint no-unused-vars: 0 */

import firebase from 'firebase';

import Panel from './components/Panel';
import auth from './auth';

const config = {
  apiKey: 'AIzaSyBCfKVu0LUNav87mRe7X7YLGJ7-eIQ3ptM',
  authDomain: 'wetomatoes.firebaseapp.com',
  databaseURL: 'https://wetomatoes.firebaseio.com',
  storageBucket: 'wetomatoes.appspot.com',
};

firebase.initializeApp(config);

auth.init();

export default {
  components: {
    Panel,
  },
};
</script>

<style>
body {
  display: block;
  height: 100%;
  font-family: 'Architects Daughter', cursive;
}

.title{
  line-height: 100px;
  text-align: center;
  margin: 10% 0;
}
.title h1 {
  color: #42b983;
  text-align: center;
  font-size: 40px;
  display: inline-block;
  margin: 0;
}
.title .logo {
  width: 100px;
  height: 100px;
  display: inline-block;
  vertical-align: top;
}

#app {
  color: #2c3e50;
}

#app a {
  color: #42b983;
  text-decoration: none;
}

.icon-tomato{
  display: inline-block;
  width: 30px;
  height: 30px;
  text-indent: -9999px;
  background: url('./assets/tomato.svg');
}
</style>
