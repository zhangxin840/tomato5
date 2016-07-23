<template>
  <div class="task"
       v-bind:class="{
             'idle': task.status === taskStatus.idle,
             'ongoing': task.status === taskStatus.ongoing,
             'active': task.status === taskStatus.active,
             'done': task.status === taskStatus.done,
             'hide': this.hide,
           }">
    <div class="icon-wrapper">
      <span class="icon tomato animated"
          v-bind:class="{
            'tada ': task.status === taskStatus.idle,
            'pulse infinite': task.status === taskStatus.ongoing,
            'swing infinite': task.status === taskStatus.active,
            'done': task.status === taskStatus.done,
          }"
          v-on:click="onClick(task)"
          v-show="task.status !== taskStatus.done">
          {{ task.note }}
      </span>
      <emotion v-bind:level="task.emotion"
               v-show="task.status === taskStatus.done">
      </emotion>
    </div>
    <div class="note-wrapper">
      <input class="note" type="text" name="name" v-model="task.note" placeholder="Title of this task">
      <div class="activeTask">
        <p class="operations" v-show="task.status === taskStatus.active">
          <span class="done" v-on:click="done">Done</span>
          <span class="drop" v-on:click="drop">Drop</span>
        </p>
      </div>
    </div>
  </div>
</template>

<script>

import moment from 'moment';
import timer from '../timer';
import Emotion from './Emotion';

const done = function done() {
  this.task.status = this.taskStatus.done;
  this.$dispatch('taskDone', this.task);
};

const drop = function drop() {
  this.task.status = this.taskStatus.idle;
  window.clearInterval(this.timeInterval);
  this.$dispatch('taskDropped', this.task);
};

const onTaskTimeDue = function onTaskTimeDue() {
  this.task.status = this.taskStatus.active;
  this.$dispatch('taskTimeDue', this.task);
};

let timeInterval;

const start = function start() {
  this.task.status = this.taskStatus.ongoing;
  this.task.startTime = moment();

  this.$dispatch('taskStarted', this.task);

  this.timeInterval = window.setInterval(() => {
    this.$dispatch('taskTimerUpdated', this.task);

    if (timer.getRemaning(this.task.startTime, 'standard').asMilliseconds() <= 0) {
      window.clearInterval(this.timeInterval);
      this.onTaskTimeDue();
    }
  }, 1000);

  if (Notification && Notification.permission !== 'granted') {
    Notification.requestPermission();
  }
};

const onClick = function onClick() {
  if (this.task.status === this.taskStatus.idle
      && this.panelStatus.userStatus === this.userStatus.idle) {
    this.start();
  } else if (this.task.status === this.taskStatus.ongoing) {
    this.drop();
  }
};

export default {
  props: ['task', 'taskStatus', 'hide', 'panelStatus', 'userStatus'],
  data() {
    return { timeInterval };
  },
  methods: { onClick, onTaskTimeDue, start, done, drop },
  events: { },
  components: { Emotion },
};
</script>

<style lang="scss" scoped>
.task {
  margin: 0 0 30px 0;
  display: flex;
  line-height: 30px;
  width: 100%;

  .icon-wrapper {
    width: 30px;
    margin-right: 10px;
    text-align: center;
  }

  .note-wrapper {
    width: 100%;
  }

  .note {
    line-height: 20px;
    position: relative;
    width: 100%;
  }

  &.hide {
    // height: 0;
    // margin: 0;
    // line-height: 0;
    // visibility: hidden;
    opacity: 0.1;
  }

  &.active {
    .note {
      display: none;
      // opacity: 0.1;
    }
  }

  transition: all 0.5s;
  position: relative;
}

.tomato{
  width: 30px;
  height: 30px;
  background: url('../assets/tomato.svg');
  background-repeat: no-repeat;

  opacity: 1;

  &:active{
    transform: scale(1.1, 1.1);
  }
}

.panel.idle .idle .tomato,
.panel.busy .ongoing .tomato {
  cursor: pointer;
}

.activeTask {
  position: absolute;
  // left: 0;
  top: 0;
  background: rgba(255,255,255,1);

  // display: none;

  .operations {
    margin: 0;

    span {
      display: inline-block;
      width: 20px;
      height: 20px;
      text-indent: -9999px;
      vertical-align: middle;

      cursor: pointer;
      margin: 0 10px;
    }

    .done {
      color: #42b983;
      background: url('../assets/done.svg');
    }

    .drop {
      color: #ff5959;
      width: 15px;
      height: 15px;
      background: url('../assets/delete.svg');
    }
  }

}
</style>
