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
        const res = await this.$authFetch('/api/stat/attack');
        const data = await res.json();
        const isWorldMap = this.mapName === 'world';
        this.attackList = (data || []).filter(item => isWorldMap ? item.sourceIsDomestic === false : item.sourceIsDomestic === true)
          .map(item => ({
            source: item.sourceLocationName,
            target: item.targetLocationName,
            method: item.attackMethod,
            system: item.targetSystem
          }));
      } catch (e) {
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
  flex: 1;
  color: #00ff99;
  text-align: left;
  padding-left: 10px;
}
</style>
