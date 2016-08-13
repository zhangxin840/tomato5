<template>
  <div class="task"
       v-bind:class="{
             'idle': task.status === taskStatus.idle,
             'ongoing': task.status === taskStatus.ongoing,
             'active': task.status === taskStatus.active,
             'done': task.status === taskStatus.done,
             'hide': this.hide,
             'disabled': this.disabled,
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
      <emotion class="small"
               v-bind:level="task.emotion"
               v-show="task.status === taskStatus.done">
      </emotion>
    </div>
    <div class="note-wrapper">
      <input class="note" type="text" autocomplete="off" v-bind:placeholder="taskTips[index] || `the ${index + 1}th task.`"
            v-model="task.note"
            v-on:blur="onTaskEdited">
      <div class="activeTask">
        <p class="operations" transition="fade" v-show="task.status === taskStatus.active">
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
import { taskTips } from '../model';
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

const onClearTask = function onClearTask() {
  if (this.task.status === this.taskStatus.ongoing) {
    this.drop();
  }
};

const onTaskEdited = function onTaskEdited() {
  this.$dispatch('taskEdited', this.task);
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
      && this.userStatus.availability === this.availabilities.idle) {
    this.start();
  } else if (this.task.status === this.taskStatus.ongoing) {
    this.drop();
  }
};

export default {
  props: ['task', 'index', 'taskStatus', 'hide', 'disabled', 'userStatus', 'availabilities'],
  data() {
    return { timeInterval, taskTips };
  },
  methods: { onClick, onTaskTimeDue, onTaskEdited, start, done, drop },
  events: {
    clearTask: onClearTask,
  },
  components: { Emotion },
};
</script>

<style lang="scss" scoped>
@import '../base';

.task {
  margin: 0 0 30px 0;
  display: flex;
  line-height: 30px;
  width: 100%;

  .icon-wrapper {
    width: 30px;
    margin-right: 10px;
    text-align: center;
    height: 30px;
  }

  .note-wrapper {
    width: 100%;
    height: 30px;
  }

  .note {
    line-height: 20px;
    position: relative;
    width: 100%;
    text-align: middle;
  }

  &.hide {
    opacity: 0.1;
  }

  &.disabled {
    .tomato {
      opacity: 0.1;
    }
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
      color: $green;
      background: url('../assets/done.svg');
    }

    .drop {
      color: $red;
      width: 15px;
      height: 15px;
      background: url('../assets/delete.svg');
    }
  }

}
</style>
