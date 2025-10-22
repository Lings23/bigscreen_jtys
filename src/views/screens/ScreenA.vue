<template>
  <div class="screen-container">
    <!-- 主体布局：左侧 + 右侧模块 -->
    <div class="main-layout">
      <div class="left-column">
        <item-wrap class="module module-large">
          <!-- 原有大模块内容 -->
        </item-wrap>
        <item-wrap class="module module-medium" title="恶意IP攻击列表">
          <!-- 新增攻击统计组件 -->
          <AttackStats />
        </item-wrap>
      </div>
      
      <!-- 右侧列 -->
      <div class="right-column">
        <item-wrap class="module module-right-1">
          <!-- 其他组件内容 -->
        </item-wrap>
        <!-- 右侧第一个模块：重保事件报送列表 -->
        <item-wrap class="module module-right-2" title="重保事件报送列表">
          <ReBaoEventList />
        </item-wrap>
        <!-- 右侧第二个模块：信息安全季报（放在重保下面） -->
        <item-wrap class="module module-right-3" title="信息安全季报">
          <QuarterlyReport />
        </item-wrap>
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
// 导入item-wrap组件
import ItemWrap from '@/components/item-wrap/item-wrap.vue';
import axios from 'axios';


export default {
  components: {
    ReBaoEventList,
    QuarterlyReport,
    AttackStats,
    ItemWrap  // 注册item-wrap组件
  },
  created() {
    this.initMockApis();
  },
  beforeUnmount() {
    // 修复：检查mock是否存在再调用restore
    if (window.mock) {
      mock.restore();
    }
  },
  methods: {
    initMockApis() {
      // 原有重保事件接口
      // 原有统计接口
      if (window.mock) {
        mock.onGet('/api/dashboard/statistics').reply(200, {
          code: 200,
          message: 'success',
          data: { totalEvents: 156, processingEvents: 23, resolvedEvents: 133, todayEvents: 12 }
        });
      }
    }
  }
};
</script>

<style scoped>
/* 基础样式设置，确保根元素占满屏幕 */
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

html, body, #app {
  width: 100vw;
  height: 100vh;
  overflow: hidden; /* 防止页面整体滚动 */
}

.screen-container {
  width: 100%;
  height: 96%;
  background-color: #0a0f28;
  background-image: radial-gradient(circle, rgba(30, 80, 188, 0.1) 1px, transparent 1px);
  background-size: 30px 30px;
  display: flex;
  flex-direction: column;
}

.main-layout {
  flex: 1;
  display: flex;
  gap: 15px;
  padding: 15px;
  box-sizing: border-box;
  overflow: hidden; /* 防止布局溢出 */
}

.left-column {
  flex: 65;
  display: flex;
  flex-direction: column;
  gap: 15px;
  overflow: hidden;
}

.right-column {
  flex: 35;
  display: flex;
  flex-direction: column;
  gap: 15px;
  overflow: hidden;
}

.module {
  position: relative;
  border-radius: 2px;
  /* 移除原有边框样式，使用item-wrap的边框 */
  background-color: rgba(10, 15, 40, 0.7);
  /* 移除原有边框和阴影 */
  display: flex;
  flex-direction: column;
  overflow: hidden; /* 模块内容溢出时隐藏或滚动 */
}

/* 左侧模块尺寸 - 使用flex比例确保填充空间 */
.module-large { flex: 6; }
.module-medium { flex: 4; }

/* 右侧三个模块的高度控制 - 使用flex比例 */
.module-right-1 { flex: 1; }
.module-right-2 { flex: 2; }
.module-right-3 { flex: 3; }

/* 确保组件内部内容也能适应容器 */
::v-deep .module > * {
  width: 100%;
  height: 100%;
  overflow: auto; /* 组件内容过多时可滚动 */
}
</style>
