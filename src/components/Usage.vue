<template>
  <article class="usage">
    <h2>Tomato habit</h2>
    <p class="chartTitle">
      Tomatoes completed
    </p>
    <canvas id="line-chart" height="300"></canvas>
    <p class="streak" transition="fade" v-if="usageData">
      Usage streak: {{ usageData.currentStreak }} day{{usageData.currentStreak > 1 ? 's' : ''}}
    </p>
  </article>
</template>

<script>

import Chart from 'chart.js';
import moment from 'moment';
import database from '../database';
import auth from '../auth';
import { taskStatus } from '../model';

const usageData = null;

const checkStreak = function checkStreak() {
  let result = -1;
  if (this.usageData && this.usageData.lastStreakTime) {
    const last = moment(this.usageData.lastStreakTime);
    const now = moment();
    if ((now.diff(last, 'days') === 1)
      || (now.diff(last, 'days') === 2 && now.day() === 0) // Sunday
      || (now.diff(last, 'days') === 3 && now.day() === 1) // Monday
    ) {
      result = 1; // Is streak
    } else if (now.diff(last, 'days') === 0) {
      result = 0; // Same day
    } else {
      result = -1; // Not streak
    }
  }

  return result;
};

const getStreakData = function getStreakData() {
  return database.get(`userData/${auth.getUser().uid}/usageData`, {
    currentStreak: 0,
    lastStreakTime: null,
  })
  .then((data) => {
    this.usageData = data;

    if (this.checkStreak() === -1) {
      this.usageData.currentStreak = 0;
      this.usageData.lastStreakTime = moment();
    }
  });
};

const processLineChartData = function processLineChartData(allTasks) {
  const xData = [];
  const yData = [];
  let day;
  let count;

  Object.keys(allTasks).forEach((key) => {
    day = moment(key);
    xData.push(day.date());

    count = allTasks[key].reduce((previousValue, item) =>
      previousValue + (item.status === taskStatus.done ? 1 : 0)
    , 0);
    yData.push(count);
  });

  console.log({ xData, yData });

  return { xData, yData };
};

const getLineChartData = function getLineChartData() {
  return database.get(`tasks/${auth.getUser().uid}`, {})
  .then((data) => processLineChartData(data));
};

// TODO: Should be moved to AWS lambda
const saveStreakData = function saveStreakData() {
  return database.save(`userData/${auth.getUser().uid}/usageData`, this.usageData);
};

const onAddStreak = function onAddStreak() {
  if (this.usageData) {
    if (this.checkStreak() === 1) {
      this.usageData.currentStreak = this.usageData.currentStreak + 1;
    } else if (this.checkStreak() === -1) {
      this.usageData.currentStreak = 1;
    } else if (this.checkStreak() === 0 && this.usageData.currentStreak === 0) {
      this.usageData.currentStreak = 1; // First after break
    }
    this.usageData.lastStreakTime = moment();

    this.saveStreakData();
  }
};

const LineOptions = {
  fill: false,
  lineTension: 0.1,
  backgroundColor: 'rgba(95,210,219,0.4)',
  borderColor: 'rgba(95,210,219,1)',
  borderCapStyle: 'butt',
  borderDash: [],
  borderDashOffset: 0.0,
  borderJoinStyle: 'miter',
  pointBorderColor: 'rgba(95,210,219,1)',
  pointBackgroundColor: '#fff',
  pointBorderWidth: 1,
  pointHoverRadius: 5,
  pointHoverBackgroundColor: 'rgba(95,210,219,1)',
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

const initLineChart = function initLineChart(id, xData, yData) {
  const ctx = document.getElementById(id);

  const data = {
    labels: xData,
    datasets: [Object.assign(LineOptions, {
      label: 'Tomato completed',
      data: yData,
    })],
  };

  const myChart = new Chart(ctx, { /* eslint no-unused-vars: 0 */
    type: 'line',
    data,
    options: lineChartOptions,
  });
};

const init = function init() {
  this.getStreakData();
  getLineChartData().then((data) => {
    initLineChart('line-chart',
    data.xData,
    data.yData);
  });
};

export default {
  data() {
    return { usageData };
  },
  created: init,
  events: {
    addStreak: onAddStreak,
  },
  methods: {
    getStreakData, saveStreakData, checkStreak,
  },
};
</script>

<style lang="scss" scoped>
@import "../base";

.chartTitle {
  text-align: center;
  margin: 30px 0 10px 0;
}

.streak {
  margin-top: 40px;
}
</style>
