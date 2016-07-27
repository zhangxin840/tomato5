<template>
  <div class="member">
    <p>
      <emotion class="small" v-bind:level="userStatus.emotion"></emotion>
      <span class="name">{{ userInfo.displayName }}</span>
      <span class="time" transition="fade" v-if="taskTimeLable">{{ taskTimeLable }}</span>
    </p>
      <div class="">
        <div class="tasks">
          <span class="icon tomato animated"
              v-for="task in tasks"
              v-bind:class="{
                'done': task.status === taskStatus.done,
                'active': task.status === taskStatus.active,
                'ongoing pulse infinite': task.status === taskStatus.ongoing,
              }">
              {{ task.note }}
          </span>
        </div>
      </div>
      <p class="note" transition="fade" v-if="activeTask">{{ activeTask.note }}</p>
  </div>
</template>

<script>
import timer from '../timer';
import Emotion from './Emotion';
import { taskStatus } from '../model';

const taskTimeLable = '';
let taskTimeInterval = null;

const init = function init() {
  taskTimeInterval = window.setInterval(() => {
    if (this.activeTask && this.activeTask.status === taskStatus.ongoing) {
      this.taskTimeLable = timer.getContdown(this.activeTask.startTime,
        'standard', 'minute');
    } else {
      this.taskTimeLable = '';
    }
  }, 1000);
};

const destroy = function destroy() {
  window.clearInterval(this.taskTimeInterval);
};

export default {
  props: ['tasks', 'userStatus', 'userInfo'],
  data() {
    return { taskStatus, taskTimeLable, taskTimeInterval };
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
  padding-bottom: 35px;
  margin: 20px 0;


  p {
    margin: 10px 0;
  }

  .emotion {
    margin-right: 10px;
    margin-left: 3px;
  }

  .note {
    position: absolute;
    bottom: 0;
    left: 0;
  }

  .time {
    // position: absolute;
    // right: 0;
    // color: $red;
  }

  .name {
    margin-right: 10px;
  }

  .tomato {
    opacity: 0.1;
    margin: 0 10px 5px 0;

    &.done {
      opacity: 1;
    }

    &.ongoing, &.active {
      opacity: 0.6;
    }
  }
}
</style>
