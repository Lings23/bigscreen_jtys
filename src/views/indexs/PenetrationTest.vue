<template>
  <div v-if="pageflag" class="right_center_wrap beautify-scroll-def" :class="{ 'overflow-y-auto': !sbtxSwiperFlag }">
    <component :is="components" :data="list" :class-option="defaultOption">
      <ul class="right_center">
        <li class="right_center_item" v-for="(item, i) in list" :key="i">
          <span class="orderNum">{{ i + 1 }}</span>
          <div class="inner_right">
            <div class="dibu"></div>
            <div class="flex">
              <div class="info">
                <span class="labels">系统名称：</span>
                <span class="contents zhuyao">{{ item.systemName }}</span>
              </div>
              <div class="info">
                <span class="labels">主管单位：</span>
                <span class="contents">{{ item.department }}</span>
              </div>
              <div class="info">
                <span class="labels">漏洞类型：</span>
                <span class="contents">{{ item.vulType }}</span>
              </div>
            </div>
            <div class="flex">
              <div class="info">
                <span class="labels">漏洞等级：</span>
                <span class="contents warning">{{ item.vulLevel }}</span>
              </div>
              <div class="info time">
                <span class="labels">时间：</span>
                <span class="contents" style="font-size:12px">{{ item.time }}</span>
              </div>
              <div class="info">
                <spa class="labels">漏洞来源：</spa>
                <span class="contents">{{item.source||'未知'}}</span>
              </div>
            </div>
            <div class="flex">
              <div class="info">
                <span class="labels">整改内容：</span>
                <span class="contents ciyao">{{ item.fixContent || '暂无整改内容' }}</span>
              </div>
            </div>
          </div>
        </li>
      </ul>
    </component>
  </div>
  <Reacquire v-else @onclick="() => {}" style="line-height:200px" />
</template>

<script>
import vueSeamlessScroll from 'vue-seamless-scroll'
import Kong from '../../components/kong.vue'

export default {
  components: { vueSeamlessScroll, Kong },
  data() {
    return {
      pageflag: true,
      list: [],
      refreshTimer: null,
      defaultOption: {
        ...this.$store.state.setting.defaultOption,
        step: 0.5, // 滚动步长（越小越慢）
        limitMoveNum: 3, // 每次滚动几个元素
        singleHeight: 250, // 每项高度
        waitTime: 1000, // 初始等待时间（ms）
        hoverStop: true, // ✨悬停是否暂停
        direction: 1, // 滚动方向：0横向，1纵向
        openWatch: true, // 数据更新时是否重启滚动
        switchOffset: 1, // 滚动一次的偏移量（影响连续滚动效果）
      }
    };
  },
  computed: {
    sbtxSwiperFlag() {
      const ssyjSwiper = this.$store.state.setting.ssyjSwiper
      this.components = ssyjSwiper ? vueSeamlessScroll : Kong
      return ssyjSwiper
    }
  },
  async mounted() {
    await this.fetchVulnList();
    this.refreshTimer = setInterval(this.fetchVulnList, 120000); // 2分钟刷新
  },
  beforeDestroy() {
    clearInterval(this.refreshTimer);
  },
  methods: {
    async fetchVulnList() {
      try {
        const res = await this.$authFetch('/api/stat/vuln-record/all');
        const data = await res.json();
        this.list = (data || []).map(item => ({
          systemName: item.systemName,
          department: item.orgName,
          vulType: item.vulnType,
          vulLevel: item.vulnLevel || '',
          time: item.foundTime ? item.foundTime.replace('T', ' ').slice(0, 19) : '',
          source: item.vulnSource,
          fixContent: item.fixContent
        }));
      } catch (e) {
        this.list = [];
      }
    }
  }
};
</script>

<style lang='scss' scoped>
.right_center {
  width: 100%;
  height: 100%;

  .right_center_item {
    display: flex;
    align-items: center;
    justify-content: center;
    height: auto;
    padding: 10px;
    font-size: 14px;
    color: #fff;

    .orderNum {
      margin: 0 20px 0 -20px;
    }

    .inner_right {
      position: relative;
      height: 100%;
      width: 440px;
      flex-shrink: 0;
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
        font-size: 13px;
        color: rgba(255, 255, 255, 0.6);
      }

      .zhuyao {
        color: $primary-color;
        font-size: 14px;
      }

      .ciyao {
        color: rgba(255, 255, 255, 0.8);
      }

      .warning {
        color: #E6A23C;
        font-size: 14px;
      }
    }
  }
}

.right_center_wrap {
  overflow: hidden;
  width: 100%;
  height: 240px;
}

.overflow-y-auto {
  overflow-y: auto;
}
</style>
