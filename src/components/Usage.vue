<template>
  <div class="usage">
    <p transition="fade" v-if="usageData">
      Usage streak: {{ usageData.currentStreak }} day{{usageData.currentStreak > 1 ? 's' : ''}}
    </p>
  </div>
</template>

<script>
import moment from 'moment';
import database from '../database';
import auth from '../auth';

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

const getUsageData = function getUsageData() {
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

// TODO: Should be moved to AWS lambda
const saveUsageData = function saveUsageData() {
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

    this.saveUsageData();
  }
};

const init = function init() {
  this.getUsageData();
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
    getUsageData, saveUsageData, checkStreak,
  },
};
</script>

<style lang="scss" scoped>
@import "../base";

</style>
