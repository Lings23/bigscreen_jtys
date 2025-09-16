<template>
  <div class="screen">
    <div class="title">{{ title }}</div>
    <div class="content">在这里搭建你的新大屏模块...</div>
  </div>
</template>

<script>
export default {
  name: 'ScreenB',
  computed: {
    title() {
      return (this.$route.meta && this.$route.meta.title) || '大屏 B';
    }
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


