<template>
  <div class="account">
    <a class="name" v-on:click="logout">{{ user.displayName }}</a>
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
  margin: 60px 0;
  // text-align: right;
}
</style>
