<template>
  <div id="app">
    <article class="main" v-bind:class="{'start': !user.uid}">
      <div class="title">
        <img class="logo" src="./assets/tomato.svg">
        <h1 class="">Tomato 5</h1>
      </div>
      <p class="instruction"><span>Concentrate for work</span> <span>five times a day</span></p>
      <panel v-if="user.uid"></panel>
      <!-- <p class="instruction team"><span>Together with your team</span></p> -->
      <!-- <panel></panel>
      <panel></panel> -->
      <account v-if="user.uid"></account>
      <div class="login" v-show="!user.uid">
        <div id="firebaseui-auth-container"></div>
      </div>
      <section class="footer">
        <p>
          <a href="https://github.com/zhangxin840/we-tomatoes" target="_blank">Star me on github</a>
        </p>
      </section>
    </article>

  </div>
</template>

<script>
import normalizeCss from 'normalize.css'; /* eslint no-unused-vars: 0 */
import animateCss from 'animate.css'; /* eslint no-unused-vars: 0 */
import firebase from 'firebase';
import FastClick from 'fastclick';

import Panel from './components/Panel';
import Account from './components/Account';
import database from './database';
import auth from './auth';

const user = auth.getUser();

const initApp = function initApp() {
  const config = {
    apiKey: 'AIzaSyAXBU7bIq9I5Hrn_PsX9HTArQ7D0AnxAtA',
    authDomain: 'tomato5-685bf.firebaseapp.com',
    databaseURL: 'https://tomato5-685bf.firebaseio.com',
    storageBucket: 'tomato5-685bf.appspot.com',
  };

  firebase.initializeApp(config);
  database.init();
  auth.init();

  if ('addEventListener' in document) {
    document.addEventListener('DOMContentLoaded', () => {
      FastClick.attach(document.body);
    }, false);
  }
};

export default {
  data() {
    return { user };
  },
  created: initApp,
  components: {
    Panel, Account,
  },
};
</script>

<style lang="scss">
body {
  // font-family: 'Architects Daughter', cursive;
  // font-family: 'Patrick Hand', cursive;
  font-family: 'Short Stack', sans-serif;;

  a {
    color: rgb(95, 210, 219);
    text-decoration: none;
    -webkit-tap-highlight-color: rgba(0,0,0,0);
    -webkit-tap-highlight-color: transparent; /* For some Androids */
    cursor: pointer;

    &:active{
        transform: scale3d(1.1, 1.1, 1);
    }
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
  padding-bottom: 30px;
}

.main {
  padding: 0 10px;
  max-width: 400px;
  margin: auto;

  .login {
    margin: 50px 0 50px 0;

    .firebaseui-busy-indicator {
      top: 0;
    }
    .mdl-button {
      font-family: 'Short Stack', sans-serif;;
    }

    .firebaseui-idp-password,
    .firebaseui-idp-password:hover {
      background-color: rgb(255, 89, 89);
    }
  }
}

.icon {
  display: inline-block;
  text-indent: -9999px;
  background-repeat: no-repeat;

  -webkit-tap-highlight-color: rgba(0,0,0,0);
  -webkit-tap-highlight-color: transparent; /* For some Androids */
}

.main.start {
  .title {
    max-width: 280px;
    margin: 40px auto;
  }
  .footer {
    text-align: center;
  }
}

.title{
  text-align: left;
  margin: 40px -10px 40px -10px;
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
  margin: 20px 0;
  line-height: 1.5;

  span {
    display: inline-block;
  }

  &.team {
    margin-top: 80px;
  }
}

.footer {
}
</style>
