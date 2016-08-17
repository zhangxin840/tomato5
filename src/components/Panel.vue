<template>
  <section class="panel"
            v-bind:class="{
              'resting': userStatus.availability === availabilities.resting,
              'idle': userStatus.availability === availabilities.idle,
              'busy': userStatus.availability === availabilities.busy,
            }">
    <div class="user">
      <div class="status">
        <div class="avator" v-on:click="toggleEmotions">
          <emotion v-bind:level="userStatus.emotion"></emotion>
        </div>
        <span class="timer animated "
              v-show="userStatus.availability >= 0"
              v-on:click="onTimerClicked"
              v-bind:class="{
                'rubberBand': (userStatus.availability === availabilities.busy)
                || (userStatus.availability === availabilities.resting)
                || ((userStatus.availability === availabilities.idle) && replay)
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
    </div>
    <div class="tasks-wrapper" v-bind:class="{'loading': !tasks}">
      <div class="tasks" transition="fade" v-if="tasks">
        <div class="list">
          <template v-for="(index, task) in tasks">
            <task v-bind:task="task"
                  v-bind:index="index"
                  v-bind:task-status="taskStatus"
                  v-bind:user-status="userStatus"
                  v-bind:availabilities="availabilities"
                  v-bind:disabled="(userStatus.availability === availabilities.resting)
                      && (task.status === taskStatus.idle)"
                  v-bind:hide="(userStatus.availability === availabilities.busy || userStatus.availability === availabilities.active)
                      && !(task.status === taskStatus.ongoing || task.status === taskStatus.active)">
            </task>
          </template>
        </div>
        <span class="icon add"
              transition="fade"
              v-show="(doneCount >= 5 || tasks.length < 5) && (userStatus.availability === availabilities.idle || userStatus.availability === availabilities.resting)"
              v-on:click="addTask">
              Add task
        </span>
      </div>
    </div>
    <team-panel
              v-if="tasks"
              v-bind:user-info="user"
              v-bind:user-status="userStatus"
              v-bind:tasks="tasks">
    </team-panel>
  </section>
</template>

<script>
import moment from 'moment';
import vue from 'vue';
import ActiveTask from './ActiveTask';
import Task from './Task';
import Emotion from './Emotion';
import TeamPanel from './TeamPanel';
import timer from '../timer';
import { taskStatus, availabilities, tasks as defaultTasks } from '../model';
import database from '../database';
import auth from '../auth';

const user = auth.getUser();
const tasks = null;

const panelStatus = {
  label: '00:00',
  activeTask: null,
  isShowEmotions: false,
};

const userStatus = {
  availability: availabilities.idle,
  emotion: '2',
  currentTeam: 'HFE-Train',
};

const Notification = window.Notification;

const replay = false;

const sendNotification = function sendNotification(title, message) {
  if (Notification) {
    const noti = new Notification(title, { /* eslint no-unused-vars: 0 */
      icon: 'http://tomato5.io/static/icons/tomato.png',
      body: message,
    });
  }
};

const getTasksPath = function getTasksPath() {
  return `tasks/${auth.getUser().uid}/${moment().format('YYYYMMDD')}`;
};

const saveTasks = function saveTasks() {
  const tasksToSave = [];
  this.tasks.forEach((task) => {
    if (task.createTime
      && moment(task.createTime).format('YYYYMMDD') === moment().format('YYYYMMDD')) {
      tasksToSave.push(task);
    }
  });
  database.save(getTasksPath(), tasksToSave);
  this.$broadcast('publish');
};

let restTimer = null;

const onRestTimeDue = function onRestTimeDue() {
  userStatus.availability = availabilities.idle;
  this.$broadcast('publish');
};

const updateTimer = function updateTimer(startTime, type) {
  const seconds = timer.getContdown(startTime, type, 'second');
  const minutes = timer.getContdown(startTime, type, 'minute');
  const tabLabel = (seconds > '00:01') ? `${minutes}` : 'Tomato5';
  panelStatus.label = seconds;
  document.title = `${tabLabel}`;
};

const clearTimer = function clearTimer() {
  panelStatus.label = '00:00';
  document.title = 'Tomato5';
};

const startRest = function startRest() {
  const restStartTime = moment();

  updateTimer(restStartTime, 'resting');
  userStatus.availability = availabilities.resting;

  restTimer = window.setInterval(() => {
    updateTimer(restStartTime, 'resting');
    if (timer.getRemaning(restStartTime, 'resting').asMilliseconds() <= 0) {
      window.clearInterval(restTimer);
      this.onRestTimeDue();
    }
  }, 1000);

  this.$broadcast('publish');
};

const stopResting = function stopResting() {
  clearTimer();
  this.userStatus.availability = availabilities.idle;

  if (restTimer) {
    window.clearInterval(restTimer);
  }

  this.$broadcast('publish');
};

const replayAnimation = function replayAnimation() {
  this.replay = false;
  window.setTimeout(() => {
    this.replay = true;
  }, 1); // To clear class in DOM
  window.setTimeout(() => {
    this.replay = false;
  }, 1000); // Clear after length of animation
};

const onTimerClicked = function onTimerClicked() {
  if (this.userStatus.availability === this.availabilities.resting) {
    this.stopResting();
    this.replayAnimation();
  } else if (this.userStatus.availability === this.availabilities.busy) {
    this.$broadcast('clearTask');
    this.replayAnimation();
  }
};

const addTask = function addTask() {
  this.tasks.push({
    // note: `The ${this.tasks.length + 1}th task`,
    note: '',
    status: taskStatus.idle,
    startTime: null,
    createTime: moment(),
    emotion: 2,
  });

  this.saveTasks();
};

const onTaskStarted = function onTaskStarted(task) {
  this.panelStatus.activeTask = task;
  updateTimer(task.startTime, 'standard');
  this.userStatus.availability = this.availabilities.busy;

  task.emotion = this.userStatus.emotion;

  this.saveTasks();
};

const onTaskDone = function onTaskDone(task) {
  this.userStatus.availability = this.availabilities.idle;
  this.panelStatus.activeTask = null;

  task.emotion = this.userStatus.emotion;

  window.setTimeout(() => {
    this.startRest();
  }, 1);

  this.saveTasks();

  return true; // Do not stop stop propagation
};

const onTaskDropped = function onTaskDropped() {
  this.userStatus.availability = this.availabilities.idle;
  this.panelStatus.activeTask = null;
  clearTimer();

  this.saveTasks();
};

const onTaskTimeDue = function onTaskTimeDue() {
  sendNotification('Tomato5', 'Tomato completed, nice job!');
  this.userStatus.availability = this.availabilities.active;

  this.saveTasks();
};

const onTaskTimerUpdated = function onTaskTimerUpdated(task) {
  updateTimer(task.startTime, 'standard');
};

const onTaskEdited = function onTaskEdited() {
  this.saveTasks();
};

const toggleEmotions = function toggleEmotions() {
  this.panelStatus.isShowEmotions = !this.panelStatus.isShowEmotions;
};

const changeEmotion = function changeEmotion(level) {
  this.panelStatus.isShowEmotions = false;
  this.userStatus.emotion = level;

  if (this.panelStatus.activeTask && this.panelStatus.activeTask.status === taskStatus.ongoing) {
    this.panelStatus.activeTask = this.userStatus.emotion;
  }

  this.$broadcast('publish');
};

const initTime = moment();

const init = function init() {
  this.getTasks();

  window.setInterval(() => {
    if ((initTime.dayOfYear() !== moment().dayOfYear())
          && (this.userStatus.availability === this.availabilities.idle)) {
      window.location.reload(); // Reload if cross day
    }
  }, 100000);
};

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

const getTasks = function getTasks() {
  return database.get(getTasksPath(), defaultTasks).then((data) => {
    this.tasks = prepareTasks(data);
    return this.tasks;
  });
};

export default {
  data() {
    return {
      user, tasks, panelStatus,
      userStatus,
      taskStatus, availabilities,
      replay,
    };
  },
  methods: {
    getTasks, addTask, saveTasks,
    startRest, onRestTimeDue, stopResting,
    toggleEmotions, changeEmotion,
    onTimerClicked, replayAnimation,
  },
  components: {
    ActiveTask, Task, Emotion, TeamPanel,
  },
  events: {
    taskDone: onTaskDone,
    taskDropped: onTaskDropped,
    taskStarted: onTaskStarted,
    taskTimeDue: onTaskTimeDue,
    taskTimerUpdated: onTaskTimerUpdated,
    taskEdited: onTaskEdited,
  },
  created: init,
  computed: {
    doneCount: function doneCount() {
      return this.tasks.reduce(
        (last, item) => last + (item.status === this.taskStatus.done ? 1 : 0)
      , 0);
    },
    emotionClass: function emotionUrl() {
      const level = this.userStatus.emotion;
      return `${level > 0 ? 'p' : 'n'}-${Math.abs(level)}`;
    },
  },
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss" scoped>
@import "../base";

h1 {
  color: $green;
}

.panel {
  // display: flex;
  margin: 0px auto;

  &.resting {
    .timer {
      color: $green;
      cursor: pointer;
    }
  }

  &.busy {
    .timer {
      cursor: pointer;
    }
  }

  &.busy {
    .timer {

    }
  }

  .tasks-wrapper {
    min-height: 315px;

    &.loading {
      background: url('../assets/loading.svg') no-repeat center 30%;
      background-size: 80px 80px;
    }
  }

  .tasks {
    width: 100%;
    position: relative;
    margin: 10px 0;

    .list {
      padding-bottom: 15px;
      position: relative;
    }

    .add {
      width: 20px;
      height: 20px;
      background: url('../assets/add.svg');
      margin: 0px 4px;
      cursor: pointer;
      position: absolute;
      left: 0;
      bottom: 0;

      &:active{
        transform: scale(1.1, 1.1);
      }
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

        &:active{
          transform: scale(1.1, 1.1);
        }
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

}
</style>
