<template>
  <item-wrap :title="'恶意IP攻击列表'">
    <div class="attack-stats-container">
      <div class="chart-wrapper pie-chart">
        <h3 class="chart-title">网络          网络攻击监测状况-月统计饼图
        </h3>
        <div class="chart-container">
          <canvas id="monthlyPieChart"></canvas>
        </div>
      </div>
      <div class="chart-wrapper bar-chart">
        <h3 class="chart-title">
          网络攻击监测状况-近12个月统计柱状图
        </h3>
        <div class="chart-container">
          <canvas id="yearlyBarChart"></canvas>
        </div>
      </div>
    </div>
  </item-wrap>
</template>

<script>
import axios from 'axios';
import Chart from 'chart.js/dist/Chart.min.js';
import ItemWrap from '@/components/item-wrap/item-wrap.vue';

export default {
  components: {
    ItemWrap
  },
  data() {
    return {
      monthlyData: null,
      yearlyData: null,
      chartColors: [
        { bg: 'rgba(0, 247, 255, 0.7)', border: 'rgba(0, 247, 255, 1)' },
        { bg: 'rgba(71, 200, 255, 0.7)', border: 'rgba(71, 200, 255, 1)' },
        { bg: 'rgba(125, 125, 255, 0.7)', border: 'rgba(125, 125, 255, 1)' },
        { bg: 'rgba(255, 125, 125, 0.7)', border: 'rgba(255, 125, 125, 1)' },
        { bg: 'rgba(125, 255, 125, 0.7)', border: 'rgba(125, 255, 125, 1)' }
      ],
      pieChart: null // 存储饼图实例
    };
  },
  mounted() {
    this.fetchAttackData();
  },
  methods: {
    async fetchAttackData() {
      try {
        const monthlyRes = await axios.get('/api/attack/monthly');
        const yearlyRes = await axios.get('/api/attack/yearly');
        
        this.monthlyData = monthlyRes.data.data;
        this.yearlyData = yearlyRes.data.data;
        
        this.initCharts();
      } catch (error) {
        console.error('获取攻击数据失败:', error);
      }
    },
    initCharts() {
      this.initPieChart();
      this.initBarChart();
    },
    initPieChart() {
      const ctx = document.getElementById('monthlyPieChart').getContext('2d');
      const total = this.monthlyData.counts.reduce((sum, count) => sum + count, 0);
      
      // 移除plugins.labels配置，使用Chart.js核心API实现标签
      this.pieChart = new Chart(ctx, {
        type: 'pie',
        data: {
          labels: this.monthlyData.types,
          datasets: [{
            data: this.monthlyData.counts,
            backgroundColor: this.chartColors.map(color => color.bg),
            borderColor: this.chartColors.map(color => color.border),
            borderWidth: 1,
            hoverOffset: 10
          }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          cutout: '0%', // 确保是完整的饼图
          tooltips: {
            callbacks: {
              label: (tooltipItem, data) => {
                const label = data.labels[tooltipItem.index] || '';
                const value = data.datasets[tooltipItem.datasetIndex].data[tooltipItem.index] || 0;
                const percentage = ((value / total) * 100).toFixed(1);
                return `${label}: ${value} (${percentage}%)`;
              }
            }
          },
          plugins: {
            legend: {
              position: 'right',
              labels: {
                color: 'rgba(255, 255, 255, 0.8)',
                font: {
                  size: 12
                },
                padding: 15
              }
            }
          },
          // 添加动画完成后绘制文本的钩子
          animation: {
            onComplete: () => this.drawPercentageLabels()
          }
        }
      });
    },
    
    // 手动绘制百分比标签
    drawPercentageLabels() {
      const chart = this.pieChart;
      const ctx = chart.ctx;
      const total = this.monthlyData.counts.reduce((sum, count) => sum + count, 0);
      const width = chart.width;
      const height = chart.height;
      const centerX = width / 2;
      const centerY = height / 2;
      
      // 计算每个扇形的中心角度和位置
      chart.data.datasets[0].data.forEach((value, index) => {
        const meta = chart.getDatasetMeta(0);
        const arc = meta.data[index];
        
        // 计算扇形中心角度（弧度）
        const startAngle = arc._model.startAngle;
        const endAngle = arc._model.endAngle;
        const midAngle = startAngle + (endAngle - startAngle) / 2;
        
        // 计算标签位置（距离中心的距离为半径的70%）
        const radius = arc._model.outerRadius * 0.7;
        const x = centerX + radius * Math.cos(midAngle);
        const y = centerY + radius * Math.sin(midAngle);
        
        // 计算百分比
        const percentage = ((value / total) * 100).toFixed(1) + '%';
        
        // 设置文本样式
        ctx.save();
        ctx.font = 'bold 12px Arial';
        ctx.fillStyle = 'white';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        
        // 绘制文本
        ctx.fillText(percentage, x, y);
        ctx.restore();
      });
    },
    
    initBarChart() {
      const ctx = document.getElementById('yearlyBarChart').getContext('2d');
      new Chart(ctx, {
        type: 'bar',
        data: {
          labels: this.yearlyData.months,
          datasets: [{
            label: '攻击数量',
            data: this.yearlyData.counts,
            backgroundColor: this.chartColors[0].bg,
            borderColor: this.chartColors[0].border,
            borderWidth: 1
          }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          barPercentage: 0.7,
          categoryPercentage: 0.8,
          scales: {
            y: {
              beginAtZero: true,
              grid: {
                color: 'rgba(255, 255, 255, 0.1)'
              },
              ticks: {
                color: 'rgba(255, 255, 255, 0.7)',
                precision: 0
              }
            },
            x: {
              grid: {
                color: 'rgba(255, 255, 255, 0.1)'
              },
              ticks: {
                color: 'rgba(255, 255, 255, 0.7)'
              }
            }
          },
          plugins: {
            legend: {
              labels: {
                color: 'rgba(255, 255, 255, 0.8)',
                boxWidth: 12,
                font: { size: 12 }
              }
            }
          }
        }
      });
    }
  }
};
</script>

<style scoped>
.attack-stats-container {
  display: flex;
  width: 100%;
  height: 100%;
  gap: 15px;
  padding: 15px;
  box-sizing: border-box;
  background-color: rgba(10, 15, 40, 0.5);
}

.chart-wrapper {
  flex: 1;
  display: flex;
  flex-direction: column;
  height: 100%;
}

.chart-title {
  margin: 0 0 15px 0;
  color: rgba(0, 247, 255, 0.9);
  font-size: 16px;
  text-align: center;
  text-shadow: 0 0 5px rgba(0, 247, 255, 0.5);
  padding-bottom: 5px;
  border-bottom: 1px solid rgba(0, 247, 255, 0.2);
}

.chart-container {
  flex: 1;
  position: relative;
  height: 0;
}

canvas {
  width: 100% !important;
  height: 100% !important;
}

:deep(.lr_titles) {
  height: 100%;
}

:deep(.item_title_content) {
  padding: 0;
  height: 100%;
}
</style>
