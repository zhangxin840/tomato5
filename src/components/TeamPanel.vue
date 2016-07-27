<template>
  <div class="teamPanel">
    <p class="title">
      Your team in actions:
    </p>
    <div class="members">
      <member v-for="(uid, member) in teamData.members"
              v-bind:tasks="member.tasks"
              v-bind:user-status="member.userStatus"
              v-bind:user-info="member.userInfo"
              v-bind:update-time="member.updateTime">
      </member>
    </div>
  </div>
</template>

<script>
import moment from 'moment';
import Member from './Member';
import database from '../database';
import auth from '../auth';
import { tasks as defaultTasks } from '../model';

const teamData = {};

const publishToTeam = function publishToTeam() {
  database.save(`teams/HFE-Train/members/${auth.getUser().uid}`, {
    rule: 'member',
    userInfo: this.userInfo,
    userStatus: this.userStatus,
    tasks: this.tasks,
    updateTime: moment(),
  }).then(() => {
    console.log('published');
  });
};

const processTeamData = function processTeamData(data) {
  Object.keys(data.members).forEach((uid) => {
    const member = data.members[uid];

    member.tasks = member.tasks.filter((task) => (task.createTime
        && moment(task.createTime).format('YYYYMMDD') === moment().add(0, 'd').format('YYYYMMDD'))
    );

    member.tasks = member.tasks.length > 0 ? member.tasks : defaultTasks;
  });

  return data;
};

const watchTeam = function watchTeam() {
  database.watch('teams/HFE-Train', (snapshot) => {
    this.teamData = processTeamData(snapshot.val());
  });
};

const init = function init() {
  // this.initTasks()
  //   .then(() => this.publishToTeam())
  //   .then(() => this.watchTeam());
  this.publishToTeam();
  this.watchTeam();
};

export default {
  props: ['userInfo', 'userStatus', 'tasks'],
  data() {
    return { teamData };
  },
  events: {
    publish: publishToTeam,
  },
  created: init,
  methods: { publishToTeam, watchTeam },
  components: { Member },
};
</script>

<style lang="scss" scoped>
.teamPanel {
  .title {
    margin: 40px 0;
    text-align: left;
  }
}
</style>
