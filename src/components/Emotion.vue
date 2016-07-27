<template>
  <div class="emotion">
    <span class="inner", v-bind:class="[emotionLevelClass]">
      {{level}}
    </span>
  </div>
</template>

<script>
export default {
  props: ['level'],
  data() {
    return { };
  },
  computed: {
    emotionLevelClass: function doneCount() {
      return `${this.level > 0 ? 'p' : 'n'}-${Math.abs(this.level)}`;
    },
  },
  methods: { },
};
</script>

<style lang="scss" scoped>
@import "../base";

.emotion {
  width: 50px;
  height: 50px;
  display: inline-block;
  background: $yellow;
  line-height: 50px;
  text-align: center;
  border-radius: 5px;
  cursor: pointer;

  .inner {
    display: inline-block;
    vertical-align: middle;
    width: 30px;
    height: 30px;
    position: relative;
    top: 0px;
    transition: background 0.6s, top 0.2s;
    text-indent: -9999px;

    &.p-1 {
      background: url('../assets/p-1.svg');
    }
    &.p-2 {
      background: url('../assets/p-2.svg');
    }
    &.p-3 {
      background: url('../assets/p-3.svg');
    }
    &.p-4 {
      background: url('../assets/p-4.svg');
    }

    &.n-1 {
      background: url('../assets/n-1.svg');
    }
    &.n-2 {
      background: url('../assets/n-2.svg');
    }
    &.n-3 {
      background: url('../assets/n-3.svg');
    }
    &.n-4 {
      background: url('../assets/n-4.svg');
    }
  }

  &:hover {
    .inner {
      top: -2px;
    }
  }

  &:active {
    transform: scale(1.1, 1.1);
  }
}

.emotion.small {
  width: 25px;
  height: 25px;
  line-height: 25px;
  cursor: default;

  .inner {
    width: 15px;
    height: 15px;
    top: 0;
  }
}

.icon-wrapper {
  .emotion {
    margin: 0 2px 0 3px;
  }
}
</style>
