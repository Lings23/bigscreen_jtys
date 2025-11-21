<template>
  <div class="attack-stats-container">
    <div class="chart-wrapper pie-chart">
      <h3 class="chart-title">网络攻击监测状况-月统计饼图</h3>
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
</template>
<script>
import axios from 'axios';
import Chart from 'chart.js/dist/Chart.min.js';
export default {
  data() {
    return {
      attackTypes: ['恶意代码攻击', '漏洞攻击', '拒绝服务攻击', '扫描探测', '其他类型攻击'],
      yearlyData: null,
      currentMonthData: null, // 最新一个月数据（饼图用）
      chartColors: [
        { bg: 'rgba(0, 247, 255, 0.7)', border: 'rgba(0, 247, 255, 1)' },
        { bg: 'rgba(71, 200, 255, 0.7)', border: 'rgba(71, 200, 255, 1)' },
        { bg: 'rgba(125, 125, 255, 0.7)', border: 'rgba(125, 125, 255, 1)' },
        { bg: 'rgba(255, 125, 125, 0.7)', border: 'rgba(255, 125, 125, 1)' },
        { bg: 'rgba(125, 255, 125, 0.7)', border: 'rgba(125, 255, 125, 1)' }
      ],
      pieChart: null // 保留饼图实例存储
    };
  },
  mounted() {
    this.fetchAttackData();
  },
  methods: {
    async fetchAttackData() {
      try {
        const yearlyRes = await axios.get('/api/attack/yearly');
        this.yearlyData = yearlyRes.data.data;
        
        // 提取最新一个月数据（数组最后一项）
        this.currentMonthData = this.attackTypes.map((_, index) => {
          return this.yearlyData.datasets[index].data[this.yearlyData.datasets[index].data.length - 1];
        });
        
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
      const total = this.currentMonthData.reduce((sum, count) => sum + count, 0);
      
      this.pieChart = new Chart(ctx, {
        type: 'pie',
        data: {
          labels: this.attackTypes,
          datasets: [{
            data: this.currentMonthData,
            backgroundColor: this.chartColors.map(color => color.bg),
            borderColor: this.chartColors.map(color => color.border),
            borderWidth: 1,
            hoverOffset: 10
          }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          cutout: '0%', // 保持完整饼图
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
                font: { size: 12 },
                padding: 15
              }
            }
          },
          // 保留原有百分比绘制钩子
          animation: {
            onComplete: () => this.drawPercentageLabels()
          }
        }
      });
    },
    // 保留原有手动绘制百分比标签逻辑
    drawPercentageLabels() {
      const chart = this.pieChart;
      const ctx = chart.ctx;
      const total = this.currentMonthData.reduce((sum, count) => sum + count, 0);
      const width = chart.width;
      const height = chart.height;
      const centerX = width / 2;
      const centerY = height / 2;
      
      chart.data.datasets[0].data.forEach((value, index) => {
        const meta = chart.getDatasetMeta(0);
        const arc = meta.data[index];
        
        const startAngle = arc._model.startAngle;
        const endAngle = arc._model.endAngle;
        const midAngle = startAngle + (endAngle - startAngle) / 2;
        
        const radius = arc._model.outerRadius * 0.7;
        const x = centerX + radius * Math.cos(midAngle);
        const y = centerY + radius * Math.sin(midAngle);
        
        const percentage = ((value / total) * 100).toFixed(1) + '%';
        
        ctx.save();
        ctx.font = 'bold 12px Arial';
        ctx.fillStyle = 'white';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(percentage, x, y);
        ctx.restore();
      });
    },
    initBarChart() {
      const ctx = document.getElementById('yearlyBarChart').getContext('2d');
      
      // 构建堆叠数据集（单柱多色上下堆叠）
      const datasets = this.attackTypes.map((type, index) => ({
        label: type,
        data: this.yearlyData.datasets[index].data,
        backgroundColor: this.chartColors[index].bg,
        borderColor: this.chartColors[index].border,
        borderWidth: 1,
        stack: '攻击类型' // 同一堆叠组确保单柱堆叠
      }));
      
      new Chart(ctx, {
        type: 'bar',
        data: {
          labels: this.yearlyData.months, // 近12个月（仅显示月份）
          datasets: datasets
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          barPercentage: 0.7,
          categoryPercentage: 0.8,
          scales: {
            y: {
              beginAtZero: true,
              stacked: true, // 启用Y轴堆叠（核心）
              grid: { color: 'rgba(255, 255, 255, 0.1)' },
              ticks: { color: 'rgba(255, 255, 255, 0.7)', precision: 0 }
            },
            x: {
              stacked: true, // 启用X轴堆叠（核心）
              grid: { color: 'rgba(255, 255, 255, 0.1)' },
              ticks: { color: 'rgba(255, 255, 255, 0.7)' }
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
/* 完全保留原有样式，不做任何修改 */
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