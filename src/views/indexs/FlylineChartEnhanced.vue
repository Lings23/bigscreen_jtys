<template>
  <div class="centermap">
    <dv-border-box-13>
    <div class="maptitle">
      <div class="zuo"></div>
      <span class="titletext">实时攻击监测</span>
      <div class="you"></div>
    </div>
  <div class="mapwrap">
    <!-- 假设你有一个封装好的 flyline-chart-enhanced 组件 -->

    <flyline-chart-enhanced
        v-if="mapReady"
        :config="config"
        @change-map="handleMapChange"
        @dblclick-blank="handleBackToWorld"
        style="width: 100%; height: 100%" />
    <!-- 左下角轮播解释区域 -->
    <transition name="fade" >
      <div v-if="visibleCarousel.length" class="map-carousel" @mouseenter="pauseCarousel" @mouseleave="resumeCarousel">
        <div v-for="(item, index) in visibleCarousel" :key="index">{{ item }}</div>
      </div>
    </transition>
  </div>
    </dv-border-box-13>
  </div>
</template>

<script>
import * as echarts from 'echarts'
import FlylineChartEnhanced from '@/components/flyline-chart-enhanced.vue'

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
    //启动定时器，每两分钟刷新飞线
    this.flylineRefreshInterval = setInterval(() => {
      this.refreshFlyline();
    }, 3000);
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
      }, 3000);
    },
    async fetchFlylineData(mapName) {
      try {
        // 判断是世界地图还是中国地图
        const isWorldMap = mapName === 'world';

        // 根据地图类型选择调用接口（从你 Spring Boot 后端）
        const url = isWorldMap
            ? 'http://localhost:9991/foreign/map/findAll'
            : 'http://localhost:9991/domestic/threats/topn';

        const res = await fetch(url);
        const data = await res.json();

        const citySet = new Set();
        const points = [];
        const lines = [];
        const descriptions = [];
        console.log('每条飞线原始数据：', data);

        data.forEach(item => {
          const fromCity = item.domesticAttackIpCity || item.foreignAttackIpCity; // 适配字段名
          const toCity = item.innerIpCity || item.targetIpCity;

          const fromCoord = [item.domesticAttackIpLon || item.foreignAttackIpLon, item.domesticAttackIpLat || item.foreignAttackIpLat];
          const toCoord = [item.innerIpLon || item.targetIpLon, item.innerIpLat || item.targetIpLat];

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
            const desc = `攻击源: ${fromCity} ➜ 目标: ${toCity} ｜方式: ${item.source || '未知'} ｜系统: ${item.systemName || '未知'}`;
            descriptions.push(desc);
          }
        });
        this.carouselInfoList=descriptions;
        this.resetCarousel();
        return { points, lines };

      } catch (error) {
        console.error('飞线数据加载失败:', error);
        return { points: [], lines: [] };
      }
    },
    async refreshFlyline(){
      const {points, lines} = await this.fetchFlylineData(this.config.map.mapName)
      this.config.points = points
      this.config.lines = lines
    },

    async loadMap(mapName) {
      this.mapReady = false
      try {
        const res = await fetch(`/map/${mapName}.json`)
        if (!res.ok) throw new Error('地图加载失败: ' + res.status)
        const geoJson = await res.json()

        echarts.registerMap(mapName, geoJson)
        this.config.map.mapName = mapName



        this.mapReady = true
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
  margin-bottom: 30px;
}
.maptitle {
  height: 60px;
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
  height: 548px;
  width: 100%;
  box-sizing: border-box;
  position: relative;
  overflow: hidden;
  padding-top: 20px;
  padding-right: 20px;
  padding-left: 20px;
  padding-bottom: 20px;
}
.flyine-chart-enhanced {
  width: 100%;
  height: 100%;
  box-sizing: border-box;
}
/* 轮播容器固定在左下角 */
.map-carousel {
  position: absolute;
  bottom: 10px;
  left: 10px;
  max-width: 400px;
  background-color: rgba(0, 0, 0, 0.6);
  color: #f35c5c;
  font-size: 14px;
  padding: 10px 14px;
  border-radius: 8px;
  line-height: 1.5;
}

.fade-enter-active, .fade-leave-active {
  transition: opacity 0.8s;
}
.fade-enter, .fade-leave-to {
  opacity: 0;
}



/* 可按需添加样式 */
</style>
