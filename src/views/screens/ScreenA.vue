<template>
  <div class="screen-container">
    <!-- 主体布局：左侧 + 右侧模块 -->
    <div class="main-layout">
      <div class="left-column">
        <div class="module module-large"></div>
        <div class="module module-medium">
          <!-- 新增攻击统计组件 -->
          <AttackStats />
        </div>
      </div>
      
      <!-- 右侧列 -->
      <div class="right-column">
        <div class="module module-right-1">
          <!-- 其他组件内容 -->
        </div>
        <!-- 右侧第一个模块：重保事件报送列表 -->
        <div class="module module-right-2">
          <ReBaoEventList />
        </div>
        <!-- 右侧第二个模块：信息安全季报（放在重保下面） -->
        <div class="module module-right-3">
          <QuarterlyReport />
        </div>
      </div>
    </div>
  </div>
</template>


<script>
// 导入原有组件
import ReBaoEventList from '../indexs/ReBaoEventList.vue';
import QuarterlyReport from '../indexs/QuarterlyReport.vue';
// 导入新增的攻击统计组件
import AttackStats from '../indexs/AttackStats.vue';
import axios from 'axios';


export default {
  components: {
    ReBaoEventList,
    QuarterlyReport,
    AttackStats  // 注册新组件
  },
  created() {
    this.initMockApis();
  },
  beforeUnmount() {
    mock.restore();
  },
  methods: {
    initMockApis() {
      // 原有重保事件接口
      // 原有统计接口
      mock.onGet('/api/dashboard/statistics').reply(200, {
        code: 200,
        message: 'success',
        data: { totalEvents: 156, processingEvents: 23, resolvedEvents: 133, todayEvents: 12 }
      });
    }
  }
};
</script>

<style scoped>
/* 原有样式保持不变 */
html, body {
  width: 100%;
  height: 100%;
  padding: 0;
  margin: 0;
}

.screen-container {
  width: 100%;
  height: 150vh;
  background-color: #0a0f28;
  padding: 0;
  margin: 0;
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  background-image: radial-gradient(circle, rgba(30, 80, 188, 0.1) 1px, transparent 1px);
  background-size: 30px 30px;
}

.header {
  height: 60px;
  line-height: 60px;
  text-align: center;
  color: #00f7ff;
  font-size: 24px;
  text-shadow: 0 0 10px rgba(0, 247, 255, 0.6);
  background-color: rgba(10, 15, 40, 0.9);
  border-bottom: 1px solid rgba(0, 247, 255, 0.3);
}

.main-layout {
  flex: 1;
  display: flex;
  gap: 15px;
  padding: 15px;
  box-sizing: border-box;
  overflow: auto;
}

.left-column {
  flex: 65;
  display: flex;
  flex-direction: column;
  gap: 15px;
}

.right-column {
  flex: 35;
  display: flex;
  flex-direction: column;
  gap: 15px;
}

.module {
  position: relative;
  overflow: hidden;
  border-radius: 2px;
  background-color: rgba(10, 15, 40, 0.7);
  border: 1px solid rgba(0, 247, 255, 0.3);
  box-shadow: 0 0 10px rgba(0, 247, 255, 0.1);
  flex: 1;
  display: flex;
  flex-direction: column;
  min-height: 0;
}

/* 左侧模块尺寸 */
.module-large { flex: 6; }
.module-medium { flex: 4; }

/* 右侧三个模块的高度控制 */
.module-right-1 { flex: 1; }
.module-right-2 { flex: 2; }
.module-right-3 { flex: 3; }
</style>
