<template>
  <div id="app">
    <div class="title">
      <img class="logo" src="./assets/tomato.svg">
      <h1 class="">Take Five</h1>
    </div>
    <p class="instruction"><span>Concentrate for work</span>, <span>five times a day</span></p>
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
  apiKey: 'AIzaSyBCfKVu0LUNav87mRe7X7YLGJ7-eIQ3ptM',
  authDomain: 'wetomatoes.firebaseapp.com',
  databaseURL: 'https://wetomatoes.firebaseio.com',
  storageBucket: 'wetomatoes.appspot.com',
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
  font-family: 'Architects Daughter', cursive;

  a {
    color: #42b983;
    text-decoration: none;
  }

  color: #2c3e50;
  font-size: 15px;
}

.title{
  text-align: left;
  margin: 10% auto;
  text-align: center;

  h1 {
    color: #42b983;
    text-align: center;
    font-size: 40px;
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
  margin: 30px auto;

  &.team {
    margin-top: 80px;
  }
}



.icon-tomato{
  display: inline-block;
  width: 30px;
  height: 30px;
  text-indent: -9999px;
  background: url('./assets/tomato.svg');
}
</style>
