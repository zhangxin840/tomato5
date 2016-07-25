<template>
  <div class="account">
    User: {{ user.displayName }}
    <a class="name" v-on:click="logout">(Change)</a>
  </div>
</template>

<script>
import auth from '../auth';

const user = auth.getUser();
const logout = function logout() {
  auth.logout();
};

export default {
  data() {
    return { user };
  },
  methods: { logout },
};
</script>

<style lang="scss" scoped>
.account {
  margin: 100px 0 0 0;
  // text-align: right;
}
</style>
