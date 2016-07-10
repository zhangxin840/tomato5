<template>
  <section class="panel"
            v-bind:class="{
              'resting': panelStatus.userStatus === userStatus.resting,
              'idle': panelStatus.userStatus === userStatus.idle,
              'busy': panelStatus.userStatus === userStatus.busy,
            }">
    <div class="user">
      <div class="avator">
        <img class="pic" :src="user.photoURL" alt="avator" />
      </div>
      <span class="timer animated rubberBand"
            v-show="panelStatus.userStatus > 0">
        {{ panelStatus.label }}
      </span>
    </div>
    <div class="task">
      <div class="list">
        <template v-for="task in list.tasks">
          <task v-bind:task="task"
                v-bind:task-status="taskStatus"
                v-bind:panel-status="panelStatus">
          </task>
        </template>
      </div>
      <active-task v-if="panelStatus.activeTask"
                   v-bind:task="panelStatus.activeTask"
                   v-bind:task-status="taskStatus"
                   v-bind:user-status="userStatus">
      </active-task>
    </div>
  </section>
</template>

<script>

import moment from 'moment';
import ActiveTask from './ActiveTask';
import Task from './Task';
import timer from '../timer';

window.moment = moment;

const taskStatus = {
  dropped: -1,
  idle: 0,
  ongoning: 1,
  paused: 2,
  active: 3,
  done: 4,
};

const userStatus = {
  unknown: -1,
  idle: 0,
  active: 1,
  resting: 2,
  busy: 3,
};

const task1 = {
  note: 'This is task1.',
  status: taskStatus.done,
  startTime: moment(),
};

const task2 = {
  note: 'This is task2.',
  status: taskStatus.done,
  startTime: moment(),
};

const task3 = {
  note: 'This is task3.',
  status: taskStatus.idle,
  startTime: moment(),
};

const task4 = {
  note: 'This is task4.',
  status: taskStatus.idle,
  startTime: moment(),
};

const task5 = {
  note: 'This is task5.',
  status: taskStatus.idle,
  startTime: moment(),
};

const list = {
  user: 'zhangxin840',
  tasks: [
    task1, task2, task3, task4, task5,
  ],
};

const user = {
  name: 'zhangxin840',
  photoURL: 'https:///www.granneman.com/files/cache/716011d79afdd5969b0656b7ad5812b2.jpg',
};

const panelStatus = {
  label: '00:00',
  userStatus: userStatus.idle,
  activeTask: null,
};

const onRestTimeDue = function onRestTimeDue() {
  panelStatus.userStatus = userStatus.idle;
};

const startRest = function startRest() {
  const startTime = moment();

  panelStatus.label = timer.getContdown(startTime, 'resting', 'second');
  panelStatus.userStatus = userStatus.resting;

  const theTimer = window.setInterval(() => {
    panelStatus.label = timer.getContdown(startTime, 'resting', 'second');
    if (timer.getRemaning(startTime, 'resting').seconds() <= 0) {
      window.clearInterval(theTimer);
      onRestTimeDue();
    }
  }, 1000);
};


const onTaskDone = function onTaskDone() {
  startRest();
};

const onTaskDropped = function onTaskDropped() {
  this.panelStatus.userStatus = this.userStatus.idle;
};

export default {
  data() {
    return { user, list, panelStatus, taskStatus, userStatus };
  },
  methods: { },
  components: {
    ActiveTask, Task,
  },
  events: { taskDone: onTaskDone, taskDropped: onTaskDropped },
};

</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss" scoped>
h1 {
  color: #42b983;
}

.panel {
  display: flex;
  max-width: 280px;
  margin: 50px auto;

  &.resting {
    .timer {
      color: #42b983;
    }
  }

  &.busy {
    .timer {

    }
  }

  .user {
    margin-right: 20px;
    width: 60px;
    // overflow: hidden;

    .avator {
      text-align: center;
      .pic{
        display: inline-block;
        width: 50px;
        height: 50px;
        border-radius: 25px;
      }
    }

    .timer{
      display: block;
      text-align: center;
      width: 100%;
      font-size: 20px;
      line-height: 35px;
    }
  }

  .list{
    margin: 8px 0;
    text-align: left;
    line-height: 40px;
    .icon-tomato{
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
  }
}

</style>
