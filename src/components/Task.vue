<template>
  <div class="task"
       v-bind:class="{' hide ': this.hide}">
    <span v-bind:class="{
          'idle animated tada ': task.status === taskStatus.idle,
          'ongoing animated pulse infinite': task.status === taskStatus.ongoing,
          'active animated swing infinite': task.status === taskStatus.active,
          'done': task.status === taskStatus.done,
        }"
        v-on:click="onClick(task)"
        class="icon-tomato">
        {{ task.note }}
    </span>
    <input class="note" type="text" name="name" :value="task.note" placeholder="Title of this task">
  </div>
</template>

<script>

import timer from '../timer';
import moment from 'moment';

const onTaskTimeDue = function onTaskTimeDue() {
  this.task.status = this.taskStatus.active;
  this.$dispatch('taskTimeDue', this.task);
};

const startTask = function startTask() {
  this.task.status = this.taskStatus.ongoing;
  this.task.startTime = moment();

  this.$dispatch('taskStarted', this.task);

  const theTimer = window.setInterval(() => {
    this.$dispatch('taskTimerUpdated', this.task);

    if (timer.getRemaning(this.task.startTime, 'standard').asMilliseconds() <= 0) {
      window.clearInterval(theTimer);
      this.onTaskTimeDue();
    }
  }, 1000);

  if (Notification && Notification.permission !== 'granted') {
    Notification.requestPermission();
  }
};

const onClick = function onClick() {
  if (this.task.status === this.taskStatus.idle) {
    this.startTask();
  }
};

export default {
  props: ['task', 'taskStatus', 'hide'],
  data() {
    return { };
  },
  methods: { onClick, onTaskTimeDue, startTask },
  events: { },
};
</script>

<style lang="scss" scoped>

.task {
  margin: 0 0 30px 0;
  display: flex;
  .note {
    line-height: 20px;
    position: relative;
    width: 100%;
  }

  line-height: 30px;
  width: 100%;

  &.hide {
    opacity: 0.2;
  }

  transition: all 0.5s;
}

.icon-tomato{
  display: inline-block;
  width: 30px;
  height: 30px;
  text-indent: -9999px;
  background: url('../assets/tomato.svg');

  margin: 0 10px 0 0;
  opacity: 0.5;

  &:hover{
    // transform: scale(1.2, 1.2);
  }

  &.done{
    opacity: 1;
  }

  &.ongoing{
    opacity: 0.6;
  }

  &.active{
    opacity: 0.6;
  }

  &.idle {
    cursor: pointer;
  }
}
</style>
