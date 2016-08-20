<template>
  <article class="usage" transition="fade" v-if="loaded">
    <h2>Tomato habit</h2>
    <p class="chartTitle">
      Tomatoes completed
    </p>
    <canvas id="line-chart" height="200"></canvas>
    <p class="chartTitle">
      Tomatoes time distribution
    </p>
    <canvas id="bar-chart" height="200"></canvas>
    <p class="streak">
      Tomato streak: {{ usageData.streak }} day{{usageData.streak > 1 ? 's' : ''}}
    </p>
    <p class="total">
      Total completed: {{ usageData.totalCount }}
    </p>
  </article>
</template>

<script>

import Chart from 'chart.js';
import moment from 'moment';
import database from '../database';
import auth from '../auth';
import { taskStatus } from '../model';

const loaded = false;

const usageData = {
  totalCount: 0,
  streak: 0,
};

const getDoneCount = function getDoneCount(data) {
  let count = 0;
  if (data) {
    count = data.reduce((previousValue, item) => previousValue
      + (item.status === taskStatus.done ? 1 : 0), 0);
  }
  return count;
};

const getStreak = function getStreak(tasks) {
  let streak = 0;
  let indexDay = moment();

  streak = getDoneCount(tasks[indexDay.format('YYYYMMDD')]) > 0 ? 1 : 0;
  indexDay = indexDay.subtract(1, 'd');

  while (tasks[indexDay.format('YYYYMMDD')]) {
    if (getDoneCount(tasks[indexDay.format('YYYYMMDD')]) > 0) {
      streak++;
      indexDay = indexDay.subtract(1, 'd');
    } else if (indexDay.day() === 0 || indexDay.day() === 6) {
      indexDay = indexDay.subtract(1, 'd');
    } else {
      break;
    }
  }

  return streak;
};

// const checkStreak = function checkStreak() {
//   let result = -1;
//   if (this.usageData && this.usageData.lastStreakTime) {
//     const last = moment(this.usageData.lastStreakTime);
//     const now = moment();
//     if ((now.diff(last, 'days') === 1)
//       || (now.diff(last, 'days') === 2 && now.day() === 0) // Sunday
//       || (now.diff(last, 'days') === 3 && now.day() === 1) // Monday
//     ) {
//       result = 1; // Is streak
//     } else if (now.diff(last, 'days') === 0) {
//       result = 0; // Same day
//     } else {
//       result = -1; // Not streak
//     }
//   }
//
//   return result;
// };

// const getStreak = function getStreak() {
//   return database.get(`userData/${auth.getUser().uid}/usageData`, {
//     currentStreak: 0,
//     lastStreakTime: null,
//   })
//   .then((data) => {
//     this.usageData = data;
//
//     if (this.checkStreak() === -1) {
//       this.usageData.currentStreak = 0;
//       this.usageData.lastStreakTime = moment();
//     }
//   });
// };

// const saveStreakData = function saveStreakData() {
//   return database.save(`userData/${auth.getUser().uid}/usageData`, this.usageData);
// };

const getUsageData = function getUsageData(tasks) {
  const totalCount = Object.keys(tasks).reduce((previousValue, item) => previousValue +
      getDoneCount(tasks[item])
  , 0);

  usageData.totalCount = totalCount;
  usageData.streak = getStreak(tasks);
};

const fillTasks = function fillTasks(tasks) {
  const keys = Object.keys(tasks);
  const filledTasks = {};
  const firstDay = keys[0] && moment(keys[0]);
  const lastDay = keys[keys.length - 1] && moment(keys[keys.length - 1]);
  const fillLength = 7;
  let indexDay;

  // Fill days in middle
  for (indexDay = firstDay; indexDay && indexDay <= lastDay; indexDay.add(1, 'd')) {
    filledTasks[indexDay.format('YYYYMMDD')] = tasks[indexDay.format('YYYYMMDD')] || [];
  }

  // Fill today if empty
  if (Object.keys(filledTasks).length === 0) {
    filledTasks[moment().format('YYYYMMDD')] = [];
  }

  // Fill to enough length
  while (Object.keys(filledTasks).length < fillLength) {
    filledTasks[moment(Object.keys(filledTasks)[0]).subtract(1, 'd').format('YYYYMMDD')] = [];
  }

  return filledTasks;
};

const getTasksData = function getTasksData() {
  return database.get(`tasks/${auth.getUser().uid}`, {});
};

const onTaskDone = function onCompleteTask() {
  // if (this.usageData) {
  //   if (this.checkStreak() === 1) {
  //     this.usageData.currentStreak = this.usageData.currentStreak + 1;
  //   } else if (this.checkStreak() === -1) {
  //     this.usageData.currentStreak = 1;
  //   } else if (this.checkStreak() === 0 && this.usageData.currentStreak === 0) {
  //     this.usageData.currentStreak = 1; // First after break
  //   }
  //   this.usageData.lastStreakTime = moment();
  //
  //   this.saveStreakData();
  // }
};

const lineOptions = {
  label: 'Tomato completed',
  fill: false,
  lineTension: 0.1,
  backgroundColor: 'rgba(95,210,219,0.4)',
  borderColor: 'rgba(95,210,219,0.8)',
  borderCapStyle: 'butt',
  borderDash: [],
  borderDashOffset: 0.0,
  borderJoinStyle: 'miter',
  pointBorderColor: 'rgba(95,210,219,0.8)',
  pointBackgroundColor: '#fff',
  pointBorderWidth: 1,
  pointHoverRadius: 5,
  pointHoverBackgroundColor: 'rgba(95,210,219,0.8)',
  pointHoverBorderColor: 'rgba(220,220,220,1)',
  pointHoverBorderWidth: 2,
  pointRadius: 1,
  pointHitRadius: 10,
  spanGaps: false,
};

const lineChartOptions = {
  legend: {
    display: false,
  },
  scales: {
    yAxes: [{
      ticks: {
        beginAtZero: true,
      },
    }],
  },
};

const barOptions = {
  label: 'Tomato completed',
  backgroundColor: 'rgba(95,210,219,0.4)',
  borderColor: 'rgba(95,210,219,0.8)',
  borderWidth: 1,
};

const barChartOptions = {
  legend: {
    display: false,
  },
  scales: {
    yAxes: [{
      ticks: {
        beginAtZero: true,
      },
    }],
  },
};

const getLineChartData = function getLineChartData(tasks) {
  const xData = [];
  const yData = [];
  // const keys = Object.keys(tasks);
  let day;
  let count;
  const trimLength = -21;

  Object.keys(tasks).forEach((key) => {
    day = moment(key);
    xData.push(day.date());

    count = getDoneCount(tasks[key]);
    yData.push(count);
  });

  return { xData: xData.slice(trimLength), yData: yData.slice(trimLength) };
};

const getBarChartData = function getBarChartData(tasks) {
  const distribution = {
  };

  for (let i = 0; i < 24; i++) {
    distribution[i] = 0;
  }

  Object.keys(tasks).forEach((key) => {
    tasks[key].forEach((task) => {
      if (task.status === taskStatus.done && task.startTime) {
        const starthour = moment(task.startTime).hour();
        distribution[starthour]++;
      }
    });
  });

  const yData = [];
  Object.keys(distribution).forEach((key) => {
    yData.push(distribution[key]);
  });

  return { xData: Object.keys(distribution), yData };
};

const initChart = function initChart(id, xData, yData, type, dataOptions, options) {
  const ctx = document.getElementById(id);

  const data = {
    labels: xData,
    datasets: [Object.assign(dataOptions, {
      data: yData,
    })],
  };

  const myChart = new Chart(ctx, { /* eslint no-unused-vars: 0 */
    type,
    data,
    options,
  });
};

const init = function init() {
  getTasksData()
  .then((data) => fillTasks(data))
  .then((data) => {
    getUsageData(data);
    return data;
  })
  .then((data) => {
    const lineChartData = getLineChartData(data);
    window.setTimeout(() => {
      initChart('line-chart',
        lineChartData.xData,
        lineChartData.yData,
        'line',
        lineOptions,
        lineChartOptions
      );
    }, 1);

    const barChartData = getBarChartData(data);
    window.setTimeout(() => {
      initChart('bar-chart',
        barChartData.xData,
        barChartData.yData,
        'bar',
        barOptions,
        barChartOptions
      );
    }, 1);

    return data;
  })
  .then(() => {
    this.loaded = true;
  });
};

export default {
  data() {
    return { usageData, loaded };
  },
  created: init,
  events: {
    taskDone: onTaskDone,
  },
  methods: {
  },
};
</script>

<style lang="scss" scoped>
@import "../base";

.usage {
  margin-top: 50px;
}

.chartTitle {
  text-align: center;
  margin: 40px 0 15px 0;
}

.streak {
  margin-top: 30px;
}
</style>
