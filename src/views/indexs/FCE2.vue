<template>
  <div class="centermap">
    <dv-border-box-13>
      <div class="maptitle">
        <div class="zuo"></div>
        <span class="titletext">实时攻击监测</span>
        <div class="you"></div>
      </div>

      <!-- 地图部分 -->
      <div class="mapwrap">
        <flyline-chart-enhanced
            v-if="mapReady"
            :config="config"
            @change-map="handleMapChange"
            @dblclick-blank="handleBackToWorld"
            style="width: 100%; height: 100%" />
      </div>
    </dv-border-box-13>
  </div>
</template>


<script>
import * as echarts from 'echarts'
import FlylineChartEnhanced from '@/components/flyline-chart-enhanced.vue'
import emitter from '@/utils/eventBus.js'
import worldMapData from '@/assets/map/world.json'
import chinaMapData from '@/assets/map/china.json'

export default {
  name: 'FlylineWorldMapEnhanced',
  components: {
    FlylineChartEnhanced
  },
  data() {
    return {
      mapReady: false, // 地图是否准备好
      flylineRefreshInterval: null, // 用于定时刷新飞线
      config: {
        map: {
          mapName: 'world' // 需要先注册 world 地图
        },
        points: [],
        lines: [],
        icon: {
          show: true,
          color: '#00ffff'
        },
        line: {
          color: '#40ff00',
          width: 1,
          orbitColor: '#ff0000',
          duration: [10, 20],
          radius: 2
        },
        halo: {
          show: true,
          duration: [20, 30],
          radius: 120,
          color: '#ff0000'
        },
        text: {
          show: false,
          color: '#ffffff'
        }
      },
      carouselIndex: 0,
      currentInfoIndex: 0,
      carouselInfoList: [],
      carouselTimer: null,
      currentCarouselText: '',
      visibleCarousel: [],
    }
  },
  mounted() {
    this.loadMap('world')
    this.startFlylineAutoRefresh();
    this.resetCarousel(); // 初始化轮播
  },
  beforeDestroy() {
    if (this.flylineRefreshInterval) {
      clearInterval(this.flylineRefreshInterval)
    }
    if(this.carouselTimer){
      clearInterval(this.carouselTimer);
    }
  },
  methods: {
    startFlylineAutoRefresh() {
      if (this.flylineRefreshInterval) {
        clearInterval(this.flylineRefreshInterval);
      }
      this.flylineRefreshInterval = setInterval(() => {
        this.refreshFlyline();
      }, 30000); // 30 秒刷新一次
    },
    pauseCarousel() {
      if (this.carouselTimer) {
        clearInterval(this.carouselTimer);
        this.carouselTimer = null;
      }
    },
    resumeCarousel() {
      if (!this.carouselTimer && this.carouselInfoList.length > 0) {
        this.carouselTimer = setInterval(() => {
          this.carouselIndex = (this.carouselIndex + 1) % this.carouselInfoList.length;
          const next = [];
          for (let i = 0; i < 3; i++) {
            next.push(this.carouselInfoList[(this.carouselIndex + i) % this.carouselInfoList.length]);
          }
          this.visibleCarousel = next;
        }, 3000);
      }
    },
    resetCarousel() {
      clearInterval(this.carouselTimer);
      this.carouselIndex = 0;
      this.visibleCarousel = this.carouselInfoList.slice(0, 3);
      this.carouselTimer = setInterval(() => {
        this.carouselIndex = (this.carouselIndex + 1) % this.carouselInfoList.length;
        const next = [];
        for (let i = 0; i < 3; i++) {
          next.push(this.carouselInfoList[(this.carouselIndex + i) % this.carouselInfoList.length]);
        }
        this.visibleCarousel = next;
      }, 12000);
    },
    async fetchFlylineData(mapName) {
      try {
        const res = await this.$authFetch('/api/stat/attack/all');
        const data = await res.json();
        // 根据地图类型筛选国内/国外
        const isWorldMap = mapName === 'world';
        const filtered = data.filter(item => isWorldMap ? item.sourceIsDomestic === false : item.sourceIsDomestic === true);
        const citySet = new Set();
        const points = [];
        const lines = [];
        const descriptions = [];
        filtered.forEach(item => {
          const fromCity = item.sourceLocationName;
          const toCity = item.targetLocationName;
          const fromCoord = [item.sourceLng, item.sourceLat];
          const toCoord = [item.targetLng, item.targetLat];
          // 起点
          if (fromCity && !citySet.has(fromCity)) {
            citySet.add(fromCity);
            points.push({ name: fromCity, coordinate: fromCoord });
          }
          // 终点
          if (toCity && !citySet.has(toCity)) {
            citySet.add(toCity);
            points.push({ name: toCity, coordinate: toCoord });
          }
          if (fromCity && toCity) {
            lines.push({ source: fromCity, target: toCity });
            const desc = `攻击源: ${fromCity} ➜ 目标: ${toCity} ｜方式: ${item.attackMethod || '未知'} ｜系统: ${item.targetSystem || '未知'}`;
            descriptions.push(desc);
          }
        });
        this.carouselInfoList = descriptions;
        this.resetCarousel();
        return { points, lines };
      } catch (error) {
        return { points: [], lines: [] };
      }
    },
    async refreshFlyline(){
      const {points, lines} = await this.fetchFlylineData(this.config.map.mapName)
      this.config.points = points
      this.config.lines = lines
    },
    async loadMap(mapName) {
      emitter.emit('mapChanged', mapName)
      this.mapReady = false
      try {
        // 使用 import 的地图数据
        const geoJson = mapName === 'world' ? worldMapData : chinaMapData
        echarts.registerMap(mapName, geoJson)
        this.config.map.mapName = mapName
        this.mapReady = true
        this.refreshFlyline();
        this.startFlylineAutoRefresh();
      } catch (err) {
        console.error(`地图 ${mapName} 加载失败:`, err)
      }
    },
    handleBackToWorld() {
      if (this.config.map.mapName !== 'world') {
        this.loadMap('world')
      }
    },
    handleMapChange(mapName) {
      this.loadMap(mapName)
    }
  }
}
</script>

<style scoped>
.centermap {

}
.maptitle {
  height: 40px;
  display: flex;
  justify-content: center;
  padding-top: 10px;
  box-sizing: border-box;
}
.titletext {
  font-size: 28px;
  font-weight: 900;
  letter-spacing: 6px;
  background: linear-gradient(
      92deg,
      #0072ff 0%,
      #00eaff 48.8525390625%,
      #01aaff 100%
  );
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  margin: 0 10px;
}

.zuo,
.you {
  background-size: 100% 100%;
  width: 29px;
  height: 20px;
  margin-top: 8px;
}

.zuo {
  background: url("../../assets/img/xiezuo.png") no-repeat;
}

.you {
  background: url("../../assets/img/xieyou.png") no-repeat;
}
.mapwrap {
  height: 500px;
  width: 100%;
  box-sizing: border-box;
  position: relative;
  overflow: hidden;
  padding-top: 20px;
  padding-right: 20px;
  padding-left: 20px;
  padding-bottom: 10px;
}
.flyine-chart-enhanced {
  width: 100%;
  height: 100%;
  box-sizing: border-box;
}






/* 可按需添加样式 */
</style>
