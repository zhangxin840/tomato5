<template>
  <div class="activeTask">
    <p class="operations" v-show="task.status === taskStatus.active">
      <span class="done" v-on:click="done">Done</span>
      <span class="drop" v-on:click="drop">Drop</span>
    </p>
  </div>

</template>

<script>
const done = function done() {
  this.task.status = this.taskStatus.done;
  this.$dispatch('taskDone', this.task);
};

const drop = function drop() {
  this.task.status = this.taskStatus.idle;
  this.$dispatch('taskDropped', this.task);
};

export default {
  props: ['task', 'taskStatus'],
  data() {
    return { };
  },
  methods: { done, drop },
};
</script>

<style lang="scss" scoped>
.activeTask {
  margin-top: 13px;

  .operations .span {
    cursor: pointer;
  }
}
</style>
