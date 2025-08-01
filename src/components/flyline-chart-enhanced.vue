<template>
  <div ref="chart" style="width: 100%; height: 100%"></div>
</template>

<script>
import * as echarts from 'echarts'

export default {
  name: 'FlylineChartEnhanced',
  props: {
    config: {
      type: Object,
      required: true
    }
  },
  data() {
    return {
      chartInstance: null
    }
  },
  watch: {
    config: {
      handler() {
        this.renderChart()
      },
      deep: true
    }
  },
  mounted() {
    this.chartInstance = echarts.init(this.$refs.chart)
    this.chartInstance.on('click', this.handleClick)
    this.renderChart()
    window.addEventListener('resize', this.resizeChart)

    // 绑定 DOM 层双击事件
    this.$refs.chart.addEventListener('dblclick', this.handleDoubleClickOnDom)
  },
  beforeDestroy() {
    this.chartInstance.dispose()
    window.removeEventListener('resize', this.resizeChart)
    this.$refs.chart.removeEventListener('dblclick', this.handleDoubleClickOnDom)
  },
  methods: {
    handleClick(params) {
      if (params.name === '中国' || params.name === '中国北京') {
        this.$emit('change-map', 'china')
      }
    },
    // 关键处理：DOM 双击 + 反推地图坐标
    handleDoubleClickOnDom(e) {
      const pixel = [e.offsetX, e.offsetY]
      const geoCoord = this.chartInstance.convertFromPixel({ geoIndex: 0 }, pixel)

      // 判断是否在地图坐标系内
      if (!geoCoord || isNaN(geoCoord[0]) || isNaN(geoCoord[1])) {
        // 完全空白区域
        console.log('[双击空白区域]', geoCoord)
        this.$emit('dblclick-blank')
      } else {
        // 判断是否命中某个省份区域（通过 geo 中的区域坐标判断）
        const model = this.chartInstance.getModel()
        const geo = model.getComponent('geo')
        const regions = geo.coordinateSystem.regions

        const insideRegion = regions.some(region => {
          return region.contain(geoCoord[0], geoCoord[1])
        })

        if (!insideRegion) {
          console.log('[双击地图但不在任何区域]', geoCoord)
          this.$emit('dblclick-blank')
        } else {
          console.log('[双击地图区域]', geoCoord)
          // 可以选择不触发任何事件
        }
      }
    },
    resizeChart() {
      if (this.chartInstance) {
        this.chartInstance.resize()
      }
    },
    renderChart() {
      const config = this.config
      if (!config.map || !config.map.mapName) return

      const option = {
        geo: {
          map: config.map.mapName,
          roam: true,
          left:'2%',
          right:'2%',
          top: '2%',
          bottom: '2%',
          label: {
            show: config.text.show,
            color: config.text.color
          },
          itemStyle: {
            areaColor: '#1d5e98',
            borderColor: '#fff'
          }
        },
        series: [
          {
            type: 'lines',
            coordinateSystem: 'geo',
            effect: {
              show: true,
              period: 6,
              trailLength: 0.7,
              color: config.line.color || '#00ffff',
              symbolSize: 3
            },
            lineStyle: {
              color: config.line.color || '#00ffff',
              width: config.line.width || 2,
              opacity: config.line.opacity || 0.8,
              curveness: 0.2
            },
            data: config.lines.map(line => {
              const source = config.points.find(p => p.name === line.source)
              const target = config.points.find(p => p.name === line.target)
              return source && target
                  ? { fromName: line.source, toName: line.target, coords: [source.coordinate, target.coordinate] }
                  : null
            }).filter(Boolean)
          },
          {
            type: 'effectScatter',
            coordinateSystem: 'geo',
            rippleEffect: { brushType: 'stroke' },
            label: {
              show: true,
              position: 'right',
              formatter: '{b}'
            },
            symbolSize: 6,
            itemStyle: {
              color: config.icon.color || '#00ffff'
            },
            data: config.points.map(p => ({
              name: p.name,
              value: p.coordinate
            }))
          }
        ]
      }

      this.chartInstance.setOption(option)
    }
  }
}
</script>

<style scoped>
</style>
