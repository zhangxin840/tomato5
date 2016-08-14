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

const taskTips = [
  '✎ Plan your work in this list.',
  'Click tomato to start working.',
  'After finishing, take a rest.',
  'Restart if you are disturbed.',
  'Take 5 tomatoes to be more productive.',
];

const task1 = {
  note: '',
  status: taskStatus.idle,
  startTime: null,
  createTime: moment(),
  emotion: 2,
};

const task2 = {
  note: '',
  status: taskStatus.idle,
  startTime: null,
  createTime: moment(),
  emotion: 2,
};

const task3 = {
  note: '',
  status: taskStatus.idle,
  startTime: null,
  createTime: moment(),
  emotion: 2,
};

const task4 = {
  note: '',
  status: taskStatus.idle,
  startTime: null,
  createTime: moment(),
  emotion: 2,
};

const task5 = {
  note: '',
  status: taskStatus.idle,
  startTime: null,
  createTime: moment(),
  emotion: 2,
};

const tasks = [
  task1, task2, task3, task4, task5,
];

const team = {
  info: {
    inviteCode: 'HFE-Train',
    name: 'HFE-Train',
  },
  members: {
    UID: {
      rule: 'member',
      userInfo: {},
      userStatus: {},
      tasks: [],
      updateTime: '', // moment
    },
  },
};

const userData = {
  teamData: {
    currentTeam: '',
  },
  usageData: {
    currentStreak: 0,
    lastStreakTime: '',
  },
  systemData: {
    rule: 'normal',
  },
};

export { taskStatus, taskTips, availabilities, tasks, team, userData };
