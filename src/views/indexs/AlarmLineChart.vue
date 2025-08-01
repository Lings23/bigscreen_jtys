<template>
  <div class="right_top_inner">
    <div class="quarter-toggle">
      <div class="quarter-info">
        <span>日均告警量：{{ avgAlarm }}</span>
        <span>总告警量：{{ totalAlarm }}</span>
        <span>峰值告警量：{{ peakAlarm }}</span>
      </div>
      <button
          :class="{ active: currentQuarter === 'current' }"
          @click="switchQuarter('current')"
      >
        本季度
      </button>
      <button
          :class="{ active: currentQuarter === 'last' }"
          @click="switchQuarter('last')"
      >
        上季度
      </button>
    </div>

    <Echart id="rightTop" :options="option" ref="charts" />
  </div>
</template>

<script>
import { graphic } from "echarts";

export default {
  data() {
    return {
      currentQuarter: "current", // current or last
      option: {},
      alarmData: [], // 所有接口数据
      avgAlarm: 0,
      totalAlarm: 0,
      peakAlarm: 0,
    };
  },

  async mounted() {
    await this.fetchAlarmData();
    this.initChart();
  },

  methods: {
    async fetchAlarmData() {
      try {
        const res = await this.$authFetch("/api/stat/alarm");
        const data = await res.json();
        this.alarmData = data;
      } catch (e) {
        this.alarmData = [];
      }
    },

    switchQuarter(type) {
      this.currentQuarter = type;
      this.initChart();
    },

    getQuarterData() {
      // 获取本季度或上季度数据
      if (!this.alarmData.length) return { xData: [], 成功: [], 可疑: [], 尝试: [], 总数: [] };
      const now = new Date();
      const year = now.getFullYear();
      const quarter = Math.floor(now.getMonth() / 3) + 1;
      let targetYear, targetQuarter;
      if (this.currentQuarter === 'current') {
        targetYear = year;
        targetQuarter = quarter;
      } else {
        if (quarter === 1) {
          targetYear = year - 1;
          targetQuarter = 4;
        } else {
          targetYear = year;
          targetQuarter = quarter - 1;
        }
      }
      // 用 statDate 计算每条数据的年份和季度
      const quarterData = this.alarmData.filter(item => {
        const d = new Date(item.statDate);
        const y = d.getFullYear();
        const q = Math.floor(d.getMonth() / 3) + 1;
        return y === targetYear && q === targetQuarter;
      });
      // 按日期排序
      quarterData.sort((a, b) => new Date(a.statDate) - new Date(b.statDate));
      // 组装 Echarts 数据
      const xData = quarterData.map(item => item.statDate.slice(5));
      const 成功 = quarterData.map(item => item.successCount);
      const 可疑 = quarterData.map(item => item.suspiciousCount);
      const 尝试 = quarterData.map(item => item.attemptCount);
      const 总数 = quarterData.map(item => item.successCount + item.suspiciousCount + item.attemptCount);
      // 统计
      this.totalAlarm = 总数.reduce((a, b) => a + b, 0);
      this.avgAlarm = 总数.length ? Math.round(this.totalAlarm / 总数.length) : 0;
      this.peakAlarm = 总数.length ? Math.max(...总数) : 0;
      return { xData, 成功, 可疑, 尝试, 总数 };
    },

    getLineSeries(name, data, color) {
      return {
        name,
        type: "line",
        data,
        smooth: true,
        symbol: "none",
        color,
        areaStyle: {
          color: new graphic.LinearGradient(0, 0, 0, 1, [
            { offset: 0, color },
            { offset: 1, color: `${color.replace(".7", ".0")}` },
          ]),
        },
        markPoint: {
          data: [
            {
              type: "max",
              valueDim: "y",
              symbol: "circle",
              symbolSize: 6,
              itemStyle: {
                color,
                shadowColor: color,
                shadowBlur: 8,
              },
              label: { formatter: "" },
            },
          ],
        },
      };
    },

    initChart() {
      const data = this.getQuarterData();
      this.option = {
        tooltip: {
          trigger: "axis",
          backgroundColor: "rgba(0,0,0,.6)",
          borderColor: "rgba(147, 235, 248, .8)",
          textStyle: {
            color: "#FFF",
          },
        },
        grid: {
          show: true,
          left: "10px",
          right: "30px",
          bottom: "20px",
          top: "50px",
          containLabel: true,
          borderColor: "#1F63A3",
        },
        xAxis: {
          type: "category",
          data: data.xData,
          boundaryGap: false,
          axisLabel: {
            color: "#7EB7FD",
            fontWeight: "500",
          },
          axisLine: {
            lineStyle: {
              color: "rgba(31,99,163,.1)",
            },
          },
          splitLine: {
            show: true,
            lineStyle: {
              color: "rgba(31,99,163,.2)",
            },
          },
        },
        yAxis: {
          type: "value",
          axisLabel: {
            color: "#7EB7FD",
            fontWeight: "500",
          },
          axisLine: {
            lineStyle: {
              color: "rgba(31,99,163,.1)",
            },
          },
          splitLine: {
            show: true,
            lineStyle: {
              color: "rgba(31,99,163,.2)",
            },
          },
        },
        legend:{
          data: ["成功", "总数", "可疑", "尝试"],
          textStyle:{
            color: "#9fe7dc",
            fontSize: 13,
          },
          bottom: "2px",
        },
        series: [
          this.getLineSeries("成功", data.成功, "rgba(46, 213, 115, 0.7)"),
          this.getLineSeries("总数", data.总数, "rgba(252, 144, 16, 0.7)"),
          this.getLineSeries("可疑", data.可疑, "rgba(255, 69, 96, 0.7)"),
          this.getLineSeries("尝试", data.尝试, "rgba(9, 202, 243, 0.7)"),
        ],
      };
    },
  },
};
</script>

<style lang="scss" scoped>
.right_top_inner {
  position: relative;
  height: 270px;
  width: 100%;
  overflow: hidden;
  margin-top: -8px;

  .quarter-toggle {
    position: absolute;
    top: 8px;
    right: 16px;
    z-index: 10;
    display: flex;
    align-items: center;
    .quarter-info {
      font-size: 14px;
      color: #f6bc32;
      margin-right: 12px;
      display: flex;
      gap: 8px;
      white-space: nowrap;

      span {
        display: inline-block;
      }
    }
    button {
      background: transparent;
      border: 1px solid #2e8cf0;
      color: #2e8cf0;
      padding: 2px 10px;
      margin-left: 6px;
      cursor: pointer;
      font-size: 12px;
      border-radius: 4px;
      transition: all 0.3s;

      &.active {
        background: #2e8cf0;
        color: #fff;
      }
    }
  }
}
</style>
