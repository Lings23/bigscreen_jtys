<template>
  <div class="screen">
    <div class="title">{{ title }}</div>
    <div class="content">
      <LeftTop />
    </div>
  </div>
</template>

<script>
import LeftTop from './system3D.vue';
export default {
  name: 'ScreenA',
  computed: {
    title() {
      return (this.$route.meta && this.$route.meta.title) || '大屏 A';
    }
  },
  components: {
    LeftTop
  }
}
</script>

<style scoped>
.screen {
  width: 100%;
  height: 100%;
  color: #fff;
}
.title {
  text-align: center;
  font-size: 24px;
  margin: 8px 0 12px;
}
</style>


