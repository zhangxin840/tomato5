<template>
  <section class="panel">
    <div class="user">
      <div class="avator">
        <img class="pic" :src="photoURL" alt="avator" />
        <span class="timer">25:00</span>
      </div>
    </div>
    <div class="task">
      <div class="list">
        <span class="icon-tomato">tomaro1</span>
        <span class="icon-tomato">tomaro1</span>
        <span class="icon-tomato">tomaro1</span>
        <span class="icon-tomato">tomaro1</span>
        <span class="icon-tomato">tomaro1</span>
        <span class="icon-tomato">tomaro1</span>
        <span class="icon-tomato">tomaro1</span>
      </div>
    </div>
  </section>
</template>

<script>
export default {
  data() {
    return {
      // note: changing this line won't causes changes
      // with hot-reload because the reloaded component
      // preserves its current state and we are modifying
      // its initial state.
      name: 'zhangxin840',
      // photoURL: './assets/tomato.svg',
      photoURL: 'https:///www.granneman.com/files/cache/716011d79afdd5969b0656b7ad5812b2.jpg',
    };
  },
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
h1 {
  color: #42b983;
}

.panel{
  display: flex;
  width: 80%;
  max-width: 400px;
  margin: auto;
}

.panel .user{
  margin-right: 30px;
}

.panel .avator .timer{
  display: block;
  text-align: center;
}

.panel .avator .pic{
  display: inline-block;
  width: 50px;
  height: 50px;
  border-radius: 25px;
}
.panel .list{
  text-align: left;
  line-height: 40px;
}

</style>
