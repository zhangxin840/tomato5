<template>
  <section class="teamPanel">
    <div class="teamPanel-wrapper">
      <h2 class="">
        Team
        <!-- <span>{{ teamData.info.name }}</span>     -->
        <span class="expander" v-on:click="showForm()">+</span>
      </h2>
      <div class="teamManager " transition="expand" v-show="teamForm.isShow">
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
              Share this TeamID to invite others to join your team
            </p>
            <p class="tips">
              Edit TeamID to join or create another team
            </p>
            <p transition="fade" v-if="teamForm.status === 'ready' && !$validation.invalid && teamForm.inviteCode !== userTeamData.currentTeam">
              <a v-on:click="joinTeam(teamForm.inviteCode)" class="ready">
                 Join Team
              </a>
            </p>
            <p transition="fade" v-if="teamForm.status === 'doing'" class="doing">Joining...</p>
            <p transition="fade" v-if="teamForm.status === 'success'" class="success">Succeeded</p>
            <p transition="fade" v-if="teamForm.status === 'fail'" class="fail">Failed</p>
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
      <div class="message clearfix" transition="fade" v-if="teamData">
        <input type="text" class="" placeholder="Headline" maxlength="200"
               v-model="teamData.common.messages[dateLabel].headline"
               v-on:blur="changeHeadline">
      </div>
      <div class="members" transition="fade" v-if="teamData">
        <member v-for="(uid, member) in teamData.members"
                v-bind:flowers="teamData.common.flowers[this.dateLabel][uid]"
                v-bind:speech="teamData.common.messages[this.dateLabel].speeches[uid]"
                v-bind:auth-user="authUser"
                v-bind:is-saving="isSaving"
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

const showMemberDays = 7;

const teamData = null;
const userTeamData = null;

const teamForm = {
  inviteCode: '',
  name: '',
  isShow: false,
  isJoin: true,
  status: 'ready',
};

const isSaving = false;

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

const addFlower = function addFlower(uid) {
  const path = `teams/${this.userTeamData.currentTeam}/common/flowers/${this.dateLabel}/${uid}`;
  // console.log(path);
  this.isSaving = true;
  database.save(path, this.teamData.common.flowers[this.dateLabel][uid]).then(() => {
    this.isSaving = false;
  }, () => {
    this.isSaving = false;
  });

  utils.report('team', 'addFlower');
};

const updateSpeech = function updateSpeech(uid) {
  const teamId = this.userTeamData.currentTeam;
  const path = `teams/${teamId}/common/messages/${this.dateLabel}/speeches/${uid}`;
  database.save(path, this.teamData.common.messages[this.dateLabel].speeches[uid]).then(() => {
  }, () => {
  });

  utils.report('team', 'updateSpeech');
};

const changeHeadline = function changeHeadline() {
  const path = `teams/${this.userTeamData.currentTeam}/common/messages/${this.dateLabel}/headline`;
  database.save(path, this.teamData.common.messages[this.dateLabel].headline).then(() => {
  }, () => {
  });

  utils.report('team', 'changeHeadline');
};

const joinTeam = function joinTeam(inviteCode) {
  const recoverTime = 2000;

  if (inviteCode && this.userTeamData) {
    this.userTeamData.currentTeam = inviteCode;
    if (watchRef) {
      watchRef.off();
    }

    this.teamForm.status = 'doing';

    this.publishToTeam().then(() => {
      this.watchTeam();

      this.teamForm.status = 'success';
      window.setTimeout(() => {
        this.teamForm.isShow = false;
        window.setTimeout(() => {
          this.teamForm.status = 'ready';
        }, recoverTime / 2);
      }, recoverTime);
    }, () => {
      this.teamForm.status = 'fail';
      window.setTimeout(() => {
        this.teamForm.status = 'ready';
      }, recoverTime);
    });

    this.saveUserTeamData().then(() => {
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
  if (!data) {
    return null;
  }

  /* eslint-disable no-param-reassign */
  // Init the common data structure
  data.common = data.common || {};
  data.common.flowers = data.common.flowers || {};
  data.common.messages = data.common.messages || {};

  const flowers = data.common.flowers;
  const messages = data.common.messages;

  flowers[this.dateLabel] = flowers[this.dateLabel] || {};
  Object.keys(data.members).forEach((uid) => {
    flowers[this.dateLabel][uid] = flowers[this.dateLabel][uid] || {
      count: 0,
    };
  });

  messages[this.dateLabel] = messages[this.dateLabel] || {};
  messages[this.dateLabel].headline = messages[this.dateLabel].headline || '';
  messages[this.dateLabel].speeches = messages[this.dateLabel].speeches || {};
  Object.keys(data.members).forEach((uid) => {
    messages[this.dateLabel].speeches[uid] = messages[this.dateLabel].speeches[uid] || {
      content: '',
      isShowSpeech: false,
    };
  });
  /* eslint-enable no-param-reassign */

  // Filter tasks and members
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

  return data;
};

const watchTeam = function watchTeam() {
  watchRef = database.watch(`teams/${this.userTeamData.currentTeam}`, (snapshot) => {
    this.teamData = this.processTeamData(snapshot.val());
  });
};

const authUser = auth.getUser();

const init = function init() {
  this.getUserTeamData().then(() => {
    this.teamForm.inviteCode = this.userTeamData.currentTeam;
    this.joinTeam(this.userTeamData.currentTeam);
  });

  utils.report('workflow', 'initTeam');
};

const getUserTeamData = function getUserTeamData() {
  return database.get(`userData/${auth.getUser().uid}/teamData`, {
    currentTeam: null,
  }).then((data) => {
    const defaultTeam = `TEAM-${authUser.uid.slice(0, 3)}-${Math.random().toString().slice(2, 7)}`;

    this.userTeamData = data;
    this.userTeamData.currentTeam = this.userTeamData.currentTeam || defaultTeam;
  });
};

const saveUserTeamData = function saveUserTeamData() {
  return database.save(`userData/${auth.getUser().uid}/teamData`, this.userTeamData);
};

// Only get dateLabel when init, to avoid cross day issues.
const dateLabel = moment().format('YYYYMMDD');


export default {
  props: ['userInfo', 'userStatus', 'tasks'],
  data() {
    return { teamData, teamForm, userTeamData, dateLabel, isSaving, authUser };
  },
  events: {
    publish: publishToTeam,
    tabFocused: publishToTeam,
    updateSpeech,
    addFlower,
  },
  created: init,
  methods: {
    publishToTeam, watchTeam,
    getUserTeamData, saveUserTeamData,
    joinTeam, createTeam, changeTeamName,
    showForm,
    changeHeadline,
    processTeamData,
    updateSpeech,
  },
  components: { Member },
};
</script>

<style lang="scss" scoped>
@import "../base";

.teamPanel {
  margin: 85px 0 0px 0;;

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

  .message {
    input {
      display: block;
      width: 100%;
      text-align: center;
      line-height: 30px;
      margin: 35px 0 0px 0;
    }
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

    .success {
      color: $green;
    }

    .fail {
      color: $red;
    }

    .tips {
      color: $gray;
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
  height: 170px;
  overflow: hidden;
}

/* .expand-enter defines the starting state for entering */
/* .expand-leave defines the ending state for leaving */
.expand-enter, .expand-leave {
  height: 0;
  opacity: 0;
}
</style>
