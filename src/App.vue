<template>
  <div id="app">
    <div class="title">
      <img class="logo" src="./assets/tomato.svg">
      <h1>We Tomatoes!</h1>
    </div>

    <panel></panel>
  </div>
</template>

<script>
import normalize from 'normalize.css'; /* eslint no-unused-vars: 0 */
import Hello from './components/Hello';
import Panel from './components/Panel';

export default {
  components: {
    Hello, Panel,
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
