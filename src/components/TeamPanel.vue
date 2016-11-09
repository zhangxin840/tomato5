<template>
  <section class="teamPanel">
    <div class="teamPanel-wrapper">
      <h2 class="">
        Tomato Team
        <!-- <span>{{ teamData.info.name }}</span>     -->
        <span class="expander" v-on:click="showForm()">+</span>
      </h2>
      <div class="teamManager" transition="expand" v-show="teamForm.isShow">
        <p class="switch" v-show="false">
          <span class="selector" v-on:click="teamForm.isJoin = true" v-bind:class="{ 'selected': teamForm.isJoin }">Join Team</span>
          <span class="spacer">or</span>
          <span class="selector" v-on:click="teamForm.isJoin = false" v-bind:class="{ 'selected': !teamForm.isJoin }">My Team</span>
        </p>
        <validator name="validation">
        <form class="theForm" novalidate>
          <div class="join" transition="slide_left" v-show="teamForm.isJoin">
            <p class="field">
              <span>TeamID: </span>
              <input type="text" autocomplete="off" value=""
                    placeholder="6-24 characters"
                    maxlength="24"
                    v-model="teamForm.inviteCode"
                    v-validate:invite-code="{ minlength: 6 }">
            </p>
            <p class="tips">
              You can use TeamID to create or join a team
            </p>
            <p transition="fade" v-if="!$validation.invalid">
              <a v-on:click="joinTeam(teamForm.inviteCode)">Join Team</a>
            </p>
          </div>
          <div class="create" transition="slide_right" v-show="!teamForm.isJoin">
            <p class="field">
              <span class="">Name: </span>
              <input type="text" value="" v-model="teamForm.name">
            </p>
            <p class="field">
              <span class="">Invite Code: </span>
              <input type="text" autocomplete="off" value="" placeholder="4-12 charactors" v-model="teamForm.inviteCode">
            </p>
            <p class="tips">
              Others will use this code to join your team.
            </p>
            <p>
              <a v-on:click="createTeam(teamForm.inviteCode, teamForm.name)">Save</a>
            </p>
          </div>
          <!-- <p class="info"></p> -->
        </form>
        </validator>
      </div>
      <div class="members" transition="fade" v-if="teamData">
        <member v-for="(uid, member) in teamData.members"
                v-bind:tasks="member.tasks"
                v-bind:user-status="member.userStatus"
                v-bind:user-info="member.userInfo"
                v-bind:update-time="member.updateTime"
                v-if="!member.isHideMember">
        </member>
      </div>
    </div>
  </section>
</template>

<script>
import moment from 'moment';
import Member from './Member';
import database from '../database';
import auth from '../auth';
import { getDefaultTasks } from '../model';
import utils from '../utils';

const showMemberDays = 14;

const teamData = null;
const userTeamData = null;

const teamForm = {
  inviteCode: '',
  name: '',
  isShow: false,
  isJoin: true,
};

const showForm = function showForm() {
  this.teamForm.isShow = !this.teamForm.isShow;
  utils.report('team', 'showForm');
};

let watchRef = null;

const publishToTeam = function publishToTeam() {
  let promise;

  if (this.userTeamData && this.userTeamData.currentTeam) {
    const memberPath = `teams/${this.userTeamData.currentTeam}/members/${auth.getUser().uid}`;
    promise = database.save(memberPath, {
      rule: 'member',
      userInfo: this.userInfo,
      userStatus: this.userStatus,
      tasks: this.tasks,
      updateTime: moment(),
    }).then(() => {
      // console.log('published');
    });
  } else {
    promise = Promise.resolve();
  }

  return promise;
};

const joinTeam = function joinTeam(inviteCode) {
  if (inviteCode && this.userTeamData) {
    this.userTeamData.currentTeam = inviteCode;
    if (watchRef) {
      watchRef.off();
    }

    this.publishToTeam().then(() => {
      this.watchTeam();
    });

    this.saveUserTeamData().then(() => {
      this.teamForm.isShow = false;
    });

    utils.report('team', 'join');
  }
};

const createTeam = function createTeam(inviteCode, name) {
  if (inviteCode && name) {
    database.save(`teams/${inviteCode}`, {
      info: { inviteCode, name },
      members: [],
    }).then(() => this.joinTeam(inviteCode));
  }
};

const changeTeamName = function changeTeamName(inviteCode, name) {
  database.save(`teams/${inviteCode}/info`, { inviteCode, name }).then(() => {
    // console.log('Name changed');
  });
};

const processTeamData = function processTeamData(data) {
  if (data && data.members) {
    Object.keys(data.members).forEach((uid) => {
      const member = data.members[uid];

      member.tasks = member.tasks.filter((task) => (task.createTime
          && moment(task.createTime).format('YYYYMMDD') === moment().add(0, 'd').format('YYYYMMDD'))
      );

      member.tasks = member.tasks.length > 0 ? member.tasks : getDefaultTasks();

      // Hide member if not updated
      if (!member.updateTime ||
        moment.duration(moment(member.updateTime) - moment()).days() > showMemberDays) {
        member.isHideMember = true;
      }
    });
  }

  return data;
};

const watchTeam = function watchTeam() {
  watchRef = database.watch(`teams/${this.userTeamData.currentTeam}`, (snapshot) => {
    this.teamData = processTeamData(snapshot.val());
  });
};

const init = function init() {
  this.getUserTeamData().then(() => {
    this.teamForm.inviteCode = this.userTeamData.currentTeam;
    this.joinTeam(this.userTeamData.currentTeam);
  });

  utils.report('workflow', 'initTeam');
};

const getUserTeamData = function getUserTeamData() {
  return database.get(`userData/${auth.getUser().uid}/teamData`, { currentTeam: '' })
    .then((data) => {
      this.userTeamData = data;
    });
};

const saveUserTeamData = function saveUserTeamData() {
  return database.save(`userData/${auth.getUser().uid}/teamData`, this.userTeamData);
};

export default {
  props: ['userInfo', 'userStatus', 'tasks'],
  data() {
    return { teamData, teamForm, userTeamData };
  },
  events: {
    publish: publishToTeam,
    tabFocused: publishToTeam,
  },
  created: init,
  methods: {
    publishToTeam, watchTeam,
    getUserTeamData, saveUserTeamData,
    joinTeam, createTeam, changeTeamName,
    showForm,
  },
  components: { Member },
};
</script>

<style lang="scss" scoped>
@import "../base";

.teamPanel {
  margin: 100px 0 0px 0;;

  &:before, &:after {
    content: "";
    display: table;
    clear: both;
  }

  .expander {
    color: $blue;
    line-height: 30px;
    display: inline-block;
    padding: 0px 10px;
    cursor: pointer;
    user-select: none;
  }

  .members {
    overflow: hidden; // Enable BFC to avoid merging margin, for smoother animation
  }

  .teamManager {
    .switch {
      margin: 0px 0 0px 0;
      user-select: none;
      .selector {
        padding: 5px 10px;
        border-radius: 5px;
        transition: all .3s;
        color: $blue;
        cursor: pointer;
      }
      .spacer {
        margin: 0 10px;
      }
      .selected {
        background-color: $green;
        color: white;
        cursor: default;
      }
    }

    .theForm {
      position: relative;
    }

    .field {
      span {
        margin-right: 10px;
      }
    }

    .tips {
      opacity: 0.5;
    }
  }
}

.slide_left-transition {
  transition: all .5s;
  width: 100%;
  position: absolute;;
  overflow: hidden;
  top: 0;
  left: 0;
}

.slide_left-enter, .slide_left-leave {
  left: -500px;
  opacity: 0;
}

.slide_right-transition {
  transition: all .5s;
  width: 100%;
  position: absolute;
  overflow: hidden;
  left: 0;
  top: 0;
}

.slide_right-enter, .slide_right-leave {
  left: 700px;
  opacity: 0;
}

/* always present */
.expand-transition {
  transition: all .3s ease;
  height: 110px;
  overflow: hidden;
}

/* .expand-enter defines the starting state for entering */
/* .expand-leave defines the ending state for leaving */
.expand-enter, .expand-leave {
  height: 0;
  opacity: 0;
}
</style>
