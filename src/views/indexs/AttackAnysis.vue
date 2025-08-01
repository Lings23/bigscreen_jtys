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
      areaType: 'pie',
      chart1Inst: null,
      chart2Inst: null,
      barChartInst: null,
    };
  },
  mounted() {
    this.initCharts();
    this.renderCharts();
    window.addEventListener('resize', this.resizeCharts);
  },
  beforeDestroy() {
    window.removeEventListener('resize', this.resizeCharts);
  },
  methods: {
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
          { name: '外联', value: 20806 },
          { name: '外对内', value: 46809 },
          { name: '其他', value: 5003 },
          { name: '横向', value: 2169 }
        ];
        const total = pieData.reduce((sum, item) => sum + item.value, 0);

        const pieOption1 = {
          title: {
            text: '网络异常事件统计',
            left: 'center',
            //字体颜色黄色
            textStyle: {
              color: '#fcea35',
              fontSize: 16
            }
          },
          tooltip: {
            trigger: 'item',
            formatter: '{b}: {c} ({d}%)'
          },
          legend: {
            top: 'bottom',
            //字体颜色白色
            textStyle: {
              color: '#fff',
              fontSize: 12
            },
          },
          series: [{
            type: 'pie',
            radius: ['40%', '70%'],
            avoidLabelOverlap: false,
            label: {
              show: true,
              position: 'center',
              formatter: () => ` ${total}\n异常事件`,
              fontSize: 16,
              fontWeight: 'bold',
              color: '#fffafa'
            },
            emphasis: {
              label: {
                show: true,
                fontSize: 16,
                fontWeight: 'bold'
              }
            },
            labelLine: {
              show: false
            },
            data: pieData
          }]
        };

        const realData = {
          domestic: 99.83,
          overseas: 0.17,
          cities: {
            domestic: [
              { name: '北京市', value: 75.5 },
              { name: '黑龙江省', value: 0.12 },
              { name: '江苏省', value: 0.03 },
              { name: '陕西省', value: 0.01 },
              { name: '其他', value: 24.17 }
            ],
            overseas: [
              { name: '美国', value: 0.17 }
            ]
          }
        };

        const domesticRatio = 90;
        const overseasRatio = 10;

// 放大系数，让黑龙江、江苏、陕西更明显
        const scaleFactor = 10;

// 处理国内城市数据，放大特定省份value
        const adjustedDomesticCities = realData.cities.domestic.map(city => {
          if (['黑龙江省', '江苏省', '陕西省'].includes(city.name)) {
            return {
              name: city.name,
              value: city.value * scaleFactor,  // 放大
              realValue: city.value,
              realPercent: city.value.toFixed(2)
            };
          } else {
            return {
              name: city.name,
              value: city.value,
              realValue: city.value,
              realPercent: city.value.toFixed(2)
            };
          }
        });

// 计算放大后国内总和，用于归一化到 domesticRatio
        const adjustedDomesticTotal = adjustedDomesticCities.reduce((sum, c) => sum + c.value, 0);

// 归一化国内城市value，使总和等于 domesticRatio
        const normalizedDomesticCities = adjustedDomesticCities.map(city => ({
          name: city.name,
          value: city.value / adjustedDomesticTotal * domesticRatio,
          realValue: city.realValue,
          realPercent: city.realPercent
        }));

// 海外城市，全部归为 overseasRatio
        const adjustedOverseasCities = realData.cities.overseas.map(city => ({
          name: city.name,
          value: overseasRatio,  // 海外一个城市填满海外圈
          realValue: city.value,
          realPercent: city.value.toFixed(2)
        }));
        const softColors = [
          '#7FB3D5', '#76D7C4', '#A9DFBF', '#F7DC6F',
          '#F0B27A', '#D7BDE2', '#F5B7B1', '#AAB7B8',
          '#5499C7', '#48C9B0', '#52BE80', '#F4D03F'
        ];

// 拼出 legend 显示用的名称（城市名称）
        const legendData = [
          ...normalizedDomesticCities.map(c => c.name),
          ...adjustedOverseasCities.map(c => c.name)
        ];
        const pieOption2 = {
          title: {
            text: '外联IP地理分布统计',
            left: 'center'
            // 字体颜色绿色
            , textStyle: {
              color: '#77fc35',
              fontSize: 16
            }
          },
          tooltip: {
            trigger: 'item',
            formatter: function (info) {
              const name = info.name;
              const rawValue = info.data.realValue !== undefined ? info.data.realValue : info.data.value;
              const rawPercent = info.data.realPercent !== undefined ? info.data.realPercent : info.percent;
              return `${name} : ${rawValue} (${rawPercent}%)`;
            }
          },

          series: {
            type: 'sunburst',
            radius: ['0%', '80%'],
            data: [
              {
                name: '国内',
                value: domesticRatio,
                realValue: realData.domestic,
                realPercent: realData.domestic.toFixed(2),
                children: normalizedDomesticCities.map((city, index) => ({
                  ...city,
                  label: {
                    show: !['黑龙江省', '江苏省', '陕西省'].includes(city.name)  // 隐藏小城市标签
                  },
                  itemStyle: {
                    color: softColors[index % softColors.length]
                  }
                }))
              },
              {
                name: '国外',
                value: overseasRatio,
                realValue: realData.overseas,
                realPercent: realData.overseas.toFixed(2),
                children: adjustedOverseasCities.map((city, index) => ({
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
            //字体颜色黄色
            top:25,
            textStyle: {
              color: '#fcea35',
              fontSize: 16,
              padding: [0, 0, -10, 0]
            }
          },
          xAxis: {
            type: 'category',
            data: ['4月1日\n-6月30日','7月1日\n-9月30日','10月1日\n-12月31日', '1月1日\n-3月31日'],
            //字体颜色白色
            axisLabel: {
              color: '#fff',
              fontSize: 12
            }
          },
          yAxis: {
            type: 'value'
          },
          series: [{
            data: [60,70,83,84],
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
      this.chart1Inst.resize();
      this.chart2Inst.resize();
      this.barChartInst.resize();
    }
  }
};
</script>

<style scoped>
.center_bottom {
  padding: 10px;
}
.switch-button {
  text-align: center;
  margin-bottom: 10px;
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
}
.chart {
  width: 300px;
  height: 220px;
  margin: 0px;
}
.barchart{
  width: 100%;
  height: 270px;
  margin: -10px;
}
</style>
