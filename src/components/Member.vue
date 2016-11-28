<template>
  <div class="member">
    <div class="memberStatus">
      <emotion class="small" v-bind:level="userStatus.emotion"></emotion>
      <span class="beacon"
            v-bind:class="{
              'busy': userStatus.availability === availabilities.busy,
              'idle': userStatus.availability === availabilities.idle,
              'resting': userStatus.availability === availabilities.resting,
              'active': userStatus.availability === availabilities.active,
              'offline': isOffline,
            }">
      </span>
      <span class="name">{{ userInfo.displayName || (userInfo.email && userInfo.email.match(/^([^@]*)@/)[1]) }}</span>
      <span class="time" transition="fade" v-if="taskTimeLable">{{ taskTimeLable }}</span>
      <div class="flowers"
           v-bind:class="{
             'disabled': isFlowersCooling || isSaving,
           }"
           v-on:click="onClickFlowers()">
        <span class="icon flower animated"></span>
        <span class="count animated"
              v-bind:class="{
                'jello': isFlowersCooling,
              }">{{ flowers.count }}</span>
      </div>
    </div>
    <div class="tasks">
      <span class="icon tomato animated"
          v-for="task in tasks"
          v-bind:title="task.note"
          v-bind:class="{
            'planned': (task.status === taskStatus.idle && task.note) || (isOffline && (task.status === (taskStatus.ongoing || taskStatus.active))),
            'ongoing pulse infinite': (task.status === taskStatus.ongoing) && !isOffline,
            'active': (task.status === taskStatus.active) && !isOffline,
            'done': task.status === taskStatus.done,
          }">
      </span>
    </div>
    <div class="note-container">
      <p class="note" transition="fade" v-if="activeTask">{{ activeTask.note }}</p>
    </div>
  </div>
</template>

<script>
import timer from '../timer';
import moment from 'moment';
import Emotion from './Emotion';
import { taskStatus, availabilities } from '../model';
import { offLineThreshold, checkMemberInterval } from '../configs';

const taskTimeLable = '';
let statusChecker = null;

const isOffline = true;
const isFlowersCooling = false;

const onClickFlowers = function onClickFlowers() {
  if (this.isFlowersCooling || this.isSaving) {
    return;
  }

  this.flowers.count++;
  this.isFlowersCooling = true;

  this.$dispatch('addFlower', this.uid);

  setTimeout(() => {
    this.isFlowersCooling = false;
  }, 1000);
};

const init = function init() {
  statusChecker = window.setInterval(() => {
    if (!this.updateTime) {
      this.isOffline = true;
    } else {
      // Restore from server
      this.updateTime = moment(this.updateTime);
      if (moment().diff(this.updateTime, 'minutes') > offLineThreshold) {
        this.isOffline = true;
      } else {
        this.isOffline = false;
      }
    }

    if (this.activeTask && this.activeTask.status === taskStatus.ongoing) {
      this.taskTimeLable = timer.getContdown(this.activeTask.startTime,
        'standard', 'minute');
    } else {
      this.taskTimeLable = '';
    }
  }, checkMemberInterval);
};

const destroy = function destroy() {
  window.clearInterval(this.statusChecker);
};

export default {
  props: ['tasks', 'userStatus', 'userInfo', 'updateTime', 'uid', 'flowers', 'isSaving'],
  data() {
    return {
      taskStatus, availabilities,
      taskTimeLable, statusChecker,
      isOffline, isFlowersCooling,
    };
  },
  methods: { onClickFlowers },
  components: { Emotion },
  created: init,
  beforeDestroy: destroy,
  computed: {
    activeTask: function activeTask() {
      let result = null;

      if (this.tasks) {
        for (let i = 0; i < this.tasks.length; i++) {
          if (this.tasks[i].status === taskStatus.ongoing) {
            result = this.tasks[i];
            break;
          }
        }
      }

      if (this.isOffline) {
        result = null;
      }

      return result;
    },
  },
};
</script>

<style lang="scss" scoped>
@import "../base";

.member {
  position: relative;
  padding-bottom: 50px;
  margin: 0 0 0 0;

  &:first-of-type {
    margin-top: 25px;
  }

  .memberStatus {
    line-height: 50px;
    user-select: none;
  }

  .emotion {
    margin-right: 10px;
    margin-left: 3px;
  }

  .beacon {
    color: $green;
    background-color: #eee;
    display: inline-block;
    width: 10px;
    height: 10px;
    vertical-align: middle;
    border-radius: 5px;
    text-indent: -9999px;
    margin-right: 5px;

    &.offline {
      background-color: #eee !important;
    }

    &.idle {
      background-color: $green;
    }

    &.active {
      background-color: $yellow;
    }

    &.busy {
      background-color: $red;
    }

    &.resting {
      background-color: $blue;
    }
  }

  .name {
    margin-right: 15px;
    // min-width: 80px;
    display: inline-block;
  }

  .time {
    // position: absolute;
    // right: 0;
    // color: $red;
  }

  .flowers {
    float: right;
    display: inline-block;
    cursor: pointer;
    user-select: none;
    // margin-right: 15px;
    min-width: 50px;

    &.disabled {
      cursor: default;
    }

    .count {
      transition: all .1s;
      text-align: left;
      display: inline-block;
      margin-left: -5px;
      padding: 0;
    }

    .flower{
      vertical-align: middle;
      margin-right: 0px;

      width: 25px;
      height: 25px;
      background-image: url('../assets/flower.svg');
      opacity: 1;
    }
  }

  .tomato {
    opacity: 0.1;
    margin: 0 10px 5px 0;

    &.done {
      opacity: 1;
    }

    &.ongoing, &.active, &.planned {
      opacity: 0.5;
    }
  }

  .note-container {
    height: 50px;
    position: absolute;
    bottom: 0;
    left: 0;
    width: 100%;

    .note {
      margin: 3px 0 0 0;
    }
  }
}
</style>
