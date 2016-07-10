<template>
  <div v-bind:class="{
        'idle animated tada ': task.status === taskStatus.idle,
        'ongoing animated pulse infinite': task.status === taskStatus.ongoing,
        'active animated swing infinite': task.status === taskStatus.active,
        'done': task.status === taskStatus.done,
      }"
      v-on:click="onClick(task)"
      class="icon-tomato">
      {{ task.note }}
  </div>

</template>

<script>

import timer from '../timer';
import moment from '../moment';

const Notification = window.Notification;

const sendNotification = function sendNotification(title, message) {
  if (Notification) {
    const noti = new Notification(title, { /* eslint no-unused-vars: 0 */
      icon: 'http://cdn.sstatic.net/stackexchange/img/logos/so/so-icon.png',
      body: message,
    });
  }
};

const onTaskTimeDue = function onTaskTimeDue(task) {
  sendNotification('Take Five', 'The first tomato completed, nice job!');
  this.panelStatus.userStatus = this.userStatus.active;
  task.status = this.taskStatus.active; /* eslint no-param-reassign: 0 */
};

const startTask = function startTask() {
  const startTime = moment();

  this.panelStatus.activeTask = this.task;
  this.panelStatus.label = timer.getContdown(startTime, 'standard', 'second');
  this.panelStatus.userStatus = this.userStatus.busy;

  this.task.status = this.taskStatus.ongoing; /* eslint no-param-reassign: 0 */

  const theTimer = window.setInterval(() => {
    this.panelStatus.label = timer.getContdown(startTime, 'standard', 'second');
    if (timer.getRemaning(startTime, 'standard').asMilliseconds() <= 0) {
      window.clearInterval(theTimer);
      onTaskTimeDue(this.task);
    }
  }, 1000);

  if (Notification && Notification.permission !== 'granted') {
    Notification.requestPermission();
  }
};

const onClick = function onClick() {
  this.$dispatch('taskStarted', this.task);

  if (this.task.status === this.taskStatus.idle) {
    startTask();
  }
};

export default {
  props: ['task', 'taskStatus', 'panelStatus'],
  data() {
    return { };
  },
  methods: { onClick },
  events: {
    taskDone: onTaskDone,
    taskDropped: onTaskDropped,
  },
};
</script>

<style lang="scss" scoped>

</style>
