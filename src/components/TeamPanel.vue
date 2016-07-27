<template>
  <div class="teamPanel">
    <p class="title">
      Your team in actions:
    </p>
    <div class="members">
      <member v-for="(uid, member) in teamData.members"
              v-bind:tasks="member.tasks"
              v-bind:user-status="member.userStatus"
              v-bind:user-info="member.userInfo">
      </member>
    </div>
  </div>
</template>

<script>
import Member from './Member';
import database from '../database';
import auth from '../auth';

const publishToTeam = function publishToTeam() {
  database.save(`teams/HFE-Train/members/${auth.getUser().uid}`, {
    rule: 'member',
    userInfo: this.userInfo,
    userStatus: this.userStatus,
    tasks: this.tasks,
  }).then(() => {
    console.log('published');
  });
};

const teamData = {};

const watchTeam = function watchTeam() {
  database.watch('teams/HFE-Train', (snapshot) => {
    this.teamData = snapshot.val();
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
