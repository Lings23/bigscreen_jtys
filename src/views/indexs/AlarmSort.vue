<template>
  <div class="right_bottom">
    <!-- 切换按钮 -->
    <div class="switch-button">
      <button
          :class="{ active: areaType === 'overseas' }"
          @click="switchArea('overseas')"
      >境外</button>
      <button
          :class="{ active: areaType === 'domestic' }"
          @click="switchArea('domestic')"
      >境内</button>
    </div>

    <!-- 胶囊图 -->
    <dv-capsule-chart :config="config" style="width:100%;height:250px" />
  </div>
</template>

<script>
import { currentGET } from 'api/modules';

export default {
  data() {
    return {
      areaType: 'overseas', // 默认为境外
      config: {
        showValue: true,
        unit: '次',
        data: []
      },
      refreshTimer: null
    };
  },
  created() {
    this.getData();
    this.refreshTimer = setInterval(this.getData, 120000); // 2分钟刷新
  },
  beforeDestroy() {
    clearInterval(this.refreshTimer);
  },
  methods: {
    switchArea(type) {
      if (this.areaType !== type) {
        this.areaType = type;
        this.getData();
      }
    },
    async getData() {
      try {
        const res = await this.$authFetch('/api/stat/region');
        const data = await res.json();
        const typeMap = { overseas: 'foreign', domestic: 'domestic' };
        const filtered = (data || []).filter(item => item.regionType === typeMap[this.areaType]);
        // alertCount降序排序，取前10
        const sorted = filtered.sort((a, b) => b.alertCount - a.alertCount).slice(0, 10);
        this.config = {
          ...this.config,
          data: sorted.map(item => ({ name: item.regionName, value: item.alertCount }))
        };
      } catch (e) {
        this.config = { ...this.config, data: [] };
      }
    }
  }
};
</script>

<style lang="scss" scoped>
.right_bottom {
  box-sizing: border-box;
  padding: 0 16px;

  .switch-button {
    display: flex;
    justify-content: center;
    margin: -3px ;

    button {
      background-color: transparent;
      color: #ffffff;
      border: 1px solid #3a9ff8;
      padding: 1px 12px;
      margin: 0 5px;
      border-radius: 4px;
      cursor: pointer;
      transition: all 0.3s;

      &.active {
        background-color: #3a9ff8;
        color: #fff;
      }

      &:hover {
        background-color: rgba(58, 159, 248, 0.8);
      }
    }
  }
}
</style>