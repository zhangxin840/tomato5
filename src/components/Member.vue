<template>
  <div class="member">
    <div class="speech" v-bind:class="{
      'show': userStatus.isShowSpeech && (authUser.uid === userInfo.uid || (userStatus.speech && userStatus.speech.length > 0)),
      'long': userStatus.speech && userStatus.speech.length > 15
    }">
      <div v-if="authUser.uid === userInfo.uid" class="content edit">
        <input v-model="userStatus.speech" v-on:blur="onChangeSpeech" class="" type="text" name="" placeholder="How are you doing?" maxlength="100">
      </div>
      <div v-if="authUser.uid !== userInfo.uid" class="content show">
        <p>{{userStatus.speech}}</p>
      </div>
    </div>
    <div class="memberStatus">
      <emotion class="small" v-on:click="onClickEmotion" v-bind:level="userStatus.emotion"></emotion>
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

  this.$dispatch('addFlower', this.userInfo.uid);

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

const onChangeSpeech = function onChangeSpeech() {
  // 'userStatus' in this component is from team, not the authUser
  // Sync data back to authUser if the change is made for himself
  if (this.userInfo.uid === this.authUser.uid) {
    this.$dispatch('updateSpeech', this.userStatus.speech, this.userStatus.isShowSpeech);
  }
};

const onClickEmotion = function onClickEmotion() {
  this.userStatus.isShowSpeech = !this.userStatus.isShowSpeech;

  if (this.userInfo.uid === this.authUser.uid) {
    this.$dispatch('updateSpeech', this.userStatus.speech, this.userStatus.isShowSpeech);
  }
};

const destroy = function destroy() {
  window.clearInterval(this.statusChecker);
};

export default {
  props: ['tasks', 'userStatus', 'userInfo', 'updateTime', 'flowers', 'isSaving', 'authUser'],
  data() {
    return {
      taskStatus, availabilities,
      taskTimeLable, statusChecker,
      isOffline, isFlowersCooling,
    };
  },
  methods: { onClickFlowers, onClickEmotion, onChangeSpeech },
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

  .speech {
    position: relative;
    opacity: 0;
    transition: opacify, 0.2s;

    &.show {
      opacity: 1;
    }

    &.long .content.edit {
      width: 100%;
    }

    .content {
      display: inline-block;
      border: 1px solid $light-gray;
      border-radius: 10px;
      padding: 0px 15px;
      line-height: 30px;
      min-height: 30px;
      box-sizing: border-box;
      max-width: 100%;
      margin: 0;
      min-width: 80px;
      color: $gray;
      transition: width 0.5s;

      &.edit {
        width: 200px;
        input {
          color: $gray;
          line-height: 28px;
          border: none;
          display: inline-block;
          box-sizing: border-box;
          background: none;
          width: 100%;
        }
      }

      &.show {
        p {
          margin: 0;
          display: inline-block;
          line-height: 28px;
          box-sizing: border-box;
        }
      }
    }

    .content:after {
      content: "";
      position: absolute;
      left: 35px;
      bottom: 0;
      width: 10px;
      height: 1px;
      background: white;
    }

    &:after {
      border-color: $light-gray;
      content: "";
      position: absolute;
      z-index: 10;
      bottom: -10px;
      left: 25px;
      width: 10px;
      height: 10px;
      border-style: solid;
      border-width: 0 1px 1px 0;
      background: transparent;
      border-bottom-right-radius: 10px;
      display: block;
    }


    &:before {
      border-color: $light-gray;
      content: "";
      position: absolute;
      z-index: 10;
      bottom: -10px;
      left: 25px;
      width: 20px;
      height: 10px;
      border-style: solid;
      border-width: 0 1px 1px 0;
      background: transparent;
      border-bottom-right-radius: 15px 10px;
      display: block;
    }
  }

  .memberStatus {
    line-height: 50px;
    user-select: none;
  }

  .emotion {
    margin-right: 10px;
    margin-left: 3px;
    cursor: pointer;
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
