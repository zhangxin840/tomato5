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
        <div class="avator" v-on:click="toggleEmotions">
          <emotion v-bind:level="panelStatus.emotion"></emotion>
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
            <emotion v-bind:level="1" v-on:click="changeEmotion(1)"></emotion>
            <emotion v-bind:level="2" v-on:click="changeEmotion(2)"></emotion>
            <emotion v-bind:level="3" v-on:click="changeEmotion(3)"></emotion>
            <emotion v-bind:level="4" v-on:click="changeEmotion(4)"></emotion>
          </p>
          <p>
            <emotion v-bind:level="-1" v-on:click="changeEmotion(-1)"></emotion>
            <emotion v-bind:level="-2" v-on:click="changeEmotion(-2)"></emotion>
            <emotion v-bind:level="-3" v-on:click="changeEmotion(-3)"></emotion>
            <emotion v-bind:level="-4" v-on:click="changeEmotion(-4)"></emotion>
          </p>
        </div>
      </div>
      <!-- <active-task v-if="panelStatus.activeTask"
                   v-bind:task="panelStatus.activeTask"
                   v-bind:task-status="taskStatus"
                   v-bind:user-status="userStatus">
      </active-task> -->
    </div>
    <div class="tasks" v-if="tasks">
      <div class="list">
        <template v-for="task in tasks">
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
            v-show="(doneCount >= 5 || tasks.length < 5) && (panelStatus.userStatus === userStatus.idle)"
            v-on:click="addTask">Add task</span>
    </div>
  </section>
</template>

<script>
import moment from 'moment';
import vue from 'vue';
import ActiveTask from './ActiveTask';
import Task from './Task';
import Emotion from './Emotion';
import timer from '../timer';
import { taskStatus, userStatus, tasks as defaultTasks } from '../model';
import database from '../database';
import auth from '../auth';

const user = auth.getUser();
const tasks = null;

const panelStatus = {
  label: '00:00',
  userStatus: userStatus.idle,
  activeTask: null,
  emotion: '2',
  isShowEmotions: false,
};

const Notification = window.Notification;

const sendNotification = function sendNotification(title, message) {
  if (Notification) {
    const noti = new Notification(title, { /* eslint no-unused-vars: 0 */
      icon: 'http://tomato5.github.io/static/icons/tomato.png',
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
    if (timer.getRemaning(startTime, 'resting').asMilliseconds() <= 0) {
      window.clearInterval(theTimer);
      onRestTimeDue();
    }
  }, 1000);
};

const getTasksPath = function getTasksPath() {
  return `tasks/${auth.getUser().uid}/${moment().format('YYYYMMDD')}`;
};

const saveTasks = function saveTasks() {
  database.save(getTasksPath(), this.tasks);
};

const addTask = function addTask() {
  this.tasks.push({
    note: `The ${this.tasks.length + 1}th task`,
    status: taskStatus.idle,
    startTime: null,
    createTime: moment(),
    emotion: 2,
  });

  this.saveTasks();
};

const onTaskStarted = function onTaskStarted(task) {
  this.panelStatus.activeTask = task;
  this.panelStatus.label = timer.getContdown(task.startTime, 'standard', 'second');
  this.panelStatus.userStatus = this.userStatus.busy;

  task.emotion = this.panelStatus.emotion;

  this.saveTasks();
};

const onTaskDone = function onTaskDone(task) {
  this.panelStatus.userStatus = this.userStatus.idle;
  this.panelStatus.activeTask = null;

  task.emotion = this.panelStatus.emotion;

  window.setTimeout(() => {
    startRest();
  }, 1);

  this.saveTasks();
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

const changeEmotion = function changeEmotion(level) {
  this.panelStatus.isShowEmotions = false;
  this.panelStatus.emotion = level;

  if (this.panelStatus.activeTask && this.panelStatus.activeTask.status === taskStatus.ongoing) {
    this.panelStatus.activeTask = this.panelStatus.emotion;
  }
};

const initTasks = function initTasks() {
  const prepareTasks = function prepareTasks(theTasks) {
    theTasks.forEach((task) => { /* eslint no-param-reassign: 0 */
      task.createTime = task.createTime && moment(task.createTime);
      task.startTime = task.startTime && moment(task.startTime);
      task.emotion = task.emotion || 2;
      task.status = task.status || taskStatus.idle;
      task.note = task.note || '';

      // Rest task if not done
      if (task.status !== taskStatus.done) {
        task.startTime = null;
        task.status = taskStatus.idle;
      }
    });

    return theTasks;
  };

  database.get(getTasksPath(), defaultTasks).then((data) => {
    this.tasks = prepareTasks(data);
  });
};

const init = function init() {
  this.initTasks();
};

export default {
  data() {
    return { user, tasks, panelStatus, taskStatus, userStatus };
  },
  methods: { addTask, toggleEmotions, changeEmotion, initTasks, saveTasks },
  components: {
    ActiveTask, Task, Emotion,
  },
  events: {
    taskDone: onTaskDone,
    taskDropped: onTaskDropped,
    taskStarted: onTaskStarted,
    taskTimeDue: onTaskTimeDue,
    taskTimerUpdated: onTaskTimerUpdated,
  },
  created: init,
  computed: {
    doneCount: function doneCount() {
      return this.tasks.reduce(
        (last, item) => last + (item.status === this.taskStatus.done ? 1 : 0)
      , 0);
    },
    emotionClass: function emotionUrl() {
      const level = this.panelStatus.emotion;
      return `${level > 0 ? 'p' : 'n'}-${Math.abs(level)}`;
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
  margin: 0px auto;

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
    position: relative;

    .status {
      width: 100%;
      text-align: center;
      display: flex;
      justify-content: center;
      padding: 30px 0;

      .avator {
        margin-right: 20px;
      }

      .timer{
        font-size: 24px;
        line-height: 50px;
        width: 80px;
        text-align: left;
      }
    }

    .emotions{
      overflow: hidden;
      transition: all 0.2s;
      width: 100%;
      background: white;
      z-index: 1;
      border: 1px solid #eee;
      padding: 10px 10px 10px 10px;
      border-radius: 10px;
      box-sizing: border-box;

      position: absolute;
      top: -60px;
      left: 50%;
      opacity: 0;
      transform: scaleY(0) translate(-50%, 0);

      p {
        margin: 10px 0;
      }

      &.expanded {
        // scaleY(1) will be compiled to scale(1), that will break the animation.
        transform: scaleY(0.999) translate(-50%, 0);
        opacity: 1;
      };

      .selections {
        text-align: center;

        .emotion {
          margin: 15px 2.5%;
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
