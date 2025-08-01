<template>
  <div class="empty-block">
    <div class="placeholder-text"></div>
  </div>
</template>

<script>
export default {
  name: "EmptyBlock",
};
</script>

<style scoped lang="scss">
.empty-block {
  height: 100%;
  width: 100%;
  background-color: rgba(255, 255, 255, 0.05);
  //border: 1px dashed rgba(255, 255, 255, 0.2);
  display: flex;
  align-items: center;
  justify-content: center;
  color: rgba(255, 255, 255, 0.5);
  font-size: 16px;
  font-style: italic;
}
</style>
