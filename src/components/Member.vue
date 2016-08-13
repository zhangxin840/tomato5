<template>
  <div class="member">
    <p>
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
      <span class="name">{{ userInfo.displayName || userInfo.email }}</span>
      <span class="time" transition="fade" v-if="taskTimeLable">{{ taskTimeLable }}</span>
    </p>
      <div class="">
        <div class="tasks">
          <span class="icon tomato animated"
              v-for="task in tasks"
              v-bind:title="task.note"
              v-bind:class="{
                'done': task.status === taskStatus.done,
                'active': task.status === taskStatus.active,
                'ongoing pulse infinite': task.status === taskStatus.ongoing,
                'planned': task.status === taskStatus.idle && task.note,
              }">
          </span>
        </div>
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

const init = function init() {
  statusChecker = window.setInterval(() => {
    if (this.activeTask && this.activeTask.status === taskStatus.ongoing) {
      this.taskTimeLable = timer.getContdown(this.activeTask.startTime,
        'standard', 'minute');
    } else {
      this.taskTimeLable = '';
    }

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
  }, checkMemberInterval);
};

const destroy = function destroy() {
  window.clearInterval(this.statusChecker);
};

export default {
  props: ['tasks', 'userStatus', 'userInfo', 'updateTime'],
  data() {
    return { taskStatus, availabilities, taskTimeLable, statusChecker, isOffline };
  },
  methods: { },
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

      return result;
    },
  },
};
</script>

<style lang="scss" scoped>
@import "../base";

.member {
  position: relative;
  padding-bottom: 45px;
  margin: 0 0 0 0;

  p {
    margin: 10px 0;
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

  .note-container {
    height: 45px;
    position: absolute;
    bottom: 0;
    left: 0;
    width: 100%;

    .note {
      margin: 0
    }
  }

  .time {
    // position: absolute;
    // right: 0;
    // color: $red;
  }

  .name {
    margin-right: 15px;
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
}
</style>
