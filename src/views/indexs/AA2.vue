<template>
  <div class="center_bottom">
    <div class="switch-button">
      <button :class="{active: areaType === 'pie'}" @click="switchArea('pie')">
        网络异常行为
      </button>
      <button :class="{active: areaType === 'bar'}" @click="switchArea('bar')">
        外联主机统计
      </button>

      <div class="charts">
        <!-- 用 v-show 替代 v-if，避免 DOM 被销毁 -->
        <div v-show="areaType === 'pie'" class="pie-wrapper">
          <div ref="chart1" class="chart"></div>
          <div ref="chart2" class="chart"></div>
        </div>
        <div v-show="areaType === 'bar'" ref="barChart" class="barchart"></div>
      </div>
    </div>
  </div>
</template>

<script>
import * as echarts from 'echarts';

export default {
  data() {
    return {
      areaType: 'bar',
      chart1Inst: null,
      chart2Inst: null,
      barChartInst: null,
      abnormalData: {
        outbound: 0,
        outsideToInside: 0,
        lateralMove: 0,
        other: 0
      },
      ipData: {
        domestic: [],
        overseas: []
      },
      quarterData: [0, 0, 0, 0] // 四个季度的数据
    };
  },
  async mounted() {
    await this.fetchData();
    this.initCharts();
    this.renderCharts();
    window.addEventListener('resize', this.resizeCharts);
  },
  beforeDestroy() {
    window.removeEventListener('resize', this.resizeCharts);
  },
  methods: {
    // 获取最新数据
    getLatestData(data) {
      return data.reduce((latest, item) => {
        if (!latest || new Date(item.statTime) > new Date(latest.statTime)) {
          return item;
        }
        return latest;
      }, null);
    },

    // 获取季度索引（0-3）和年份
    getQuarterInfo(dateStr) {
      const date = new Date(dateStr);
      const year = date.getFullYear();
      const quarter = Math.floor(date.getMonth() / 3);
      return { year, quarter };
    },

    // 获取当前季度和上季度的范围
    getQuarterRange() {
      const now = new Date();
      const currentYear = now.getFullYear();
      const currentQuarter = Math.floor(now.getMonth() / 3);
      
      // 计算上季度的年份和季度
      let lastYear = currentYear;
      let lastQuarter = currentQuarter - 1;
      if (lastQuarter < 0) {
        lastYear--;
        lastQuarter = 3;
      }
      
      return {
        current: { year: currentYear, quarter: currentQuarter },
        last: { year: lastYear, quarter: lastQuarter }
      };
    },

    async fetchData() {
      try {
        // 获取异常事件数据
        const abnormalRes = await this.$authFetch('/api/stat/abnormal');
        const abnormalData = await abnormalRes.json();
        const latestAbnormal = this.getLatestData(abnormalData);
        if (latestAbnormal) {
          this.abnormalData = {
            outbound: latestAbnormal.outbound || 0,
            outsideToInside: latestAbnormal.outsideToInside || 0,
            lateralMove: latestAbnormal.lateralMove || 0,
            other: latestAbnormal.other || 0
          };
        }

        // 获取IP地理分布数据
        const ipRes = await this.$authFetch('/api/stat/outbound-ip');
        const ipData = await ipRes.json();
        
        // 按国内外分组
        this.ipData = ipData.reduce((acc, item) => {
          if (item.isDomestic) {
            acc.domestic.push({
              name: item.location,
              value: item.ipCount
            });
          } else {
            acc.overseas.push({
              name: item.location,
              value: item.ipCount
            });
          }
          return acc;
        }, { domestic: [], overseas: [] });

        // 计算四个季度的数据
        const { current, last } = this.getQuarterRange();
        const quarterSums = [0, 0, 0, 0]; // 初始化四个季度的数据

        ipData.forEach(item => {
          const { year, quarter } = this.getQuarterInfo(item.statTime);
          // 如果是当前年份的数据
          if (year === current.year) {
            quarterSums[quarter] += item.ipCount;
          }
          // 如果是去年第四季度的数据（当前是第一季度时）
          else if (year === last.year && quarter === 3 && current.quarter === 0) {
            quarterSums[3] += item.ipCount;
          }
        });

        this.quarterData = quarterSums;

      } catch (e) {
        console.error('获取数据失败:', e);
      }
    },

    switchArea(type) {
      this.areaType = type;
      this.$nextTick(() => {
        this.renderCharts();
      });
    },

    initCharts() {
      if (!this.chart1Inst && this.$refs.chart1) {
        this.chart1Inst = echarts.init(this.$refs.chart1);
      }
      if (!this.chart2Inst && this.$refs.chart2) {
        this.chart2Inst = echarts.init(this.$refs.chart2);
      }
      if (!this.barChartInst && this.$refs.barChart) {
        this.barChartInst = echarts.init(this.$refs.barChart);
      }
    },

    renderCharts() {
      this.initCharts();

      if (this.areaType === 'pie') {
        const pieData = [
          { name: '外联', value: this.abnormalData.outbound },
          { name: '外对内', value: this.abnormalData.outsideToInside },
          { name: '横向', value: this.abnormalData.lateralMove },
          { name: '其他', value: this.abnormalData.other }
        ];
        const total = pieData.reduce((sum, item) => sum + item.value, 0);

        const pieOption1 = {
          title: {
            text: '网络异常事件统计',
            left: 'center',
            top:'-2px',
            textStyle: {
              color: '#fcea35',
              fontSize: 14,
              padding: [0,0,0,0]
            }
          },
          tooltip: {
            trigger: 'item',
            formatter: '{b}: {c} ({d}%)'
          },
          legend: {
            top: 150,
            textStyle: {
              color: '#fff',
              fontSize: 12
            },
          },
          series: [{
            type: 'pie',
            radius: ['35%', '60%'],
            avoidLabelOverlap: false,
            label: {
              show: true,
              position: 'center',
              formatter: () => ` ${total}\n异常事件`,
              fontSize: 14,
              fontWeight: 'bold',
              color: '#fffafa'
            },
            emphasis: {
              label: {
                show: true,
                fontSize: 14,
                fontWeight: 'bold'
              }
            },
            labelLine: {
              show: false
            },
            data: pieData
          },
          {
            name: '外层标签',
            type: 'pie',
            radius: ['40%', '60%'],
            label: {
              show: true,
              position: 'outside',
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
              },
              color: '#fff',
              fontSize: 12
            },
            labelLine: {
              show: true,
              length: 10,
              length2: 10
            },
            data: pieData
          }]
        };

        // 计算国内外总数和占比
        const domesticTotal = this.ipData.domestic.reduce((sum, item) => sum + item.value, 0);
        const overseasTotal = this.ipData.overseas.reduce((sum, item) => sum + item.value, 0);
        const total2 = domesticTotal + overseasTotal;
        const domesticRatio = (domesticTotal / total2 * 100).toFixed(2);
        const overseasRatio = (overseasTotal / total2 * 100).toFixed(2);

        const softColors = [
          '#7FB3D5', '#76D7C4', '#A9DFBF', '#F7DC6F',
          '#F0B27A', '#D7BDE2', '#F5B7B1', '#AAB7B8',
          '#5499C7', '#48C9B0', '#52BE80', '#F4D03F'
        ];

        const pieOption2 = {
          title: {
            text: '外联IP地理分布统计',
            left: 'center',
            textStyle: {
              color: '#77fc35',
              fontSize: 14
            }
          },
          tooltip: {
            trigger: 'item',
            formatter: function (info) {
              return `${info.name}: ${info.value} (${info.percent}%)`;
            }
          },
          series: {
            type: 'sunburst',
            radius: ['0%', '65%'],
            data: [
              {
                name: '国内',
                value: domesticTotal,
                children: this.ipData.domestic.map((city, index) => ({
                  ...city,
                  itemStyle: {
                    color: softColors[index % softColors.length]
                  }
                }))
              },
              {
                name: '国外',
                value: overseasTotal,
                children: this.ipData.overseas.map((city, index) => ({
                  ...city,
                  itemStyle: {
                    color: softColors[(index + 6) % softColors.length]
                  }
                }))
              }
            ],
            label: {
              rotate: 0,
              color: 'rgba(0,0,0,0.89)',
              fontSize: 9
            },
            itemStyle: {
              borderColor: '#000',
              borderWidth: 1
            }
          }
        };

        if (this.chart1Inst) {
          this.chart1Inst.setOption(pieOption1);
          this.chart1Inst.resize();
        }
        if (this.chart2Inst) {
          this.chart2Inst.setOption(pieOption2);
          this.chart2Inst.resize();
        }

      } else if (this.areaType === 'bar') {
        const barOption = {
          title: {
            text: '四季度外联主机统计',
            left: 'center',
            top: 25,
            textStyle: {
              color: '#fcea35',
              fontSize: 16,
              padding: [0, 0, -10, 0]
            }
          },
          xAxis: {
            type: 'category',
            data: ['4月1日\n-6月30日','7月1日\n-9月30日','10月1日\n-12月31日', '1月1日\n-3月31日'],
            axisLabel: {
              color: '#fff',
              fontSize: 12
            }
          },
          yAxis: {
            type: 'value'
          },
          series: [{
            data: this.quarterData,
            type: 'bar',
            label: {
              show: true,
              position: 'top',
              color: '#fcf003',
              fontSize: 14
            },
          }],
          axisLabel: {
            color: '#fff',
            fontSize: 9
          }
        };

        if (this.barChartInst) {
          this.barChartInst.setOption(barOption);
          this.barChartInst.resize();
        }
      }
    },
    resizeCharts() {
      this.chart1Inst && this.chart1Inst.resize();
      this.chart2Inst && this.chart2Inst.resize();
      this.barChartInst && this.barChartInst.resize();
    }
  }
};
</script>

<style scoped>
.center_bottom {
  padding: 0px;
}
.switch-button {
  text-align: center;
  margin-bottom: 0px;
}
button {
  margin: 0 8px;
  padding: 3px 14px;
  border: 1px solid #1890ff;
  background-color: transparent;
  color: #1890ff;
  border-radius: 4px;
  cursor: pointer;
}
button.active {
  background-color: #1890ff;
  color: white;
}
.charts {
  display: flex;
  justify-content: center;
  flex-wrap: wrap;
}
.pie-wrapper {
  display: flex;
  justify-content: space-around;
  width: 100%;
  height: 225px;
}
.chart {
  width: 300px;
  height: 180px;
  margin: 0px;
}
.barchart{
  width: 100%;
  height: 210px;
  margin: -10px;
}
</style>
