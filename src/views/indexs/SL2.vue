<template>
  <div
      class="right_center_wrap"
      ref="scrollContainer"
      @mouseenter="pauseScroll"
      @mouseleave="resumeScroll"
  >
    <ul class="right_center">
      <li
          class="right_center_item"
          v-for="(item, i) in duplicatedList"
          :key="i"
          :class="i % 2 === 0 ? 'even' : 'odd'"
      >
        <span class="orderNum">{{ (i % list.length) + 1 }}</span>
        <div class="inner_right">
          <div class="flex">
            <div class="info">
              <span class="labels">系统：</span>
              <span class="contents zhuyao">{{ item.systemName }}</span>
            </div>
            <div class="info">
              <span class="labels">IP：</span>
              <span class="contents">{{ item.ip }}</span>
            </div>
            <div class="info">
              <span class="labels">时间：</span>
              <span class="contents time">{{ item.time }}</span>
            </div>
          </div>

          <div class="flex">
            <div class="info">
              <span class="labels">状态：</span>
              <span class="contents">{{ item.status }}</span>
            </div>
            <div class="info">
              <span class="labels">事件来源：</span>
              <span class="contents">{{item.source||'未知'}}</span>
            </div>
            <div class="info long">
              <span class="labels">内容：</span>
              <span class="contents ciyao" :class="{ warning: item.alertDetail }">
                {{ item.alertDetail || '无' }}
              </span>
            </div>

          </div>
        </div>
      </li>
    </ul>
  </div>
</template>
<script>
export default {
  data() {
    return {
      list: [],
      duplicatedList:[],
      scrollTimer: null,
      refreshTimer: null
    };
  },
  async mounted() {
    await this.fetchEventList();
    this.refreshTimer = setInterval(this.fetchEventList, 120000); // 2分钟刷新
    this.duplicatedList=[...this.list,...this.list];
    this.startScroll();
  },
  beforeDestroy() {
    this.stopScroll();
    clearInterval(this.refreshTimer);
  },
  methods: {
    async fetchEventList() {
      try {
        const res = await this.$authFetch('/api/stat/event/all');
        const data = await res.json();
        this.list = (data || []).map(item => ({
          systemName: item.systemName,
          ip: item.ipAddress,
          time: item.eventTime ? item.eventTime.replace('T', ' ').slice(0, 19) : '',
          status: item.status === 'unhandled' ? '未处置' : '已处置',
          alertDetail: item.content,
          source: item.source
        }));
        this.duplicatedList = [...this.list, ...this.list];
      } catch (e) {
        this.list = [];
        this.duplicatedList = [];
      }
    },
    startScroll() {
      const el = this.$refs.scrollContainer;
      if(el.scrollHeight<=el.clientHeight||this.list.length==5){
        return;
      }
      this.scrollTimer = setInterval(() => {
        if (el.scrollTop + el.clientHeight >= el.scrollHeight - 1) {
          el.scrollTop = 0;
        } else {
          el.scrollTop += 1;
        }
      }, 40);
    },
    stopScroll() {
      clearInterval(this.scrollTimer);
      this.scrollTimer = null;
    },
    pauseScroll() {
      this.stopScroll();
    },
    resumeScroll() {
      if (!this.scrollTimer) {
        this.startScroll();
      }
    },
  },
};
</script>


<style lang="scss" scoped>
.right_center {
  width: 100%;
  height: 100%;
  padding: 0;
  margin: 0;

  .right_center_item {
    display: flex;
    align-items: flex-start;
    padding: 6px 10px;
    font-size: 13px;
    color: #fff;
    line-height: 1.4;
    transition: background 0.3s;

    &.even {
      background-color: rgba(30, 35, 45, 0.6);
    }
    &.odd {
      background-color: rgba(20, 64, 107, 0.42);
    }

    .orderNum {
      margin-right: 10px;
      color: #00ffff;
      font-weight: bold;
    }

    .inner_right {
      flex: 1;

      .flex {
        display: flex;
        flex-wrap: wrap;
        margin-bottom: 2px;

        .info {
          display: flex;
          align-items: center;
          margin-right: 14px;

          .labels {
            font-size: 12px;
            color: rgba(255, 255, 255, 0.6);
            margin-right: 4px;
            white-space: nowrap;
          }

          .contents {
            font-size: 13px;
            color: #fff;
            white-space: nowrap;

            &.zhuyao {
              color: #00eaff;
              font-weight: 500;
            }
            &.ciyao {
              color: #eee;
              font-style: italic;
            }
            &.warning {
              color: #ffc107;
              font-weight: 600;
            }
            &.time {
              font-size: 12px;
              color: #ccc;
            }
          }
          &.long {
            flex: 1;
            min-width: 50%;
          }
        }
      }
    }
  }
}

.right_center_wrap {
  overflow-y: auto;
  width: 100%;
  height: 250px;
  padding-right: 4px;
  position: relative;
}

.right_center_wrap::-webkit-scrollbar {
  width: 6px; /* 滚动条宽度 */
}

.right_center_wrap::-webkit-scrollbar-track {
  background-color: rgba(0, 0, 0, 0.1); /* 半透明背景 */
  border-radius: 3px;
}

.right_center_wrap::-webkit-scrollbar-thumb {
  background-color: rgba(255, 255, 255, 0.3); /* 滑块半透明 */
  border-radius: 3px;
}

.right_center_wrap::-webkit-scrollbar-thumb:hover {
  background-color: rgba(255, 255, 255, 0.5); /* hover 状态下颜色更亮 */
}
</style>