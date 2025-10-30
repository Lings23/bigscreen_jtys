<template>
    <div class="wrap">
      <!-- 左侧仪表盘 -->
      <div ref="chart" class="chart"></div>
  
      <!-- 右侧信息面板 -->
      <div class="info-panel">
        <!-- 单位选择下拉框 -->
        <select v-model="selectedUnit" @change="handleUnitChange" class="dropdown">
          <option v-for="unit in units" :key="unit.id" :value="unit.id">
            {{ unit.name }}
          </option>
        </select>
  
        <!-- 漏洞处置统计信息 -->
        <div class="stats">
          <div class="stat-item">
            <span class="stat-label">统计处置的漏洞数量：</span>
            <span class="stat-value">{{ currentUnitStats.vulnerabilityCount }}</span>
          </div>
          <div class="stat-item">
            <span class="stat-label">平均响应时长：</span>
            <span class="stat-value">{{ currentUnitStats.avgResponseTime }}</span>
          </div>
          <div class="stat-item">
            <span class="stat-label">同比上月效率提升：</span>
            <span class="stat-value" :class="{ 'positive': currentUnitStats.efficiencyImprovement > 0, 'negative': currentUnitStats.efficiencyImprovement < 0 }">{{ currentUnitStats.efficiencyImprovement > 0 ? '+' : '' }}{{ currentUnitStats.efficiencyImprovement }}%</span>
          </div>
        </div>
      </div>
    </div>
  </template>
  
  <script>
  import * as echarts from 'echarts';
  import { currentGET } from '@/api';
  
  export default {
    name: 'EfficiencyAnalysis',
    data() {
      return {
        chart: null,
        option: null,
        selectedUnit: 'all',
        units: [
          { id: 'all', name: '全部单位' }
        ],
        unitStatsData: {
          all: { 
            score: 0, 
            vulnerabilityCount: 0, 
            avgResponseTime: '0小时', 
            efficiencyImprovement: 0 
          }
        },
        loading: false
      };
    },
    computed: {
      currentUnitStats() {
        return this.unitStatsData[this.selectedUnit];
      }
    },
    methods: {
      // 获取单位列表
      async fetchUnits() {
        try {
          const res = await currentGET('efficiency', { type: 'units' });
          if (res && res.code === 200 && res.data) {
            this.units = [
              { id: 'all', name: '全部单位' },
              ...res.data
            ];
          }
        } catch (error) {
          console.error('获取单位列表失败:', error);
        }
      },
      // 获取效率统计数据
      async fetchEfficiencyData(unitId = 'all') {
        try {
          this.loading = true;
          const res = await currentGET('efficiency', { unitId });
          if (res && res.code === 200 && res.data) {
            // 更新单位统计数据
            this.$set(this.unitStatsData, unitId, {
              score: res.data.score || 0,
              vulnerabilityCount: res.data.vulnerabilityCount || 0,
              avgResponseTime: res.data.avgResponseTime || '0小时',
              efficiencyImprovement: res.data.efficiencyImprovement || 0
            });
            // 更新图表
            this.renderChart(res.data.score || 0);
          }
        } catch (error) {
          console.error('获取效率数据失败:', error);
        } finally {
          this.loading = false;
        }
      },
      initCharts() {
        this.chart = echarts.init(this.$refs.chart, null, { renderer: 'svg' });
        this.renderChart(this.currentUnitStats.score);
      },
      renderChart(score) {
        this.option = {
          title: {
            text: '半年内漏洞处置效率评分',
            left: 'center',
            top: -2,
            textStyle: {
              color: '#ff035b',
              fontSize: 20,
              fontWeight: 'bold'
            }
          },
          series: [{
            type: 'gauge',
            axisLine: {
              lineStyle: {
                width: 8,
                color: [
                  [0.3, 'red'],
                  [0.7, '#FFD700'],
                  [1, 'green']
                ]
              }
            },
            pointer: { itemStyle: { color: 'auto' } },
            axisTick: { distance: -8, length: 8, lineStyle: { width: 3, color: '#fff' } },
            splitLine: { distance: -10, length: 8, lineStyle: { width: 2, color: '#fff' } },
            axisLabel: { distance: 20, fontSize: 12, color: '#fff' },
            detail: { valueAnimation: true, fontSize: 20, color: '#fff' },
            data: [{ value: score }]
          }]
        };
        this.chart.setOption(this.option);
      },
      handleUnitChange() {
        // 切换单位时，如果该单位数据不存在，则从后端获取
        if (!this.unitStatsData[this.selectedUnit]) {
          this.fetchEfficiencyData(this.selectedUnit);
        } else {
          const newScore = this.currentUnitStats.score;
          this.renderChart(newScore);
        }
      }
    },
    mounted() {
      this.initCharts();
      // 初始化时获取单位列表和默认数据
      this.fetchUnits();
      this.fetchEfficiencyData('all');
    }
  };
  </script>
  
  <style scoped>
  .wrap {
    display: flex;
    align-items: flex-start;
    justify-content: space-between;
    color: #fff;
    width: 100%;
    height: 100%;
    padding: 0px;
    box-sizing: border-box;
    overflow: hidden;
  }
  
  .chart {
    width: 300px;
    height: 220px;

  }
  
  .info-panel {
    flex: 1;
    margin-left: 20px;
  }
  
  .dropdown {
    margin-top: 2px;
    width: 150px;
    padding: 6px;
    margin-bottom: 4px;
    background-color: rgba(255, 255, 255, 0.1);
    color: #fff;
    border: 1px solid rgba(255, 255, 255, 0.3);
    border-radius: 4px;
    font-size: 14px;
    cursor: pointer;
  }
  
  .dropdown option {
    background-color: #1a1a2e;
    color: #fff;
  }
  
  .stats {
    display: flex;
    flex-direction: column;
    gap: 8px;
  }
  
  .stat-item {
    padding: 10px 15px;
    border: 1px solid rgba(236, 245, 246, 0.13);
    border-radius: 8px;
    background: linear-gradient(to right, rgb(2, 14, 255), rgba(0, 212, 255, 0));
    transition: all 0.3s ease;
  }
  
  .stat-item:hover {
    border-color: rgba(0, 212, 255, 0.6);
    background: linear-gradient(to right, rgba(0, 212, 255, 0.25), rgba(0, 212, 255, 0));
    transform: translateX(5px);
  }
  
  .stat-label {
    font-size: 15px;
    color: rgba(255, 255, 255, 0.85);
    font-weight: 450;
  }
  
  .stat-value {
    font-weight: bold;
    font-size: 20px;
    margin-left: 10px;
    color: #00d4ff;
    text-shadow: 0 0 10px rgba(0, 212, 255, 0.5);
  }
  
  .stat-value.positive {
    color: #00ff88;
    text-shadow: 0 0 10px rgba(0, 255, 136, 0.5);
  }
  
  .stat-value.negative {
    color: #ff4444;
    text-shadow: 0 0 10px rgba(255, 68, 68, 0.5);
  }
  </style>
  