<template>
  <div
      class="right_center_wrap overflow-y-auto"
      ref="scrollContainer"
      @mouseenter="pauseScroll"
      @mouseleave="resumeScroll"
  >
    <ul class="right_center">
      <li class="right_center_item" v-for="(item, i) in list" :key="i">
        <span class="orderNum">{{ i + 1 }}</span>
        <div class="inner_right">
          <div class="dibu"></div>

          <div class="flex">
            <div class="info">
              <span class="labels">涉事系统：</span>
              <span class="contents zhuyao">{{ item.systemName }}</span>
            </div>
            <div class="info">
              <span class="labels">涉事IP：</span>
              <span class="contents">{{ item.ip }}</span>
            </div>
          </div>

          <div class="flex">
            <div class="info">
              <span class="labels">时间：</span>
              <span class="contents" style="font-size: 12px">{{ item.time }}</span>
            </div>
            <div class="info">
              <span class="labels">处置情况：</span>
              <span class="contents">{{ item.status }}</span>
            </div>
          </div>

          <div class="flex">
            <div class="info">
              <span class="labels">事件内容：</span>
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
      list: [
        {
          systemName: '业务管理系统',
          ip: '192.168.1.10',
          time: '2025-06-25 09:30:00',
          status: '已处置',
          alertDetail: 'SQL注入攻击尝试',
        },
        {
          systemName: '用户认证服务',
          ip: '10.0.0.15',
          time: '2025-06-25 08:20:00',
          status: '未处置',
          alertDetail: '暴力破解登录行为',
        },
        {
          systemName: '日志收集服务',
          ip: '172.16.0.5',
          time: '2025-06-24 22:45:00',
          status: '已处置',
          alertDetail: '异常流量高峰',
        },
        {
          systemName: '日志收集服务',
          ip: '172.16.0.5',
          time: '2025-06-24 22:45:00',
          status: '已处置',
          alertDetail: '异常流量高峰',
        },
        {
          systemName: '日志收集服务',
          ip: '172.16.0.5',
          time: '2025-06-24 22:45:00',
          status: '已处置',
          alertDetail: '异常流量高峰',
        },
        // 可继续添加更多 mock 项
      ],
    };
  },
  mounted() {
    this.startScroll();
  },
  beforeDestroy() {
    this.stopScroll();
  },
  methods: {
    startScroll() {
      const el = this.$refs.scrollContainer;
      this.scrollTimer = setInterval(() => {
        el.scrollTop += 1;
        if (el.scrollTop + el.clientHeight >= el.scrollHeight) {
          el.scrollTop = 0;
        }
      }, 40); // 速度可调节
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

  .right_center_item {
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 10px;
    font-size: 14px;
    color: #fff;

    .orderNum {
      margin: 0 20px 0 -20px;
    }

    .inner_right {
      position: relative;
      width: 400px;
      line-height: 1.5;

      .dibu {
        position: absolute;
        height: 2px;
        width: 104%;
        background-image: url("../../assets/img/zuo_xuxian.png");
        bottom: -12px;
        left: -2%;
        background-size: cover;
      }
    }

    .info {
      margin-right: 10px;
      display: flex;
      align-items: center;

      .labels {
        flex-shrink: 0;
        font-size: 12px;
        color: rgba(255, 255, 255, 0.6);
      }

      .zhuyao {
        color: #409EFF;
        font-size: 15px;
      }

      .ciyao {
        color: rgba(255, 255, 255, 0.8);
      }

      .warning {
        color: #E6A23C;
        font-size: 15px;
      }
    }
  }
}

.right_center_wrap {
  overflow: hidden;
  width: 100%;
  height: 250px;
  padding-right: 10px;
}
.right_center_wrap::-webkit-scrollbar {
  width: 4px;
}
.right_center_wrap::-webkit-scrollbar-track{
  background: rgba(0, 0, 0, 0.1);
}
.right_center_wrap::-webkit-scrollbar-thumb {
  background-color: rgba(255, 255, 255, 0.3); /* 滑块半透明 */
  border-radius: 3px;
}
.right_center_wrap::-webkit-scrollbar-thumb:hover {
  background-color: rgba(255, 255, 255, 0.5); /* hover 状态下颜色更亮 */
}
.overflow-y-auto {
  overflow-y: auto;
}
</style>
