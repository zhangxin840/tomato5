<template>
  <section class="panel">
    <div class="user">
      <div class="avator">
        <img class="pic" :src="user.photoURL" alt="avator" />
      </div>
      <span class="timer">{{ status.label }}</span>
    </div>
    <div class="task">
      <div class="list">
        <span v-for="task in list.tasks"
              v-bind:class="{ 'animated tada idle': task.status === taskStatus.idle }"
              class="icon-tomato">
          {{ task.note }}
        </span>
      </div>
    </div>
  </section>
</template>

<script>

import moment from 'moment';

window.moment = moment;

const taskStatus = {
  dropped: -1,
  idle: 0,
  ongoning: 1,
  paused: 2,
  done: 3,
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

const status = {
  label: '00:00',
  userStatus: userStatus.idle,
};

const getRemaning = function getRemaning(startTime) {
  const total = moment.duration(10, 'seconds');
  const elapsed = moment().diff(startTime, 'seconds');
  const remaning = total.subtract(elapsed, 'seconds');

  return remaning;
};

const getContdown = function getContdown(startTime, level) {
  const remaning = getRemaning(startTime);
  let minutes = remaning.minutes() > 0 ? remaning.minutes() : 0;
  let seconds = remaning.seconds() > 0 ? remaning.seconds() : 0;
  let result = '';

  if (level === 'minute') {
    result = `${minutes}m`;
  } else {
    minutes = minutes > 9 ? `${minutes}` : `0${minutes}`;
    seconds = seconds > 9 ? `${seconds}` : `0${seconds}`;
    result = `${minutes}:${seconds}`;
  }

  return result;
};


window.getContdown = getContdown;

const Notification = window.Notification;

const sendNotification = function sendNotification(title, message) {
  if (Notification) {
    const noti = new Notification(title, { /* eslint no-unused-vars: 0 */
      icon: 'http://cdn.sstatic.net/stackexchange/img/logos/so/so-icon.png',
      body: message,
    });
  }
};

const startTimer = function startTimer(startTime) {
  const timer = window.setInterval(() => {
    status.label = getContdown(startTime, 'second');
    if (getRemaning(startTime).seconds() <= 0) {
      sendNotification('Take Five', 'The first tomato completed, nice job!');
      window.clearInterval(timer);
    }
  }, 1000);

  if (Notification) {
    Notification.requestPermission();
  }
};

const onClick = function click() {
  sendNotification('test1', 'test2');
  console.log('send');
};

startTimer(moment().subtract(0, 's'));

export default {
  data() {
    return { user, list, status, taskStatus };
  },
  methods: { onClick },
};

</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss" scoped>
h1 {
  color: #42b983;
}

.panel{
  display: flex;
  max-width: 280px;
  margin: 50px auto;

  .user{
    margin-right: 30px;

    .avator {
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
    }
  }

  .list{
    margin: 8px 0;
    text-align: left;
    line-height: 40px;
    .icon-tomato{
      margin: 0 5px;
    }
    .icon-tomato.idle{
      opacity: 0.5;
      cursor: pointer;
    }
  }
}

</style>
