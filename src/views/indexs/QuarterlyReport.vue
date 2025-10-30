<template>
  <div class="report-container">
    <!-- 年份选择按钮 -->
    <div class="year-select-btn" @click="toggleYearList">
      {{ selectedYear }}年
      <i :class="['arrow-icon', { 'rotate': yearListVisible }]"></i>
    </div>
    <!-- 年份下拉列表 -->
    <ul class="year-list" v-show="yearListVisible">
      <li 
        v-for="year in years" 
        :key="year" 
        @click="selectYear(year)"
        :class="{ 'active': year === selectedYear }"
      >
        {{ year }}年
      </li>
    </ul>

    <!-- 加载状态 -->
    <div v-if="loading" class="status loading">
      <div class="spinner"></div>
      <p>加载数据中...</p>
    </div>
    
    <!-- 错误状态 -->
    <div v-else-if="error" class="status error">
      <p>数据加载失败: {{ errorMsg }}</p>
      <button @click="fetchQuarterlyData">重试</button>
    </div>
    
    <!-- 图表容器 -->
    <div v-else class="chart-container">
      <canvas ref="chart"></canvas>
    </div>
  </div>
</template>

<script>
import { ref, onMounted, watch, nextTick } from 'vue';
import Chart from 'chart.js';
import axios from 'axios';

export default {
  setup() {
    // 基础数据 - 默认选中最近年份（数组最后一项）
    const years = [2023, 2024, 2025];
    const selectedYear = ref(years[years.length - 1]); // 自动选中最近年份
    const chart = ref(null);
    const chartInstance = ref(null);
    const quarterlyData = ref({});

    // 状态管理
    const loading = ref(true);
    const error = ref(false);
    const errorMsg = ref('');
    const yearListVisible = ref(false);

    // 请求数据
    const fetchQuarterlyData = async () => {
      try {
        loading.value = true;
        error.value = false;
        errorMsg.value = '';

        const response = await axios.get('/quarterlySecurityReport', {
          params: { year: selectedYear.value }
        });

        console.log('季报原始响应:', response);
        console.log('季报响应类型:', typeof response);
        console.log('季报success:', response.success);
        console.log('季报data字段:', response.data);

        // 注意: axios响应拦截器已经返回response.data，所以这里的response就是原始的response.data
        if (response.success ) {
          quarterlyData.value = response.data;
          console.log('季报最终数据:', quarterlyData.value);
          nextTick(() => initChart());
        } else {
          console.error('数据验证失败:', {
            hasResponse: !!response,
            success: response.success,
            hasDataField: !!response.data
          });
          throw new Error('数据格式错误');
        }
      } catch (err) {
        error.value = true;
        errorMsg.value = err.message || '加载失败';
        console.error('数据请求错误:', err);
      } finally {
        loading.value = false;
      }
    };

    // 初始化图表（优化尺寸匹配）
    const initChart = () => {
      if (!chart.value || !quarterlyData.value.季度) return;

      const ctx = chart.value.getContext('2d');
      
      // 销毁已有实例
      if (chartInstance.value) {
        chartInstance.value.destroy();
      }

      // 计算容器实际尺寸，确保图表填充容器
      const container = chart.value.parentElement;
      const containerWidth = container.clientWidth;
      const containerHeight = container.clientHeight;
      
      // 设置canvas尺寸匹配容器
      chart.value.width = containerWidth;
      chart.value.height = containerHeight;

      chartInstance.value = new Chart(ctx, {
        type: 'bar',
        data: {
          labels: quarterlyData.value.季度,
          datasets: [
            {
              label: '信息安全检查数量',
              data: quarterlyData.value.信息安全检查数量 || [],
              backgroundColor: 'rgba(0, 247, 255, 0.7)',
              borderColor: 'rgba(0, 247, 255, 1)',
              borderWidth: 1
            },
            {
              label: '信息安全培训数量',
              data: quarterlyData.value.信息安全培训数量 || [],
              backgroundColor: 'rgba(71, 200, 255, 0.7)',
              borderColor: 'rgba(71, 200, 255, 1)',
              borderWidth: 1
            },
            {
              label: '信息系统建设整改',
              data: quarterlyData.value.信息系统建设整改 || [],
              backgroundColor: 'rgba(255, 125, 125, 0.7)',
              borderColor: 'rgba(255, 125, 125, 1)',
              borderWidth: 1
            }
          ]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          // 调整柱形大小占比
          barPercentage: 0.7,  // 柱形宽度占类别宽度的比例（0-1）
          categoryPercentage: 0.8,  // 类别宽度占总宽度的比例（0-1）
          scales: {
            xAxes: [{
              gridLines: { color: 'rgba(255, 255, 255, 0.1)' },
              ticks: { color: 'rgba(255, 255, 255, 0.7)' }
            }],
            yAxes: [{
              beginAtZero: true,
              gridLines: { color: 'rgba(255, 255, 255, 0.1)' },
              ticks: { color: 'rgba(255, 255, 255, 0.7)', precision: 0 }
            }]
          },
          legend: {
            labels: {
              color: 'rgba(255, 255, 255, 0.9)',
              boxWidth: 12,
              font: { size: 12 }
            }
          }
        }
      });
    };

    // 年份选择逻辑
    const toggleYearList = () => {
      yearListVisible.value = !yearListVisible.value;
    };

    const selectYear = (year) => {
      selectedYear.value = year;
      yearListVisible.value = false;
      fetchQuarterlyData();
    };

    // 监听年份变化
    watch(selectedYear, () => {
      fetchQuarterlyData();
    });

    // 初始化时立即加载数据
    onMounted(() => {
      // 确保DOM渲染完成后立即加载
      nextTick(() => {
        fetchQuarterlyData();
      });
    });

    return {
      years,
      selectedYear,
      chart,
      loading,
      error,
      errorMsg,
      yearListVisible,
      toggleYearList,
      selectYear,
      fetchQuarterlyData
    };
  }
};
</script>

<style scoped lang="scss">
.report-container {
  width: 100%;
  height: 100%;
  padding: 15px;
  box-sizing: border-box;
  position: relative;
  overflow: hidden;
}

/* 年份选择器 */
.year-select-btn {
  position: absolute;
  top: 15px;
  right: 15px;
  background-color: rgba(10, 15, 40, 0.7);
  border: 1px solid rgba(0, 247, 255, 0.3);
  color: #e0e8ff;
  padding: 4px 12px;
  border-radius: 4px;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 8px;
  z-index: 10;
}

.year-list {
  position: absolute;
  top: 45px;
  right: 15px;
  background-color: rgba(10, 15, 40, 0.9);
  border: 1px solid rgba(0, 247, 255, 0.3);
  border-radius: 4px;
  list-style: none;
  padding: 5px 0;
  margin: 0;
  z-index: 10;
  min-width: 80px;

  li {
    padding: 4px 15px;
    color: #e0e8ff;
    cursor: pointer;

    &.active {
      background-color: rgba(0, 247, 255, 0.3);
      color: #00f7ff;
    }
  }
}

.arrow-icon {
  width: 0;
  height: 0;
  border-left: 5px solid transparent;
  border-right: 5px solid transparent;
  border-top: 5px solid #e0e8ff;
  transition: transform 0.3s;
}

.rotate {
  transform: rotate(180deg);
}

/* 图表容器（关键：让图表占满可用空间） */
.chart-container {
  width: 100%;
  height: calc(100% - 50px); /* 减去年份选择器高度 */
  margin-top: 40px; /* 给年份选择器留出空间 */
  position: relative;
}

/* 状态容器 */
.status {
  width: 100%;
  height: calc(100% - 50px);
  margin-top: 40px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  color: rgba(255, 255, 255, 0.7);

  button {
    margin-top: 10px;
    background-color: rgba(0, 247, 255, 0.2);
    border: 1px solid rgba(0, 247, 255, 0.7);
    color: #00f7ff;
    padding: 4px 12px;
    border-radius: 4px;
    cursor: pointer;
  }
}

.spinner {
  width: 30px;
  height: 30px;
  border: 2px solid rgba(0, 247, 255, 0.3);
  border-radius: 50%;
  border-top-color: rgba(0, 247, 255, 1);
  animation: spin 1s linear infinite;
  margin-bottom: 10px;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}

/* 移除原有的父组件样式兼容代码 */
</style>
