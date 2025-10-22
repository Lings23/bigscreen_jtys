<template>
  <!-- 移除item-wrap组件，保留内部内容结构 -->
  <div class="event-list-container">
    <!-- 滚动内容区域 -->
    <div 
      class="scroll-container" 
      ref="scrollContainer"
      @mouseenter="pauseScroll"
      @mouseleave="resumeScroll"
    >
      <div class="list-content" ref="listContent">
        <div 
          class="event-item" 
          v-for="(item, index) in duplicatedList" 
          :key="index"
        >
          <div class="event-rank">{{ (index % eventList.length) + 1 }}</div>
          <div class="event-info">
            <div class="info-row">
              <span class="label">事件名称：</span>
              <span class="value event-name">{{ item.name }}</span>
            </div>
            <div class="info-row">
              <span class="label">参与单位：</span>
              <span class="value unit-count">{{ item.unitCount }} 家</span>
              
              <span class="label time-label">起止时间：</span>
              <span class="value time-value">{{ item.startTime }} 至 {{ item.endTime }}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      eventList: [],
      duplicatedList: [],
      scrollTimer: null,
      scrollSpeed: 1,
      scrollInterval: 40
    };
  },
  async mounted() {
    this.$nextTick(async () => {
      await this.fetchEventList();
      
      if (this.eventList.length > 0) {
        this.duplicatedList = [...this.eventList, ...this.eventList];
        this.$nextTick(() => {
          this.startScroll();
        });
      }
    });
  },
  beforeDestroy() {
    this.stopScroll();
  },
  methods: {
    async fetchEventList() {
      // 模拟mock数据
      this.eventList = [
        {
          name: "春节重保活动",
          unitCount: 12,
          startTime: "2025-01-20",
          endTime: "2025-02-20"
        },
        {
          name: "两会期间网络保障",
          unitCount: 25,
          startTime: "2025-03-01",
          endTime: "2025-03-20"
        },
        {
          name: "国庆网络安全保障",
          unitCount: 18,
          startTime: "2025-09-25",
          endTime: "2025-10-07"
        },
        {
          name: "重要会议通信保障",
          unitCount: 8,
          startTime: "2025-06-10",
          endTime: "2025-06-15"
        },
        {
          name: "网络安全演练活动",
          unitCount: 30,
          startTime: "2025-05-01",
          endTime: "2025-05-10"
        }
      ];
    },
    startScroll() {
      const container = this.$refs.scrollContainer;
      const content = this.$refs.listContent;
      
      if (!container || !content) return;
      
      if (content.offsetHeight <= container.clientHeight) return;
      
      this.stopScroll();
      
      this.scrollTimer = setInterval(() => {
        if (!container.isConnected) {
          this.stopScroll();
          return;
        }
        
        container.scrollTop += this.scrollSpeed;
        
        if (container.scrollTop >= content.offsetHeight / 2) {
          container.scrollTop = 0;
        }
      }, this.scrollInterval);
    },
    stopScroll() {
      if (this.scrollTimer) {
        clearInterval(this.scrollTimer);
        this.scrollTimer = null;
      }
    },
    pauseScroll() {
      this.stopScroll();
    },
    resumeScroll() {
      const container = this.$refs.scrollContainer;
      const content = this.$refs.listContent;
      
      if (container && content && content.offsetHeight > container.clientHeight) {
        this.startScroll();
      }
    }
  }
};
</script>

<style scoped lang="scss">
.event-list-container {
  width: 100%;
  height: 100%;
  background-color: rgba(10, 15, 40, 0.85);
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  position: relative;
  
  background-image: 
    radial-gradient(circle at 10% 20%, rgba(30, 80, 188, 0.1) 0%, transparent 20%),
    radial-gradient(circle at 80% 60%, rgba(30, 80, 188, 0.1) 0%, transparent 20%);
}

.scroll-container {
  flex: 1;
  overflow: hidden;
  position: relative;
  padding: 10px 0;
}

.list-content {
  width: 100%;
}

.event-item {
  display: flex;
  padding: 12px 18px;
  border-bottom: 1px dashed rgba(0, 247, 255, 0.15);
  color: #fff;
  font-size: 16px;
  
  &:last-child {
    border-bottom: none;
  }
  
  &:hover {
    background-color: rgba(30, 80, 188, 0.1);
  }
}

.event-rank {
  width: 24px;
  height: 24px;
  line-height: 24px;
  text-align: center;
  color: #00f7ff;
  margin-right: 15px;
  flex-shrink: 0;
  font-size: 16px;
}

.event-info {
  flex: 1;
  width: 0;
  
  .info-row {
    margin-bottom: 8px;
    
    &:last-child {
      margin-bottom: 0;
    }
  }
  
  .label {
    color: #8ca0c8;
    margin-right: 10px;
    font-size: 16px;
  }
  
  .value {
    color: #e0e8ff;
    font-size: 16px;
  }
  
  .event-name {
    color: #00f7ff;
  }
  
  .time-label {
    margin-left: 25px;
  }
  
  .unit-count {
    color: #47c8ff;
  }
  
  .time-value {
    color: #ff7d7d;
  }
}
</style>
