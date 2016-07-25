import moment from 'moment';

const taskStatus = {
  dropped: -1,
  idle: 0,
  ongoing: 1,
  paused: 2,
  active: 3,
  done: 4,
};

const availabilities = {
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
  createTime: moment(),
  emotion: 2,
};

const task2 = {
  note: 'Click tomato to start working.',
  status: taskStatus.idle,
  startTime: null,
  createTime: moment(),
  emotion: 2,
};

const task3 = {
  note: 'After finishing, take a rest.',
  status: taskStatus.idle,
  startTime: null,
  createTime: moment(),
  emotion: 2,
};

const task4 = {
  note: 'Restart if you are disturbed.',
  status: taskStatus.idle,
  startTime: null,
  createTime: moment(),
  emotion: 2,
};

const task5 = {
  note: 'Take 5 to be more productive.',
  status: taskStatus.idle,
  startTime: null,
  createTime: moment(),
  emotion: 2,
};

const tasks = [
  task1, task2, task3, task4, task5,
];

const team = {
  screctId: 'HFE-Train',
  name: 'HFE-Train',
  members: {
    UID: {
      rule: 'admin',
      userStatus: {},
      tasks: [],
    },
  },
};

export { taskStatus, availabilities, tasks, team };
