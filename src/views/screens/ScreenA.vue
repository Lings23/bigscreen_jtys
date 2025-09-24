<template>
  <div class="screen-container">
    <!-- 顶部标题区域 -->
  
    <!-- 主体布局：左侧 + 右侧模块 -->
    <div class="main-layout">
      <div class="left-column">
        <div class="module module-large"></div>
        <div class="module module-medium"></div>
      </div>
      <div class="right-column">
        <div class="module module-small"></div>
        <div class="module module-small"></div>
        <div class="module module-small"></div>
      </div>
    </div>
  </div>
</template>

<style scoped>
/* 页面整体容器：纵向 flex，占满视口高度 */
.screen-container {
  width: 100%;
  height: 90%; /* 改为100vh，避免高度过大导致滚动 */
  background-color: #0a1026;
  padding: 0;
  box-sizing: border-box;
  display: flex;
  flex-direction: column; /* 纵向排列标题和主体 */
}

/* 顶部标题：固定高度 */
.header {
  height: 60px;
  line-height: 60px;
  text-align: center;
  color: #fff;
  font-size: 24px;
  text-shadow: 0 0 8px rgba(0, 247, 255, 0.8);
}

/* 主体布局：占满标题下方剩余高度，且距离顶部标题有间距 */
.main-layout {
  flex: 1; /* 自动填充剩余高度 */
  display: flex;
  gap: 15px;
  padding: 0 15px 15px 15px;
  box-sizing: border-box;
  margin-top: 20px; /* 关键：添加距离顶部标题的间距，可根据需要调整数值 */
}

/* 左侧列：纵向 flex，占主体宽度的 65% */
.left-column {
  flex: 65;
  display: flex;
  flex-direction: column;
  gap: 15px;
}

/* 右侧列：纵向 flex，占主体宽度的 35% */
.right-column {
  flex: 35;
  display: flex;
  flex-direction: column;
  gap: 15px;
}

/* 通用模块样式：占满所在列的剩余高度 */
.module {
  position: relative;
  overflow: hidden;
  border-radius: 6px;
  background: linear-gradient(135deg, rgba(14, 30, 66, 0.8) 0%, rgba(14, 30, 66, 0.6) 100%);
  box-shadow: 0 0 5px rgba(30, 80, 188, 0.8), inset 0 0 15px rgba(30, 80, 188, 0.5);
  flex: 1; /* 每个模块自动填充所在列的剩余高度 */
}

/* 模块边框（模拟截图中的光效边框） */
.module {
  border: 2px solid rgba(0, 247, 255, 0.5);
  box-shadow: 0 0 10px rgba(0, 247, 255, 0.3);
}

/* 各模块的 flex 比例（控制高度分配） */
.module-large {
  flex: 6; /* 左侧大模块占 6 份高度 */
}
.module-medium {
  flex: 4; /* 左侧中模块占 4 份高度 */
}
.module-small {
  flex: 3; /* 右侧小模块各占 3 份高度 */
}
</style>
