<template>
  <div class="duty-table-container">
    <!-- 表头 -->
    <div class="table-header">
      <div class="col-hd col-dept">单位名称</div>
      <div class="col-hd col-leader">带班领导（联系电话）</div>
      <div class="col-hd col-duty">值班人员（联系电话）</div>
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
          v-for="(item, index) in dutyList"
          :key="index"
      >
        <div class="col col-dept">{{ item.department }}</div>
        <div class="col col-leader">{{ item.leader.name }}（{{ item.leader.phone }}）</div>
        <div class="col col-duty">{{ item.duty.name }}（{{ item.duty.phone }}）</div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      dutyList: [],
    };
  },
  async mounted() {
    await this.fetchDutyData();
    if (this.dutyList.length <= 5) return;
    this.startScroll();
  },
  beforeDestroy() {
    this.stopScroll();
  },
  methods: {
    async fetchDutyData() {
      try {
        const res = await this.$authFetch('/api/stat/duty/all');
        const data = await res.json();
        this.dutyList = (data || []).map(item => ({
          department: item.orgName,
          leader: { name: item.leaderName, phone: item.leaderPhone },
          duty: { name: item.dutyPerson, phone: item.dutyPhone },
        }));
      } catch (e) {
        this.dutyList = [];
      }
    },
    startScroll() {
      const el = this.$refs.scrollContainer;
      this.scrollTimer = setInterval(() => {
        el.scrollTop += 1;
        if (el.scrollTop + el.clientHeight >= el.scrollHeight) {
          el.scrollTop = 0;
        }
      }, 50); // 控制滚动速度
    },
    stopScroll() {
      clearInterval(this.scrollTimer);
      this.scrollTimer = null;
    },
    pauseScroll() {
      this.stopScroll();
    },
    resumeScroll() {
      if (!this.scrollTimer && this.dutyList.length > 5) {
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
  width: 6px; /* 滚动条宽度 */
}

.table-body::-webkit-scrollbar-track {
  background-color: rgba(0, 0, 0, 0.1); /* 半透明背景 */
  border-radius: 3px;
}

.table-body::-webkit-scrollbar-thumb {
  background-color: rgba(255, 255, 255, 0.3); /* 滑块半透明 */
  border-radius: 3px;
}

.table-body::-webkit-scrollbar-thumb:hover {
  background-color: rgba(255, 255, 255, 0.5); /* hover 状态下颜色更亮 */
}


.table-row:nth-child(2n-1) {
  background-color: rgba(255, 255, 255, 0.05);
}


.table-row:nth-child(2n) {
  background-color: rgba(64, 158, 255, 0.1);
}

.col-hd{
  font-weight: bold;
  flex: 1;
  padding: 2px 6px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
.col {

  flex: 1;
  padding: 2px 6px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.col-dept {
  flex: 1.5;
}

.col-leader,
.col-duty {
  flex: 2;
}
</style>
