<template>
  <div class="vuln-pie-chart">
    <div class="charts">
      <div ref="chart1" class="chart"></div>
      <div ref="chart2" class="chart"></div>
    </div>
  </div>
</template>


<script>
import * as echarts from 'echarts';

export default {
  data() {
    return {
      chart1: null,
      chart2: null,
      currentData: {
        high: 0,
        medium: 0,
        low: 0
      },
      lastData: {
        fixed: 0,
        unfixed: 0
      }
    };
  },
  async mounted() {
    await this.fetchData();
    this.initCharts();
    window.addEventListener('resize', this.resizeCharts);
  },
  beforeDestroy() {
    window.removeEventListener('resize', this.resizeCharts);
  },
  methods: {
    // 获取本季度和上季度的时间范围
    getQuarterRange() {
      const now = new Date();
      const currentYear = now.getFullYear();
      const currentQuarter = Math.floor(now.getMonth() / 3) + 1;
      
      let lastYear = currentYear;
      let lastQuarter = currentQuarter - 1;
      if (lastQuarter === 0) {
        lastYear--;
        lastQuarter = 4;
      }
      
      return {
        current: { year: currentYear, quarter: currentQuarter },
        last: { year: lastYear, quarter: lastQuarter }
      };
    },

    // 判断日期是否在指定季度
    isInQuarter(dateStr, year, quarter) {
      const date = new Date(dateStr);
      const y = date.getFullYear();
      const q = Math.floor(date.getMonth() / 3) + 1;
      return y === year && q === quarter;
    },

    async fetchData() {
      try {
        // 获取季度范围
        const { current, last } = this.getQuarterRange();

        // 获取漏洞统计数据（本季度）
        const vulnRes = await this.$authFetch('/api/stat/vuln-stat');
        const vulnData = await vulnRes.json();
        const currentVulnData = vulnData.filter(item => 
          this.isInQuarter(item.foundTime, current.year, current.quarter)
        );
        if (currentVulnData.length > 0) {
          // 如果有多条记录，取最新的一条
          const latest = currentVulnData.reduce((a, b) => 
            new Date(a.foundTime) > new Date(b.foundTime) ? a : b
          );
          this.currentData = {
            high: latest.highRiskCount || 0,
            medium: latest.mediumRiskCount || 0,
            low: latest.lowRiskCount || 0
          };
        }

        // 获取修复情况数据（上季度）
        const fixRes = await this.$authFetch('/api/stat/vuln-fix');
        const fixData = await fixRes.json();
        const lastFixData = fixData.filter(item => 
          this.isInQuarter(item.statTime, last.year, last.quarter)
        );
        if (lastFixData.length > 0) {
          // 如果有多条记录，取最新的一条
          const latest = lastFixData.reduce((a, b) => 
            new Date(a.statTime) > new Date(b.statTime) ? a : b
          );
          this.lastData = {
            fixed: latest.fixedCount || 0,
            unfixed: latest.unfixedCount || 0
          };
        }
      } catch (e) {
        console.error('获取数据失败:', e);
      }
    },

    resizeCharts() {
      this.chart1 && this.chart1.resize();
      this.chart2 && this.chart2.resize();
    },

    initCharts() {
      this.chart1 = echarts.init(this.$refs.chart1, null, { renderer: 'svg' });
      this.chart2 = echarts.init(this.$refs.chart2, null, { renderer: 'svg' });

      const option1 = {
        title: {
          text: '本季度漏洞分布',
          left: 'center',
          top: -6,
          textStyle: { color: '#fcf003', fontSize: 14 }
        },
        tooltip: {
          trigger: 'item',
          position: 'right',
          formatter: '{b}: {c} 个 ({d}%)'
        },
        legend: {
          orient: 'horizontal',
          left: 'center',
          bottom: 5,
          itemWidth: 12,
          itemHeight: 10,
          itemGap: 5,
          textStyle: {
            fontSize: 11,
            color: '#fff'
          }
        },
        series: [
          {
            name: '漏洞等级',
            type: 'pie',
            radius: ['35%', '60%'],
            startAngle: 100,
            avoidLabelOverlap: false,
            label: {
              show: true,
              formatter: params =>
                  `{value|数量：${params.value}}\n{percent|占比：${params.percent}%}`,
              rich: {
                value: {
                  fontSize: 11,
                  color: '#00ffff'
                },
                percent: {
                  fontSize: 11,
                  color: '#ffcc00'
                }
              }
            },
            labelLine: {
              show: true,
              length: 12,
              length2: 8
            },
            data: [
              { value: this.currentData.high, name: '高危漏洞' },
              { value: this.currentData.medium, name: '中危漏洞' },
              { value: this.currentData.low, name: '低危漏洞' }
            ],
            color: ['#ff4d4f', '#faad14', '#479eef']
          }
        ]
      };

      const option2 = {
        title: {
          text: '上季度漏洞修复情况',
          left: 'center',
          top: -6,
          textStyle: { color: '#00ffa6', fontSize: 14 }
        },
        tooltip: {
          trigger: 'item',
          position: 'left',
          formatter: '{b}: {c} 个 ({d}%)'
        },
        legend: {
          orient: 'horizontal',
          left: 'center',
          bottom: 4,
          itemWidth: 10,
          itemHeight: 7,
          itemGap: 8,
          textStyle: {
            fontSize: 12,
            color: '#fff'
          }
        },
        series: [
          {
            name: '修复情况',
            type: 'pie',
            radius: ['35%', '60%'],
            startAngle: 105,
            avoidLabelOverlap: false,
            label: {
              show: true,
              formatter: params =>
                  `{value|数量：${params.value}}\n{percent|占比：${params.percent}%}`,
              rich: {
                value: {
                  fontSize: 11,
                  color: '#00ffff'
                },
                percent: {
                  fontSize: 11,
                  color: '#ffcc00'
                }
              }
            },
            labelLine: {
              show: true,
              length: 10,
              length2: 10
            },
            data: [
              { value: this.lastData.fixed, name: '已修复' },
              { value: this.lastData.unfixed, name: '未修复' }
            ],
            color: ['#52c41a', '#00ffd9']
          }
        ]
      };

      this.chart1.setOption(option1);
      this.chart2.setOption(option2);
    }
  }
};
</script>


<style scoped>
.vuln-pie-chart {
  max-width: 820px;
  margin: auto;
  max-height: 255px;
  font-family: Arial, sans-serif;
}

.charts {
  display: flex;
  justify-content: space-around;
  flex-wrap: nowrap;
  gap: 20px;
  max-height: 255px;
}

.chart {
  width: 48%;
  height: 220px;
  padding: 2px;
  overflow: visible;
  box-sizing: content-box;
}
</style>

