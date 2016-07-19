<template>
  <section class="panel"
            v-bind:class="{
              'resting': panelStatus.userStatus === userStatus.resting,
              'idle': panelStatus.userStatus === userStatus.idle,
              'busy': panelStatus.userStatus === userStatus.busy,
            }">
    <div class="user">
      <div class="status">
        <!-- <img class="avator" src="../assets/p-2.svg" alt="avator" /> -->
        <!-- <img class="avator" v-bind:src="user.photoURL" alt="avator" /> -->
        <div class="emotion avator" v-on:click="toggleEmotions">
          <span class="inner {{emotionClass}}"></span>
        </div>
        <span class="timer animated "
              v-show="panelStatus.userStatus >= 0"
              v-bind:class="{
                'rubberBand': (panelStatus.userStatus === userStatus.busy) || (panelStatus.userStatus === userStatus.resting)
              }">
          {{ panelStatus.label }}
        </span>
      </div>
      <div class="emotions"
            v-bind:class="{
              'expanded': panelStatus.isShowEmotions
            }">
        <p>
          Select your energy level:
        </p>
        <div class="selections">
          <p>
            <div class="emotion" v-on:click="changeEmotion('p', 1)">
              <span class="inner p-1"></span>
            </div>
            <div class="emotion" v-on:click="changeEmotion('p', 2)">
              <span class="inner p-2"></span>
            </div>
            <div class="emotion" v-on:click="changeEmotion('p', 3)">
              <span class="inner p-3"></span>
            </div>
            <div class="emotion" v-on:click="changeEmotion('p', 4)">
              <span class="inner p-4"></span>
            </div>
          </p>
          <p>
            <div class="emotion" v-on:click="changeEmotion('n', 1)">
              <span class="inner n-1"></span>
            </div>
            <div class="emotion" v-on:click="changeEmotion('n', 2)">
              <span class="inner n-2"></span>
            </div>
            <div class="emotion" v-on:click="changeEmotion('n', 3)">
              <span class="inner n-3"></span>
            </div>
            <div class="emotion" v-on:click="changeEmotion('n', 4)">
              <span class="inner n-4"></span>
            </div>
          </p>
        </div>
      </div>
      <!-- <active-task v-if="panelStatus.activeTask"
                   v-bind:task="panelStatus.activeTask"
                   v-bind:task-status="taskStatus"
                   v-bind:user-status="userStatus">
      </active-task> -->
    </div>
    <div class="tasks">
      <div class="list">
        <template v-for="task in list.tasks">
          <task v-bind:task="task"
                v-bind:task-status="taskStatus"
                v-bind:panel-status="panelStatus"
                v-bind:user-status="userStatus"
                v-bind:hide="!((panelStatus.userStatus === userStatus.idle)
                    || (task.status === taskStatus.ongoing || task.status === taskStatus.active))
                    && !(panelStatus.userStatus === userStatus.resting && task.status === taskStatus.done)">
          </task>
        </template>
      </div>
      <span class="icon add"
            v-show="doneCount >= 5"
            v-on:click="addTask">Add task</span>
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
  note: 'Plan your work in this list.',
  status: taskStatus.idle,
  startTime: null,
};

const task2 = {
  note: 'Click tomato to start working.',
  status: taskStatus.idle,
  startTime: null,
};

const task3 = {
  note: 'After finishing, take a rest.',
  status: taskStatus.idle,
  startTime: null,
};

const task4 = {
  note: 'Restart if you are disturbed.',
  status: taskStatus.idle,
  startTime: null,
};

const task5 = {
  note: 'Take 5 to be more productive.',
  status: taskStatus.idle,
  startTime: null,
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
  emotionType: 'p',
  emotionLevel: '2',
  isShowEmotions: false,
};

const Notification = window.Notification;

const sendNotification = function sendNotification(title, message) {
  if (Notification) {
    const noti = new Notification(title, { /* eslint no-unused-vars: 0 */
      icon: 'http://cdn.sstatic.net/stackexchange/img/logos/so/so-icon.png',
      body: message,
    });
  }
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

const addTask = function addTask() {
  this.list.tasks.push({
    note: `The ${this.list.tasks.length + 1}th task`,
    status: taskStatus.idle,
    startTime: null,
  });
};

const onTaskStarted = function onTaskStarted(task) {
  this.panelStatus.activeTask = task;
  this.panelStatus.label = timer.getContdown(task.startTime, 'standard', 'second');
  this.panelStatus.userStatus = this.userStatus.busy;
};

const onTaskDone = function onTaskDone() {
  this.panelStatus.userStatus = this.userStatus.idle;
  this.panelStatus.activeTask = null;
  window.setTimeout(() => {
    startRest();
  }, 1);
};

const onTaskDropped = function onTaskDropped() {
  this.panelStatus.userStatus = this.userStatus.idle;
  this.panelStatus.activeTask = null;
  this.panelStatus.label = '00:00';
};

const onTaskTimeDue = function onTaskTimeDue() {
  sendNotification('Tomato 5', 'Tomato completed, nice job!');
  this.panelStatus.userStatus = this.userStatus.active;
};

const onTaskTimerUpdated = function onTaskTimerUpdated(task) {
  this.panelStatus.label = timer.getContdown(task.startTime, 'standard', 'second');
};

const toggleEmotions = function toggleEmotions() {
  this.panelStatus.isShowEmotions = !this.panelStatus.isShowEmotions;
};

const changeEmotion = function changeEmotion(type, level) {
  this.panelStatus.isShowEmotions = false;
  this.panelStatus.emotionType = type;
  this.panelStatus.emotionLevel = level;
};

export default {
  data() {
    return { user, list, panelStatus, taskStatus, userStatus };
  },
  methods: { addTask, toggleEmotions, changeEmotion },
  components: {
    ActiveTask, Task,
  },
  events: {
    taskDone: onTaskDone,
    taskDropped: onTaskDropped,
    taskStarted: onTaskStarted,
    taskTimeDue: onTaskTimeDue,
    taskTimerUpdated: onTaskTimerUpdated,
  },
  computed: {
    doneCount: function doneCount() {
      return this.list.tasks.reduce(
        (last, item) => last + (item.status === this.taskStatus.done ? 1 : 0)
      , 0);
    },
    emotionClass: function emotionUrl() {
      return `${this.panelStatus.emotionType}-${this.panelStatus.emotionLevel}`;
    },
  },
};

</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss" scoped>
h1 {
  color: #42b983;
}

.panel {
  // display: flex;
  max-width: 400px;
  margin: 50px auto;
  padding: 0 10px;

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
    user-select: none;

    .status {
      width: 100%;
      text-align: center;
      display: flex;
      justify-content: center;
      margin: 30px 0;

      .avator {
        width: 50px;
        height: 50px;
        // border-radius: 25px;
        margin-right: 20px;
      }

      .timer{
        font-size: 24px;
        line-height: 50px;
        width: 80px;
        text-align: left;
      }
    }

    .emotion {
      width: 50px;
      height: 50px;
      display: inline-block;
      background: rgb(280,240,130);
      line-height: 50px;
      text-align: center;
      border-radius: 5px;
      cursor: pointer;

      .inner {
        display: inline-block;
        vertical-align: middle;
        width: 30px;
        height: 30px;
        position: relative;
        top: 0px;
        transition: background 0.6s, top 0.2s;


        &.p-1 {
          background: url('../assets/p-1.svg');
        }
        &.p-2 {
          background: url('../assets/p-2.svg');
        }
        &.p-3 {
          background: url('../assets/p-3.svg');
        }
        &.p-4 {
          background: url('../assets/p-4.svg');
        }

        &.n-1 {
          background: url('../assets/n-1.svg');
        }
        &.n-2 {
          background: url('../assets/n-2.svg');
        }
        &.n-3 {
          background: url('../assets/n-3.svg');
        }
        &.n-4 {
          background: url('../assets/n-4.svg');
        }
      }

      &:hover {
        .inner {
          top: -2px;
        }
      }

      &:active {
        transform: scale(1.1, 1.1);
      }
    }

    .emotions{
      height: 0;
      overflow: hidden;
      transition: height 0.4s;
      // margin-top: -20px;

      &.expanded {
        height: 220px;
      };

      .selections {
        text-align: center;

        .emotion {
          margin: 10px 8px;
        }

        p {
          margin: 0;
        }
      }
    }
  }
  .tasks {
    width: 100%;

    .list {
      margin: 8px 0;
      text-align: left;
      line-height: 40px;
    }

    .add {
      width: 20px;
      height: 20px;
      background: url('../assets/add.svg');
      margin: 0px 4px;
      cursor: pointer;

      &:active{
        transform: scale(1.1, 1.1);
      }
    }
  }

}

</style>
