<template>
  <div class="attack-carousel-wrap">
    <vue-seamless-scroll :data="attackList" :class-option="scrollOption">
      <ul class="attack-list">
        <li v-for="(item, index) in attackList" :key="index" class="attack-item">
          <span class="city">来源：{{ item.source }}</span>
          <span class="arrow">➜️</span>
          <span class="city">目标：{{ item.target }}</span>
          <span class="method">方式：{{ item.method }}</span>
          <span class="system">系统：{{ item.system }}</span>
          <span class="organization">单位：{{ item.organization }}</span>
        </li>
      </ul>
    </vue-seamless-scroll>
  </div>
</template>

<script>
import vueSeamlessScroll from 'vue-seamless-scroll';
import emitter from '@/utils/eventBus.js';

export default {
  components: { vueSeamlessScroll },
  data() {
    return {
      mapName:'world',
      attackList:[],
      scrollOption: {
        step: 0.5,
        limitMoveNum: 2,
        hoverStop: true,
        direction: 1,
        singleHeight: 32,
        waitTime: 1000,
        openWatch: true,
        switchOffset: 1,
      }
    };
  },
  mounted() {
    this.updateAttackList();
    emitter.on('mapChanged',this.handleMapChange);
  },
  beforeDestroy() {
    emitter.off('mapChanged', this.handleMapChange);
  },
  methods:{
    handleMapChange(map){
      this.mapName=map;
      this.updateAttackList();
    },
    async updateAttackList(){
      try {
        // 1. 获取攻击数据
        const attackRes = await this.$authFetch('/api/stat/attack');
        const attackData = await attackRes.json();
        const isWorldMap = this.mapName === 'world';
        const filteredAttacks = (attackData || []).filter(item => 
          isWorldMap ? item.sourceIsDomestic === false : item.sourceIsDomestic === true
        );

        // 2. 获取所有目标IP
        const targetIps = [...new Set(filteredAttacks.map(item => item.targetIp))];

        // 3. 批量查询资产信息
        const assetPromises = targetIps.map(async (ip) => {
          try {
            const assetRes = await this.$authFetch(`/api/asset-list/search?assetIp=${ip}`);
            const assetData = await assetRes.json();
            return { ip, asset: assetData[0] || null };
          } catch (e) {
            return { ip, asset: null };
          }
        });

        const assetResults = await Promise.all(assetPromises);
        const assetMap = new Map();
        assetResults.forEach(({ ip, asset }) => {
          if (asset) {
            assetMap.set(ip, asset);
          }
        });

        // 4. 组合数据
        this.attackList = filteredAttacks.map(item => {
          const asset = assetMap.get(item.targetIp);
          return {
            source: item.sourceLocationName || '未知',
            target: item.targetLocationName || '未知',
            method: item.attackMethod || '未知',
            system: asset ? (asset.systemName || '未知') : '未知',
            organization: asset ? (asset.organizationName || '未知') : '未知'
          };
        });
      } catch (e) {
        console.error('获取攻击数据失败:', e);
        this.attackList = [];
      }
    }
  }
};
</script>

<style scoped>
.attack-carousel-wrap {
  width: 650px;
  height: 120px;
  overflow: hidden;
  margin: auto;
  font-family: sans-serif;
  color: #fff;
  background-color: transparent;
  border-radius: 6px;
  padding: 1px;
}

.attack-list {
  list-style: none;
  padding: 0;
  margin: 0;
}

.attack-item {
  display: flex;
  justify-content: space-between;
  padding: 6px 10px;
  font-size: 14px;
  line-height: 32px;
  border-bottom: 1px dashed #444;
}

.city {
  width: 80px;
  text-align: center;
}

.arrow {
  width: 30px;
  text-align: center;
  color: #00eaff;
}

.method {
  width: 120px;
  color: #ffa500;
  text-align: center;
}

.system {
  width: 120px;
  color: #00ff99;
  text-align: center;
}

.organization {
  width: 100px;
  color: #ff6b6b;
  text-align: center;
}
</style>
