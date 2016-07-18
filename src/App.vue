<template>
  <div id="app">
    <div class="title">
      <img class="logo" src="./assets/tomato.svg">
      <h1 class="">Tomato 5</h1>
    </div>
    <p class="instruction"><span>Concentrate for work</span> <span>five times a day</span></p>
    <panel></panel>
    <!-- <p class="instruction team"><span>Together with your team</span></p> -->
    <!-- <panel></panel>
    <panel></panel> -->
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
  apiKey: 'AIzaSyAXBU7bIq9I5Hrn_PsX9HTArQ7D0AnxAtA',
  authDomain: 'tomato5-685bf.firebaseapp.com',
  databaseURL: 'https://tomato5-685bf.firebaseio.com',
  storageBucket: 'tomato5-685bf.appspot.com',
};

firebase.initializeApp(config);

// auth.init();

export default {
  components: {
    Panel,
  },
};
</script>

<style lang="scss">
body {
  display: block;
  height: 100%;
  // font-family: 'Architects Daughter', cursive;
  // font-family: 'Patrick Hand', cursive;
  font-family: 'Short Stack', cursive;

  a {
    color: #42b983;
    text-decoration: none;
  }

  input[type=text], input[type=text]:focus {
    color: #2c3e50;
    border: none;
    margin: 0;
    padding: 0;
    box-shadow: none;
    outline: initial;

    border-bottom: 1px solid #eee;
  }

  color: #2c3e50;
  font-size: 15px;
}

.icon {
  display: inline-block;
  text-indent: -9999px;
}

.title{
  text-align: left;
  margin: 40px auto 40px auto;
  text-align: center;

  h1 {
    color: #42b983;
    text-align: center;
    font-size: 38px;
    display: inline-block;
    margin: 0;
    line-height: 100px;
    position: relative;
    top: 10px
  }

  .logo {
    width: 100px;
    height: 100px;
    display: inline-block;
    vertical-align: top;
  }
}

.instruction {
  // display: inline-block;
  text-align: center;
  span {
    display: inline-block;
  }
  margin: 20px auto;
  line-height: 1.5;
  padding: 0 10px;

  &.team {
    margin-top: 80px;
  }
}
</style>
