<template>
  <div class="duty-table-container">
    <!-- 表头 -->
    <div class="table-header">
      <div class="col-hd col-system">系统名称</div>
      <div class="col-hd col-score">风险评分</div>
    </div>

    <!-- 表体 -->
    <div
        class="table-body"
        ref="scrollContainer"
        @mouseenter="pauseScroll"
        @mouseleave="resumeScroll"
    >
      <div
          class="table-row"
          v-for="(item, index) in riskList"
          :key="index"
      >
        <div class="col col-system">{{ item.systemName }}</div>
        <div class="col col-score">{{ item.score }}</div>
      </div>
    </div>
  </div>
</template>


<script>
import emitter from '@/utils/eventBus.js';
export default {
  data() {
    return {
      riskList: [],
      refreshTimer: null
    };
  },
  async mounted() {
    await this.fetchRiskList();
    this.refreshTimer = setInterval(this.fetchRiskList, 120000); // 2分钟刷新
    emitter.on('map-change',this.handleMapChange);
    if (this.riskList.length <= 5) return;
    this.startScroll();
  },
  beforeDestroy() {
    this.stopScroll();
    clearInterval(this.refreshTimer);
    emitter.off('map-change', this.handleMapChange);
  },
  methods: {
    async fetchRiskList() {
      try {
        const res = await this.$authFetch('/api/stat/risk');
        const data = await res.json();
        this.riskList = (data || []).map(item => ({
          systemName: item.systemName,
          score: item.riskScore
        }));
      } catch (e) {
        this.riskList = [];
      }
    },
    handleMapChange(mapName){},
    startScroll() {
      const el = this.$refs.scrollContainer;
      this.scrollTimer = setInterval(() => {
        el.scrollTop += 1;
        if (el.scrollTop + el.clientHeight >= el.scrollHeight) {
          el.scrollTop = 0;
        }
      }, 50);
    },
    stopScroll() {
      clearInterval(this.scrollTimer);
      this.scrollTimer = null;
    },
    pauseScroll() {
      this.stopScroll();
    },
    resumeScroll() {
      if (!this.scrollTimer && this.riskList.length > 5) {
        this.startScroll();
      }
    },
  },
};
</script>


<style scoped lang="scss">
.duty-table-container {
  border: 1px solid rgba(255, 255, 255, 0.1);
  font-size: 14px;
  color: #fff;
  width: 100%;
}

.table-header,
.table-row {
  display: flex;
  align-items: center;
  padding: 6px 12px;
}

.table-header {
  background-color: rgba(0, 89, 255, 0.7);
  font-weight: bold;
  position: sticky;
  top: 0;
  z-index: 10;
}

.table-body {
  height: 227px;
  overflow-y: auto;
}

.table-body::-webkit-scrollbar {
  width: 6px;
}
.table-body::-webkit-scrollbar-track {
  background-color: rgba(0, 0, 0, 0.1);
  border-radius: 3px;
}
.table-body::-webkit-scrollbar-thumb {
  background-color: rgba(255, 255, 255, 0.3);
  border-radius: 3px;
}
.table-body::-webkit-scrollbar-thumb:hover {
  background-color: rgba(255, 255, 255, 0.5);
}

.table-row:nth-child(2n-1) {
  background-color: rgba(255, 255, 255, 0.05);
}
.table-row:nth-child(2n) {
  background-color: rgba(64, 158, 255, 0.1);
}

.col-hd, .col {
  flex: 1;
  padding: 2px 6px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
.col-system {
  flex: 2;
}
.col-score {
  flex: 1;
}
</style>
