<template>
  <div id="app">
    <article class="main" v-bind:class="{'start': !user.uid}">
      <div class="title">
        <a href="/">
          <img class="logo" src="./assets/tomato.svg">
        </a>
        <h1 class="">Tomato5</h1>
      </div>
      <!-- <p class="instruction"><span>Concentrate for work</span> <span>five times a day</span></p> -->
      <panel transition="fade" v-if="user.uid"></panel>
      <usage v-if="user.uid"></usage>
      <account v-if="user.uid"></account>
      <section class="footer">
        <p>
          <a href="https://github.com/zhangxin840/tomato5" target="_blank">Star me on github</a>
        </p>
        <p>
          <a href="https://www.focusboosterapp.com/the-pomodoro-technique
" target="_blank">The theory behind: Pomodoro Technique</a>
        </p>
        <!-- <p>
          <div>Icons made by <a href="http://www.flaticon.com/authors/freepik" title="Freepik">Freepik</a> from <a href="http://www.flaticon.com" title="Flaticon">www.flaticon.com</a> is licensed by <a href="http://creativecommons.org/licenses/by/3.0/" title="Creative Commons BY 3.0" target="_blank">CC 3.0 BY</a></div>
        </p> -->
      </section>
      <div class="login" v-show="!user.uid">
        <div id="firebaseui-auth-container"></div>
      </div>
    </article>

  </div>
</template>

<script>
import normalizeCss from 'normalize.css'; /* eslint no-unused-vars: 0 */
import animateCss from 'animate.css'; /* eslint no-unused-vars: 0 */
import firebase from 'firebase';
import FastClick from 'fastclick';

import commonCss from './common.scss'; /* eslint no-unused-vars: 0 */
import Panel from './components/Panel';
import Account from './components/Account';
import Usage from './components/Usage';
import database from './database';
import auth from './auth';
import { firebaseConfig } from './configs';
import utils from './utils';

const user = auth.getUser();

const tabId = Math.round(1000 * Math.random());

const makeMonoTab = function makeMonoTab() {
  const checkTab = function checkTab() {
    const storedTabId = window.localStorage.getItem('tabId');
    if (storedTabId && storedTabId.length > 0 && storedTabId !== `${tabId}`) {
      // if (window.confirm('You already have Tomato5 running in another tab,'
      //   + ' we suggest to close this tab and use the previous one.')) {
      //   window.close();
      // } else {
      //   window.localStorage.setItem('tabId', tabId);
      // }
      utils.report('usage', 'multiTabs');
    } else {
      window.localStorage.setItem('tabId', tabId);
    }
  };

  document.addEventListener('visibilitychange', () => {
    if (document.visibilityState === 'visible') {
      checkTab();
      this.$broadcast('tabFocused');
    }
  });

  window.addEventListener('beforeunload', (e) => {
    window.localStorage.removeItem('tabId');
  });

  checkTab();
};

const onTaskDone = function onTaskDone() {
  this.$broadcast('recount');
};

const initApp = function initApp() {
  firebase.initializeApp(firebaseConfig);
  database.init();
  auth.init();

  if ('addEventListener' in document) {
    document.addEventListener('DOMContentLoaded', () => {
      FastClick.attach(document.body);
    }, false);
  }

  this.makeMonoTab();
  utils.report('workflow', 'initApp');
};

export default {
  data() {
    return { user };
  },
  methods: { makeMonoTab },
  created: initApp,
  events: {
    taskDone: onTaskDone,
  },
  components: {
    Panel, Account, Usage,
  },
};
</script>

<style lang="scss">
@import 'base';


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
    background-color: $red;
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
  p {
    margin: 10px 0;
  }
}

/* always present */
.fade-transition {
  transition: opacity 0.3s;
}

/* .fade-enter defines the starting state for entering */
/* .fade-leave defines the ending state for leaving */
.fade-enter, .fade-leave {
  opacity: 0;
}
</style>
